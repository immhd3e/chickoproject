"use client";

import { useState } from "react";

import MainHeader from "./MainHeader";
import CategoryMenu from "./CategoryMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50">
        <MainHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <CategoryMenu />
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}