import { ToolCard } from "@/components/tool-card";
import { Container } from "@/components/ui/container";
import {
  FileText,
  Image,
  Palette,
  Cpu,
  FileJson,
  FileCode,
  File,
  FileArchive,
  Calculator,
} from "lucide-react";

interface ToolCategory {
  title: string;
  tools: {
    title: string;
    description: string;
    icon: any;
    href: string;
    color?: string;
  }[];
}

const toolCategories: ToolCategory[] = [
  {
    title: "PDF Tools",
    tools: [
      {
        title: "PDF Merger",
        description: "Combine multiple PDF files into one",
        icon: File,
        href: "/tools/pdf-merger",
        color: "bg-red-500/10",
      },
      {
        title: "PDF Splitter",
        description: "Split PDF files into multiple documents",
        icon: File,
        href: "/tools/pdf-splitter",
        color: "bg-red-500/10",
      },
      {
        title: "PDF Compressor",
        description: "Reduce PDF file size",
        icon: File,
        href: "/tools/pdf-compressor",
        color: "bg-red-500/10",
      },
    ],
  },
  {
    title: "Conversion Tools",
    tools: [
      {
        title: "Image Converter",
        description: "Convert images between formats",
        icon: Image,
        href: "/tools/image-converter",
        color: "bg-blue-500/10",
      },
      {
        title: "JSON to CSV",
        description: "Convert JSON to CSV format",
        icon: FileJson,
        href: "/tools/json-to-csv",
        color: "bg-blue-500/10",
      },
      {
        title: "Markdown to HTML",
        description: "Convert Markdown to HTML",
        icon: FileText,
        href: "/tools/markdown-to-html",
        color: "bg-blue-500/10",
      },
      {
        title: "Unit Converter",
        description: "Convert between different units of measurement",
        icon: FileText,
        href: "/tools/unit-converter",
        color: "bg-blue-500/10",
      },
    ],
  },
  {
    title: "IT Tools",
    tools: [
      {
        title: "Hash Generator",
        description: "Generate hash values for text or files",
        icon: Cpu,
        href: "/tools/hash-generator",
        color: "bg-green-500/10",
      },
      {
        title: "Base64 Encoder/Decoder",
        description: "Encode or decode Base64 strings",
        icon: FileCode,
        href: "/tools/base64",
        color: "bg-green-500/10",
      },
      {
        title: "URL Encoder/Decoder",
        description: "Encode or decode URL components",
        icon: FileCode,
        href: "/tools/url-encoder",
        color: "bg-green-500/10",
      },
      {
        title: "QR Code Generator",
        description: "Create QR codes for URLs or text",
        icon: Cpu,
        href: "/tools/qr-generator",
        color: "bg-green-500/10",
      },
      {
        title: "Password Generator",
        description: "Generate secure random passwords",
        icon: Cpu,
        href: "/tools/password-generator",
        color: "bg-green-500/10",
      },
    ],
  },
  {
    title: "Color Tools",
    tools: [
      {
        title: "Color Picker",
        description: "Pick and convert colors between formats",
        icon: Palette,
        href: "/tools/color-picker",
        color: "bg-purple-500/10",
      },
      {
        title: "Color Palette Generator",
        description: "Generate harmonious color palettes",
        icon: Palette,
        href: "/tools/color-palette",
        color: "bg-purple-500/10",
      },
      {
        title: "Contrast Checker",
        description: "Check color contrast for accessibility",
        icon: Palette,
        href: "/tools/contrast-checker",
        color: "bg-purple-500/10",
      },
      {
        title: "Theme Customizer",
        description: "Create and preview custom color themes",
        icon: Palette,
        href: "/tools/theme-customizer",
        color: "bg-purple-500/10",
      },
    ],
  },
  {
    title: "Utilities",
    tools: [
      {
        title: "File Compressor",
        description: "Compress files to reduce size",
        icon: FileArchive,
        href: "/tools/file-compressor",
        color: "bg-yellow-500/10",
      },
      {
        title: "Calculator",
        description: "Perform various calculations",
        icon: Calculator,
        href: "/tools/calculator",
        color: "bg-yellow-500/10",
      },
      {
        title: "Text Diff Checker",
        description: "Compare two texts and find differences",
        icon: FileText,
        href: "/tools/text-diff",
        color: "bg-yellow-500/10",
      },
    ],
  },
];

export function ToolGrid() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        {toolCategories.map((category, index) => (
          <div key={index} className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-1 w-8 bg-primary rounded mr-3"></div>
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.tools.map((tool, toolIndex) => (
                <ToolCard
                  key={toolIndex}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  href={tool.href}
                  color={tool.color}
                />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
