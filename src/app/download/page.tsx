"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Download, Github } from "lucide-react";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Download AZ-Tools</h1>

            <div className="border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">GitHub Repository</h2>
              <p className="text-muted-foreground mb-6">
                AZ-Tools is an open-source project. You can download the source
                code from our GitHub repository.
              </p>
              <Link
                href="https://github.com/yourusername/AZ-tools"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Clone the Repository
              </h2>
              <p className="text-muted-foreground mb-4">
                Use Git to clone the repository to your local machine:
              </p>
              <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                git clone https://github.com/yourusername/AZ-tools.git
              </div>
              <p className="text-muted-foreground mb-4">
                After cloning, navigate to the project directory and install
                dependencies:
              </p>
              <div className="bg-muted p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
                cd AZ-tools
                <br />
                npm install
              </div>
              <p className="text-muted-foreground mb-4">
                Start the development server:
              </p>
              <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto">
                npm run dev
              </div>
            </div>

            <div className="border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Download ZIP</h2>
              <p className="text-muted-foreground mb-6">
                Alternatively, you can download the source code as a ZIP file
                directly from GitHub.
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  // Create a dummy ZIP file for download
                  const zipHeader = new Uint8Array([
                    0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                  ]);

                  const blob = new Blob([zipHeader], {
                    type: "application/zip",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "AZ-tools-source.zip";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" />
                Download ZIP
              </Button>
            </div>

            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                System Requirements
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Node.js 16.x or later</li>
                <li>npm 8.x or later</li>
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
              </ul>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
