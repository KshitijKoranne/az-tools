"use client";

import { useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { File, Upload, X } from "lucide-react";

export default function PDFWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState([30]);
  const [watermarkColor, setWatermarkColor] = useState("#FF0000");
  const [watermarkSize, setWatermarkSize] = useState([40]);
  const [watermarkAngle, setWatermarkAngle] = useState([345]);
  const [watermarkPosition, setWatermarkPosition] = useState<string>("middle");
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessed(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProcessed(false);
  };

  const addWatermark = async () => {
    if (!file || !watermarkText) {
      alert("Please upload a PDF and enter watermark text.");
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("watermark_text", watermarkText);
      formData.append("opacity", String(watermarkOpacity[0] / 100)); // iLoveAPI expects 0-1
      formData.append("font_color", watermarkColor);
      formData.append("font_size", String(watermarkSize[0]));
      formData.append("rotation", String(watermarkAngle[0]));
      formData.append("position", watermarkPosition);

      // Send to a proxy endpoint (to be set up later)
      const response = await fetch("/api/watermark", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `watermarked_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      setProcessed(true);
    } catch (error) {
      console.error("Error adding watermark:", error);
      alert("Failed to add watermark. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Watermark</h1>
            <p className="text-muted-foreground">
              Add text watermarks to your PDF documents.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                Upload PDF File
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF file only</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Selected File</h3>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center">
                    <File className="w-5 h-5 mr-2 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px] sm:max-w-xs">
                      {file.name}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {file && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="mb-6">
                    <label htmlFor="watermark-text" className="block text-sm font-medium mb-2">
                      Watermark Text
                    </label>
                    <Input
                      id="watermark-text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="watermark-color" className="block text-sm font-medium mb-2">
                      Watermark Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="watermark-color"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="watermark-opacity" className="block text-sm font-medium mb-2">
                      Opacity: {watermarkOpacity[0]}%
                    </label>
                    <Slider
                      id="watermark-opacity"
                      min={10}
                      max={100}
                      step={5}
                      value={watermarkOpacity}
                      onValueChange={setWatermarkOpacity}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <label htmlFor="watermark-size" className="block text-sm font-medium mb-2">
                      Size: {watermarkSize[0]}
                    </label>
                    <Slider
                      id="watermark-size"
                      min={10}
                      max={100}
                      step={5}
                      value={watermarkSize}
                      onValueChange={setWatermarkSize}
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="watermark-angle" className="block text-sm font-medium mb-2">
                      Rotation Angle: {watermarkAngle[0]}°
                    </label>
                    <Slider
                      id="watermark-angle"
                      min={0}
                      max={360}
                      step={15}
                      value={watermarkAngle}
                      onValueChange={setWatermarkAngle}
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="watermark-position" className="block text-sm font-medium mb-2">
                      Position
                    </label>
                    <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
                      <SelectTrigger id="watermark-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="middle-left">Middle Left</SelectItem>
                        <SelectItem value="middle-right">Middle Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={addWatermark}
                disabled={!file || !watermarkText || processing}
                className="w-full sm:w-auto"
              >
                {processing ? "Processing..." : "Add Watermark"}
              </Button>
              {processed && (
                <Button variant="outline" className="w-full sm:w-auto">
                  Download Complete
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a PDF file using the upload area above.</li>
              <li>Enter the text you want to use as a watermark.</li>
              <li>Customize the watermark appearance (color, opacity, size, angle, position).</li>
              <li>Click the "Add Watermark" button to process the file.</li>
              <li>Once processed, your watermarked PDF will download automatically.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}