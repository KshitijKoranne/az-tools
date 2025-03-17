"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FileText, Copy, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function CharacterCounterPage() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (text: string) => {
    // Characters (with and without spaces)
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // Words
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    // Sentences (basic approximation)
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;

    // Paragraphs
    const paragraphs =
      text.split(/\n\s*\n/).filter(Boolean).length || (text.trim() ? 1 : 0);

    // Lines
    const lines = text.split("\n").length;

    // Reading time (average reading speed: 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const clearText = () => {
    setText("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Character Counter</h1>
            <p className="text-muted-foreground">
              Count characters, words, sentences, and more in your text.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="text-input"
                      className="block text-sm font-medium"
                    >
                      Enter or paste your text
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearText}
                        className="h-8 px-2 text-xs"
                        disabled={!text}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-8 px-2 text-xs"
                        disabled={!text}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                  <textarea
                    id="text-input"
                    rows={12}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Type or paste your text here..."
                    value={text}
                    onChange={handleTextChange}
                  ></textarea>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Text Statistics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-md">
                    <div className="grid grid-cols-2 gap-y-3">
                      <div className="text-sm text-muted-foreground">
                        Characters:
                      </div>
                      <div className="text-sm font-medium text-right">
                        {stats.characters}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Characters (no spaces):
                      </div>
                      <div className="text-sm font-medium text-right">
                        {stats.charactersNoSpaces}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Words:
                      </div>
                      <div className="text-sm font-medium text-right">
                        {stats.words}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Sentences:
                      </div>
                      <div className="text-sm font-medium text-right">
                        {stats.sentences}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Paragraphs:
                      </div>
                      <div className="text-sm font-medium text-right">
                        {stats.paragraphs}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Lines:
                      </div>
                      <div className="text-sm font-medium text-right">
                        {stats.lines}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Reading Time</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Approx. time to read:
                      </span>
                      <span className="text-sm font-medium">
                        {stats.readingTime === 0
                          ? "< 1 min"
                          : `${stats.readingTime} min`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h4 className="text-sm font-medium mb-2">Density</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Avg. words per sentence:
                        </span>
                        <span className="text-sm font-medium">
                          {stats.sentences > 0
                            ? (stats.words / stats.sentences).toFixed(1)
                            : "0"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Avg. characters per word:
                        </span>
                        <span className="text-sm font-medium">
                          {stats.words > 0
                            ? (stats.charactersNoSpaces / stats.words).toFixed(
                                1,
                              )
                            : "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Type or paste your text in the input area.</li>
              <li>
                View the character count and other statistics in real-time.
              </li>
              <li>Use the copy button to copy your text to the clipboard.</li>
              <li>Use the clear button to reset the text area.</li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> This tool is useful for writers who need
                to meet specific character or word count requirements, or for
                social media posts where character limits apply.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
