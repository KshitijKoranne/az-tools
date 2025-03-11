"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Calculator as CalculatorIcon, Trash2 } from "lucide-react";
import { useState } from "react";

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    if (firstOperand === null || operator === null) return parseFloat(display);

    const inputValue = parseFloat(display);
    let result = 0;

    switch (operator) {
      case "+":
        result = firstOperand + inputValue;
        break;
      case "-":
        result = firstOperand - inputValue;
        break;
      case "*":
        result = firstOperand * inputValue;
        break;
      case "/":
        result = firstOperand / inputValue;
        break;
      default:
        return inputValue;
    }

    return result;
  };

  const handleEquals = () => {
    if (firstOperand === null || operator === null) return;

    const result = performCalculation();
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(display);
    const percentValue = currentValue / 100;
    setDisplay(String(percentValue));
  };

  const toggleSign = () => {
    const currentValue = parseFloat(display);
    setDisplay(String(-1 * currentValue));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Calculator</h1>
            <p className="text-muted-foreground">
              A simple calculator for basic arithmetic operations.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 max-w-md mx-auto">
            <div className="mb-4 p-4 bg-muted/30 rounded-md text-right">
              <div className="text-3xl font-mono">{display}</div>
              {operator && (
                <div className="text-sm text-muted-foreground">
                  {firstOperand} {operator}
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                onClick={clearDisplay}
                className="col-span-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" onClick={handlePercentage}>
                %
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("/")}
                className="bg-amber-500/10 hover:bg-amber-500/20"
              >
                ÷
              </Button>

              <Button variant="outline" onClick={() => inputDigit("7")}>
                7
              </Button>
              <Button variant="outline" onClick={() => inputDigit("8")}>
                8
              </Button>
              <Button variant="outline" onClick={() => inputDigit("9")}>
                9
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("*")}
                className="bg-amber-500/10 hover:bg-amber-500/20"
              >
                ×
              </Button>

              <Button variant="outline" onClick={() => inputDigit("4")}>
                4
              </Button>
              <Button variant="outline" onClick={() => inputDigit("5")}>
                5
              </Button>
              <Button variant="outline" onClick={() => inputDigit("6")}>
                6
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("-")}
                className="bg-amber-500/10 hover:bg-amber-500/20"
              >
                -
              </Button>

              <Button variant="outline" onClick={() => inputDigit("1")}>
                1
              </Button>
              <Button variant="outline" onClick={() => inputDigit("2")}>
                2
              </Button>
              <Button variant="outline" onClick={() => inputDigit("3")}>
                3
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOperator("+")}
                className="bg-amber-500/10 hover:bg-amber-500/20"
              >
                +
              </Button>

              <Button variant="outline" onClick={toggleSign}>
                +/-
              </Button>
              <Button variant="outline" onClick={() => inputDigit("0")}>
                0
              </Button>
              <Button variant="outline" onClick={inputDecimal}>
                .
              </Button>
              <Button
                variant="default"
                onClick={handleEquals}
                className="bg-amber-500 hover:bg-amber-600"
              >
                =
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Enter numbers using the number buttons.</li>
              <li>
                Use the operation buttons (+, -, ×, ÷) to perform calculations.
              </li>
              <li>Press the equals (=) button to see the result.</li>
              <li>Use the Clear button to reset the calculator.</li>
              <li>
                The percentage (%) button converts the current number to a
                percentage.
              </li>
              <li>
                The +/- button toggles between positive and negative numbers.
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
