import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });
  const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });

  const file = files.file?.[0]; // Get the uploaded file
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const watermark_text = fields.watermark_text?.[0];
  const opacity = fields.opacity?.[0];
  const font_color = fields.font_color?.[0];
  const font_size = fields.font_size?.[0];
  const rotation = fields.rotation?.[0];
  const position = fields.position?.[0];

  if (!watermark_text) {
    return res.status(400).json({ error: "Watermark text is required" });
  }

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
    uploadForm.append("file", fs.createReadStream(file.filepath), { filename: file.originalFilename || "input.pdf" });
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
      transparency: String(1 - Number(opacity)),
      font_color: font_color?.replace("#", ""),
      font_size: Number(font_size),
      rotation: Number(rotation),
      gravity: gravityMap[position || "middle"] || "Center",
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
    res.setHeader("Content-Disposition", `attachment; filename=watermarked_${file.originalFilename || "output.pdf"}`);
    res.send(Buffer.from(fileBuffer));
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to process watermark" });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle multipart/form-data manually
  },
};