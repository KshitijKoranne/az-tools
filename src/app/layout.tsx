import { TempoInit } from "@/components/tempo-init";
import { Providers } from "@/app/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AZ-Tools - Mobile-Optimized Utility Toolkit",
  description:
    "Free, no-login utility tools for everyday tasks like PDF manipulation, format conversions, and calculations - all optimized for mobile use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <Script
        src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
        strategy="afterInteractive"
      />

      <body className={inter.className}>
        <Providers>
          {children}
          <TempoInit />
        </Providers>
      </body>
    </html>
  );
}
