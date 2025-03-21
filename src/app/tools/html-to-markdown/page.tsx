"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileText, Upload, X, Copy } from "lucide-react";
import { useState } from "react";
import TurndownService from "turndown";

export default function HtmlToMarkdownPage() {
  const [file, setFile] = useState<File | null>(null);
  const [htmlText, setHtmlText] = useState("");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [markdownOutput, setMarkdownOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const turndownService = new TurndownService({
    headingStyle: "atx", // Use # for headings
    bulletListMarker: "-", // Use - for unordered lists
    codeBlockStyle: "fenced", // Use ``` for code blocks
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConverted(false);
      setMarkdownOutput(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setHtmlText(e.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlText(e.target.value);
    setConverted(false);
    setMarkdownOutput(null);
  };

  const removeFile = () => {
    setFile(null);
    setHtmlText("");
    setConverted(false);
    setMarkdownOutput(null);
  };

  const convertHtmlToMarkdown = async () => {
    setConverting(true);

    try {
      if (!htmlText.trim()) {
        throw new Error("No HTML content provided");
      }

      const markdown = turndownService.turndown(htmlText);
      setMarkdownOutput(markdown);
      setConverted(true);
    } catch (error) {
      alert("Error converting HTML to Markdown.");
      console.error(error);
    } finally {
      setConverting(false);
    }
  };

  const copyToClipboard = () => {
    if (!markdownOutput) return;
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    if (!markdownOutput) return;

    const blob = new Blob([markdownOutput], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file
      ? file.name.replace(/\.(html|htm)$/, ".md")
      : "converted.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              HTML to Markdown Converter
            </h1>
            <p className="text-muted-foreground">
              Convert HTML code to Markdown format for easier editing and
              readability.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload HTML File
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
                      HTML file (.html, .htm)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".html,.htm,text/html"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md mb-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-muted-foreground" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="html-input"
                  className="block text-sm font-medium mb-2"
                >
                  HTML Input
                </label>
                <textarea
                  id="html-input"
                  rows={12}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="<h1>Hello World</h1>\n<p>This is a <strong>sample</strong> HTML content.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>"
                  value={htmlText}
                  onChange={handleTextChange}
                ></textarea>
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste your HTML code or upload a file above.
                </p>
              </div>

              {converted && markdownOutput && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="markdown-output"
                      className="block text-sm font-medium"
                    >
                      Markdown Output
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="h-8 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <textarea
                    id="markdown-output"
                    rows={12}
                    className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={markdownOutput}
                    readOnly
                  ></textarea>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The converted Markdown code.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={convertHtmlToMarkdown}
                disabled={!htmlText || converting}
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to Markdown"}
              </Button>
              {converted && markdownOutput && (
                <Button
                  variant="outline"
                  onClick={downloadMarkdown}
                  className="w-full sm:w-auto"
                >
                  Download Markdown
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload an HTML file or paste HTML code in the input area.</li>
              <li>
                Click the "Convert to Markdown" button to process the code.
              </li>
              <li>
                Review the Markdown output to ensure the conversion is correct.
              </li>
              <li>Copy the Markdown code or download it as a .md file.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}