"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Copy, Palette } from "lucide-react";
import { useState, useEffect } from "react";

export default function ColorPickerPage() {
  const [color, setColor] = useState("#3b82f6");
  const [rgb, setRgb] = useState("");
  const [hsl, setHsl] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return null;
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgb(${r}, ${g}, ${b})`;
    };

    // Convert hex to HSL
    const hexToHsl = (hex: string) => {
      // Convert hex to RGB first
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return null;
      let r = parseInt(result[1], 16);
      let g = parseInt(result[2], 16);
      let b = parseInt(result[3], 16);

      // Convert RGB to HSL
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    setRgb(hexToRgb(color) || "");
    setHsl(hexToHsl(color) || "");
  }, [color]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Color Picker</h1>
            <p className="text-muted-foreground">
              Pick colors and convert between different color formats.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label
                    htmlFor="color-picker"
                    className="block text-sm font-medium mb-2"
                  >
                    Select Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      id="color-picker"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-16 h-16 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Color Formats
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <span className="font-mono text-sm">{color}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(color, "hex")}
                          className="h-8"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copied === "hex" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <span className="font-mono text-sm">{rgb}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(rgb, "rgb")}
                          className="h-8"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copied === "rgb" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <span className="font-mono text-sm">{hsl}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(hsl, "hsl")}
                          className="h-8"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          {copied === "hsl" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Color Preview</h3>
                  <div
                    className="w-full h-40 rounded-md border"
                    style={{ backgroundColor: color }}
                  ></div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Sample Text</h3>
                  <div className="space-y-2">
                    <div
                      className="p-4 rounded-md"
                      style={{ backgroundColor: color, color: "white" }}
                    >
                      <p className="font-medium">
                        White text on selected color
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-md"
                      style={{ backgroundColor: color, color: "black" }}
                    >
                      <p className="font-medium">
                        Black text on selected color
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-md border"
                      style={{ color: color }}
                    >
                      <p className="font-medium">Selected color as text</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Use the color picker or enter a hex color code.</li>
              <li>View the color in different formats (HEX, RGB, HSL).</li>
              <li>Copy any format to your clipboard with the copy button.</li>
              <li>
                See a preview of how the color looks in different contexts.
              </li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
