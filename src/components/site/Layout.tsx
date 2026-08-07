import type { ReactNode } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import ScrollProgress from "@/components/motion/ScrollProgress";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper" style={{ overflowX: "clip" }}>
      <ScrollProgress />
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
