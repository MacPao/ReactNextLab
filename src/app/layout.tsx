import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "../context/I18nContext";

export const metadata: Metadata = {
  title: "Data Platform Operations Console | 資料平台營運主控台",
  description: "Enterprise Data Platform Operations Console for POS Performance, Addax DataX ETL Pipeline Management, and RBAC Role Authorization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
