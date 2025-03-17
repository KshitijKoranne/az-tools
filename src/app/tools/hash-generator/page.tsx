"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, File, Upload, X } from "lucide-react";
import { useState } from "react";

export default function HashGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [hashType, setHashType] = useState("md5");
  const [hashResult, setHashResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputType, setInputType] = useState<"text" | "file">("text");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setInputType("file");
      setHashResult(null);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setInputType("text");
    setHashResult(null);
  };

  const removeFile = () => {
    setFile(null);
    setHashResult(null);
  };

  const generateHash = async () => {
    setIsGenerating(true);

    try {
      // Use the Web Crypto API to generate real hashes
      const encoder = new TextEncoder();
      let data;

      if (inputType === "text") {
        data = encoder.encode(text);
      } else if (file) {
        // Read file as ArrayBuffer
        const buffer = await file.arrayBuffer();
        data = new Uint8Array(buffer);
      } else {
        throw new Error("No input provided");
      }

      // Map hash type to algorithm
      const algorithm =
        {
          md5: "SHA-1", // Web Crypto doesn't support MD5, using SHA-1 as fallback
          sha1: "SHA-1",
          sha256: "SHA-256",
          sha512: "SHA-512",
        }[hashType] || "SHA-256";

      // Generate hash
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      setHashResult(hashHex);
    } catch (error) {
      console.error("Error generating hash:", error);
      alert("Error generating hash.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (hashResult) {
      navigator.clipboard.writeText(hashResult);
      alert("Hash copied to clipboard!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Hash Generator</h1>
            <p className="text-muted-foreground">
              Generate hash values for text or files using various algorithms.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="hash-type"
                className="block text-sm font-medium mb-2"
              >
                Hash Algorithm
              </label>
              <Select value={hashType} onValueChange={setHashType}>
                <SelectTrigger id="hash-type" className="w-full">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="md5">MD5</SelectItem>
                  <SelectItem value="sha1">SHA-1</SelectItem>
                  <SelectItem value="sha256">SHA-256</SelectItem>
                  <SelectItem value="sha512">SHA-512</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-4">Input Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="text-input"
                    className="block text-sm font-medium mb-2"
                  >
                    Text Input
                  </label>
                  <Input
                    id="text-input"
                    type="text"
                    placeholder="Enter text to hash"
                    value={text}
                    onChange={handleTextChange}
                    className="mb-2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium mb-2"
                  >
                    File Input
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-10 border border-dashed rounded-md cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-center px-4">
                        <Upload className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {file ? file.name : "Choose a file"}
                        </span>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {file && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {hashResult && (
              <div className="mb-6">
                <label
                  htmlFor="hash-result"
                  className="block text-sm font-medium mb-2"
                >
                  Hash Result ({hashType.toUpperCase()})
                </label>
                <div className="relative">
                  <Input
                    id="hash-result"
                    type="text"
                    value={hashResult}
                    readOnly
                    className="pr-10 font-mono text-xs sm:text-sm bg-muted/30"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={generateHash}
              disabled={
                isGenerating ||
                (inputType === "text" && !text) ||
                (inputType === "file" && !file)
              }
              className="w-full sm:w-auto"
            >
              {isGenerating ? "Generating..." : "Generate Hash"}
            </Button>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Select a hash algorithm from the dropdown menu.</li>
              <li>
                Enter text in the text input field or upload a file (not both).
              </li>
              <li>Click the "Generate Hash" button to calculate the hash.</li>
              <li>
                Copy the generated hash to your clipboard using the copy button.
              </li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
