"use client";

import { useState } from "react";

import type { Category } from "@/data/categories";
import CategoryMenu from "./CategoryMenu";
import MainHeader from "./MainHeader";
import MobileMenu from "./MobileMenu";

export default function Navbar({ categories }: { categories: Category[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      

      <header className="sticky top-0 z-50">
        <MainHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <CategoryMenu categories={categories} />
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}