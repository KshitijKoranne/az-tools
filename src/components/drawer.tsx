"use client";

import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  FileText,
  Image,
  Cpu,
  Palette,
  Calculator,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const toolCategories = [
  {
    title: "PDF Tools",
    icon: FileText,
    tools: [
      { title: "PDF Merger", href: "/tools/pdf-merger" },
      { title: "PDF Splitter", href: "/tools/pdf-splitter" },
      { title: "PDF Compressor", href: "/tools/pdf-compressor" },
      { title: "PDF to Image", href: "/tools/pdf-to-image" },
      { title: "PDF Watermark", href: "/tools/pdf-watermark" },
      { title: "PDF Encrypt", href: "/tools/pdf-encrypt" },
      { title: "PDF Rotate", href: "/tools/pdf-rotate" },
      { title: "PDF Metadata Editor", href: "/tools/pdf-metadata" },
    ],
  },
  {
    title: "Conversion Tools",
    icon: Image,
    tools: [
      { title: "Image Converter", href: "/tools/image-converter" },
      { title: "JSON to CSV", href: "/tools/json-to-csv" },
      { title: "Markdown to HTML", href: "/tools/markdown-to-html" },
      { title: "Unit Converter", href: "/tools/unit-converter" },
      { title: "CSV to JSON", href: "/tools/csv-to-json" },
      { title: "HTML to Markdown", href: "/tools/html-to-markdown" },
      { title: "XML to JSON", href: "/tools/xml-to-json" },
      { title: "Image Resizer", href: "/tools/image-resizer" },
      { title: "Currency Converter", href: "/tools/currency-converter" },
    ],
  },
  {
    title: "IT Tools",
    icon: Cpu,
    tools: [
      { title: "Hash Generator", href: "/tools/hash-generator" },
      { title: "Base64 Encoder/Decoder", href: "/tools/base64" },
      { title: "URL Encoder/Decoder", href: "/tools/url-encoder" },
      { title: "QR Code Generator", href: "/tools/qr-generator" },
      { title: "Password Generator", href: "/tools/password-generator" },
      { title: "JWT Decoder", href: "/tools/jwt-decoder" },
      { title: "Regex Tester", href: "/tools/regex-tester" },
    ],
  },
  {
    title: "Color Tools",
    icon: Palette,
    tools: [
      { title: "Color Picker", href: "/tools/color-picker" },
      { title: "Color Palette Generator", href: "/tools/color-palette" },
      { title: "Contrast Checker", href: "/tools/contrast-checker" },
      { title: "Theme Customizer", href: "/tools/theme-customizer" },
      { title: "Gradient Generator", href: "/tools/gradient-generator" },
      { title: "Color Blindness Simulator", href: "/tools/color-blindness" },
      { title: "Color Extractor", href: "/tools/color-extractor" },
      { title: "CSS Color Generator", href: "/tools/css-color-generator" },
      { title: "Color Name Finder", href: "/tools/color-name-finder" },
    ],
  },
  {
    title: "Utilities",
    icon: Calculator,
    tools: [
      { title: "File Compressor", href: "/tools/file-compressor" },
      { title: "Calculator", href: "/tools/calculator" },
      { title: "Text Diff Checker", href: "/tools/text-diff" },
      { title: "Notes App", href: "/tools/notes" },
      { title: "Pomodoro Timer", href: "/tools/pomodoro" },
      { title: "Random Number Generator", href: "/tools/random-number" },
      { title: "Character Counter", href: "/tools/character-counter" },
      { title: "Todo List", href: "/tools/todo-list" },
    ],
  },
];

export function ToolsDrawer() {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  useEffect(() => {
    if (isDrawerOpen) {
      setOpenCategories(toolCategories.map((cat) => cat.title));
    } else {
      setOpenCategories([]);
    }
  }, [isDrawerOpen]);

  return (
    <Drawer.Root
      direction="left"
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
    >
      <Drawer.Trigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-2 z-50 rounded-full border-2 border-primary/20 bg-background/80 backdrop-blur-sm transition-all hover:bg-primary/10 md:left-16 md:top-4"
        >
          <Menu className="h-5 w-5 text-primary" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Content className="fixed left-0 top-0 z-[60] h-screen w-72 bg-background/95 p-6 shadow-xl ring-1 ring-border backdrop-blur-md md:w-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 [-webkit-overflow-scrolling:touch]">
        <div className="flex flex-col gap-6 min-h-[calc(100vh-3rem)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Tool Categories</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-3 flex-1">
            {toolCategories.map((category) => (
              <div key={category.title}>
                <button
                  onClick={() => toggleCategory(category.title)}
                  className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span className="flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    {category.title}
                  </span>
                  {openCategories.includes(category.title) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {openCategories.includes(category.title) && (
                  <ul className="mt-2 space-y-1 pl-6">
                    {category.tools.map((tool) => (
                      <li key={tool.title}>
                        <Link
                          href={tool.href}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {tool.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}