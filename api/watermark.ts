import type { VercelRequest, VercelResponse } from "@vercel/node";
import FormData from "form-data";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

  const authHeader = `Bearer ${process.env.ILOVEAPI_PUBLIC_KEY}:${process.env.ILOVEAPI_SECRET_KEY}`;

  try {
    // Step 1: Start a new task
    const startResponse = await fetch("https://api.iloveapi.com/v1/task", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tool: "watermark" }),
    });
    if (!startResponse.ok) throw new Error(await startResponse.text());
    const { task_id } = await startResponse.json();

    // Step 2: Upload the file
    const uploadForm = new FormData();
    uploadForm.append("file", file, { filename: "input.pdf" });
    const uploadResponse = await fetch(`https://api.iloveapi.com/v1/upload/${task_id}`, {
      method: "POST",
      headers: { Authorization: authHeader },
      body: uploadForm as any,
    });
    if (!uploadResponse.ok) throw new Error(await uploadResponse.text());
    const uploadData = await uploadResponse.json();
    const fileId = uploadData.files[0].file_id;

    // Step 3: Process the task
    const gravityMap: { [key: string]: string } = {
      middle: "Center",
      "top-left": "NorthWest",
      "top-right": "NorthEast",
      "middle-left": "West",
      "middle-right": "East",
      "bottom-left": "SouthWest",
      "bottom-right": "SouthEast",
    };
    const processBody = {
      files: [{ file_id: fileId }],
      tool: "watermark",
      mode: "text",
      text: watermark_text,
      transparency: String(1 - Number(opacity)), // 0 = opaque, 1 = transparent
      font_color: font_color.replace("#", ""), // iLoveAPI expects no #
      font_size: Number(font_size),
      rotation: Number(rotation),
      gravity: gravityMap[position] || "Center",
    };
    const processResponse = await fetch(`https://api.iloveapi.com/v1/process/${task_id}`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processBody),
    });
    if (!processResponse.ok) throw new Error(await processResponse.text());
    const processData = await processResponse.json();

    // Step 4: Download the result
    const downloadUrl = processData.download_url;
    const fileResponse = await fetch(downloadUrl);
    const fileBuffer = await fileResponse.arrayBuffer();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=watermarked.pdf`);
    res.send(Buffer.from(fileBuffer));
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to process watermark" });
  }
}