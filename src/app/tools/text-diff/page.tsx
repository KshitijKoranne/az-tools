"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileText } from "lucide-react";
import { useState } from "react";

export default function TextDiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<
    { type: string; value: string }[]
  >([]);
  const [isComparing, setIsComparing] = useState(false);

  const handleTextChange1 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText1(e.target.value);
  };

  const handleTextChange2 = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText2(e.target.value);
  };

  const compareTexts = () => {
    setIsComparing(true);

    try {
      // Simple diff algorithm for demonstration
      const lines1 = text1.split("\n");
      const lines2 = text2.split("\n");

      const result: { type: string; value: string }[] = [];

      // Very basic line-by-line comparison
      const maxLines = Math.max(lines1.length, lines2.length);

      for (let i = 0; i < maxLines; i++) {
        const line1 = i < lines1.length ? lines1[i] : null;
        const line2 = i < lines2.length ? lines2[i] : null;

        if (line1 === line2) {
          result.push({ type: "equal", value: line1 || "" });
        } else {
          if (line1 !== null) {
            result.push({ type: "removed", value: line1 });
          }
          if (line2 !== null) {
            result.push({ type: "added", value: line2 });
          }
        }
      }

      setDiffResult(result);
    } catch (error) {
      alert("Error comparing texts.");
    } finally {
      setIsComparing(false);
    }
  };

  const downloadDiffResult = () => {
    if (diffResult.length === 0) return;

    // Format the diff result as text
    let diffText = "";
    diffResult.forEach((line) => {
      const prefix =
        line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
      diffText += prefix + line.value + "\n";
    });

    // Create and download the file
    const blob = new Blob([diffText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diff_result.txt";
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
            <h1 className="text-3xl font-bold mb-2">Text Diff Checker</h1>
            <p className="text-muted-foreground">
              Compare two texts and highlight the differences.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="text-1"
                  className="block text-sm font-medium mb-2"
                >
                  Original Text
                </label>
                <textarea
                  id="text-1"
                  rows={10}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Paste your original text here"
                  value={text1}
                  onChange={handleTextChange1}
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="text-2"
                  className="block text-sm font-medium mb-2"
                >
                  Modified Text
                </label>
                <textarea
                  id="text-2"
                  rows={10}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Paste your modified text here"
                  value={text2}
                  onChange={handleTextChange2}
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                onClick={compareTexts}
                disabled={!text1 || !text2 || isComparing}
                className="w-full sm:w-auto"
              >
                {isComparing ? "Comparing..." : "Compare Texts"}
              </Button>

              {diffResult.length > 0 && (
                <Button
                  variant="outline"
                  onClick={downloadDiffResult}
                  className="w-full sm:w-auto"
                >
                  Download Diff Result
                </Button>
              )}
            </div>

            {diffResult.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Comparison Result</h3>
                <div className="border rounded-md p-4 bg-muted/30 font-mono text-sm overflow-x-auto">
                  {diffResult.map((line, index) => (
                    <div
                      key={index}
                      className={`${
                        line.type === "added"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : line.type === "removed"
                            ? "bg-red-500/10 text-red-700 dark:text-red-400"
                            : ""
                      } 
                                  py-1 px-2 whitespace-pre-wrap`}
                    >
                      {line.type === "added"
                        ? "+ "
                        : line.type === "removed"
                          ? "- "
                          : "  "}
                      {line.value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Paste your original text in the first text area.</li>
              <li>Paste your modified text in the second text area.</li>
              <li>Click the "Compare Texts" button to see the differences.</li>
              <li>
                Added lines are highlighted in green, removed lines in red.
              </li>
              <li>
                Use this tool to identify changes between two versions of text.
              </li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
