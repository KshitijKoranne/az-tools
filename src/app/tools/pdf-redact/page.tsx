"use client";

import { useState, useRef, useCallback } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import dynamic from "next/dynamic";

const ToolsDrawer = dynamic(
  () => import("@/components/drawer").then((mod) => mod.ToolsDrawer),
  { ssr: false }
);

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFRedactPage() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [redactions, setRedactions] = useState<
    { page: number; x: number; y: number; width: number; height: number }[]
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ page: number; x: number; y: number } | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const pageDimensions = useRef<{ width: number; height: number }[]>([]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setRedactions([]);
      setNumPages(null);
      pageDimensions.current = [];
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    canvasRefs.current = Array(numPages).fill(null);
    pageDimensions.current = Array(numPages).fill({ width: 0, height: 0 });
  };

  const startRedaction = useCallback((pageIndex: number) => (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setStartPos({ page: pageIndex + 1, x, y });
  }, []);

  const drawRedaction = useCallback((pageIndex: number) => (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos || startPos.page !== pageIndex + 1) return;
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = e.clientX - rect.left - startPos.x;
    const height = e.clientY - rect.top - startPos.y;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redactions.forEach((r) => {
        if (r.page === pageIndex + 1) {
          ctx.fillStyle = "black";
          ctx.fillRect(r.x, r.y, r.width, r.height);
        }
      });
      ctx.fillStyle = "black";
      ctx.fillRect(startPos.x, startPos.y, width, height);
    }
  }, [isDrawing, startPos, redactions]);

  const endRedaction = useCallback((pageIndex: number) => (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos || startPos.page !== pageIndex + 1) return;
    const canvas = canvasRefs.current[pageIndex];
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = e.clientX - rect.left - startPos.x;
    const height = e.clientY - rect.top - startPos.y;

    const newRedaction = {
      page: startPos.page,
      x: Math.min(startPos.x, startPos.x + width),
      y: Math.min(startPos.y, startPos.y + height),
      width: Math.abs(width),
      height: Math.abs(height),
    };

    setRedactions((prev) => [...prev, newRedaction]);
    setIsDrawing(false);
    setStartPos(null);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      [...redactions, newRedaction].forEach((r) => {
        if (r.page === pageIndex + 1) {
          ctx.fillStyle = "black";
          ctx.fillRect(r.x, r.y, r.width, r.height);
        }
      });
    }
  }, [isDrawing, startPos, redactions]);

  const applyRedactions = async () => {
    if (!file || redactions.length === 0) {
      alert("Please upload a PDF and add at least one redaction.");
      return;
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    redactions.forEach((redaction) => {
      const page = pdfDoc.getPage(redaction.page - 1);
      const { width: pageWidth, height: pageHeight } = page.getSize();
      const canvas = canvasRefs.current[redaction.page - 1];
      if (!canvas) return;

      // Use actual page dimensions instead of canvas for scaling
      const scaleX = pageWidth / canvas.width;
      const scaleY = pageHeight / canvas.height;
      const pdfX = redaction.x * scaleX;
      const pdfY = pageHeight - (redaction.y + redaction.height) * scaleY; // Correct Y-axis flip
      const pdfWidth = redaction.width * scaleX;
      const pdfHeight = redaction.height * scaleY;

      page.drawRectangle({
        x: pdfX,
        y: pdfY,
        width: pdfWidth,
        height: pdfHeight,
        color: rgb(0, 0, 0), // Black
        opacity: 1,
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "redacted.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const onPageRenderSuccess = useCallback((pageIndex: number) => () => {
    const canvas = canvasRefs.current[pageIndex];
    const pageCanvas = document.querySelector(
      `.react-pdf__Page__canvas[data-page-number="${pageIndex + 1}"]`
    ) as HTMLCanvasElement;
    if (canvas && pageCanvas) {
      canvas.width = pageCanvas.width;
      canvas.height = pageCanvas.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redactions.forEach((r) => {
          if (r.page === pageIndex + 1) {
            ctx.fillStyle = "black";
            ctx.fillRect(r.x, r.y, r.width, r.height);
          }
        });
      }
    }
  }, [redactions]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <ToolsDrawer />
      <main className="flex-1 py-12">
        <Container>
          <h1 className="text-3xl font-bold mb-6">PDF Redact Tool</h1>
          <p className="text-muted-foreground mb-4">
            Upload a PDF and click-and-drag to draw rectangles over areas you want to redact permanently.
          </p>
          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            className="mb-6 p-2 border rounded-md"
          />
          {file && (
            <div className="space-y-6">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="space-y-4"
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <div key={index} className="relative mx-auto" style={{ width: "fit-content" }}>
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={Math.min(800, window.innerWidth - 40)}
                      onRenderSuccess={onPageRenderSuccess(index)}
                    />
                    <canvas
                      ref={(el: HTMLCanvasElement | null) => {
                        canvasRefs.current[index] = el;
                      }}
                      className="absolute top-0 left-0"
                      onMouseDown={startRedaction(index)}
                      onMouseMove={drawRedaction(index)}
                      onMouseUp={endRedaction(index)}
                      onMouseLeave={endRedaction(index)}
                      style={{ zIndex: 10, pointerEvents: "all" }}
                    />
                  </div>
                ))}
              </Document>
              <Button
                onClick={applyRedactions}
                disabled={redactions.length === 0}
                className="mt-6 w-full md:w-auto"
              >
                Download Redacted PDF
              </Button>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}