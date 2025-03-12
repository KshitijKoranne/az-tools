"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Upload, X } from "lucide-react";
import { useState } from "react";

export default function Base64Page() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("encode");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setOutputText("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOutputText("");
    }
  };

  const removeFile = () => {
    setFile(null);
    setOutputText("");
  };

  const encodeText = () => {
    setIsProcessing(true);
    try {
      const encoded = btoa(inputText);
      setOutputText(encoded);
    } catch (error) {
      alert("Error encoding text. Make sure it contains valid characters.");
    } finally {
      setIsProcessing(false);
    }
  };

  const decodeText = () => {
    setIsProcessing(true);
    try {
      const decoded = atob(inputText);
      setOutputText(decoded);
    } catch (error) {
      alert("Error decoding text. Make sure it's valid Base64.");
    } finally {
      setIsProcessing(false);
    }
  };

  const encodeFile = () => {
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // Get the base64 string without the data URL prefix
        const base64String = (e.target.result as string).split(",")[1];
        setOutputText(base64String);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      alert("Error reading file.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const decodeToFile = () => {
    setIsProcessing(true);
    try {
      // Convert base64 to binary data
      const byteCharacters = atob(inputText);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create blob and download
      const blob = new Blob([byteArray]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "decoded_file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsProcessing(false);
    } catch (error) {
      alert("Error decoding to file. Make sure it's valid Base64.");
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      alert("Copied to clipboard!");
    }
  };

  const processData = () => {
    if (activeTab === "encode") {
      if (file) {
        encodeFile();
      } else {
        encodeText();
      }
    } else {
      // Decode tab
      if (file) {
        decodeToFile();
      } else {
        decodeText();
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Base64 Encoder/Decoder</h1>
            <p className="text-muted-foreground">
              Encode text to Base64 or decode Base64 to text.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <Tabs
              defaultValue="encode"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>
              <TabsContent value="encode">
                <p className="text-sm text-muted-foreground mb-4">
                  Convert text or files to Base64 format.
                </p>
              </TabsContent>
              <TabsContent value="decode">
                <p className="text-sm text-muted-foreground mb-4">
                  Convert Base64 back to text or files.
                </p>
              </TabsContent>
            </Tabs>

            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload File (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <span className="text-sm truncate max-w-[200px] sm:max-w-xs">
                    {file.name}
                  </span>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="input-text"
                className="block text-sm font-medium mb-2"
              >
                {activeTab === "encode" ? "Text to Encode" : "Base64 to Decode"}
              </label>
              <textarea
                id="input-text"
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder={
                  activeTab === "encode"
                    ? "Enter text to encode to Base64"
                    : "Enter Base64 to decode"
                }
                value={inputText}
                onChange={handleTextChange}
                disabled={!!file}
              ></textarea>
              <p className="mt-1 text-xs text-muted-foreground">
                {file
                  ? "File input is selected. Clear the file to use text input."
                  : activeTab === "encode"
                    ? "Enter the text you want to encode."
                    : "Enter the Base64 string you want to decode."}
              </p>
            </div>

            {outputText && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="output-text"
                    className="block text-sm font-medium"
                  >
                    {activeTab === "encode" ? "Encoded Base64" : "Decoded Text"}
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <textarea
                  id="output-text"
                  rows={6}
                  className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={outputText}
                  readOnly
                ></textarea>
              </div>
            )}

            <Button
              onClick={processData}
              disabled={isProcessing || (!inputText && !file)}
              className="w-full sm:w-auto"
            >
              {isProcessing
                ? "Processing..."
                : activeTab === "encode"
                  ? "Encode"
                  : "Decode"}
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Select the "Encode" or "Decode" tab based on your needs.</li>
              <li>
                Either enter text in the input field or upload a file (not
                both).
              </li>
              <li>
                Click the "{activeTab === "encode" ? "Encode" : "Decode"}"
                button to process the data.
              </li>
              <li>
                Copy the result to your clipboard using the copy button if
                needed.
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
