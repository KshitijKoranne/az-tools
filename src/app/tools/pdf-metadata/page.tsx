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

export default function PDFMetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<{
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
  }>({
    title: "",
    author: "",
    subject: "",
    keywords: "",
    creator: "",
    producer: "",
  });
  const [originalMetadata, setOriginalMetadata] = useState<
    Record<string, string>
  >({});
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [updatedPdfBytes, setUpdatedPdfBytes] = useState<Uint8Array | null>(
    null,
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessed(false);
      setUpdatedPdfBytes(null);

      try {
        // Load the PDF document and extract metadata
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Get existing metadata
        const title = pdfDoc.getTitle() || "";
        const author = pdfDoc.getAuthor() || "";
        const subject = pdfDoc.getSubject() || "";
        const keywords = pdfDoc.getKeywords() || "";
        const creator = pdfDoc.getCreator() || "";
        const producer = pdfDoc.getProducer() || "";

        setMetadata({ title, author, subject, keywords, creator, producer });
        setOriginalMetadata({
          title,
          author,
          subject,
          keywords,
          creator,
          producer,
        });
      } catch (error) {
        console.error("Error loading PDF:", error);
        alert("Error loading PDF. Please make sure it is a valid PDF file.");
        setFile(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setMetadata({
      title: "",
      author: "",
      subject: "",
      keywords: "",
      creator: "",
      producer: "",
    });
    setOriginalMetadata({});
    setProcessed(false);
    setUpdatedPdfBytes(null);
  };

  const handleMetadataChange = (field: string, value: string) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateMetadata = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      // Load the PDF document
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Update metadata
      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);
      pdfDoc.setKeywords([metadata.keywords]);
      pdfDoc.setCreator(metadata.creator);
      pdfDoc.setProducer(metadata.producer);

      // Save the updated PDF
      const pdfBytes = await pdfDoc.save();

      setUpdatedPdfBytes(pdfBytes);
      setProcessed(true);
    } catch (error) {
      console.error("Error updating PDF metadata:", error);
      alert(
        "Error updating PDF metadata. Please try again with a valid PDF file.",
      );
    } finally {
      setProcessing(false);
    }
  };

  const downloadUpdatedPDF = () => {
    if (!updatedPdfBytes || !file) return;

    // Create a blob from the PDF bytes
    const blob = new Blob([updatedPdfBytes], { type: "application/pdf" });

    // Use file-saver to save the file
    saveAs(blob, `updated_${file.name}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Metadata Editor</h1>
            <p className="text-muted-foreground">
              View and edit document properties of your PDF files.
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
              </div>
            )}

            {file && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4">
                  Document Properties
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1"
                    >
                      Title
                    </label>
                    <Input
                      id="title"
                      value={metadata.title}
                      onChange={(e) =>
                        handleMetadataChange("title", e.target.value)
                      }
                      placeholder="Document title"
                    />
                    {originalMetadata.title &&
                      originalMetadata.title !== metadata.title && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Original: {originalMetadata.title}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium mb-1"
                    >
                      Author
                    </label>
                    <Input
                      id="author"
                      value={metadata.author}
                      onChange={(e) =>
                        handleMetadataChange("author", e.target.value)
                      }
                      placeholder="Document author"
                    />
                    {originalMetadata.author &&
                      originalMetadata.author !== metadata.author && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Original: {originalMetadata.author}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-1"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      value={metadata.subject}
                      onChange={(e) =>
                        handleMetadataChange("subject", e.target.value)
                      }
                      placeholder="Document subject"
                    />
                    {originalMetadata.subject &&
                      originalMetadata.subject !== metadata.subject && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Original: {originalMetadata.subject}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="keywords"
                      className="block text-sm font-medium mb-1"
                    >
                      Keywords
                    </label>
                    <Input
                      id="keywords"
                      value={metadata.keywords}
                      onChange={(e) =>
                        handleMetadataChange("keywords", e.target.value)
                      }
                      placeholder="Comma-separated keywords"
                    />
                    {originalMetadata.keywords &&
                      originalMetadata.keywords !== metadata.keywords && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Original: {originalMetadata.keywords}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="creator"
                      className="block text-sm font-medium mb-1"
                    >
                      Creator
                    </label>
                    <Input
                      id="creator"
                      value={metadata.creator}
                      onChange={(e) =>
                        handleMetadataChange("creator", e.target.value)
                      }
                      placeholder="Application that created the document"
                    />
                    {originalMetadata.creator &&
                      originalMetadata.creator !== metadata.creator && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Original: {originalMetadata.creator}
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="producer"
                      className="block text-sm font-medium mb-1"
                    >
                      Producer
                    </label>
                    <Input
                      id="producer"
                      value={metadata.producer}
                      onChange={(e) =>
                        handleMetadataChange("producer", e.target.value)
                      }
                      placeholder="Application that produced the document"
                    />
                    {originalMetadata.producer &&
                      originalMetadata.producer !== metadata.producer && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Original: {originalMetadata.producer}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={updateMetadata}
                disabled={!file || processing}
                className="w-full sm:w-auto"
              >
                {processing ? "Processing..." : "Update Metadata"}
              </Button>
              {processed && (
                <Button
                  variant="outline"
                  onClick={downloadUpdatedPDF}
                  className="w-full sm:w-auto"
                >
                  Download Updated PDF
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a PDF file using the upload area above.</li>
              <li>View and edit the document properties (metadata).</li>
              <li>Click the "Update Metadata" button to apply your changes.</li>
              <li>
                Once processing is complete, download your updated PDF document.
              </li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
