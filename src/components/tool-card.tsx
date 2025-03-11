import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export function ToolCard({
  title,
  description,
  icon: Icon,
  href,
  color = "bg-primary/10",
}: ToolCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-md hover:scale-105 hover:border-primary/50">
        <CardHeader className="pb-2">
          <div
            className={`w-12 h-12 rounded-md flex items-center justify-center ${color}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4 text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Link>
  );
}
