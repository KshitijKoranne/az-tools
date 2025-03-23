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

  const file = files.file?.[0];
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

  const publicKey = process.env.ILOVEAPI_PUBLIC_KEY;
  const authHeader = `Bearer ${publicKey}`;
  console.log("Public key:", publicKey);
  console.log("Auth header:", authHeader);

  try {
    // Step 1: Start a new task (simplified)
    const startUrl = "https://api.ilovepdf.com/v1/start/watermark";
    console.log("Start request URL:", startUrl);
    const startResponse = await fetch(startUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Accept": "text/plain",
      },
    });
    const startText = await startResponse.text();
    console.log("Start response status:", startResponse.status);
    // Log headers using forEach instead of spread
    const headersObj: Record<string, string> = {};
    startResponse.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    console.log("Start response headers:", JSON.stringify(headersObj));
    console.log("Start response body:", startText);
    if (!startResponse.ok) throw new Error(startText);
    const task = startText.trim();

    // Step 2: Upload the file
    const uploadForm = new FormData();
    uploadForm.append("task", task);
    uploadForm.append("file", fs.createReadStream(file.filepath), { filename: file.originalFilename || "input.pdf" });
    const uploadResponse = await fetch("https://api.ilovepdf.com/v1/upload", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: uploadForm as any,
    });
    const uploadText = await uploadResponse.text();
    console.log("Upload response:", uploadResponse.status, uploadText);
    if (!uploadResponse.ok) throw new Error(uploadText);
    const uploadData = JSON.parse(uploadText);
    const serverFilename = uploadData.server_filename;

    // Step 3: Process the task
    const gravityMap: { [key: string]: string } = {
      middle: "center",
      "top-left": "top-left",
      "top-right": "top-right",
      "middle-left": "left",
      "middle-right": "right",
      "bottom-left": "bottom-left",
      "bottom-right": "bottom-right",
    };
    const processForm = new FormData();
    processForm.append("task", task);
    processForm.append("server_filename", serverFilename);
    processForm.append("text", watermark_text);
    processForm.append("transparency", String(Math.round((1 - Number(opacity)) * 100)));
    processForm.append("font_color", font_color?.replace("#", ""));
    processForm.append("font_size", font_size);
    processForm.append("rotation", rotation);
    processForm.append("position", gravityMap[position || "middle"] || "center");
    const processResponse = await fetch("https://api.ilovepdf.com/v1/process", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: processForm as any,
    });
    const processText = await processResponse.text();
    console.log("Process response:", processResponse.status, processText);
    if (!processResponse.ok) throw new Error(processText);
    const processData = JSON.parse(processText);

    // Step 4: Download the result
    const downloadResponse = await fetch(`https://api.ilovepdf.com/v1/download/${task}`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });
    const downloadText = await downloadResponse.text();
    console.log("Download response:", downloadResponse.status, downloadText);
    if (!downloadResponse.ok) throw new Error(downloadText);
    const fileBuffer = await downloadResponse.arrayBuffer();

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
    bodyParser: false,
  },
};