import { validateSignup, type Identifier } from "./auth-utils";

export type SessionUser = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
};

export type Result = { ok: true; user: SessionUser } | { ok: false; error: string };

type StoredUser = SessionUser & { passwordHash: string };

const USERS = "mdf_users_v2";
const SESSION = "mdf_session_v2";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// فقط برای نمایش: رمز را ساده هش می‌کند تا به‌صورت متن خام ذخیره نشود
async function hash(password: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

const find = (id: Identifier) =>
  read<StoredUser[]>(USERS, []).find((u) => (id.type === "phone" ? u.phone === id.value : u.email === id.value)) ?? null;

function strip(u: StoredUser): SessionUser {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
}

export async function checkAccount(id: Identifier) {
  await sleep(300);
  return { exists: !!find(id) };
}

export async function login(id: Identifier, password: string): Promise<Result> {
  await sleep(400);
  const user = find(id);
  if (!user || user.passwordHash !== (await hash(password))) return { ok: false, error: "رمز عبور درست نیست." };
  write(SESSION, user.id);
  return { ok: true, user: strip(user) };
}

export async function signup(id: Identifier, name: string, password: string): Promise<Result> {
  await sleep(400);
  const invalid = validateSignup(name, password);
  if (invalid) return { ok: false, error: invalid };
  if (find(id)) return { ok: false, error: "برای این مشخصات قبلاً حساب ساخته شده است." };

  const user: StoredUser = {
    id: uid(),
    name: name.trim(),
    email: id.type === "email" ? id.value : null,
    phone: id.type === "phone" ? id.value : null,
    role: "CUSTOMER",
    passwordHash: await hash(password),
  };
  write(USERS, [...read<StoredUser[]>(USERS, []), user]);
  write(SESSION, user.id);
  return { ok: true, user: strip(user) };
}

export async function me(): Promise<SessionUser | null> {
  const id = read<string | null>(SESSION, null);
  if (!id) return null;
  const user = read<StoredUser[]>(USERS, []).find((u) => u.id === id);
  return user ? strip(user) : null;
}

export async function logout() {
  try {
    localStorage.removeItem(SESSION);
  } catch {}
}
