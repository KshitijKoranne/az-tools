"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ContrastCheckerPage() {
  const [foregroundColor, setForegroundColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#3b82f6");
  const [contrastRatio, setContrastRatio] = useState(0);
  const [wcagAA, setWcagAA] = useState(false);
  const [wcagAAA, setWcagAAA] = useState(false);
  const [wcagAALarge, setWcagAALarge] = useState(false);
  const [wcagAAALarge, setWcagAAALarge] = useState(false);

  useEffect(() => {
    calculateContrast();
  }, [foregroundColor, backgroundColor]);

  const calculateContrast = () => {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return [0, 0, 0];
      return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ];
    };

    // Calculate relative luminance
    const calculateLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgRgb = hexToRgb(foregroundColor);
    const bgRgb = hexToRgb(backgroundColor);

    const fgLuminance = calculateLuminance(fgRgb);
    const bgLuminance = calculateLuminance(bgRgb);

    // Calculate contrast ratio
    const ratio =
      (Math.max(fgLuminance, bgLuminance) + 0.05) /
      (Math.min(fgLuminance, bgLuminance) + 0.05);

    setContrastRatio(ratio);

    // Check WCAG compliance
    setWcagAA(ratio >= 4.5);
    setWcagAAA(ratio >= 7);
    setWcagAALarge(ratio >= 3);
    setWcagAAALarge(ratio >= 4.5);
  };

  const swapColors = () => {
    const temp = foregroundColor;
    setForegroundColor(backgroundColor);
    setBackgroundColor(temp);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Contrast Checker</h1>
            <p className="text-muted-foreground">
              Check color contrast for accessibility compliance.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label
                    htmlFor="foreground-color"
                    className="block text-sm font-medium mb-2"
                  >
                    Text Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      id="foreground-color"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={foregroundColor}
                      onChange={(e) => setForegroundColor(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="background-color"
                    className="block text-sm font-medium mb-2"
                  >
                    Background Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      id="background-color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={swapColors}
                  className="w-full mb-6"
                >
                  Swap Colors
                </Button>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    Contrast Ratio: {contrastRatio.toFixed(2)}:1
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center mr-2">
                        {wcagAA ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <span>WCAG AA: Normal Text (minimum 4.5:1)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center mr-2">
                        {wcagAAA ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <span>WCAG AAA: Normal Text (minimum 7:1)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center mr-2">
                        {wcagAALarge ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <span>WCAG AA: Large Text (minimum 3:1)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 flex items-center justify-center mr-2">
                        {wcagAAALarge ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <span>WCAG AAA: Large Text (minimum 4.5:1)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Preview</h3>
                <div
                  className="w-full h-64 rounded-md border p-6 flex flex-col justify-between"
                  style={{ backgroundColor: backgroundColor }}
                >
                  <div>
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{ color: foregroundColor }}
                    >
                      Large Text Example
                    </h2>
                    <p className="text-base" style={{ color: foregroundColor }}>
                      This is an example of normal text on the selected
                      background color. The contrast ratio should be at least
                      4.5:1 for WCAG AA compliance.
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-md border"
                    style={{ borderColor: foregroundColor }}
                  >
                    <p className="text-sm" style={{ color: foregroundColor }}>
                      Small text example in a bordered container.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Select a text color and a background color using the color
                pickers.
              </li>
              <li>The contrast ratio will be calculated automatically.</li>
              <li>Check if the colors meet WCAG accessibility guidelines.</li>
              <li>Use the preview to see how the colors look together.</li>
              <li>
                Adjust colors as needed to meet accessibility requirements.
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
