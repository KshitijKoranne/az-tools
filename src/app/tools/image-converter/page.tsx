"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, Upload, X } from "lucide-react";
import { useState } from "react";

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("jpg");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConverted(false);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setConverted(false);
  };

  const convertImage = async () => {
    setConverting(true);
    // In a real implementation, we would use a library to convert the image
    // For demo purposes, we'll simulate conversion
    setTimeout(() => {
      setConverting(false);
      setConverted(true);
    }, 2000);
  };

  const downloadConvertedImage = () => {
    if (!file || !previewUrl) return;

    // For demonstration, we'll use the preview URL as the source
    // In a real implementation, this would be the actual converted image
    fetch(previewUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name.split(".")[0] + "." + outputFormat;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Error downloading image:", err);
        alert("Error downloading the converted image");
      });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Image Converter</h1>
            <p className="text-muted-foreground">
              Convert images between different formats like JPG, PNG, WebP, and
              more.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP, GIF, or BMP
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
                <div className="flex flex-col sm:flex-row gap-4">
                  {previewUrl && (
                    <div className="w-full sm:w-1/3 h-40 bg-muted/30 rounded-md overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md mb-4">
                      <div className="flex items-center">
                        <Image className="w-5 h-5 mr-2 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[200px] sm:max-w-xs">
                          {file.name}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeFile}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="output-format"
                        className="block text-sm font-medium mb-2"
                      >
                        Convert to
                      </label>
                      <Select
                        value={outputFormat}
                        onValueChange={setOutputFormat}
                      >
                        <SelectTrigger id="output-format" className="w-full">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                          <SelectItem value="gif">GIF</SelectItem>
                          <SelectItem value="bmp">BMP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={convertImage}
                disabled={!file || converting}
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert Image"}
              </Button>
              {converted && (
                <Button
                  variant="outline"
                  onClick={downloadConvertedImage}
                  className="w-full sm:w-auto"
                >
                  Download Converted Image
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload an image using the upload area above.</li>
              <li>Select the output format you want to convert to.</li>
              <li>Click the "Convert Image" button to process the file.</li>
              <li>
                Once processing is complete, download your converted image.
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
