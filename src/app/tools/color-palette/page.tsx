"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [paletteType, setPaletteType] = useState("analogous");
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    generatePalette();
  }, [baseColor, paletteType]);

  const generatePalette = () => {
    // Convert hex to HSL
    const hexToHsl = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return { h: 0, s: 0, l: 0 };
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;

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

      return { h, s, l };
    };

    // Convert HSL to hex
    const hslToHex = (h: number, s: number, l: number) => {
      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const { h, s, l } = hexToHsl(baseColor);
    let newPalette: string[] = [];

    switch (paletteType) {
      case "analogous":
        // Analogous colors are next to each other on the color wheel
        newPalette = [
          hslToHex((h - 0.1 + 1) % 1, s, l),
          hslToHex((h - 0.05 + 1) % 1, s, l),
          baseColor,
          hslToHex((h + 0.05) % 1, s, l),
          hslToHex((h + 0.1) % 1, s, l),
        ];
        break;
      case "monochromatic":
        // Monochromatic colors are variations in lightness and saturation
        newPalette = [
          hslToHex(h, s, Math.max(0, l - 0.3)),
          hslToHex(h, s, Math.max(0, l - 0.15)),
          baseColor,
          hslToHex(h, s, Math.min(1, l + 0.15)),
          hslToHex(h, s, Math.min(1, l + 0.3)),
        ];
        break;
      case "complementary":
        // Complementary colors are opposite on the color wheel
        newPalette = [
          hslToHex((h - 0.1 + 1) % 1, s, l),
          baseColor,
          hslToHex((h + 0.1) % 1, s, l),
          hslToHex((h + 0.4) % 1, s, l),
          hslToHex((h + 0.5) % 1, s, l), // Complementary
        ];
        break;
      case "triadic":
        // Triadic colors are evenly spaced on the color wheel
        newPalette = [
          baseColor,
          hslToHex((h + 0.33) % 1, s, l),
          hslToHex((h + 0.67) % 1, s, l),
          hslToHex((h + 0.33) % 1, s, Math.min(1, l + 0.15)),
          hslToHex((h + 0.67) % 1, s, Math.min(1, l + 0.15)),
        ];
        break;
      default:
        newPalette = [baseColor];
    }

    setPalette(newPalette);
  };

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const randomizeColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    setBaseColor(randomColor);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Color Palette Generator</h1>
            <p className="text-muted-foreground">
              Generate harmonious color palettes for your designs.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label
                    htmlFor="base-color"
                    className="block text-sm font-medium mb-2"
                  >
                    Base Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      id="base-color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-16 h-16 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={randomizeColor}
                      title="Random Color"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="palette-type"
                    className="block text-sm font-medium mb-2"
                  >
                    Palette Type
                  </label>
                  <Select value={paletteType} onValueChange={setPaletteType}>
                    <SelectTrigger id="palette-type">
                      <SelectValue placeholder="Select palette type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="monochromatic">
                        Monochromatic
                      </SelectItem>
                      <SelectItem value="complementary">
                        Complementary
                      </SelectItem>
                      <SelectItem value="triadic">Triadic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    About This Palette
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {paletteType === "analogous" &&
                      "Analogous colors are next to each other on the color wheel, creating a harmonious and cohesive look."}
                    {paletteType === "monochromatic" &&
                      "Monochromatic colors are variations in lightness and saturation of a single color, creating a subtle and elegant look."}
                    {paletteType === "complementary" &&
                      "Complementary colors are opposite each other on the color wheel, creating a high-contrast and vibrant look."}
                    {paletteType === "triadic" &&
                      "Triadic colors are evenly spaced around the color wheel, creating a balanced and vibrant look."}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Generated Palette</h3>
                <div className="space-y-4">
                  {palette.map((color, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-md border"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">{color}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(color, index)}
                            className="h-8"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            {copied === index ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Select a base color using the color picker or enter a hex code.
              </li>
              <li>Choose a palette type from the dropdown menu.</li>
              <li>
                The generator will create a harmonious color palette based on
                your selections.
              </li>
              <li>
                Click the copy button next to any color to copy its hex code to
                your clipboard.
              </li>
              <li>Use the random button to generate a random base color.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
