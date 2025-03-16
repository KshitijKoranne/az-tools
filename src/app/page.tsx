import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MobileNav } from "@/components/mobile-nav";
import { ToolGrid } from "@/components/tool-grid";
import dynamic from "next/dynamic";

// Explicitly import ToolsDrawer as a client component with SSR disabled
const ToolsDrawer = dynamic(
  () => import("@/components/drawer").then((mod) => mod.ToolsDrawer),
  { ssr: false }
);

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <ToolsDrawer />
      <main className="flex-1">
        <Hero />
        <div id="tools-section">
          <ToolGrid />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}