"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileJson, Upload, X } from "lucide-react";
import { useState } from "react";

export default function JsonToCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConverted(false);
      setCsvPreview(null);

      // Read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setJsonText(e.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setConverted(false);
    setCsvPreview(null);
  };

  const removeFile = () => {
    setFile(null);
    setJsonText("");
    setConverted(false);
    setCsvPreview(null);
  };

  const convertJsonToCsv = async () => {
    setConverting(true);
    try {
      // Parse JSON
      const jsonData = JSON.parse(jsonText);

      // Simple JSON to CSV conversion for demo purposes
      // In a real implementation, we would use a more robust library
      let csv = "";

      // Handle array of objects
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        // Get headers
        const headers = Object.keys(jsonData[0]);
        csv += headers.join(",") + "\n";

        // Add rows
        jsonData.forEach((item) => {
          const row = headers.map((header) => {
            const value = item[header];
            // Handle string values with commas by wrapping in quotes
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          });
          csv += row.join(",") + "\n";
        });
      } else {
        // Handle single object
        const headers = Object.keys(jsonData);
        csv += headers.join(",") + "\n";

        const row = headers.map((header) => {
          const value = jsonData[header];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        });
        csv += row.join(",") + "\n";
      }

      setCsvPreview(csv);
      setConverted(true);
    } catch (error) {
      alert("Invalid JSON format. Please check your input.");
    } finally {
      setConverting(false);
    }
  };

  const downloadCsv = () => {
    if (!csvPreview) return;

    const blob = new Blob([csvPreview], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? file.name.replace(".json", ".csv") : "converted.csv";
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
            <h1 className="text-3xl font-bold mb-2">JSON to CSV Converter</h1>
            <p className="text-muted-foreground">
              Convert JSON data to CSV format for easy spreadsheet import.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload JSON File
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
                      JSON file only
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".json"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md mb-4">
                  <div className="flex items-center">
                    <FileJson className="w-5 h-5 mr-2 text-muted-foreground" />
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

            <div className="mb-6">
              <label
                htmlFor="json-input"
                className="block text-sm font-medium mb-2"
              >
                JSON Input
              </label>
              <textarea
                id="json-input"
                rows={8}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder='{"name":"John","age":30,"city":"New York"}'
                value={jsonText}
                onChange={handleTextChange}
              ></textarea>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste your JSON data or upload a file above.
              </p>
            </div>

            {converted && csvPreview && (
              <div className="mb-6">
                <label
                  htmlFor="csv-preview"
                  className="block text-sm font-medium mb-2"
                >
                  CSV Preview
                </label>
                <pre className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono overflow-x-auto">
                  {csvPreview}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={convertJsonToCsv}
                disabled={!jsonText || converting}
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to CSV"}
              </Button>
              {converted && csvPreview && (
                <Button
                  variant="outline"
                  onClick={downloadCsv}
                  className="w-full sm:w-auto"
                >
                  Download CSV
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Upload a JSON file or paste JSON data in the text area above.
              </li>
              <li>Click the "Convert to CSV" button to process the data.</li>
              <li>
                Review the CSV preview to ensure the conversion is correct.
              </li>
              <li>
                Click the "Download CSV" button to save the converted file.
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
