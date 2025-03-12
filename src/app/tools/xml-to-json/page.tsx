"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileJson, Upload, X } from "lucide-react";
import { useState } from "react";

export default function XmlToJsonPage() {
  const [file, setFile] = useState<File | null>(null);
  const [xmlText, setXmlText] = useState("");
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [jsonPreview, setJsonPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setConverted(false);
      setJsonPreview(null);

      // Read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setXmlText(e.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setXmlText(e.target.value);
    setConverted(false);
    setJsonPreview(null);
  };

  const removeFile = () => {
    setFile(null);
    setXmlText("");
    setConverted(false);
    setJsonPreview(null);
  };

  const convertXmlToJson = async () => {
    setConverting(true);
    try {
      // Simple XML to JSON conversion for demo purposes
      // In a real implementation, we would use a library like xml2js

      // Create a DOMParser to parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      // Check for parsing errors
      const parserError = xmlDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("XML parsing error: " + parserError.textContent);
      }

      // Convert XML to JSON
      const jsonObj = xmlToJson(xmlDoc);

      // Format JSON with indentation
      const jsonString = JSON.stringify(jsonObj, null, 2);
      setJsonPreview(jsonString);
      setConverted(true);
    } catch (error) {
      alert("Error converting XML to JSON. Please check your input format.");
      console.error(error);
    } finally {
      setConverting(false);
    }
  };

  // Helper function to convert XML to JSON
  const xmlToJson = (xml: Document | Element): any => {
    // Create the return object
    let obj: any = {};

    if (xml.nodeType === 1) {
      // element
      // Process attributes
      if (xml.attributes && xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < xml.attributes.length; i++) {
          const attribute = xml.attributes[i];
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) {
      // text
      obj = xml.nodeValue?.trim();
      return obj;
    }

    // Process children
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes[i];
        const nodeName = item.nodeName;

        if (nodeName === "#text") {
          if (item.nodeValue?.trim()) {
            if (xml.childNodes.length === 1) {
              obj = item.nodeValue.trim();
            } else {
              obj["#text"] = item.nodeValue.trim();
            }
          }
          continue;
        }

        const itemJson = xmlToJson(item as Element);

        if (obj[nodeName] === undefined) {
          obj[nodeName] = itemJson;
        } else {
          if (!Array.isArray(obj[nodeName])) {
            obj[nodeName] = [obj[nodeName]];
          }
          obj[nodeName].push(itemJson);
        }
      }
    }

    return obj;
  };

  const downloadJson = () => {
    if (!jsonPreview) return;

    const blob = new Blob([jsonPreview], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? file.name.replace(".xml", ".json") : "converted.json";
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
            <h1 className="text-3xl font-bold mb-2">XML to JSON Converter</h1>
            <p className="text-muted-foreground">
              Convert XML data to JSON format for easier processing in
              JavaScript applications.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium mb-2"
              >
                Upload XML File
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
                      XML file only
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".xml,application/xml,text/xml"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="xml-input"
                  className="block text-sm font-medium mb-2"
                >
                  XML Input
                </label>
                <textarea
                  id="xml-input"
                  rows={12}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder={`<root>
  <person id="1">
    <name>John Doe</name>
    <age>30</age>
    <city>New York</city>
  </person>
  <person id="2">
    <name>Jane Smith</name>
    <age>25</age>
    <city>Los Angeles</city>
  </person>
</root>`}
                  value={xmlText}
                  onChange={handleTextChange}
                ></textarea>
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste your XML data or upload a file above.
                </p>
              </div>

              {converted && jsonPreview && (
                <div>
                  <label
                    htmlFor="json-preview"
                    className="block text-sm font-medium mb-2"
                  >
                    JSON Preview
                  </label>
                  <pre className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono overflow-x-auto h-[304px] overflow-y-auto">
                    {jsonPreview}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={convertXmlToJson}
                disabled={!xmlText || converting}
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
              <li>Upload an XML file or paste XML data in the input area.</li>
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
                <strong>Note:</strong> This converter handles basic XML elements
                and attributes. For complex XML structures, some manual
                adjustments may be needed.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
