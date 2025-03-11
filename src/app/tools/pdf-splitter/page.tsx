"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { File, Upload, X } from "lucide-react";
import { useState } from "react";

export default function PDFSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState<string>("");
  const [splitting, setSplitting] = useState(false);
  const [split, setSplit] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSplit(false);
      // In a real implementation, we would use a PDF library to get the total pages
      // For demo purposes, we'll set a random number
      setTotalPages(Math.floor(Math.random() * 20) + 5);
    }
  };

  const removeFile = () => {
    setFile(null);
    setTotalPages(null);
    setSplit(false);
  };

  const splitPDF = async () => {
    setSplitting(true);
    // In a real implementation, we would use a library like pdf-lib
    // to split the PDF on the client side
    setTimeout(() => {
      setSplitting(false);
      setSplit(true);
    }, 2000);
  };

  const downloadSplitPDFs = () => {
    // In a real implementation, this would download the split PDFs
    alert("In a real implementation, this would download the split PDFs");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Splitter</h1>
            <p className="text-muted-foreground">
              Split a PDF file into multiple documents by page ranges.
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
              <div className="mb-6">
                <label
                  htmlFor="page-ranges"
                  className="block text-sm font-medium mb-2"
                >
                  Page Ranges
                </label>
                <Input
                  id="page-ranges"
                  placeholder="e.g., 1-3, 5, 7-10"
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Specify page ranges separated by commas. For example, "1-3, 5,
                  7-10" will create 3 PDFs: one with pages 1-3, one with page 5,
                  and one with pages 7-10.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={splitPDF}
                disabled={!file || !pageRanges || splitting}
                className="w-full sm:w-auto"
              >
                {splitting ? "Splitting..." : "Split PDF"}
              </Button>
              {split && (
                <Button
                  variant="outline"
                  onClick={downloadSplitPDFs}
                  className="w-full sm:w-auto"
                >
                  Download Split PDFs
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a PDF file using the upload area above.</li>
              <li>
                Specify the page ranges you want to extract in the format "1-3,
                5, 7-10".
              </li>
              <li>Click the "Split PDF" button to process the file.</li>
              <li>
                Once processing is complete, download your split PDF documents.
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
