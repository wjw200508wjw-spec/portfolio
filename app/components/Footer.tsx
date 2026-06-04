import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-bg-elevated py-10 text-center">
      <p className="text-sm text-text-secondary">
        &copy; {new Date().getFullYear()} {SITE.name} . 使用 Next.js &amp; Three.js 构建
      </p>
    </footer>
  );
}
