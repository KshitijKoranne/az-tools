"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileJson, Upload, X } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";

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
      if (!jsonText.trim()) {
        throw new Error("No JSON data provided");
      }

      // Parse JSON
      const jsonData = JSON.parse(jsonText);

      // Convert to CSV using Papa Parse
      const csv = Papa.unparse(jsonData, {
        quotes: true, // Wrap all fields in quotes to handle commas
        header: true, // Include headers if present
      });

      setCsvPreview(csv);
      setConverted(true);
    } catch (error) {
      alert("Invalid JSON format. Please check your input.");
      console.error(error);
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
                placeholder='[{"name":"John","age":30,"city":"New York"},{"name":"Jane","age":25,"city":"Los Angeles"}]'
                value={jsonText}
                onChange={handleTextChange}
              ></textarea>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste your JSON data or upload a file above. Array of objects is recommended for proper CSV structure.
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
    </div>
  );
}