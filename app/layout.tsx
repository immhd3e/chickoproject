import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

import SiteChrome from "@/components/layout/SiteChrome";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";

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
            <FavoritesProvider>
              <SiteChrome>{children}</SiteChrome>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}