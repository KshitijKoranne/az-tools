"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Slider } from "@/components/ui/slider";
import { FileArchive, Upload, X } from "lucide-react";
import { useState } from "react";

export default function FileCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState([50]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // Calculate total size
      const size = selectedFiles.reduce((total, file) => total + file.size, 0);
      setTotalSize(size);

      setCompressed(false);
      setCompressedSize(null);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const removedFileSize = newFiles[index].size;
    newFiles.splice(index, 1);
    setFiles(newFiles);

    // Update total size
    setTotalSize(totalSize - removedFileSize);

    setCompressed(false);
    setCompressedSize(null);
  };

  const compressFiles = async () => {
    setCompressing(true);
    // In a real implementation, we would use a library to compress the files
    // For demo purposes, we'll simulate compression
    setTimeout(() => {
      // Simulate compression result based on compression level
      const compressionRatio = 1 - compressionLevel[0] / 100;
      setCompressedSize(Math.floor(totalSize * compressionRatio));
      setCompressing(false);
      setCompressed(true);
    }, 2000);
  };

  const downloadCompressedFile = () => {
    if (!compressedSize || files.length === 0) return;

    // Create a dummy ZIP blob for demonstration
    // In a real implementation, this would be the actual compressed ZIP data
    const zipHeader = new Uint8Array([
      0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
    ]);

    const blob = new Blob([zipHeader], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compressed_files.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-bold mb-2">File Compressor</h1>
            <p className="text-muted-foreground">
              Compress multiple files into a single ZIP archive with adjustable
              compression level.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload Files
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
                      Select multiple files to compress
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Selected Files</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Total size: {formatFileSize(totalSize)}
                </p>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                    >
                      <div className="flex items-center">
                        <FileArchive className="w-5 h-5 mr-2 text-muted-foreground" />
                        <div>
                          <span className="text-sm truncate max-w-[200px] sm:max-w-xs block">
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {files.length > 0 && (
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
                  <span>Faster, larger file</span>
                  <span>Slower, smaller file</span>
                </div>
              </div>
            )}

            {compressed && compressedSize !== null && (
              <div className="mb-6 p-4 bg-muted/30 rounded-md">
                <h3 className="text-sm font-medium mb-2">Compression Result</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm">
                      Original: {formatFileSize(totalSize)}
                    </p>
                    <p className="text-sm">
                      Compressed: {formatFileSize(compressedSize)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    Reduced by{" "}
                    {Math.round(
                      ((totalSize - compressedSize) / totalSize) * 100,
                    )}
                    %
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={compressFiles}
                disabled={files.length === 0 || compressing}
                className="w-full sm:w-auto"
              >
                {compressing ? "Compressing..." : "Compress Files"}
              </Button>
              {compressed && (
                <Button
                  variant="outline"
                  onClick={downloadCompressedFile}
                  className="w-full sm:w-auto"
                >
                  Download ZIP
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload multiple files using the upload area above.</li>
              <li>
                Adjust the compression level slider to balance speed and file
                size.
              </li>
              <li>
                Click the "Compress Files" button to create a ZIP archive.
              </li>
              <li>
                Once processing is complete, download your compressed ZIP file.
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
