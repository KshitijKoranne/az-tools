"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Slider } from "@/components/ui/slider";
import { File, ImageIcon, Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PDFToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [imageQuality, setImageQuality] = useState([80]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [imageFormat, setImageFormat] = useState<"png" | "jpg">("png");
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConverted(false);
      setPreviewImages([]);

      try {
        // Get the total number of pages in the PDF
        const arrayBuffer = await selectedFile.arrayBuffer();
        // Using dynamic import for PDFDocument to avoid type errors
        const { PDFDocument } = await import("pdf-lib");
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        setTotalPages(pageCount);

        // By default, select all pages
        setSelectedPages(Array.from({ length: pageCount }, (_, i) => i + 1));
      } catch (error) {
        console.error("Error loading PDF:", error);
        alert("Error loading PDF. Please make sure it is a valid PDF file.");
        setFile(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setTotalPages(null);
    setSelectedPages([]);
    setConverted(false);
    setPreviewImages([]);
  };

  const togglePageSelection = (pageNum: number) => {
    if (selectedPages.includes(pageNum)) {
      setSelectedPages(selectedPages.filter((p) => p !== pageNum));
    } else {
      setSelectedPages([...selectedPages, pageNum].sort((a, b) => a - b));
    }
  };

  const selectAllPages = () => {
    if (totalPages) {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  };

  const deselectAllPages = () => {
    setSelectedPages([]);
  };

  const convertPDFToImages = async () => {
    if (!file || selectedPages.length === 0) return;

    setConverting(true);
    try {
      // In a real implementation, we would use a PDF rendering library
      // For demo purposes, we'll create placeholder images
      const mockImages: string[] = [];

      // Create a canvas to render PDF pages (in a real implementation)
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not create canvas context");
      }

      // Set canvas dimensions (this would be based on PDF page size in real implementation)
      canvas.width = 800;
      canvas.height = 1100;

      // Create placeholder images for each selected page
      for (const pageNum of selectedPages) {
        // In a real implementation, we would render the PDF page to the canvas
        // For demo, we'll create colored rectangles with page numbers
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add a border
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Add page number and file name
        ctx.fillStyle = "#333333";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`Page ${pageNum}`, canvas.width / 2, 50);

        ctx.font = "18px Arial";
        ctx.fillText(file.name, canvas.width / 2, 80);

        // Add PDF icon
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(canvas.width / 2 - 40, canvas.height / 2 - 50, 80, 100);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px Arial";
        ctx.fillText("PDF", canvas.width / 2, canvas.height / 2);

        // Convert canvas to image data URL
        const imageDataUrl = canvas.toDataURL(
          `image/${imageFormat}`,
          imageQuality[0] / 100,
        );
        mockImages.push(imageDataUrl);
      }

      setPreviewImages(mockImages);
      setConverted(true);
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      alert("Error converting PDF to images. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  const downloadImages = () => {
    if (previewImages.length === 0) return;

    // Download each image
    previewImages.forEach((imageUrl, index) => {
      const pageNum = selectedPages[index];
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${file?.name.replace(".pdf", "")}_page${pageNum}.${imageFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF to Image Converter</h1>
            <p className="text-muted-foreground">
              Convert PDF pages to high-quality images in PNG or JPG format.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF file only
                    </p>
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
                {totalPages && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Total pages: {totalPages}
                  </p>
                )}
              </div>
            )}

            {file && totalPages && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Select Pages</label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllPages}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAllPages}
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <div
                          key={pageNum}
                          className={`border rounded-md p-2 text-center cursor-pointer ${selectedPages.includes(pageNum) ? "bg-primary/10 border-primary" : "bg-muted/30"}`}
                          onClick={() => togglePageSelection(pageNum)}
                        >
                          {pageNum}
                        </div>
                      ),
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selectedPages.length} of {totalPages} pages selected
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Image Format
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="format-png"
                        name="format"
                        checked={imageFormat === "png"}
                        onChange={() => setImageFormat("png")}
                        className="mr-2"
                      />
                      <label htmlFor="format-png">
                        PNG (Higher quality, larger file size)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="format-jpg"
                        name="format"
                        checked={imageFormat === "jpg"}
                        onChange={() => setImageFormat("jpg")}
                        className="mr-2"
                      />
                      <label htmlFor="format-jpg">
                        JPG (Smaller file size)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="image-quality"
                    className="block text-sm font-medium mb-2"
                  >
                    Image Quality: {imageQuality[0]}%
                  </label>
                  <Slider
                    id="image-quality"
                    min={10}
                    max={100}
                    step={10}
                    value={imageQuality}
                    onValueChange={setImageQuality}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Lower quality, smaller file</span>
                    <span>Higher quality, larger file</span>
                  </div>
                </div>
              </>
            )}

            {converted && previewImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {previewImages.slice(0, 3).map((imageUrl, index) => (
                    <div
                      key={index}
                      className="border rounded-md overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt={`Page ${selectedPages[index]}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                  {previewImages.length > 3 && (
                    <div className="border rounded-md flex items-center justify-center p-4 bg-muted/30">
                      <span>+{previewImages.length - 3} more images</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={convertPDFToImages}
                disabled={!file || selectedPages.length === 0 || converting}
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to Images"}
              </Button>
              {converted && previewImages.length > 0 && (
                <Button
                  variant="outline"
                  onClick={downloadImages}
                  className="w-full sm:w-auto"
                >
                  Download Images
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a PDF file using the upload area above.</li>
              <li>Select the pages you want to convert to images.</li>
              <li>Choose the image format (PNG or JPG) and quality.</li>
              <li>Click the "Convert to Images" button to process the file.</li>
              <li>Once processing is complete, download your images.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
