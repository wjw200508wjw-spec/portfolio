import type { Metadata, Viewport } from "next";
import { SITE } from "@/lib/constants";
import MotionSystem from "./components/MotionSystem";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "王佳伟 Wang Jiawei — 数据工程与 AI 应用开发",
  description: "王佳伟的个人作品集：医疗数据集成、航空维修数据治理、湖仓 POC、多模态 OCR 工作流与 Python 业务自动化。",
  alternates: { canonical: "/" },
  keywords: ["王佳伟","数据工程","数据治理","湖仓","Python","SQL","AI Agent","OCR","Data Engineer"],
  openGraph: { title: "王佳伟 — 让数据流动，让业务更轻松", description: SITE.tagline, url: SITE.url, locale: "zh_CN", type: "website", images: [{url:"/images/avatar.webp", width:610, height:640, alt:"王佳伟的 3D 卡通形象"}] },
  twitter: { card: "summary", title: "王佳伟 — 数据工程与 AI 应用开发", description: SITE.tagline, images:["/images/avatar.webp"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#100e17", colorScheme: "dark" };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="zh-CN"><body><a href="#main-content" className="skip-link">跳到主要内容</a><MotionSystem>{children}</MotionSystem></body></html>;
}
