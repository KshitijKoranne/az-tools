"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileJson, Upload, X } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";

export default function CsvToJsonPage() {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState("");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [jsonPreview, setJsonPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConverted(false);
      setJsonPreview(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCsvText(e.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(e.target.value);
    setConverted(false);
    setJsonPreview(null);
  };

  const removeFile = () => {
    setFile(null);
    setCsvText("");
    setConverted(false);
    setJsonPreview(null);
  };

  const convertCsvToJson = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConverting(true);
    try {
      if (!csvText.trim()) {
        throw new Error("No data found in CSV");
      }

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });

      if (result.errors.length > 0) {
        throw new Error(
          "Error parsing CSV: " +
            result.errors.map((e) => e.message).join(", "),
        );
      }

      const jsonData = result.data;
      const jsonString = JSON.stringify(jsonData, null, 2);
      setJsonPreview(jsonString);
      setConverted(true);
    } catch (error) {
      alert("Error converting CSV to JSON. Please check your input format.");
      console.error(error);
    } finally {
      setConverting(false);
    }
  };

  const downloadJson = () => {
    if (!jsonPreview) return;

    const blob = new Blob([jsonPreview], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? file.name.replace(".csv", ".json") : "converted.json";
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
            <h1 className="text-3xl font-bold mb-2">CSV to JSON Converter</h1>
            <p className="text-muted-foreground">
              Convert CSV data to JSON format for easy integration with APIs and
              JavaScript applications.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload CSV File
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
                      CSV file only
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv"
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
                htmlFor="csv-input"
                className="block text-sm font-medium mb-2"
              >
                CSV Input
              </label>
              <textarea
                id="csv-input"
                rows={8}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder='name,age,city\n"John Doe",30,"New York"\n"Jane Smith",25,"Los Angeles"'
                value={csvText}
                onChange={handleTextChange}
              ></textarea>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste your CSV data or upload a file above. The first row should
                contain column headers.
              </p>
            </div>

            {converted && jsonPreview && (
              <div className="mb-6">
                <label
                  htmlFor="json-preview"
                  className="block text-sm font-medium mb-2"
                >
                  JSON Preview
                </label>
                <pre className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono overflow-x-auto max-h-80 overflow-y-auto">
                  {jsonPreview}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={convertCsvToJson}
                disabled={!csvText || converting}
                className="w-full sm:w-auto"
              >
                {converting ? "Converting..." : "Convert to JSON"}
              </Button>
              {converted && jsonPreview && (
                <Button
                  variant="outline"
                  onClick={downloadJson}
                  className="w-full sm:w-auto"
                >
                  Download JSON
                </Button>
              )}
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Upload a CSV file or paste CSV data in the text area above.
              </li>
              <li>Click the "Convert to JSON" button to process the data.</li>
              <li>
                Review the JSON preview to ensure the conversion is correct.
              </li>
              <li>
                Click the "Download JSON" button to save the converted file.
              </li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>CSV Format:</strong> Your CSV should have headers in the
                first row, with values separated by commas. Use quotes around
                values that contain commas (e.g., "New York, NY").
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}