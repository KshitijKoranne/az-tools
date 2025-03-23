"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";

export default function PDFWatermarkPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">PDF Watermark</h1>
            <p className="text-muted-foreground">
              Add text watermarks to your PDF documents.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">
              The PDF Watermark tool is currently under development. Check back later for updates!
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}