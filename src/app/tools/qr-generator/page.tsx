"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Copy, Download, QrCode } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://example.com");
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    setIsGenerating(true);

    // In a real implementation, we would use a QR code library
    // For demo purposes, we'll use a public API
    try {
      const encodedText = encodeURIComponent(text);
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedText}&size=${qrSize}x${qrSize}&color=${qrColor.substring(1)}&bgcolor=${bgColor.substring(1)}`;

      setQrUrl(url);
    } catch (error) {
      alert("Error generating QR code.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrUrl) return;

    // Fetch the image from the URL and convert to blob for download
    fetch(qrUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading QR code:", error);
        alert("Error downloading QR code");
      });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
            <p className="text-muted-foreground">
              Generate QR codes for URLs, text, or contact information.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label
                    htmlFor="qr-text"
                    className="block text-sm font-medium mb-2"
                  >
                    Text or URL
                  </label>
                  <Input
                    id="qr-text"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter URL or text"
                    className="mb-2"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="qr-size"
                    className="block text-sm font-medium mb-2"
                  >
                    QR Code Size: {qrSize}px
                  </label>
                  <input
                    id="qr-size"
                    type="range"
                    min="100"
                    max="400"
                    step="10"
                    value={qrSize}
                    onChange={(e) => setQrSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      htmlFor="qr-color"
                      className="block text-sm font-medium mb-2"
                    >
                      QR Code Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="qr-color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="bg-color"
                      className="block text-sm font-medium mb-2"
                    >
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="bg-color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={generateQR}
                  disabled={!text || isGenerating}
                  className="w-full mb-4"
                >
                  {isGenerating ? "Generating..." : "Generate QR Code"}
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="mb-4 p-4 bg-muted/30 rounded-md flex items-center justify-center">
                  {qrUrl ? (
                    <img
                      src={qrUrl}
                      alt="Generated QR Code"
                      className="max-w-full"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed rounded-md">
                      <QrCode className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                {qrUrl && (
                  <Button
                    variant="outline"
                    onClick={downloadQR}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Enter the text or URL you want to encode in the QR code.</li>
              <li>Adjust the size and colors as needed.</li>
              <li>Click the "Generate QR Code" button.</li>
              <li>Download the generated QR code image.</li>
              <li>Scan the QR code with a mobile device to test it.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
