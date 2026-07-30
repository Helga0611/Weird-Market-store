import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chợ Kỳ Kỳ | Chợ không thiếu thứ gì",
  description: "Sàn thương mại điện tử dành cho những món đồ không bình thường. Tặng 5.000 Xu Kỳ Lạ cho tài khoản mới.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
