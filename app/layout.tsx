import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MiniCart from "@/components/cart/MiniCart";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/cart/CartProvider";

const font = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "MDF Factory", template: "%s | MDF Factory" },
  description: "طراحی، تولید و اجرای محصولات MDF و دکوراسیون داخلی",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${font.className} bg-stone-50 text-stone-900 antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <MiniCart />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}