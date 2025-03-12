"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function RandomNumberPage() {
  const [minValue, setMinValue] = useState<string>("1");
  const [maxValue, setMaxValue] = useState<string>("100");
  const [quantity, setQuantity] = useState<string>("1");
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [includeDecimals, setIncludeDecimals] = useState<boolean>(false);
  const [decimalPlaces, setDecimalPlaces] = useState<string>("2");
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const generateRandomNumbers = () => {
    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);
    const qty = parseInt(quantity);
    const decimals = parseInt(decimalPlaces);

    // Validate inputs
    if (isNaN(min) || isNaN(max) || isNaN(qty) || min >= max || qty < 1) {
      alert(
        "Please enter valid values. Maximum must be greater than minimum, and quantity must be at least 1.",
      );
      return;
    }

    // Check if we can generate enough unique numbers
    if (!allowDuplicates && !includeDecimals) {
      const possibleNumbers = Math.floor(max) - Math.ceil(min) + 1;
      if (qty > possibleNumbers) {
        alert(
          `Cannot generate ${qty} unique numbers in the range ${min} to ${max}. Please increase the range or allow duplicates.`,
        );
        return;
      }
    }

    const numbers: string[] = [];
    const generatedSet = new Set<string>();

    for (let i = 0; i < qty; i++) {
      let randomNum: number;
      let numStr: string;

      do {
        if (includeDecimals) {
          randomNum = min + Math.random() * (max - min);
          numStr = randomNum.toFixed(decimals);
        } else {
          randomNum =
            Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
            Math.ceil(min);
          numStr = randomNum.toString();
        }
      } while (!allowDuplicates && generatedSet.has(numStr));

      numbers.push(numStr);
      generatedSet.add(numStr);
    }

    setGeneratedNumbers(numbers);
  };

  const copyToClipboard = () => {
    if (generatedNumbers.length === 0) return;

    navigator.clipboard.writeText(generatedNumbers.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Random Number Generator</h1>
            <p className="text-muted-foreground">
              Generate random numbers with custom ranges and options.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="min-value"
                  className="block text-sm font-medium mb-2"
                >
                  Minimum Value
                </label>
                <Input
                  id="min-value"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="max-value"
                  className="block text-sm font-medium mb-2"
                >
                  Maximum Value
                </label>
                <Input
                  id="max-value"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-2"
                >
                  How many numbers?
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allow-duplicates"
                      checked={allowDuplicates}
                      onChange={(e) => setAllowDuplicates(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="allow-duplicates" className="text-sm">
                      Allow duplicate numbers
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="include-decimals"
                      checked={includeDecimals}
                      onChange={(e) => setIncludeDecimals(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="include-decimals" className="text-sm">
                      Include decimal numbers
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {includeDecimals && (
              <div className="mb-6">
                <label
                  htmlFor="decimal-places"
                  className="block text-sm font-medium mb-2"
                >
                  Decimal Places
                </label>
                <Input
                  id="decimal-places"
                  type="number"
                  min="1"
                  max="10"
                  value={decimalPlaces}
                  onChange={(e) => setDecimalPlaces(e.target.value)}
                />
              </div>
            )}

            <Button
              onClick={generateRandomNumbers}
              className="w-full mb-6 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Generate Random Numbers
            </Button>

            {generatedNumbers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Generated Numbers
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
                <div className="p-4 bg-muted/30 rounded-md max-h-40 overflow-y-auto">
                  <div className="font-mono text-sm">
                    {generatedNumbers.join(", ")}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Set the minimum and maximum values for your random numbers.
              </li>
              <li>Choose how many random numbers you want to generate.</li>
              <li>Select whether to allow duplicate numbers or not.</li>
              <li>Choose whether to include decimal numbers.</li>
              <li>
                If using decimals, specify how many decimal places to include.
              </li>
              <li>Click the "Generate Random Numbers" button.</li>
              <li>Copy the generated numbers using the copy button.</li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> This tool is useful for generating random
                numbers for lotteries, games, statistical sampling, or any
                situation where you need random values.
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
