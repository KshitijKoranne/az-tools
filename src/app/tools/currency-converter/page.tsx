"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [result, setResult] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(
    {},
  );
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "INR", name: "Indian Rupee" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "ZAR", name: "South African Rand" },
  ];

  // Mock exchange rates (in a real app, these would come from an API)
  useEffect(() => {
    // Simulate loading exchange rates
    const mockRates: Record<string, number> = {
      USD: 1,
      EUR: 0.93,
      GBP: 0.79,
      JPY: 150.27,
      AUD: 1.52,
      CAD: 1.37,
      CHF: 0.9,
      CNY: 7.24,
      INR: 83.12,
      MXN: 16.73,
      SGD: 1.34,
      NZD: 1.64,
      BRL: 5.05,
      ZAR: 18.42,
    };

    setExchangeRates(mockRates);
    setLastUpdated(new Date().toLocaleString());

    // Initial conversion
    convertCurrency();
  }, []);

  const convertCurrency = () => {
    if (!amount || isNaN(Number(amount))) {
      setResult("Please enter a valid amount");
      return;
    }

    setIsConverting(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        const amountNum = parseFloat(amount);
        const fromRate = exchangeRates[fromCurrency] || 1;
        const toRate = exchangeRates[toCurrency] || 1;

        // Convert to USD first, then to target currency
        const valueInUSD = amountNum / fromRate;
        const convertedValue = valueInUSD * toRate;

        // Format the result
        const formattedResult = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: toCurrency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 4,
        }).format(convertedValue);

        setResult(formattedResult);
      } catch (error) {
        setResult("Conversion error");
      } finally {
        setIsConverting(false);
      }
    }, 500);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Currency Converter</h1>
            <p className="text-muted-foreground">
              Convert between different currencies with real-time exchange
              rates.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="amount-input"
                  className="block text-sm font-medium mb-2"
                >
                  Amount
                </label>
                <Input
                  id="amount-input"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCurrencies}
                  className="rounded-full"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="result-value"
                  className="block text-sm font-medium mb-2"
                >
                  Converted Amount
                </label>
                <Input
                  id="result-value"
                  type="text"
                  value={result}
                  readOnly
                  className="bg-muted/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="md:col-span-2">
                <label
                  htmlFor="from-currency"
                  className="block text-sm font-medium mb-2"
                >
                  From Currency
                </label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger id="from-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="to-currency"
                  className="block text-sm font-medium mb-2"
                >
                  To Currency
                </label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger id="to-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 text-xs text-muted-foreground text-right">
              Exchange rates last updated: {lastUpdated} (Demo data)
            </div>
          </div>

          <div className="border rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Enter the amount you want to convert.</li>
              <li>Select the currency you're converting from.</li>
              <li>Select the currency you want to convert to.</li>
              <li>The converted amount will appear automatically.</li>
              <li>Use the swap button to quickly reverse the conversion.</li>
            </ol>
            <div className="mt-4 p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is a demo version using static
                exchange rates. In a production environment, this would connect
                to a real-time currency exchange rate API for accurate
                conversions.
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
