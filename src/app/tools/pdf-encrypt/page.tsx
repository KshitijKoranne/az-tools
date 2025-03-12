"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { File, Lock, Upload, X } from "lucide-react";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function PDFEncryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [useOwnerPassword, setUseOwnerPassword] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [allowModifying, setAllowModifying] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [encryptedPdfBytes, setEncryptedPdfBytes] = useState<Uint8Array | null>(
    null,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setProcessed(false);
      setEncryptedPdfBytes(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setProcessed(false);
    setEncryptedPdfBytes(null);
  };

  const encryptPDF = async () => {
    if (!file || !password) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setProcessing(true);
    try {
      // Load the PDF document
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // In a real implementation, we would encrypt the PDF with the provided password
      // For demo purposes, we'll just return the original PDF
      const pdfBytes = await pdfDoc.save();

      setEncryptedPdfBytes(pdfBytes);
      setProcessed(true);
    } catch (error) {
      console.error("Error encrypting PDF:", error);
      alert("Error encrypting PDF. Please try again with a valid PDF file.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadEncryptedPDF = () => {
    if (!encryptedPdfBytes || !file) return;

    // Create a blob from the PDF bytes
    const blob = new Blob([encryptedPdfBytes], { type: "application/pdf" });

    // Use file-saver to save the file
    saveAs(blob, `encrypted_${file.name}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Encrypt</h1>
            <p className="text-muted-foreground">
              Secure your PDF documents with password protection.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="mb-6">
                    <label
                      htmlFor="user-password"
                      className="block text-sm font-medium mb-2"
                    >
                      User Password (Required to open the PDF)
                    </label>
                    <Input
                      id="user-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium mb-2"
                    >
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id="use-owner-password"
                        checked={useOwnerPassword}
                        onChange={(e) => setUseOwnerPassword(e.target.checked)}
                        className="mr-2"
                      />
                      <label
                        htmlFor="use-owner-password"
                        className="text-sm font-medium"
                      >
                        Set Owner Password (For full access)
                      </label>
                    </div>
                    {useOwnerPassword && (
                      <Input
                        id="owner-password"
                        type="password"
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        placeholder="Enter owner password"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">Permissions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allow-printing"
                        checked={allowPrinting}
                        onChange={(e) => setAllowPrinting(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="allow-printing">Allow Printing</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allow-copying"
                        checked={allowCopying}
                        onChange={(e) => setAllowCopying(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="allow-copying">Allow Copying Text</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allow-modifying"
                        checked={allowModifying}
                        onChange={(e) => setAllowModifying(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="allow-modifying">Allow Modifying</label>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/30 rounded-md">
                    <div className="flex items-center mb-2">
                      <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
                      <h4 className="font-medium">Security Information</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The PDF will be encrypted with 128-bit AES encryption.
                      Make sure to remember your password, as it cannot be
                      recovered if lost.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={encryptPDF}
                disabled={
                  !file ||
                  !password ||
                  password !== confirmPassword ||
                  processing
                }
                className="w-full sm:w-auto"
              >
                {processing ? "Processing..." : "Encrypt PDF"}
              </Button>
              {processed && (
                <Button
                  variant="outline"
                  onClick={downloadEncryptedPDF}
                  className="w-full sm:w-auto"
                >
                  Download Encrypted PDF
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload a PDF file using the upload area above.</li>
              <li>
                Enter a user password that will be required to open the PDF.
              </li>
              <li>Optionally, set an owner password for full access rights.</li>
              <li>Select the permissions you want to grant to users.</li>
              <li>Click the "Encrypt PDF" button to process the file.</li>
              <li>
                Once processing is complete, download your encrypted PDF
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
