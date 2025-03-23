import type { VercelRequest, VercelResponse } from "@vercel/node";
import FormData from "form-data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract form data from request body
  const {
    file,
    watermark_text,
    opacity,
    font_color,
    font_size,
    rotation,
    position,
  } = req.body as {
    file: Buffer | string;
    watermark_text: string;
    opacity: string;
    font_color: string;
    font_size: string;
    rotation: string;
    position: string;
  };

  // Create FormData for iLoveAPI
  const apiFormData = new FormData();
  apiFormData.append("file", file, { filename: "input.pdf" }); // Ensure file is sent as a stream/buffer
  apiFormData.append("tool", "watermark");
  apiFormData.append("mode", "text");
  apiFormData.append("text", watermark_text);
  apiFormData.append("transparency", String(1 - Number(opacity))); // iLoveAPI: 0 = opaque, 1 = transparent
  apiFormData.append("font_color", font_color);
  apiFormData.append("font_size", font_size);
  apiFormData.append("rotation", rotation);

  const gravityMap: { [key: string]: string } = {
    middle: "Center",
    "top-left": "NorthWest",
    "top-right": "NorthEast",
    "middle-left": "West",
    "middle-right": "East",
    "bottom-left": "SouthWest",
    "bottom-right": "SouthEast",
  };
  apiFormData.append("gravity", gravityMap[position] || "Center");

  try {
    const response = await fetch("https://api.iloveapi.com/v1/task", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ILOVEAPI_PUBLIC_KEY}:${process.env.ILOVEAPI_SECRET_KEY}`,
        // FormData will set Content-Type automatically with boundary
      },
      body: apiFormData as any, // Type assertion to bypass TS error (Node FormData vs Fetch BodyInit)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const taskData = await response.json();
    const taskId = taskData.task_id;

    const processResponse = await fetch(`https://api.iloveapi.com/v1/process/${taskId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ILOVEAPI_PUBLIC_KEY}:${process.env.ILOVEAPI_SECRET_KEY}`,
      },
    });

    if (!processResponse.ok) {
      throw new Error(await processResponse.text());
    }

    const processData = await processResponse.json();
    const downloadUrl = processData.download_url;

    const fileResponse = await fetch(downloadUrl);
    const fileBuffer = await fileResponse.arrayBuffer(); // Use arrayBuffer instead of buffer

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=watermarked.pdf`); // Use a generic name since file.name isn’t available
    res.send(Buffer.from(fileBuffer)); // Convert ArrayBuffer to Buffer for Vercel response
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to process watermark" });
  }
}