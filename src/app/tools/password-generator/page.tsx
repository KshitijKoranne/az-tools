"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RefreshCw, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    // Fallback if no character set is selected
    if (!chars) chars = lowercase;

    let generatedPassword = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false);
  };

  const calculatePasswordStrength = () => {
    // Simple password strength calculation
    let strength = 0;

    // Length contribution (up to 40%)
    strength += Math.min(passwordLength / 20, 1) * 40;

    // Character variety contribution (up to 60%)
    let varietyScore = 0;
    if (/[A-Z]/.test(password)) varietyScore += 15;
    if (/[a-z]/.test(password)) varietyScore += 15;
    if (/[0-9]/.test(password)) varietyScore += 15;
    if (/[^A-Za-z0-9]/.test(password)) varietyScore += 15;

    strength += varietyScore;

    setPasswordStrength(Math.round(strength));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
            <p className="text-muted-foreground">
              Generate secure, random passwords for your accounts.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <Input
                  type="text"
                  value={password}
                  readOnly
                  className="pr-24 font-mono text-lg"
                />
                <div className="absolute right-2 top-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-6 px-2 mr-1"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={generatePassword}
                    className="h-6 w-6"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Password Strength</span>
                  <span className="text-sm font-medium">
                    {getStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password-length"
                className="block text-sm font-medium mb-2"
              >
                Password Length: {passwordLength} characters
              </label>
              <input
                id="password-length"
                type="range"
                min="8"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
                />
                <label
                  htmlFor="include-uppercase"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Uppercase (A-Z)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(!!checked)}
                />
                <label
                  htmlFor="include-lowercase"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Lowercase (a-z)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
                />
                <label
                  htmlFor="include-numbers"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Numbers (0-9)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
                />
                <label
                  htmlFor="include-symbols"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Symbols (!@#$%)
                </label>
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full gap-2">
              <Shield className="h-4 w-4" />
              Generate New Password
            </Button>
          </div>

          <div className="border rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">
              Password Security Tips
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Use a different password for each account.</li>
              <li>Aim for at least 12-16 characters for important accounts.</li>
              <li>
                Include a mix of uppercase, lowercase, numbers, and symbols.
              </li>
              <li>Avoid using personal information in your passwords.</li>
              <li>
                Consider using a password manager to store your passwords
                securely.
              </li>
              <li>Enable two-factor authentication when available.</li>
            </ul>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
