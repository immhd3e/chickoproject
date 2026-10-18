"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import MiniCart from "@/components/cart/MiniCart";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // پنل مدیریت چیدمان خودش را دارد
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MiniCart />
    </>
  );
}