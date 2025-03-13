import { ToolCard } from "@/components/tool-card";
import { Container } from "@/components/ui/container";
import AnimatedOutlinedBlock from "./animated-outlined-block";
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
      {
        title: "PDF to Image",
        description: "Convert PDF pages to image formats",
        icon: File,
        href: "/tools/pdf-to-image",
        color: "bg-red-500/10",
      },
      {
        title: "PDF Watermark",
        description: "Add text or image watermarks to PDFs",
        icon: File,
        href: "/tools/pdf-watermark",
        color: "bg-red-500/10",
      },
      {
        title: "PDF Encrypt",
        description: "Secure PDFs with password protection",
        icon: File,
        href: "/tools/pdf-encrypt",
        color: "bg-red-500/10",
      },
      {
        title: "PDF Rotate",
        description: "Rotate pages in PDF documents",
        icon: File,
        href: "/tools/pdf-rotate",
        color: "bg-red-500/10",
      },
      {
        title: "PDF Metadata Editor",
        description: "Edit PDF document properties",
        icon: File,
        href: "/tools/pdf-metadata",
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
      {
        title: "CSV to JSON",
        description: "Convert CSV data to JSON format",
        icon: FileJson,
        href: "/tools/csv-to-json",
        color: "bg-blue-500/10",
      },
      {
        title: "HTML to Markdown",
        description: "Convert HTML to Markdown format",
        icon: FileText,
        href: "/tools/html-to-markdown",
        color: "bg-blue-500/10",
      },
      {
        title: "XML to JSON",
        description: "Convert XML data to JSON format",
        icon: FileJson,
        href: "/tools/xml-to-json",
        color: "bg-blue-500/10",
      },
      {
        title: "Image Resizer",
        description: "Resize images to specific dimensions",
        icon: Image,
        href: "/tools/image-resizer",
        color: "bg-blue-500/10",
      },
      {
        title: "Currency Converter",
        description: "Convert between different currencies",
        icon: FileText,
        href: "/tools/currency-converter",
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
      {
        title: "JWT Decoder",
        description: "Decode and verify JWT tokens",
        icon: FileCode,
        href: "/tools/jwt-decoder",
        color: "bg-green-500/10",
      },
      {
        title: "Regex Tester",
        description: "Test and validate regular expressions",
        icon: Cpu,
        href: "/tools/regex-tester",
        color: "bg-green-500/10",
      },
      {
        title: "Cron Expression Generator",
        description: "Create and validate cron expressions",
        icon: Cpu,
        href: "/tools/cron-generator",
        color: "bg-green-500/10",
      },
      {
        title: "UUID Generator",
        description: "Generate random UUIDs/GUIDs",
        icon: Cpu,
        href: "/tools/uuid-generator",
        color: "bg-green-500/10",
      },
      {
        title: "HTML Entity Encoder",
        description: "Convert characters to HTML entities",
        icon: FileCode,
        href: "/tools/html-entity-encoder",
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
      {
        title: "Gradient Generator",
        description: "Create beautiful CSS gradients",
        icon: Palette,
        href: "/tools/gradient-generator",
        color: "bg-purple-500/10",
      },
      {
        title: "Color Blindness Simulator",
        description: "Test designs for color blindness accessibility",
        icon: Palette,
        href: "/tools/color-blindness",
        color: "bg-purple-500/10",
      },
      {
        title: "Color Extractor",
        description: "Extract dominant colors from images",
        icon: Palette,
        href: "/tools/color-extractor",
        color: "bg-purple-500/10",
      },
      {
        title: "CSS Color Generator",
        description: "Generate CSS color variables",
        icon: Palette,
        href: "/tools/css-color-generator",
        color: "bg-purple-500/10",
      },
      {
        title: "Color Name Finder",
        description: "Find the name of any color",
        icon: Palette,
        href: "/tools/color-name-finder",
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
      {
        title: "Notes App",
        description: "Create and save quick notes",
        icon: FileText,
        href: "/tools/notes",
        color: "bg-yellow-500/10",
      },
      {
        title: "Pomodoro Timer",
        description: "Boost productivity with timed work sessions",
        icon: Calculator,
        href: "/tools/pomodoro",
        color: "bg-yellow-500/10",
      },
      {
        title: "Random Number Generator",
        description: "Generate random numbers with custom ranges",
        icon: Calculator,
        href: "/tools/random-number",
        color: "bg-yellow-500/10",
      },
      {
        title: "Character Counter",
        description: "Count characters, words, and lines in text",
        icon: FileText,
        href: "/tools/character-counter",
        color: "bg-yellow-500/10",
      },
      {
        title: "Todo List",
        description: "Create and manage simple to-do lists",
        icon: FileText,
        href: "/tools/todo-list",
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
            <AnimatedOutlinedBlock
              className="mb-6 inline-block"
              background="var(--background)"
              highlight="var(--primary)"
            >
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </AnimatedOutlinedBlock>
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
