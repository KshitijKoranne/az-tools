"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Copy, EyeDropper, Palette, RefreshCw } from "lucide-react";
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
  const [nearestColors, setNearestColors] = useState<{hex: string, name: string, distance: number}[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [eyeDropperSupported, setEyeDropperSupported] = useState(false);

  // Check if EyeDropper API is supported
  useEffect(() => {
    setEyeDropperSupported(typeof window !== 'undefined' && 'EyeDropper' in window);
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
    const distances: {hex: string, name: string, distance: number}[] = [];
    
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
      Math.pow(rgb1.b - rgb2.b, 2)
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
    const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
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
  const copyToClipboard = (text: string) =>