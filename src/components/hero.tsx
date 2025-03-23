import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <div className="py-12 md:py-20 bg-primary/5 colorful:bg-gradient-to-b colorful:from-primary/5 colorful:to-background">
      <Container>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block p-2 px-4 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Free & No Login Required
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl colorful:bg-clip-text colorful:text-transparent colorful:bg-gradient-to-r colorful:from-primary colorful:via-secondary colorful:to-accent">
            Your One Stop for all handy tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px]">
          Empower your daily tasks with our curated suite of free, efficient tools—no sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a href="#tools-section" className="inline-block">
              <Button
                size="lg"
                className="gap-2 colorful:bg-gradient-to-r colorful:from-primary colorful:to-secondary colorful:hover:from-primary/90 colorful:hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
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
