"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Copy, ImageIcon, Upload, X } from "lucide-react";
import { Palette } from "@/components/ui/palette";
import { useState, useRef, useEffect } from "react";

interface ExtractedColor {
  hex: string;
  rgb: string;
  count: number;
  percentage: number;
}

export default function ColorExtractorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [maxColors, setMaxColors] = useState(8);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setExtractedColors([]);

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
    setExtractedColors([]);
  };

  const loadImageFromUrl = () => {
    if (!urlInput) return;
    setPreviewUrl(urlInput);
    setFile(null);
    setExtractedColors([]);
  };

  const extractColors = () => {
    if (!previewUrl || !canvasRef.current) return;
    setIsExtracting(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;

      // Process image data to extract colors
      const colorMap: Record<string, number> = {};
      const totalPixels = canvas.width * canvas.height;

      // Sample pixels (skip some pixels for performance with large images)
      const skipFactor = Math.max(1, Math.floor(totalPixels / 100000));

      for (let i = 0; i < imageData.length; i += 4 * skipFactor) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Quantize colors to reduce the number of unique colors
        const quantizedR = Math.round(r / 16) * 16;
        const quantizedG = Math.round(g / 16) * 16;
        const quantizedB = Math.round(b / 16) * 16;

        const hex = rgbToHex(quantizedR, quantizedG, quantizedB);
        colorMap[hex] = (colorMap[hex] || 0) + 1;
      }

      // Convert to array and sort by frequency
      const colorArray = Object.entries(colorMap).map(([hex, count]) => ({
        hex,
        rgb: hexToRgbString(hex),
        count,
        percentage: (count / (totalPixels / skipFactor)) * 100,
      }));

      colorArray.sort((a, b) => b.count - a.count);

      // Take the top N colors
      setExtractedColors(colorArray.slice(0, maxColors));
      setIsExtracting(false);
    };

    img.onerror = () => {
      alert("Error loading image. Please try another image or URL.");
      setIsExtracting(false);
    };

    img.src = previewUrl;
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  // Convert hex to RGB string
  const hexToRgbString = (hex: string) => {
    // Remove the # if present
    hex = hex.replace(/^#/, "");

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Copy a color value to clipboard
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
            <h1 className="text-3xl font-bold mb-2">Color Extractor</h1>
            <p className="text-muted-foreground">
              Extract dominant colors from any image.
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
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF, or WebP
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="url-input"
                    className="block text-sm font-medium mb-2"
                  >
                    Or Enter Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="url-input"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <Button onClick={loadImageFromUrl} disabled={!urlInput}>
                      Load
                    </Button>
                  </div>
                </div>

                {previewUrl && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Image Preview
                    </label>
                    <div className="relative border rounded-md overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full h-auto"
                      />
                      {file && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={removeFile}
                          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={extractColors}
                  disabled={!previewUrl || isExtracting}
                  className="w-full mb-4"
                >
                  {isExtracting ? "Extracting Colors..." : "Extract Colors"}
                </Button>

                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Extracted Colors</h3>
                {extractedColors.length > 0 ? (
                  <div className="space-y-4">
                    {extractedColors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/10 rounded-md hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-md mr-3"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <div>
                            <div className="font-mono text-sm">{color.hex}</div>
                            <div className="text-xs text-muted-foreground">
                              {color.rgb}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-sm font-medium">
                            {color.percentage.toFixed(1)}%
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(color.hex)}
                            className="h-8 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copied === color.hex ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : previewUrl ? (
                  <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
                    <Palette className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-center">
                      Click "Extract Colors" to analyze the image
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
                    <ImageIcon className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-center">
                      Upload an image or enter a URL to extract colors
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload an image or enter an image URL.</li>
              <li>Click the "Extract Colors" button to analyze the image.</li>
              <li>View the dominant colors extracted from the image.</li>
              <li>Copy color codes to use in your designs.</li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> This tool is useful for creating color
                palettes based on images, finding brand colors, or matching
                colors for your design projects.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
