"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Eye, Image, Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type ColorBlindnessType =
  | "normal"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia";

export default function ColorBlindnessPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [colorBlindnessType, setColorBlindnessType] =
    useState<ColorBlindnessType>("normal");
  const [urlInput, setUrlInput] = useState("");
  const [sampleImages, setSampleImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80",
    "https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=800&q=80",
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
          setUrlInput("");
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const loadImageFromUrl = () => {
    if (!urlInput) return;
    setPreviewUrl(urlInput);
    setFile(null);
  };

  const selectSampleImage = (url: string) => {
    setPreviewUrl(url);
    setUrlInput("");
    setFile(null);
  };

  // Apply color blindness simulation filter
  useEffect(() => {
    if (!previewUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // If not normal vision, apply filter
      if (colorBlindnessType !== "normal") {
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply color blindness simulation
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Convert RGB to new values based on color blindness type
          let newR = r;
          let newG = g;
          let newB = b;

          switch (colorBlindnessType) {
            case "protanopia": // Red-blind
              newR = 0.567 * r + 0.433 * g + 0.0 * b;
              newG = 0.558 * r + 0.442 * g + 0.0 * b;
              newB = 0.0 * r + 0.242 * g + 0.758 * b;
              break;
            case "deuteranopia": // Green-blind
              newR = 0.625 * r + 0.375 * g + 0.0 * b;
              newG = 0.7 * r + 0.3 * g + 0.0 * b;
              newB = 0.0 * r + 0.3 * g + 0.7 * b;
              break;
            case "tritanopia": // Blue-blind
              newR = 0.95 * r + 0.05 * g + 0.0 * b;
              newG = 0.0 * r + 0.433 * g + 0.567 * b;
              newB = 0.0 * r + 0.475 * g + 0.525 * b;
              break;
            case "achromatopsia": // Total color blindness
              const avg = (r + g + b) / 3;
              newR = avg;
              newG = avg;
              newB = avg;
              break;
          }

          // Update pixel data
          data[i] = newR;
          data[i + 1] = newG;
          data[i + 2] = newB;
        }

        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
      }
    };

    img.src = previewUrl;
  }, [previewUrl, colorBlindnessType]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Color Blindness Simulator
            </h1>
            <p className="text-muted-foreground">
              Test how your designs appear to people with different types of
              color blindness.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium mb-2"
                  >
                    Upload Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to