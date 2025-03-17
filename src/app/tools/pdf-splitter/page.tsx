"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { File, Upload, X } from "lucide-react";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import JSZip from "jszip";

export default function PDFSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState<string>("");
  const [splitting, setSplitting] = useState(false);
  const [split, setSplit] = useState(false);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [splitPdfs, setSplitPdfs] = useState<
    { name: string; data: Uint8Array }[]
  >([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setSplit(false);
      setSplitPdfs([]);

      try {
        // Get the total number of pages in the PDF
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
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
    setSplit(false);
    setSplitPdfs([]);
  };

  const parsePageRanges = (rangesStr: string, maxPages: number): number[][] => {
    const ranges: number[][] = [];

    // Split by comma and process each range
    const parts = rangesStr.split(",").map((part) => part.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        // Handle range like "1-3"
        const [start, end] = part.split("-").map((num) => parseInt(num.trim()));

        if (
          isNaN(start) ||
          isNaN(end) ||
          start < 1 ||
          end > maxPages ||
          start > end
        ) {
          continue; // Skip invalid ranges
        }

        ranges.push(
          Array.from({ length: end - start + 1 }, (_, i) => start + i - 1),
        );
      } else {
        // Handle single page like "5"
        const pageNum = parseInt(part);

        if (isNaN(pageNum) || pageNum < 1 || pageNum > maxPages) {
          continue; // Skip invalid page numbers
        }

        ranges.push([pageNum - 1]); // Convert to 0-based index
      }
    }

    return ranges;
  };

  const splitPDF = async () => {
    if (!file || !pageRanges || !totalPages) return;

    setSplitting(true);
    try {
      // Parse the page ranges
      const ranges = parsePageRanges(pageRanges, totalPages);

      if (ranges.length === 0) {
        alert("No valid page ranges specified.");
        setSplitting(false);
        return;
      }

      // Load the PDF document
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const splitResults: { name: string; data: Uint8Array }[] = [];

      // Create a new PDF for each range
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const newPdf = await PDFDocument.create();

        // Copy the specified pages
        const copiedPages = await newPdf.copyPages(pdfDoc, range);
        copiedPages.forEach((page) => newPdf.addPage(page));

        // Save the new PDF
        const pdfBytes = await newPdf.save();

        // Create a name for this split PDF
        const rangeText =
          range.length === 1
            ? `page-${range[0] + 1}`
            : `pages-${range[0] + 1}-${range[range.length - 1] + 1}`;

        const fileName = `${file.name.replace(".pdf", "")}_${rangeText}.pdf`;

        splitResults.push({
          name: fileName,
          data: pdfBytes,
        });
      }

      setSplitPdfs(splitResults);
      setSplit(true);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("Error splitting PDF. Please try again with valid page ranges.");
    } finally {
      setSplitting(false);
    }
  };

  const downloadSplitPDFs = async () => {
    if (splitPdfs.length === 0) return;

    if (splitPdfs.length === 1) {
      // If there's only one PDF, download it directly
      const blob = new Blob([splitPdfs[0].data], { type: "application/pdf" });
      saveAs(blob, splitPdfs[0].name);
    } else {
      // If there are multiple PDFs, create a ZIP file
      const zip = new JSZip();

      // Add each PDF to the ZIP file
      splitPdfs.forEach((pdf) => {
        zip.file(pdf.name, pdf.data);
      });

      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Download the ZIP file
      const zipName = file
        ? `${file.name.replace(".pdf", "")}_split.zip`
        : "split_pdfs.zip";
      saveAs(zipBlob, zipName);
    }
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
                  Download Split PDFs {splitPdfs.length > 1 ? "(ZIP)" : ""}
                </Button>
              )}
            </div>

            {split && splitPdfs.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">
                  Split PDFs ({splitPdfs.length})
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {splitPdfs.map((pdf, index) => (
                    <li key={index}>{pdf.name}</li>
                  ))}
                </ul>
              </div>
            )}
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
                Multiple PDFs will be packaged in a ZIP file.
              </li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
