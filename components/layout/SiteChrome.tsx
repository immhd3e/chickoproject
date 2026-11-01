"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import MiniCart from "@/components/cart/MiniCart";
import type { Category } from "@/data/categories";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteChrome({ categories, children }: { categories: Category[]; children: ReactNode }) {
  const pathname = usePathname();

  // پنل مدیریت چیدمان خودش را دارد
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Navbar categories={categories} />
      <main>{children}</main>
      <Footer categories={categories} />
      <MiniCart />
    </>
  );
}