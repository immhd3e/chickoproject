import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const font = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "چیکو",
    template: "%s | چیکو",
  },
  description: "طراحی، تولید و اجرای محصولات چیکو و دکوراسیون داخلی",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${font.className} bg-stone-50 text-stone-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}