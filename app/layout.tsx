import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Chợ Kỳ Kỳ | Chợ không thiếu thứ gì",
  description: "Sàn thương mại điện tử dành cho những món đồ không bình thường. Tặng 5.000 Xu Kỳ Lạ cho tài khoản mới.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${beVietnam.variable}`}>{children}</body>
    </html>
  );
}
