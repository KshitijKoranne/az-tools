"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Coffee, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { title: string; href: string }[]
  >([]);
  const [showResults, setShowResults] = useState(false);

  const tools = [
    { title: "PDF Merger", href: "/tools/pdf-merger" },
    { title: "PDF Splitter", href: "/tools/pdf-splitter" },
    { title: "PDF Compressor", href: "/tools/pdf-compressor" },
    { title: "Image Converter", href: "/tools/image-converter" },
    { title: "JSON to CSV", href: "/tools/json-to-csv" },
    { title: "Markdown to HTML", href: "/tools/markdown-to-html" },
    { title: "Hash Generator", href: "/tools/hash-generator" },
    { title: "Base64 Encoder/Decoder", href: "/tools/base64" },
    { title: "URL Encoder/Decoder", href: "/tools/url-encoder" },
    { title: "Color Picker", href: "/tools/color-picker" },
    { title: "Color Palette Generator", href: "/tools/color-palette" },
    { title: "Contrast Checker", href: "/tools/contrast-checker" },
    { title: "Theme Customizer", href: "/tools/theme-customizer" },
    { title: "File Compressor", href: "/tools/file-compressor" },
    { title: "Calculator", href: "/tools/calculator" },
    { title: "Text Diff Checker", href: "/tools/text-diff" },
    { title: "QR Code Generator", href: "/tools/qr-generator" },
    { title: "Password Generator", href: "/tools/password-generator" },
    { title: "Unit Converter", href: "/tools/unit-converter" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      // Search implementation

      const results = tools.filter((tool) =>
        tool.title.toLowerCase().includes(query.toLowerCase()),
      );

      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">AZ-Tools</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex md:w-full md:max-w-sm items-center gap-2 relative">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search tools..."
                  className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() =>
                    searchResults.length > 0 && setShowResults(true)
                  }
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <Link
                        key={index}
                        href={result.href}
                        className="block px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                      >
                        {result.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ThemeSwitcher />
            <div id="bmc-container" className="h-10"></div>
          </div>
        </div>
      </Container>
    </header>
  );
}
