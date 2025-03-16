"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useState } from "react";

export default function JWTDecoderPage() {
  const [jwt, setJwt] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const [payload, setPayload] = useState<string>("");
  const [error, setError] = useState<string>("");

  const decodeJWT = () => {
    if (!jwt) {
      setError("Please enter a JWT to decode.");
      setHeader("");
      setPayload("");
      return;
    }

    try {
      const [headerEncoded, payloadEncoded] = jwt.split(".");
      if (!headerEncoded || !payloadEncoded) {
        throw new Error("Invalid JWT format. It should have at least two parts separated by dots.");
      }

      // Decode base64url to string
      const decodeBase64 = (str: string) => {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        return atob(padded);
      };

      const headerJson = JSON.parse(decodeBase64(headerEncoded));
      const payloadJson = JSON.parse(decodeBase64(payloadEncoded));

      setHeader(JSON.stringify(headerJson, null, 2));
      setPayload(JSON.stringify(payloadJson, null, 2));
      setError("");
    } catch (err) {
      setError("Error decoding JWT. Please ensure it’s a valid token.");
      setHeader("");
      setPayload("");
    }
  };

  const clearInput = () => {
    setJwt("");
    setHeader("");
    setPayload("");
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">JWT Decoder</h1>
            <p className="text-muted-foreground">
              Decode JSON Web Tokens to view their header and payload.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="mb-6">
              <label htmlFor="jwt-input" className="block text-sm font-medium mb-2">
                Paste JWT
              </label>
              <div className="relative">
                <Textarea
                  id="jwt-input"
                  value={jwt}
                  onChange={(e) => setJwt(e.target.value)}
                  placeholder="Enter a JWT (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                  className="w-full min-h-[100px]"
                />
                {jwt && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearInput}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <Button onClick={decodeJWT} disabled={!jwt} className="w-full sm:w-auto mb-6">
              Decode JWT
            </Button>

            {error && (
              <div className="mb-6">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {(header || payload) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Header</h3>
                  <pre className="bg-muted/30 p-4 rounded-md text-sm overflow-auto">
                    {header || "No header decoded"}
                  </pre>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Payload</h3>
                  <pre className="bg-muted/30 p-4 rounded-md text-sm overflow-auto">
                    {payload || "No payload decoded"}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Paste a JWT into the text area above.</li>
              <li>Click "Decode JWT" to process the token.</li>
              <li>View the decoded header and payload below.</li>
              <li>Use the clear button (X) to reset the input.</li>
            </ol>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}