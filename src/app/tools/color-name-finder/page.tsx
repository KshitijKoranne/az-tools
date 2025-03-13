"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Copy, Palette, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

// Color name database - a small subset for demonstration
const colorNames: Record<string, string> = {
  "#FF0000": "Red",
  "#00FF00": "Lime",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#00FFFF": "Cyan",
  "#FF00FF": "Magenta",
  "#C0C0C0": "Silver",
  "#808080": "Gray",
  "#800000": "Maroon",
  "#808000": "Olive",
  "#008000": "Green",
  "#800080": "Purple",
  "#008080": "Teal",
  "#000080": "Navy",
  "#FFA500": "Orange",
  "#A52A2A": "Brown",
  "#FFC0CB": "Pink",
  "#FFFFFF": "White",
  "#000000": "Black",
  "#F0F8FF": "AliceBlue",
  "#FAEBD7": "AntiqueWhite",
  "#7FFFD4": "Aquamarine",
  "#F0FFFF": "Azure",
  "#F5F5DC": "Beige",
  "#FFE4C4": "Bisque",
  "#FFEBCD": "BlanchedAlmond",
  "#8A2BE2": "BlueViolet",
  "#DEB887": "BurlyWood",
  "#5F9EA0": "CadetBlue",
  "#7FFF00": "Chartreuse",
  "#D2691E": "Chocolate",
  "#FF7F50": "Coral",
  "#6495ED": "CornflowerBlue",
  "#FFF8DC": "Cornsilk",
  "#DC143C": "Crimson",
  "#00008B": "DarkBlue",
  "#008B8B": "DarkCyan",
  "#B8860B": "DarkGoldenRod",
  "#A9A9A9": "DarkGray",
  "#006400": "DarkGreen",
  "#BDB76B": "DarkKhaki",
  "#8B008B": "DarkMagenta",
  "#556B2F": "DarkOliveGreen",
  "#FF8C00": "DarkOrange",
  "#9932CC": "DarkOrchid",
  "#8B0000": "DarkRed",
  "#E9967A": "DarkSalmon",
  "#8FBC8F": "DarkSeaGreen",
  "#483D8B": "DarkSlateBlue",
  "#2F4F4F": "DarkSlateGray",
  "#00CED1": "DarkTurquoise",
  "#9400D3": "DarkViolet",
  "#FF1493": "DeepPink",
  "#00BFFF": "DeepSkyBlue",
  "#696969": "DimGray",
  "#1E90FF": "DodgerBlue",
  "#B22222": "FireBrick",
  "#FFFAF0": "FloralWhite",
  "#228B22": "ForestGreen",
  "#DCDCDC": "Gainsboro",
  "#F8F8FF": "GhostWhite",
  "#FFD700": "Gold",
  "#DAA520": "GoldenRod",
  "#ADFF2F": "GreenYellow",
  "#F0FFF0": "HoneyDew",
  "#FF69B4": "HotPink",
  "#CD5C5C": "IndianRed",
  "#4B0082": "Indigo",
  "#FFFFF0": "Ivory",
  "#F0E68C": "Khaki",
  "#E6E6FA": "Lavender",
  "#FFF0F5": "LavenderBlush",
  "#7CFC00": "LawnGreen",
  "#FFFACD": "LemonChiffon",
  "#ADD8E6": "LightBlue",
  "#F08080": "LightCoral",
  "#E0FFFF": "LightCyan",
  "#FAFAD2": "LightGoldenRodYellow",
  "#D3D3D3": "LightGray",
  "#90EE90": "LightGreen",
  "#FFB6C1": "LightPink",
  "#FFA07A": "LightSalmon",
  "#20B2AA": "LightSeaGreen",
  "#87CEFA": "LightSkyBlue",
  "#778899": "LightSlateGray",
  "#B0C4DE": "LightSteelBlue",
  "#FFFFE0": "LightYellow",
  "#32CD32": "LimeGreen",
  "#FAF0E6": "Linen",
  "#66CDAA": "MediumAquaMarine",
  "#0000CD": "MediumBlue",
  "#BA55D3": "MediumOrchid",
  "#9370DB": "MediumPurple",
  "#3CB371": "MediumSeaGreen",
  "#7B68EE": "MediumSlateBlue",
  "#00FA9A": "MediumSpringGreen",
  "#48D1CC": "MediumTurquoise",
  "#C71585": "MediumVioletRed",
  "#191970": "MidnightBlue",
  "#F5FFFA": "MintCream",
  "#FFE4E1": "MistyRose",
  "#FFE4B5": "Moccasin",
  "#FFDEAD": "NavajoWhite",
  "#FDF5E6": "OldLace",
  "#6B8E23": "OliveDrab",
  "#FF4500": "OrangeRed",
  "#DA70D6": "Orchid",
  "#EEE8AA": "PaleGoldenRod",
  "#98FB98": "PaleGreen",
  "#AFEEEE": "PaleTurquoise",
  "#DB7093": "PaleVioletRed",
  "#FFEFD5": "PapayaWhip",
  "#FFDAB9": "PeachPuff",
  "#CD853F": "Peru",
  "#DDA0DD": "Plum",
  "#B0E0E6": "PowderBlue",
  "#BC8F8F": "RosyBrown",
  "#4169E1": "RoyalBlue",
  "#8B4513": "SaddleBrown",
  "#FA8072": "Salmon",
  "#F4A460": "SandyBrown",
  "#2E8B57": "SeaGreen",
  "#FFF5EE": "SeaShell",
  "#A0522D": "Sienna",
  "#87CEEB": "SkyBlue",
  "#6A5ACD": "SlateBlue",
  "#708090": "SlateGray",
  "#FFFAFA": "Snow",
  "#00FF7F": "SpringGreen",
  "#4682B4": "SteelBlue",
  "#D2B48C": "Tan",
  "#D8BFD8": "Thistle",
  "#FF6347": "Tomato",
  "#40E0D0": "Turquoise",
  "#EE82EE": "Violet",
  "#F5DEB3": "Wheat",
  "#F5F5F5": "WhiteSmoke",
  "#9ACD32": "YellowGreen",
};

