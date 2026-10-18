import Link from "next/link";
import { redirect } from "next/navigation";

import AdminNav from "@/components/admin/AdminNav";
import { destroyAdminSession, isAdmin } from "@/lib/admin-auth";

export const instant = false;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");

  async function logout() {
    "use server";
    await destroyAdminSession();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-stone-100 lg:flex">
      <aside className="bg-stone-950 p-4 text-white lg:flex lg:min-h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:p-5">
        <div className="mb-4 flex items-center justify-between lg:mb-8">
          <span className="text-lg font-bold">
            MDF<span className="text-amber-500">Factory</span>
            <span className="mr-2 text-xs font-normal text-stone-400">پنل مدیریت</span>
          </span>
        </div>

        <AdminNav />

        <div className="mt-4 flex items-center gap-4 text-sm lg:mt-auto lg:flex-col lg:items-stretch lg:gap-2">
          <Link href="/" className="rounded-xl px-4 py-2.5 text-stone-300 transition hover:bg-stone-800 hover:text-white">
            مشاهدهٔ سایت
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full rounded-xl px-4 py-2.5 text-right text-red-400 transition hover:bg-stone-800">
              خروج
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}