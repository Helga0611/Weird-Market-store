import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const fredoka = Fredoka({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chợ Kỳ Kỳ | Chợ không thiếu thứ gì",
  description: "Sàn thương mại điện tử dành cho những món đồ không bình thường. Tặng 5.000 Xu Kỳ Lạ cho tài khoản mới.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body className={`${quicksand.variable} ${fredoka.variable}`}>{children}</body>
    </html>
  );
}
