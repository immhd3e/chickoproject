"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "./AuthProvider";
import { parseIdentifier, validateSignup } from "@/lib/auth-utils";

type Tab = "login" | "signup";
type Hint = "toSignup" | "toLogin" | null;

const inputClass =
  "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-100";

const labelClass = "mb-2 block text-sm font-medium text-stone-700";

export default function LoginForm({
  next = "/",
  initialTab = "login",
}: {
  next?: string;
  initialTab?: Tab;
}) {
  const router = useRouter();
  const { user, ready, check, login, signup } = useAuth();

  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [raw, setRaw] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState<Hint>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  // اگر قبلاً وارد شده، فرم را نشان نده
  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const clearMessages = () => {
    setError("");
    setHint(null);
    setNotice("");
  };

  // شماره/ایمیل می‌ماند، فقط رمز و پیام‌ها پاک می‌شوند
  const switchTab = (t: Tab) => {
    setTab(t);
    setPassword("");
    clearMessages();
  };

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = parseIdentifier(raw);
    if (!parsed) return setError("ایمیل یا شمارهٔ موبایل معتبر وارد کنید. مثلاً 09123456789");
    if (!password) return setError("رمز عبور را وارد کنید.");

    clearMessages();
    setLoading(true);

    const { exists } = await check(parsed);
    if (!exists) {
      setLoading(false);
      setError("حسابی با این مشخصات پیدا نشد.");
      setHint("toSignup");
      return;
    }

    const r = await login(parsed, password);
    setLoading(false);

    if (!r.ok) return setError(r.error);
    router.push(next);
  };

  const onSignup = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = parseIdentifier(raw);
    if (!parsed) return setError("ایمیل یا شمارهٔ موبایل معتبر وارد کنید. مثلاً 09123456789");

    const invalid = validateSignup(name, password);
    if (invalid) return setError(invalid);

    clearMessages();
    setLoading(true);

    const { exists } = await check(parsed);
    if (exists) {
      setLoading(false);
      setError("برای این مشخصات قبلاً حساب ساخته شده است.");
      setHint("toLogin");
      return;
    }

    const r = await signup(parsed, name, password);
    setLoading(false);

    if (!r.ok) return setError(r.error);
    router.push(next);
  };

  const identifierField = (
    <>
      <label htmlFor="identifier" className={labelClass}>
        ایمیل یا شمارهٔ موبایل
      </label>
      <input
        id="identifier"
        dir="ltr"
        autoFocus={tab === "login"}
        autoComplete="username"
        placeholder="09123456789  یا  name@example.com"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className={`${inputClass} text-left`}
      />
    </>
  );

  const passwordField = (autoComplete: string, placeholder: string) => (
    <>
      <label htmlFor="password" className={`${labelClass} mt-5`}>
        رمز عبور
      </label>
      <div className="relative">
        <input
          id="password"
          type={show ? "text" : "password"}
          dir="ltr"
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${inputClass} pl-12 text-left`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-stone-800"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </>
  );

  const errorBlock = (
    <p role="alert" className="mt-3 min-h-6 text-sm text-red-600">
      {error}
      {hint && (
        <button
          type="button"
          onClick={() => switchTab(hint === "toSignup" ? "signup" : "login")}
          className="mr-2 font-medium text-amber-700 underline"
        >
          {hint === "toSignup" ? "ثبت‌نام" : "ورود به حساب"}
        </button>
      )}
    </p>
  );

  return (
    <div className="w-full">
      {/* تب‌ها */}
      <div role="tablist" className="mb-8 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-semibold">
        {(["login", "signup"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => switchTab(t)}
            className={`rounded-lg py-2.5 transition ${
              tab === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {t === "login" ? "ورود" : "ثبت‌نام"}
          </button>
        ))}
      </div>

      <h1 className="text-2xl font-bold text-stone-900">
        {tab === "login" ? "ورود به حساب" : "ساخت حساب جدید"}
      </h1>

      <p className="mt-2 text-sm leading-7 text-stone-500">
        {tab === "login"
          ? "شمارهٔ موبایل (یا ایمیل) و رمز عبور خود را وارد کنید."
          : "نام، ایمیل یا شمارهٔ موبایل و رمز عبور را وارد کنید."}
      </p>

      {notice && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">{notice}</p>
      )}

      {/* ورود: شماره + رمز یک‌جا */}
      {tab === "login" && (
        <form onSubmit={onLogin} noValidate className="mt-8">
          {identifierField}
          {passwordField("current-password", "رمز عبور")}
          {errorBlock}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>

          <p className="mt-6 text-center text-sm text-stone-500">
            حساب ندارید؟{" "}
            <button
              type="button"
              onClick={() => switchTab("signup")}
              className="font-semibold text-amber-700 hover:underline"
            >
              ثبت‌نام
            </button>
          </p>
        </form>
      )}

      {/* ثبت‌نام */}
      {tab === "signup" && (
        <form onSubmit={onSignup} noValidate className="mt-8">
          <label htmlFor="name" className={labelClass}>
            نام و نام خانوادگی
          </label>
          <input
            id="name"
            autoFocus
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />

          <div className="mt-5">{identifierField}</div>
          {passwordField("new-password", "حداقل ۸ کاراکتر")}
          {errorBlock}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full rounded-xl bg-amber-600 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
          >
            {loading ? "در حال ساخت حساب..." : "ساخت حساب و ورود"}
          </button>

          <p className="mt-6 text-center text-sm text-stone-500">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <button
              type="button"
              onClick={() => switchTab("login")}
              className="font-semibold text-amber-700 hover:underline"
            >
              ورود
            </button>
          </p>
        </form>
      )}
    </div>
  );
}