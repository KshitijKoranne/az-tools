import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable, { Fields, Files } from "formidable";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import fs from "fs/promises";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
  const opacity = parseFloat(fields.opacity?.[0] || "0.3"); // 0-1
  const font_size = parseInt(fields.font_size?.[0] || "50", 10);
  const rotation = parseInt(fields.rotation?.[0] || "0", 10);
  const position = fields.position?.[0] || "middle";
  const font_color = fields.font_color?.[0] || "#FF0000";

  if (!watermark_text) {
    return res.status(400).json({ error: "Watermark text is required" });
  }

  try {
    const pdfBytes = await fs.readFile(file.filepath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Parse color
    const r = parseInt(font_color.slice(1, 3), 16) / 255;
    const g = parseInt(font_color.slice(3, 5), 16) / 255;
    const b = parseInt(font_color.slice(5, 7), 16) / 255;

    // Watermark all pages
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();

      // Measure text dimensions
      const textWidth = font.widthOfTextAtSize(watermark_text, font_size);
      const textHeight = font.heightAtSize(font_size);

      // Calculate position
      let x: number, y: number;
      switch (position.toLowerCase()) {
        case "top-left":
          x = 50; // Margin from left
          y = height - textHeight - 50; // Margin from top
          break;
        case "top-right":
          x = width - textWidth - 50; // Margin from right
          y = height - textHeight - 50; // Margin from top
          break;
        case "middle-left":
          x = 50; // Margin from left
          y = (height - textHeight) / 2; // Center vertically
          break;
        case "middle-right":
          x = width - textWidth - 50; // Margin from right
          y = (height - textHeight) / 2; // Center vertically
          break;
        case "bottom-left":
          x = 50; // Margin from left
          y = 50; // Margin from bottom
          break;
        case "bottom-right":
          x = width - textWidth - 50; // Margin from right
          y = 50; // Margin from bottom
          break;
        case "middle":
        default:
          x = (width - textWidth) / 2; // Center horizontally
          y = (height - textHeight) / 2; // Center vertically
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

    // Save and send
    const watermarkedBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=watermarked_${file.originalFilename || "output.pdf"}`);
    res.send(Buffer.from(watermarkedBytes));
  } catch (error: unknown) {
    console.error("PDF watermarking error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: `Failed to process watermark: ${errorMessage}` });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};