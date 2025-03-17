"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Copy, Download, Palette, Plus, RefreshCw, X } from "lucide-react";
import { useState, useEffect } from "react";

type GradientType = "linear" | "radial" | "conic";
type GradientStop = { color: string; position: number };

export default function GradientGeneratorPage() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState([90]);
  const [stops, setStops] = useState<GradientStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);
  const [cssCode, setCssCode] = useState("");

  useEffect(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    let gradientCSS = "";
    if (gradientType === "linear") {
      gradientCSS = `background: linear-gradient(${angle[0]}deg, ${stopsString});`;
    } else if (gradientType === "radial") {
      gradientCSS = `background: radial-gradient(circle, ${stopsString});`;
    } else if (gradientType === "conic") {
      gradientCSS = `background: conic-gradient(from ${angle[0]}deg, ${stopsString});`;
    }

    setCssCode(gradientCSS);
  }, [gradientType, angle, stops]);

  const generateGradientCSS = () => {
    return cssCode;
  };

  const addColorStop = () => {
    if (stops.length >= 5) return;

    const positions = stops.map((stop) => stop.position);
    let newPosition = 50;

    if (positions.length >= 2) {
      positions.sort((a, b) => a - b);
      let maxGap = 0;
      let gapPosition = 50;

      for (let i = 0; i < positions.length - 1; i++) {
        const gap = positions[i + 1] - positions[i];
        if (gap > maxGap) {
          maxGap = gap;
          gapPosition = positions[i] + gap / 2;
        }
      }

      newPosition = Math.round(gapPosition);
    }

    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

    setStops([...stops, { color: randomColor, position: newPosition }]);
  };

  const removeColorStop = (index: number) => {
    if (stops.length <= 2) return;
    const newStops = [...stops];
    newStops.splice(index, 1);
    setStops(newStops);
  };

  const updateColorStop = (
    index: number,
    field: "color" | "position",
    value: string | number,
  ) => {
    const newStops = [...stops];
    if (field === "color") {
      newStops[index].color = value as string;
    } else {
      newStops[index].position = Math.min(100, Math.max(0, value as number));
    }
    setStops(newStops);
  };

  const generateRandomGradient = () => {
    const types: GradientType[] = ["linear", "radial", "conic"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setGradientType(randomType);

    const randomAngle = [Math.floor(Math.random() * 360)];
    setAngle(randomAngle);

    const numStops = Math.floor(Math.random() * 3) + 2;
    const newStops: GradientStop[] = [];

    for (let i = 0; i < numStops; i++) {
      const position =
        i === 0
          ? 0
          : i === numStops - 1
            ? 100
            : Math.floor(Math.random() * 80) + 10;
      const color = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
      newStops.push({ color, position });
    }

    newStops.sort((a, b) => a.position - b.position);
    setStops(newStops);
  };

  const copyToClipboard = () => {
    const css = generateGradientCSS();
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSS = () => {
    const css = generateGradientCSS();
    const cssContent = `/* Gradient CSS */\n${css}\n\n/* For older browsers */\n.gradient {\n  ${css}\n}\n`;

    const blob = new Blob([cssContent], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradient.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getGradientStyle = () => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return { background: `linear-gradient(${angle[0]}deg, ${stopsString})` };
    } else if (gradientType === "radial") {
      return { background: `radial-gradient(circle, ${stopsString})` };
    } else if (gradientType === "conic") {
      return {
        background: `conic-gradient(from ${angle[0]}deg, ${stopsString})`,
      };
    }

    return {};
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">CSS Gradient Generator</h1>
            <p className="text-muted-foreground">
              Create beautiful CSS gradients for your web projects.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Gradient Type
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="linear"
                        name="gradient-type"
                        checked={gradientType === "linear"}
                        onChange={() => setGradientType("linear")}
                        className="mr-2"
                      />
                      <label htmlFor="linear">Linear</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="radial"
                        name="gradient-type"
                        checked={gradientType === "radial"}
                        onChange={() => setGradientType("radial")}
                        className="mr-2"
                      />
                      <label htmlFor="radial">Radial</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="conic"
                        name="gradient-type"
                        checked={gradientType === "conic"}
                        onChange={() => setGradientType("conic")}
                        className="mr-2"
                      />
                      <label htmlFor="conic">Conic</label>
                    </div>
                  </div>
                </div>

                {(gradientType === "linear" || gradientType === "conic") && (
                  <div className="mb-6">
                    <label
                      htmlFor="angle"
                      className="block text-sm font-medium mb-2"
                    >
                      Angle: {angle[0]}°
                    </label>
                    <Slider
                      id="angle"
                      min={0}
                      max={360}
                      step={1}
                      value={angle}
                      onValueChange={setAngle}
                    />
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      Color Stops
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addColorStop}
                      disabled={stops.length >= 5}
                      className="h-8 px-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Stop
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {stops.map((stop, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) =>
                            updateColorStop(index, "color", e.target.value)
                          }
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={stop.color}
                          onChange={(e) =>
                            updateColorStop(index, "color", e.target.value)
                          }
                          className="font-mono w-28"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`position-${index}`}
                            className="block text-xs mb-1"
                          >
                            Position: {stop.position}%
                          </label>
                          <input
                            id={`position-${index}`}
                            type="range"
                            min="0"
                            max="100"
                            value={stop.position}
                            onChange={(e) =>
                              updateColorStop(
                                index,
                                "position",
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        {stops.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeColorStop(index)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="css-output"
                    className="block text-sm font-medium mb-2"
                  >
                    CSS Code
                  </label>
                  <div className="relative">
                    <textarea
                      id="css-output"
                      rows={3}
                      className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={generateGradientCSS()}
                      readOnly
                    ></textarea>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="absolute right-2 top-2 h-6 px-2"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={generateRandomGradient}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Random Gradient
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadCSS}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download CSS
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Gradient Preview
                  </label>
                  <div
                    className="w-full h-64 rounded-md border"
                    style={getGradientStyle()}
                  ></div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Sample UI Elements
                  </label>
                  <div className="space-y-4">
                    <button
                      className="px-4 py-2 rounded-md text-white font-medium w-full"
                      style={getGradientStyle()}
                    >
                      Gradient Button
                    </button>
                    <div className="p-4 rounded-md" style={getGradientStyle()}>
                      <h3 className="text-white font-bold mb-2">
                        Gradient Card
                      </h3>
                      <p className="text-white/90 text-sm">
                        This is how your gradient looks on a card element.
                      </p>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={getGradientStyle()}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Select the type of gradient you want to create.</li>
              <li>Adjust the angle for linear or conic gradients.</li>
              <li>
                Add, remove, or modify color stops to customize your gradient.
              </li>
              <li>Copy the generated CSS code to use in your projects.</li>
              <li>Use the "Random Gradient" button for inspiration.</li>
              <li>
                Download the CSS file for easy integration into your project.
              </li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}