export default function ColorNameFinderPage() {
  const [color, setColor] = useState("#3b82f6");
  const [colorName, setColorName] = useState("");
  const [nearestColors, setNearestColors] = useState<
    { hex: string; name: string; distance: number }[]
  >([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(false);

  // Check if EyeDropper API is supported
  useEffect(() => {
    setEyeDropperSupported(
      typeof window !== "undefined" && "EyeDropper" in window,
    );
  }, []);

  // Find color name when color changes
  useEffect(() => {
    findColorName(color);
  }, [color]);

  // Find the name of a color and nearest matches
  const findColorName = (hexColor: string) => {
    // Normalize hex color
    const normalizedHex = hexColor.toUpperCase();

    // Check if exact match exists
    if (colorNames[normalizedHex]) {
      setColorName(colorNames[normalizedHex]);
      setNearestColors([]);
      return;
    }

    // Find nearest colors
    const distances: { hex: string; name: string; distance: number }[] = [];

    for (const [hex, name] of Object.entries(colorNames)) {
      const distance = calculateColorDistance(normalizedHex, hex);
      distances.push({ hex, name, distance });
    }

    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance);

    // Get the closest match and nearest colors
    if (distances.length > 0) {
      setColorName(`${distances[0].name} (closest match)`);
      setNearestColors(distances.slice(0, 5));
    } else {
      setColorName("Unknown");
      setNearestColors([]);
    }
  };

  // Calculate distance between two colors in RGB space
  const calculateColorDistance = (hex1: string, hex2: string) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2),
    );
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    // Remove the # if present
    hex = hex.replace(/^#/, "");

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  // Generate a random color
  const generateRandomColor = () => {
    const randomHex = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    setColor(randomHex);
  };

  // Use the EyeDropper API to pick a color from the screen
  const useEyeDropper = async () => {
    if (!eyeDropperSupported) return;

    try {
      // @ts-ignore - EyeDropper is not in the TypeScript DOM types yet
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setColor(result.sRGBHex);
    } catch (e) {
      console.error("Error using eyedropper:", e);
    }
  };

  // Copy a color or name to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Color Name Finder</h1>
            <p className="text-muted-foreground">
              Find the name of any color and discover similar colors.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label
                    htmlFor="color-input"
                    className="block text-sm font-medium mb-2"
                  >
                    Color (Hex Code)
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex">
                      <div
                        className="w-10 h-10 rounded-l-md border-y border-l"
                        style={{ backgroundColor: color }}
                      ></div>
                      <Input
                        id="color-input"
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="rounded-l-none"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={generateRandomColor}
                      className="px-3"
                      title="Generate random color"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    {eyeDropperSupported && (
                      <Button
                        variant="outline"
                        onClick={useEyeDropper}
                        className="px-3"
                        title="Pick color from screen"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="m2 22 1-1h3l9-9"></path>
                          <path d="M3 21v-3l9-9"></path>
                          <path d="m15 6 3.5-3.5a2.12 2.12 0 0 1 3 3L18 9"></path>
                          <path d="m15 6-6 6"></path>
                          <path d="m16 16 6 6"></path>
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Color Name
                  </label>
                  <div className="p-4 bg-muted/30 rounded-md flex justify-between items-center">
                    <span className="font-medium">{colorName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(colorName)}
                      className="h-8 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copied === colorName ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                {nearestColors.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Similar Colors
                    </label>
                    <div className="space-y-2">
                      {nearestColors.map((c, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted/10 rounded-md hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded-md mr-3"
                              style={{ backgroundColor: c.hex }}
                            ></div>
                            <div>
                              <div className="font-medium text-sm">
                                {c.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {c.hex}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setColor(c.hex)}
                              className="h-7 px-2 text-xs"
                            >
                              Use
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(c.hex)}
                              className="h-7 px-2 text-xs"
                            >
                              <Copy className="h-3 w-3" />
                              {copied === c.hex ? "Copied!" : ""}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Color Preview
                  </label>
                  <div className="space-y-4">
                    <div
                      className="w-full h-40 rounded-md border"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="h-20 rounded-md flex items-center justify-center font-medium text-white"
                        style={{ backgroundColor: color }}
                      >
                        White Text
                      </div>
                      <div
                        className="h-20 rounded-md flex items-center justify-center font-medium text-black"
                        style={{ backgroundColor: color }}
                      >
                        Black Text
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Color Values
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-xs text-muted-foreground mb-1">
                        HEX
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono">{color}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(color)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-xs text-muted-foreground mb-1">
                        RGB
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono">
                          {Object.values(hexToRgb(color)).join(", ")}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `rgb(${Object.values(hexToRgb(color)).join(", ")})`,
                            )
                          }
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Enter a hex color code (e.g., #3b82f6) in the input field.
              </li>
              <li>Use the random button to generate a random color.</li>
              {eyeDropperSupported && (
                <li>
                  Use the eyedropper tool to pick a color from anywhere on your
                  screen.
                </li>
              )}
              <li>View the color name and similar colors.</li>
              <li>Copy color values to use in your projects.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
