import { promises as fs } from "node:fs";
import path from "node:path";

import { collections as defaultCollections, type Collection } from "@/data/collections";
import { products as defaultProducts, type Product } from "@/data/products";
import type { OrderStatus } from "./order-status";

const DIR = path.join(process.cwd(), "storage");

export type OrderItem = { id: number; title: string; price: number; qty: number };

export type Order = {
  id: number;
  code: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  note: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type Consultation = {
  id: number;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "contacted";
  createdAt: string;
};

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, `${name}.json`), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(name: string, data: unknown) {
  await fs.mkdir(DIR, { recursive: true });
  const file = path.join(DIR, `${name}.json`);
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

// نوبت‌دهی نوشتن‌ها تا دو درخواست هم‌زمان همدیگر را خراب نکنند
let chain: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
}

const nextId = (list: { id: number }[]) => Math.max(0, ...list.map((x) => x.id)) + 1;

// ── محصولات و مجموعه‌ها (تا وقتی مدیر ویرایش نکرده، از data/ خوانده می‌شود)
export const getProducts = () => readJson<Product[]>("products", defaultProducts);
export const getCollections = () => readJson<Collection[]>("collections", defaultCollections);

// ── سفارش‌ها
export async function listOrders() {
  const list = await readJson<Order[]>("orders", []);
  return [...list].sort((a, b) => b.id - a.id);
}

export function addOrder(
  input: Omit<Order, "id" | "code" | "status" | "createdAt" | "total">
) {
  return locked(async () => {
    const list = await readJson<Order[]>("orders", []);
    const id = nextId(list);
    const order: Order = {
      ...input,
      id,
      code: `MDF-${10000 + id}`,
      total: input.items.reduce((sum, i) => sum + i.price * i.qty, 0),
      status: "new",
      createdAt: new Date().toISOString(),
    };
    await writeJson("orders", [...list, order]);
    return order;
  });
}

export function setOrderStatus(id: number, status: OrderStatus) {
  return locked(async () => {
    const list = await readJson<Order[]>("orders", []);
    await writeJson("orders", list.map((o) => (o.id === id ? { ...o, status } : o)));
  });
}

// ── درخواست‌های مشاوره
export async function listConsultations() {
  const list = await readJson<Consultation[]>("consultations", []);
  return [...list].sort((a, b) => b.id - a.id);
}

export function addConsultation(input: Pick<Consultation, "name" | "phone" | "subject" | "message">) {
  return locked(async () => {
    const list = await readJson<Consultation[]>("consultations", []);

    // همین شماره در ۱۰ دقیقهٔ اخیر درخواست داده؟ دوباره ثبت نمی‌کنیم
    const recent = list.some(
      (c) => c.phone === input.phone && Date.now() - new Date(c.createdAt).getTime() < 10 * 60 * 1000
    );
    if (recent) return;

    await writeJson("consultations", [
      ...list,
      { ...input, id: nextId(list), status: "new", createdAt: new Date().toISOString() },
    ]);
  });
}

export function markConsultationContacted(id: number) {
  return locked(async () => {
    const list = await readJson<Consultation[]>("consultations", []);
    await writeJson("consultations", list.map((c) => (c.id === id ? { ...c, status: "contacted" as const } : c)));
  });
}