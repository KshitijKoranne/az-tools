"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { File, RotateCcw, RotateCw, Upload, X } from "lucide-react";
import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";

export default function PDFRotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>(
    {},
  );
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [rotatedPdfBytes, setRotatedPdfBytes] = useState<Uint8Array | null>(
    null,
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessed(false);
      setRotatedPdfBytes(null);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        setTotalPages(pageCount);

        const initialRotations: Record<number, number> = {};
        for (let i = 1; i <= pageCount; i++) {
          initialRotations[i] = 0;
        }
        setPageRotations(initialRotations);
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
    setPageRotations({});
    setProcessed(false);
    setRotatedPdfBytes(null);
  };

  const rotatePage = (
    pageNum: number,
    direction: "clockwise" | "counterclockwise",
  ) => {
    setPageRotations((prev) => {
      const currentRotation = prev[pageNum] || 0;
      const rotationChange = direction === "clockwise" ? 90 : -90;
      let newRotation = (currentRotation + rotationChange) % 360;
      if (newRotation < 0) newRotation += 360;

      return {
        ...prev,
        [pageNum]: newRotation,
      };
    });
  };

  const resetRotations = () => {
    if (!totalPages) return;

    const resetRotations: Record<number, number> = {};
    for (let i = 1; i <= totalPages; i++) {
      resetRotations[i] = 0;
    }
    setPageRotations(resetRotations);
  };

  const applyRotations = async () => {
    if (!file || !totalPages) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Apply rotations to each page
      const pages = pdfDoc.getPages();
      pages.forEach((page, index) => {
        const pageNum = index + 1; // Page numbers start at 1 in UI
        const rotation = pageRotations[pageNum] || 0;
        if (rotation !== 0) {
          page.setRotation(degrees(rotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      setRotatedPdfBytes(pdfBytes);
      setProcessed(true);
    } catch (error) {
      console.error("Error rotating PDF pages:", error);
      alert(
        "Error rotating PDF pages. Please try again with a valid PDF file.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const downloadRotatedPDF = () => {
    if (!rotatedPdfBytes || !file) return;

    const blob = new Blob([rotatedPdfBytes], { type: "application/pdf" });
    saveAs(blob, `rotated_${file.name}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Rotate</h1>
            <p className="text-muted-foreground">
              Rotate pages in your PDF documents to the correct orientation.
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Rotate Pages</h3>
                  <Button variant="outline" size="sm" onClick={resetRotations}>
                    Reset All Rotations
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <div key={pageNum} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Page {pageNum}</span>
                          <span className="text-sm text-muted-foreground">
                            {pageRotations[pageNum] || 0}°
                          </span>
                        </div>
                        <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center mb-2 relative">
                          <div
                            className="w-16 h-24 bg-primary/10 border border-primary/30 flex items-center justify-center"
                            style={{
                              transform: `rotate(${pageRotations[pageNum] || 0}deg)`,
                            }}
                          >
                            <span className="text-xs">Page {pageNum}</span>
                          </div>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              rotatePage(pageNum, "counterclockwise")
                            }
                            title="Rotate counterclockwise"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => rotatePage(pageNum, "clockwise")}
                            title="Rotate clockwise"
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={applyRotations}
                disabled={!file || !totalPages || processing}
                className="w-full sm:w-auto"
              >
                {processing ? "Processing..." : "Apply Rotations"}
              </Button>
              {processed && (
                <Button
                  variant="outline"
                  onClick={downloadRotatedPDF}
                  className="w-full sm:w-auto"
                >
                  Download Rotated PDF
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a PDF file using the upload area above.</li>
              <li>Use the rotation buttons to rotate each page as needed.</li>
              <li>Click the "Apply Rotations" button to process the file.</li>
              <li>
                Once processing is complete, download your rotated PDF document.
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