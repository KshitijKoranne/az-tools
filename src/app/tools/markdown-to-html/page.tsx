"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileText, Upload, X } from "lucide-react";
import { useState } from "react";
import { marked } from "marked";

export default function MarkdownToHtmlPage() {
  const [file, setFile] = useState<File | null>(null);
  const [markdownText, setMarkdownText] = useState("");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [htmlOutput, setHtmlOutput] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConverted(false);
      setHtmlOutput(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMarkdownText(e.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
    setConverted(false);
    setHtmlOutput(null);
  };

  const removeFile = () => {
    setFile(null);
    setMarkdownText("");
    setConverted(false);
    setHtmlOutput(null);
  };

  const convertMarkdownToHtml = async () => {
    setConverting(true);

    try {
      if (!markdownText.trim()) {
        throw new Error("No Markdown content provided");
      }

      // Ensure marked returns a string by awaiting it if necessary
      const html = await marked(markdownText, {
        gfm: true,
        breaks: true,
      });

      setHtmlOutput(html as string); // Type assertion since we know it's a string after await
      setConverted(true);
    } catch (error) {
      alert("Error converting Markdown to HTML.");
      console.error(error);
    } finally {
      setConverting(false);
    }
  };

  const downloadHtml = () => {
    if (!htmlOutput) return;

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted HTML</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
${htmlOutput}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? file.name.replace(".md", ".html") : "converted.html";
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
              Markdown to HTML Converter
            </h1>
            <p className="text-muted-foreground">
              Convert Markdown text to HTML format for web publishing.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload Markdown File
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
                      Markdown file (.md)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".md,.markdown,text/markdown"
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
                  htmlFor="markdown-input"
                  className="block text-sm font-medium mb-2"
                >
                  Markdown Input
                </label>
                <textarea
                  id="markdown-input"
                  rows={12}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="# Heading\n\nThis is a paragraph with **bold** and *italic* text.\n\n- List item 1\n- List item 2"
                  value={markdownText}
                  onChange={handleTextChange}
                ></textarea>
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste your Markdown text or upload a file above.
                </p>
              </div>

              {converted && htmlOutput && (
                <div>
                  <label
                    htmlFor="html-output"
                    className="block text-sm font-medium mb-2"
                  >
                    HTML Output
                  </label>
                  <div className="relative">
                    <textarea
                      id="html-output"
                      rows={12}
                      className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={htmlOutput}
                      readOnly
                    ></textarea>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The converted HTML code.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={convertMarkdownToHtml}
                disabled={!markdownText || converting}
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to HTML"}
              </Button>
              {converted && htmlOutput && (
                <Button
                  variant="outline"
                  onClick={downloadHtml}
                  className="w-full sm:w-auto"
                >
                  Download HTML
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Upload a Markdown file or paste Markdown text in the input area.
              </li>
              <li>Click the "Convert to HTML" button to process the text.</li>
              <li>
                Review the HTML output to ensure the conversion is correct.
              </li>
              <li>
                Click the "Download HTML" button to save the converted file.
              </li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}