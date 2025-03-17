"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { File, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);

  // Load original dimensions when file changes
  useEffect(() => {
    if (!file) {
      setOriginalWidth(null);
      setOriginalHeight(null);
      setWidth("");
      setHeight("");
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setResizedImageUrl(null);
      } else {
        alert("Please upload a valid image file (e.g., JPG, PNG).");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setResizedImageUrl(null);
  };

  const handleWidthChange = (value: string) => {
    const newWidth = value ? parseInt(value) : "";
    setWidth(newWidth);

    if (lockAspectRatio && newWidth && originalWidth && originalHeight) {
      const aspectRatio = originalWidth / originalHeight;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (value: string) => {
    const newHeight = value ? parseInt(value) : "";
    setHeight(newHeight);

    if (lockAspectRatio && newHeight && originalWidth && originalHeight) {
      const aspectRatio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const resizeImage = async () => {
    if (!file || !width || !height) {
      alert("Please upload an image and specify both width and height.");
      return;
    }

    setProcessing(true);
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Canvas context not available");

      ctx.drawImage(img, 0, 0, width, height);
      const resizedDataUrl = canvas.toDataURL(file.type);

      setResizedImageUrl(resizedDataUrl);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error resizing image:", error);
      alert("Error resizing image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadResizedImage = () => {
    if (!resizedImageUrl || !file) return;

    const extension = file.name.split(".").pop();
    saveAs(resizedImageUrl, `resized_${file.name.replace(`.${extension}`, "")}_${width}x${height}.${extension}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Image Resizer</h1>
            <p className="text-muted-foreground">
              Resize images to your desired dimensions.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
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
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, or other image formats
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

            {file && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Selected Image</h3>
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
                <p className="text-sm text-muted-foreground mt-2">
                  Original Dimensions: {originalWidth} x {originalHeight} px
                </p>
              </div>
            )}

            {file && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="width" className="block text-sm font-medium mb-2">
                    Width (px)
                  </label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Enter width"
                    min={1}
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium mb-2">
                    Height (px)
                  </label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Enter height"
                    min={1}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lock-aspect"
                    checked={lockAspectRatio}
                    onCheckedChange={setLockAspectRatio}
                  />
                  <label htmlFor="lock-aspect" className="text-sm font-medium">
                    Lock Aspect Ratio
                  </label>
                </div>
              </div>
            )}

            {resizedImageUrl && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <img src={resizedImageUrl} alt="Resized Preview" className="max-w-full h-auto rounded-md" />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={resizeImage}
                disabled={!file || !width || !height || processing}
                className="w-full sm:w-auto"
              >
                {processing ? "Resizing..." : "Resize Image"}
              </Button>
              {resizedImageUrl && (
                <Button
                  variant="outline"
                  onClick={downloadResizedImage}
                  className="w-full sm:w-auto"
                >
                  Download Resized Image
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload an image file using the upload area above.</li>
              <li>View the original dimensions and set new width and height.</li>
              <li>Toggle "Lock Aspect Ratio" to maintain proportions (optional).</li>
              <li>Click "Resize Image" to process the file.</li>
              <li>Preview and download the resized image.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}