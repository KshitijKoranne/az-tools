import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable, { Fields, Files } from "formidable";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import fs from "fs/promises";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse form data
  const form = formidable({ multiples: false });
  let fields: Fields, files: Files;
  try {
    [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });
  } catch (err) {
    console.error("Form parsing error:", err);
    return res.status(400).json({ error: "Failed to parse form data" });
  }

  const file = files.file?.[0];
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const watermark_text = fields.watermark_text?.[0];
  const opacity = parseFloat(fields.opacity?.[0] || "0.3"); // 0-1, default 0.3
  const font_size = parseInt(fields.font_size?.[0] || "50", 10); // Default 50
  const rotation = parseInt(fields.rotation?.[0] || "0", 10); // Default 0
  const position = fields.position?.[0] || "middle"; // Default center
  const font_color = fields.font_color?.[0] || "#FF0000"; // Default red

  if (!watermark_text) {
    return res.status(400).json({ error: "Watermark text is required" });
  }

  try {
    // Load the input PDF
    const pdfBytes = await fs.readFile(file.filepath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Parse color (hex to RGB)
    const r = parseInt(font_color.slice(1, 3), 16) / 255;
    const g = parseInt(font_color.slice(3, 5), 16) / 255;
    const b = parseInt(font_color.slice(5, 7), 16) / 255;

    // Watermark all pages
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      let x: number, y: number;

      // Position logic
      switch (position) {
        case "top-left":
          x = 50;
          y = height - 50;
          break;
        case "top-right":
          x = width - 50;
          y = height - 50;
          break;
        case "middle-left":
          x = 50;
          y = height / 2;
          break;
        case "middle-right":
          x = width - 50;
          y = height / 2;
          break;
        case "bottom-left":
          x = 50;
          y = 50;
          break;
        case "bottom-right":
          x = width - 50;
          y = 50;
          break;
        case "middle":
        default:
          x = width / 2;
          y = height / 2;
          break;
      }

      // Draw watermark
      page.drawText(watermark_text, {
        x,
        y,
        size: font_size,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: degrees(rotation),
      });
    }

    // Save and send the watermarked PDF
    const watermarkedBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=watermarked_${file.originalFilename || "output.pdf"}`);
    res.send(Buffer.from(watermarkedBytes));
  } catch (error: unknown) {
    console.error("PDF watermarking error:", error);
    // Safely handle the error type
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: `Failed to process watermark: ${errorMessage}` });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};