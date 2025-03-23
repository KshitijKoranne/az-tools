import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable, { Fields, Files } from "formidable";
import FormData from "form-data";
import fs from "fs";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse incoming multipart form data
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
  const opacity = fields.opacity?.[0] || "30"; // Default if missing
  const font_color = fields.font_color?.[0] || "FF0000"; // Default red
  const font_size = fields.font_size?.[0] || "50"; // Default per docs
  const rotation = fields.rotation?.[0] || "0"; // Default no rotation
  const position = fields.position?.[0] || "middle"; // Default center

  if (!watermark_text) {
    return res.status(400).json({ error: "Watermark text is required" });
  }

  const publicKey = process.env.ILOVEAPI_PUBLIC_KEY;
  if (!publicKey) {
    console.error("Missing ILOVEAPI_PUBLIC_KEY environment variable");
    return res.status(500).json({ error: "Server configuration error" });
  }
  const authHeader = `Bearer ${publicKey}`;
  console.log("Auth header:", authHeader);

  try {
    // Step 1: Start a new task
    const startUrl = "https://api.ilovepdf.com/v1/start/watermark";
    console.log("Starting task with URL:", startUrl);
    const startResponse = await fetch(startUrl, {
      method: "GET",
      headers: { Authorization: authHeader },
    });
    const startText = await startResponse.text();
    console.log("Start response status:", startResponse.status, "Body:", startText);
    if (!startResponse.ok) {
      throw new Error(`Start failed: ${startText}`);
    }
    const task = startText.trim(); // Task ID as plain text
    console.log("Task ID:", task);

    // Step 2: Upload the file
    const uploadForm = new FormData();
    uploadForm.append("task", task);
    uploadForm.append("file", fs.createReadStream(file.filepath), {
      filename: file.originalFilename || "input.pdf",
    });
    const uploadResponse = await fetch("https://api.ilovepdf.com/v1/upload", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: uploadForm as any,
    });
    const uploadText = await uploadResponse.text();
    console.log("Upload response status:", uploadResponse.status, "Body:", uploadText);
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadText}`);
    }
    const uploadData = JSON.parse(uploadText);
    const serverFilename = uploadData.server_filename;
    if (!serverFilename) {
      throw new Error("Upload response missing server_filename");
    }
    console.log("Server filename:", serverFilename);

    // Step 3: Process the task with watermark parameters
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
    processForm.append("tool", "watermark"); // Explicitly set tool
    processForm.append("text", watermark_text);
    processForm.append("transparency", String(Math.round((1 - Number(opacity)) * 100))); // 0-100
    processForm.append("font_color", font_color.replace("#", ""));
    processForm.append("font_size", font_size);
    processForm.append("rotation", rotation);
    processForm.append("position", gravityMap[position] || "center");
    // Additional watermark parameters from docs
    processForm.append("font_family", "Arial"); // Default per docs
    processForm.append("font_style", "normal"); // Default
    processForm.append("layer", "above"); // Default per docs

    const processResponse = await fetch("https://api.ilovepdf.com/v1/process", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: processForm as any,
    });
    const processText = await processResponse.text();
    console.log("Process response status:", processResponse.status, "Body:", processText);
    if (!processResponse.ok) {
      throw new Error(`Process failed: ${processText}`);
    }
    const processData = JSON.parse(processText);
    if (!processData.status || processData.status !== "success") {
      throw new Error("Process did not complete successfully");
    }

    // Step 4: Download the result
    const downloadUrl = `https://api.ilovepdf.com/v1/download/${task}`;
    console.log("Downloading from:", downloadUrl);
    const downloadResponse = await fetch(downloadUrl, {
      method: "GET",
      headers: { Authorization: authHeader },
    });
    if (!downloadResponse.ok) {
      const downloadText = await downloadResponse.text();
      throw new Error(`Download failed: ${downloadText}`);
    }
    const fileBuffer = await downloadResponse.arrayBuffer();
    console.log("Download response status:", downloadResponse.status, "Size:", fileBuffer.byteLength);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=watermarked_${file.originalFilename || "output.pdf"}`);
    res.send(Buffer.from(fileBuffer));
  } catch (error) {
    console.error("API error:", error);
    let errorMessage = "Failed to process watermark";
    if (error instanceof Error && error.message.includes("rate limit")) {
      errorMessage = "API rate limit exceeded. Please try again later.";
      res.status(429); // Too Many Requests
    } else if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return res.status(500).json({ error: errorMessage });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};