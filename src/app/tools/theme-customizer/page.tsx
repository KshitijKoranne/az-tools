"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Check, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeCustomizerPage() {
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#10b981");
  const [accentColor, setAccentColor] = useState("#8b5cf6");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#111827");
  const [activeTab, setActiveTab] = useState("custom");
  const [themeApplied, setThemeApplied] = useState(false);

  const presetThemes = [
    {
      name: "Ocean Blue",
      primary: "#0ea5e9",
      secondary: "#0284c7",
      accent: "#38bdf8",
      background: "#f0f9ff",
      text: "#0c4a6e",
    },
    {
      name: "Forest Green",
      primary: "#16a34a",
      secondary: "#15803d",
      accent: "#4ade80",
      background: "#f0fdf4",
      text: "#14532d",
    },
    {
      name: "Royal Purple",
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#a78bfa",
      background: "#f5f3ff",
      text: "#4c1d95",
    },
    {
      name: "Sunset Orange",
      primary: "#f97316",
      secondary: "#ea580c",
      accent: "#fb923c",
      background: "#fff7ed",
      text: "#7c2d12",
    },
  ];

  const applyTheme = () => {
    // In a real implementation, this would apply the theme to the application
    // For demo purposes, we'll just show a success message
    setThemeApplied(true);
    setTimeout(() => setThemeApplied(false), 3000);
  };

  const applyPresetTheme = (theme: (typeof presetThemes)[0]) => {
    setPrimaryColor(theme.primary);
    setSecondaryColor(theme.secondary);
    setAccentColor(theme.accent);
    setBackgroundColor(theme.background);
    setTextColor(theme.text);
    setActiveTab("custom");
  };

  const generateRandomTheme = () => {
    // Generate random colors
    const randomHex = () => {
      return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
    };

    setPrimaryColor(randomHex());
    setSecondaryColor(randomHex());
    setAccentColor(randomHex());
    setBackgroundColor("#ffffff"); // Keep background white for readability
    setTextColor("#111827"); // Keep text dark for readability
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Theme Customizer</h1>
            <p className="text-muted-foreground">
              Create and preview custom color themes for your projects.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <Tabs
              defaultValue="custom"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="custom">Custom Theme</TabsTrigger>
                <TabsTrigger value="presets">Preset Themes</TabsTrigger>
              </TabsList>

              <TabsContent value="custom" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Color Settings</h3>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="primary-color"
                          className="block text-sm font-medium mb-2"
                        >
                          Primary Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="primary-color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="secondary-color"
                          className="block text-sm font-medium mb-2"
                        >
                          Secondary Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="secondary-color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="accent-color"
                          className="block text-sm font-medium mb-2"
                        >
                          Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="accent-color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="background-color"
                          className="block text-sm font-medium mb-2"
                        >
                          Background Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="background-color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="text-color"
                          className="block text-sm font-medium mb-2"
                        >
                          Text Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            id="text-color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <Button onClick={applyTheme} className="gap-2">
                        <Palette className="h-4 w-4" />
                        Apply Theme
                      </Button>
                      <Button
                        variant="outline"
                        onClick={generateRandomTheme}
                        className="gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Random Theme
                      </Button>
                    </div>

                    {themeApplied && (
                      <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        <span>Theme applied successfully!</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Theme Preview</h3>
                    <div
                      className="border rounded-lg p-6 h-[400px] overflow-auto"
                      style={{ backgroundColor, color: textColor }}
                    >
                      <h2
                        className="text-2xl font-bold mb-4"
                        style={{ color: textColor }}
                      >
                        Theme Preview
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <h3
                            className="text-lg font-medium mb-2"
                            style={{ color: textColor }}
                          >
                            Buttons
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="px-4 py-2 rounded-md text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Primary Button
                            </button>
                            <button
                              className="px-4 py-2 rounded-md text-white"
                              style={{ backgroundColor: secondaryColor }}
                            >
                              Secondary Button
                            </button>
                            <button
                              className="px-4 py-2 rounded-md text-white"
                              style={{ backgroundColor: accentColor }}
                            >
                              Accent Button
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3
                            className="text-lg font-medium mb-2"
                            style={{ color: textColor }}
                          >
                            Cards
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div
                              className="p-4 rounded-md"
                              style={{
                                backgroundColor: `${primaryColor}20`,
                                borderLeft: `4px solid ${primaryColor}`,
                              }}
                            >
                              <h4
                                className="font-medium"
                                style={{ color: primaryColor }}
                              >
                                Primary Card
                              </h4>
                              <p style={{ color: textColor }}>
                                This is a sample card with primary color.
                              </p>
                            </div>
                            <div
                              className="p-4 rounded-md"
                              style={{
                                backgroundColor: `${secondaryColor}20`,
                                borderLeft: `4px solid ${secondaryColor}`,
                              }}
                            >
                              <h4
                                className="font-medium"
                                style={{ color: secondaryColor }}
                              >
                                Secondary Card
                              </h4>
                              <p style={{ color: textColor }}>
                                This is a sample card with secondary color.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3
                            className="text-lg font-medium mb-2"
                            style={{ color: textColor }}
                          >
                            Text Elements
                          </h3>
                          <h4 style={{ color: primaryColor }}>
                            Primary Heading
                          </h4>
                          <h4 style={{ color: secondaryColor }}>
                            Secondary Heading
                          </h4>
                          <h4 style={{ color: accentColor }}>Accent Heading</h4>
                          <p style={{ color: textColor }}>
                            Regular text in the text color.
                          </p>
                          <a
                            href="#"
                            style={{
                              color: primaryColor,
                              textDecoration: "underline",
                            }}
                          >
                            This is a link in primary color
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="presets">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {presetThemes.map((theme, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => applyPresetTheme(theme)}
                    >
                      <h3 className="text-lg font-medium mb-2">{theme.name}</h3>
                      <div className="flex gap-2 mb-4">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        ></div>
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: theme.secondary }}
                        ></div>
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        ></div>
                      </div>
                      <div
                        className="p-4 rounded-md"
                        style={{
                          backgroundColor: theme.background,
                          color: theme.text,
                        }}
                      >
                        <h4 style={{ color: theme.primary }}>Sample Heading</h4>
                        <p>This is how text would look with this theme.</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            className="px-3 py-1 rounded-md text-white text-sm"
                            style={{ backgroundColor: theme.primary }}
                          >
                            Button
                          </button>
                          <button
                            className="px-3 py-1 rounded-md text-white text-sm"
                            style={{ backgroundColor: theme.secondary }}
                          >
                            Button
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Customize your theme by selecting colors for different elements.
              </li>
              <li>Use the color pickers or enter hex color codes directly.</li>
              <li>Preview how your theme looks in real-time.</li>
              <li>Try preset themes for quick inspiration.</li>
              <li>Click "Apply Theme" to use your custom theme.</li>
              <li>Use "Random Theme" to generate random color combinations.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
