"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Slider } from "@/components/ui/slider";
import { File, Upload, X } from "lucide-react";
import { useState } from "react";

export default function PDFCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState([50]);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCompressed(false);
      setCompressedSize(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setOriginalSize(null);
    setCompressed(false);
    setCompressedSize(null);
  };

  const compressPDF = async () => {
    setCompressing(true);
    // In a real implementation, we would use a library to compress the PDF
    // For demo purposes, we'll simulate compression
    setTimeout(() => {
      // Simulate compression result based on compression level
      const compressionRatio = 1 - compressionLevel[0] / 100;
      if (originalSize) {
        setCompressedSize(Math.floor(originalSize * compressionRatio));
      }
      setCompressing(false);
      setCompressed(true);
    }, 2000);
  };

  const downloadCompressedPDF = () => {
    // In a real implementation, this would download the compressed PDF
    alert("In a real implementation, this would download the compressed PDF");
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Compressor</h1>
            <p className="text-muted-foreground">
              Reduce the file size of your PDF documents while maintaining
              quality.
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
                {originalSize && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Original size: {formatFileSize(originalSize)}
                  </p>
                )}
              </div>
            )}

            {file && (
              <div className="mb-6">
                <label
                  htmlFor="compression-level"
                  className="block text-sm font-medium mb-2"
                >
                  Compression Level: {compressionLevel[0]}%
                </label>
                <Slider
                  id="compression-level"
                  min={10}
                  max={90}
                  step={10}
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lower quality, smaller file</span>
                  <span>Higher quality, larger file</span>
                </div>
              </div>
            )}

            {compressed && compressedSize && originalSize && (
              <div className="mb-6 p-4 bg-muted/30 rounded-md">
                <h3 className="text-sm font-medium mb-2">Compression Result</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm">
                      Original: {formatFileSize(originalSize)}
                    </p>
                    <p className="text-sm">
                      Compressed: {formatFileSize(compressedSize)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    Reduced by{" "}
                    {Math.round(
                      ((originalSize - compressedSize) / originalSize) * 100,
                    )}
                    %
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={compressPDF}
                disabled={!file || compressing}
                className="w-full sm:w-auto"
              >
                {compressing ? "Compressing..." : "Compress PDF"}
              </Button>
              {compressed && (
                <Button
                  variant="outline"
                  onClick={downloadCompressedPDF}
                  className="w-full sm:w-auto"
                >
                  Download Compressed PDF
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a PDF file using the upload area above.</li>
              <li>
                Adjust the compression level slider to balance quality and file
                size.
              </li>
              <li>Click the "Compress PDF" button to process the file.</li>
              <li>
                Once processing is complete, download your compressed PDF
                document.
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
