import { Container } from "@/components/ui/container";
import { Coffee } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8 bg-primary/5 colorful:bg-gradient-to-t colorful:from-primary/5 colorful:to-transparent">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Made in INDIA by KSK Labs. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.buymeacoffee.com/kshitijkorz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Coffee className="h-4 w-4" />
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
