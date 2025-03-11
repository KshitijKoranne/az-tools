"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function UrlEncoderPage() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("encode");

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setOutputText("");
  };

  const encodeUrl = () => {
    setIsProcessing(true);
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
    } catch (error) {
      alert("Error encoding URL.");
    } finally {
      setIsProcessing(false);
    }
  };

  const decodeUrl = () => {
    setIsProcessing(true);
    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
    } catch (error) {
      alert("Error decoding URL. Make sure it's a valid encoded URL.");
    } finally {
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
      encodeUrl();
    } else {
      decodeUrl();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">URL Encoder/Decoder</h1>
            <p className="text-muted-foreground">
              Encode or decode URL components for safe transmission.
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
                  Convert text to URL-encoded format for safe use in URLs.
                </p>
              </TabsContent>
              <TabsContent value="decode">
                <p className="text-sm text-muted-foreground mb-4">
                  Convert URL-encoded text back to its original form.
                </p>
              </TabsContent>
            </Tabs>

            <div className="mb-6">
              <label
                htmlFor="input-text"
                className="block text-sm font-medium mb-2"
              >
                {activeTab === "encode" ? "Text to Encode" : "URL to Decode"}
              </label>
              <textarea
                id="input-text"
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder={
                  activeTab === "encode"
                    ? "Enter text to encode"
                    : "Enter URL-encoded text to decode"
                }
                value={inputText}
                onChange={handleTextChange}
              ></textarea>
            </div>

            {outputText && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="output-text"
                    className="block text-sm font-medium"
                  >
                    {activeTab === "encode" ? "Encoded URL" : "Decoded Text"}
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
              disabled={isProcessing || !inputText}
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
              <li>Enter the text you want to process in the input field.</li>
              <li>
                Click the "{activeTab === "encode" ? "Encode" : "Decode"}"
                button to process the text.
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
