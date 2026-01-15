import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitMeal - 健身饮食助手",
  description: "帮助健身者和饮食管理者快速知道该吃什么",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
