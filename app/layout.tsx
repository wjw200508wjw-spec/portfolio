import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE.nameEn} — ${SITE.title}`,
  description: SITE.tagline,
  keywords: [
    "Data Engineer", "AI Agent", "Big Data", "Flink CDC", "Python",
    "PostgreSQL", "LangChain", "LangGraph", "数据工程师", "王佳伟",
  ],
  openGraph: {
    title: `${SITE.nameEn} — Data Engineer & AI Agent Developer`,
    description: SITE.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
