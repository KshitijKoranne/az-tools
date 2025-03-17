"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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

interface UnitCategory {
  name: string;
  units: {
    name: string;
    value: number;
  }[];
}

export default function UnitConverterPage() {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("length");

  const unitCategories: Record<string, UnitCategory> = {
    length: {
      name: "Length",
      units: [
        { name: "Millimeter (mm)", value: 0.001 },
        { name: "Centimeter (cm)", value: 0.01 },
        { name: "Meter (m)", value: 1 },
        { name: "Kilometer (km)", value: 1000 },
        { name: "Inch (in)", value: 0.0254 },
        { name: "Foot (ft)", value: 0.3048 },
        { name: "Yard (yd)", value: 0.9144 },
        { name: "Mile (mi)", value: 1609.344 },
      ],
    },
    weight: {
      name: "Weight",
      units: [
        { name: "Milligram (mg)", value: 0.000001 },
        { name: "Gram (g)", value: 0.001 },
        { name: "Kilogram (kg)", value: 1 },
        { name: "Metric Ton (t)", value: 1000 },
        { name: "Ounce (oz)", value: 0.0283495 },
        { name: "Pound (lb)", value: 0.453592 },
        { name: "Stone (st)", value: 6.35029 },
      ],
    },
    temperature: {
      name: "Temperature",
      units: [
        { name: "Celsius (°C)", value: 0 },
        { name: "Fahrenheit (°F)", value: 1 },
        { name: "Kelvin (K)", value: 2 },
      ],
    },
    volume: {
      name: "Volume",
      units: [
        { name: "Milliliter (ml)", value: 0.000001 },
        { name: "Liter (l)", value: 0.001 },
        { name: "Cubic Meter (m³)", value: 1 },
        { name: "Fluid Ounce (fl oz)", value: 0.0000295735 },
        { name: "Cup", value: 0.000236588 },
        { name: "Pint (pt)", value: 0.000473176 },
        { name: "Quart (qt)", value: 0.000946353 },
        { name: "Gallon (gal)", value: 0.00378541 },
      ],
    },
    area: {
      name: "Area",
      units: [
        { name: "Square Meter (m²)", value: 1 },
        { name: "Square Kilometer (km²)", value: 1000000 },
        { name: "Square Centimeter (cm²)", value: 0.0001 },
        { name: "Square Millimeter (mm²)", value: 0.000001 },
        { name: "Square Inch (in²)", value: 0.00064516 },
        { name: "Square Foot (ft²)", value: 0.092903 },
        { name: "Square Yard (yd²)", value: 0.836127 },
        { name: "Acre", value: 4046.86 },
        { name: "Hectare (ha)", value: 10000 },
      ],
    },
  };

  useEffect(() => {
    if (selectedCategory) {
      const units = unitCategories[selectedCategory].units;
      if (units.length > 0) {
        setFromUnit(units[0].name);
        setToUnit(units.length > 1 ? units[1].name : units[0].name);
      }
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (inputValue && fromUnit && toUnit) {
      convertUnit();
    }
  }, [inputValue, fromUnit, toUnit]);

  const convertUnit = () => {
    if (!inputValue || !fromUnit || !toUnit) return;

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Invalid input");
      return;
    }

    const category = unitCategories[selectedCategory];
    const fromUnitObj = category.units.find((u) => u.name === fromUnit);
    const toUnitObj = category.units.find((u) => u.name === toUnit);

    if (!fromUnitObj || !toUnitObj) {
      setResult("Invalid units");
      return;
    }

    let convertedValue: number;

    // Special case for temperature
    if (selectedCategory === "temperature") {
      // Convert to Celsius first
      let celsius: number;
      if (fromUnit === "Celsius (°C)") {
        celsius = value;
      } else if (fromUnit === "Fahrenheit (°F)") {
        celsius = (value - 32) * (5 / 9);
      } else {
        // Kelvin
        celsius = value - 273.15;
      }

      // Convert from Celsius to target unit
      if (toUnit === "Celsius (°C)") {
        convertedValue = celsius;
      } else if (toUnit === "Fahrenheit (°F)") {
        convertedValue = celsius * (9 / 5) + 32;
      } else {
        // Kelvin
        convertedValue = celsius + 273.15;
      }
    } else {
      // For other units, use the standard conversion
      const baseValue = value * fromUnitObj.value;
      convertedValue = baseValue / toUnitObj.value;
    }

    // Format the result based on the magnitude
    let formattedResult: string;
    if (
      Math.abs(convertedValue) < 0.000001 ||
      Math.abs(convertedValue) >= 1000000
    ) {
      formattedResult = convertedValue.toExponential(6);
    } else {
      formattedResult = convertedValue.toPrecision(7);
      // Remove trailing zeros after decimal point
      formattedResult = formattedResult
        .replace(/(\.\d*?)0+$/, "$1")
        .replace(/\.$/, "");
    }

    setResult(formattedResult);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
            <p className="text-muted-foreground">
              Convert between different units of measurement.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <div className="mb-6">
              <label
                htmlFor="category-select"
                className="block text-sm font-medium mb-2"
              >
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(unitCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="from-value"
                  className="block text-sm font-medium mb-2"
                >
                  From
                </label>
                <Input
                  id="from-value"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapUnits}
                  className="rounded-full"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="to-value"
                  className="block text-sm font-medium mb-2"
                >
                  To
                </label>
                <Input
                  id="to-value"
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
                  htmlFor="from-unit"
                  className="block text-sm font-medium mb-2"
                >
                  From Unit
                </label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger id="from-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory &&
                      unitCategories[selectedCategory].units.map(
                        (unit, index) => (
                          <SelectItem key={index} value={unit.name}>
                            {unit.name}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="to-unit"
                  className="block text-sm font-medium mb-2"
                >
                  To Unit
                </label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger id="to-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory &&
                      unitCategories[selectedCategory].units.map(
                        (unit, index) => (
                          <SelectItem key={index} value={unit.name}>
                            {unit.name}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Select a category of measurement from the dropdown.</li>
              <li>Enter the value you want to convert in the "From" field.</li>
              <li>Select the unit you're converting from.</li>
              <li>Select the unit you want to convert to.</li>
              <li>The converted value will appear automatically.</li>
              <li>Use the swap button to quickly reverse the conversion.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
