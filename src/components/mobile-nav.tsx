"use client";

import { Button } from "@/components/ui/button";
import { Home, Grid, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-4">
        <Link href="/" className="flex flex-col items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Home className="h-6 w-6" />
          </Button>
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/#tools-section"
          className="flex flex-col items-center justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 text-muted-foreground`}
          >
            <Grid className="h-6 w-6" />
          </Button>
          <span className="text-xs">Tools</span>
        </Link>
        <Link href="/#" className="flex flex-col items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 text-muted-foreground`}
            onClick={() => {
              const searchInput = document.querySelector(
                'input[type="search"]',
              ) as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
              }
            }}
          >
            <Search className="h-6 w-6" />
          </Button>
          <span className="text-xs">Search</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 ${pathname === "/settings" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Settings className="h-6 w-6" />
          </Button>
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </div>
  );
}
