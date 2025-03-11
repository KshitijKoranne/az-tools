import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <div className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-background">
      <Container>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block p-2 px-4 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Free & Mobile-Optimized
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Free Utility Tools for Everyday Tasks
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px]">
            A collection of free, mobile-optimized tools for PDF manipulation,
            format conversions, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a href="#tools-section" className="inline-block">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Tools <ArrowDown className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
