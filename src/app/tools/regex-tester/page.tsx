"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [matches, setMatches] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const testRegex = () => {
    if (!pattern || !text) {
      setError("Please enter both a regex pattern and test text.");
      setMatches([]);
      setGroups([]);
      return;
    }

    try {
      const regex = new RegExp(pattern, "g");
      const matchResults: RegExpExecArray[] = [];
      let match: RegExpExecArray | null;

      // Use exec in a loop to collect all matches
      while ((match = regex.exec(text)) !== null) {
        matchResults.push(match);
        // Prevent infinite loop with zero-width matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }

      if (matchResults.length === 0) {
        setMatches(["No matches found."]);
        setGroups([]);
        setError("");
      } else {
        const matchStrings = matchResults.map((match) => match[0]);
        const allGroups = matchResults
          .map((match) => match.slice(1))
          .flat()
          .filter(Boolean);

        setMatches(matchStrings);
        setGroups(allGroups);
        setError("");
      }
    } catch (err) {
      setError("Invalid regex pattern. Please check your syntax.");
      setMatches([]);
      setGroups([]);
    }
  };

  const clearInputs = () => {
    setPattern("");
    setText("");
    setMatches([]);
    setGroups([]);
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
            <p className="text-muted-foreground">
              Test and validate regular expressions against your text.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label htmlFor="pattern-input" className="block text-sm font-medium mb-2">
                Regex Pattern
              </label>
              <Input
                id="pattern-input"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex (e.g., \\d+ or [a-z]+)"
              />
            </div>

            <div className="mb-6 relative">
              <label htmlFor="text-input" className="block text-sm font-medium mb-2">
                Test Text
              </label>
              <Textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to test against your regex"
                className="w-full min-h-[100px]"
              />
              {(pattern || text) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearInputs}
                  className="absolute top-10 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <Button onClick={testRegex} disabled={!pattern || !text} className="w-full sm:w-auto mb-6">
              Test Regex
            </Button>

            {error && (
              <div className="mb-6">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {(matches.length > 0 || groups.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Matches</h3>
                  <pre className="bg-muted/30 p-4 rounded-md自然的 text-sm overflow-auto">
                    {matches.length > 0
                      ? matches.join("\n")
                      : "No matches found"}
                  </pre>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Captured Groups</h3>
                  <pre className="bg-muted/30 p-4 rounded-md text-sm overflow-auto">
                    {groups.length > 0 ? groups.join("\n") : "No groups captured"}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Enter a regex pattern in the first field (e.g., \d+ for numbers).</li>
              <li>Type or paste text to test in the textarea below.</li>
              <li>Click "Test Regex" to see matches and captured groups.</li>
              <li>Use the clear button (X) to reset the inputs.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}