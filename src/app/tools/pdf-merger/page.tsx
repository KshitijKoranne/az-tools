"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { File, Upload, X } from "lucide-react";
import { useState } from "react";

export default function PDFMergerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [merged, setMerged] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setMerged(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setMerged(false);
  };

  const mergePDFs = async () => {
    setMerging(true);
    // In a real implementation, we would use a library like pdf-lib
    // to merge the PDFs on the client side
    setTimeout(() => {
      setMerging(false);
      setMerged(true);
    }, 2000);
  };

  const downloadMergedPDF = () => {
    // In a real implementation, this would download the merged PDF
    alert("In a real implementation, this would download the merged PDF");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Merger</h1>
            <p className="text-muted-foreground">
              Combine multiple PDF files into a single document.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload PDF Files
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
                      PDF files only
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Selected Files</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                    >
                      <div className="flex items-center">
                        <File className="w-5 h-5 mr-2 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[200px] sm:max-w-xs">
                          {file.name}
                        </span>
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

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={mergePDFs}
                disabled={files.length < 2 || merging}
                className="w-full sm:w-auto"
              >
                {merging ? "Merging..." : "Merge PDFs"}
              </Button>
              {merged && (
                <Button
                  variant="outline"
                  onClick={downloadMergedPDF}
                  className="w-full sm:w-auto"
                >
                  Download Merged PDF
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload two or more PDF files using the upload area above.</li>
              <li>
                Arrange the files in the order you want them to appear in the
                final document (drag and drop to reorder).
              </li>
              <li>Click the "Merge PDFs" button to combine the files.</li>
              <li>
                Once processing is complete, download your merged PDF document.
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
