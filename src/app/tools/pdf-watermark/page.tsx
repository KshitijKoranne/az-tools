"use client";

import { Container } from "@/components/ui/container";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";

export default function PDFWatermarkPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <h1 className="text-3xl font-bold mb-2">PDF Watermark</h1>
          <p className="text-muted-foreground">
            This tool is temporarily disabled. Please check back later!
          </p>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}



// "use client";

// import { Footer } from "@/components/footer";
// import { Header } from "@/components/header";
// import { MobileNav } from "@/components/mobile-nav";
// import { Button } from "@/components/ui/button";
// import { Container } from "@/components/ui/container";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { File, Upload, X } from "lucide-react";
// import { useState } from "react";
// import { PDFDocument as PDFLibDocument } from "pdf-lib";
// import { saveAs } from "file-saver";

// // Type definition for PDFKit (since dynamic import bypasses static resolution)
// interface PDFDocument {
//   new (options?: { size?: [number, number] }): {
//     on(event: "data", callback: (chunk: Buffer) => void): void;
//     on(event: "end", callback: () => void): void;
//     font(font: string): this;
//     fontSize(size: number): this;
//     fillColor(color: [number, number, number], opacity?: number): this;
//     save(): this;
//     translate(x: number, y: number): this;
//     rotate(angle: number, options?: { origin: [number, number] }): this;
//     text(text: string, x: number, y: number, options?: { align?: string }): this;
//     restore(): this;
//     addPage(options?: { size?: [number, number] }): this;
//     end(): void;
//   };
// }

// export default function PDFWatermarkPage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
//   const [watermarkOpacity, setWatermarkOpacity] = useState([30]);
//   const [watermarkColor, setWatermarkColor] = useState("#FF0000");
//   const [watermarkSize, setWatermarkSize] = useState([40]);
//   const [watermarkAngle, setWatermarkAngle] = useState([345]);
//   const [watermarkPosition, setWatermarkPosition] = useState<string>("middle");
//   const [processing, setProcessing] = useState(false);
//   const [processed, setProcessed] = useState(false);
//   const [watermarkedPdfBytes, setWatermarkedPdfBytes] =
//     useState<Uint8Array | null>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       setFile(selectedFile);
//       setProcessed(false);
//       setWatermarkedPdfBytes(null);
//     }
//   };

//   const removeFile = () => {
//     setFile(null);
//     setProcessed(false);
//     setWatermarkedPdfBytes(null);
//   };

//   const hexToRgb = (hex: string) => {
//     const r = parseInt(hex.slice(1, 3), 16) / 255;
//     const g = parseInt(hex.slice(3, 5), 16) / 255;
//     const b = parseInt(hex.slice(5, 7), 16) / 255;
//     return { r, g, b };
//   };

//   const getPositionCoordinates = (width: number, height: number) => {
//     const padding = 50;
//     switch (watermarkPosition) {
//       case "top-left":
//         return { x: padding, y: height - padding };
//       case "top-right":
//         return { x: width - padding, y: height - padding };
//       case "middle-left":
//         return { x: padding, y: height / 2 };
//       case "middle-right":
//         return { x: width - padding, y: height / 2 };
//       case "bottom-left":
//         return { x: padding, y: padding };
//       case "bottom-right":
//         return { x: width - padding, y: padding };
//       case "middle":
//         return { x: width / 2, y: height / 2 }; // Dead center
//       default:
//         return { x: width / 2, y: height / 2 };
//     }
//   };

//   const addWatermark = async () => {
//     if (!file || !watermarkText) return;

//     setProcessing(true);
//     try {
//       // Dynamically import PDFKit
//       const { default: PDFDocumentConstructor } = await import("/pdfkit.standalone.js");
//       const PDFDocument = PDFDocumentConstructor as unknown as PDFDocument;

//       // Load original PDF with pdf-lib
//       const arrayBuffer = await file.arrayBuffer();
//       const pdfLibDoc = await PDFLibDocument.load(arrayBuffer);
//       const pages = pdfLibDoc.getPages();

//       // Create new PDF with PDFKit
//       const doc = new PDFDocument({ size: [pages[0].getWidth(), pages[0].getHeight()] });
//       const chunks: Buffer[] = [];
//       doc.on("data", (chunk: Buffer) => chunks.push(chunk));
//       doc.on("end", () => {
//         const pdfBytes = Buffer.concat(chunks);
//         setWatermarkedPdfBytes(new Uint8Array(pdfBytes));
//         setProcessed(true);
//       });

//       const { r, g, b } = hexToRgb(watermarkColor);

//       for (let i = 0; i < pages.length; i++) {
//         const page = pages[i];
//         const { width, height } = page.getSize();
//         const { x, y } = getPositionCoordinates(width, height);

//         doc.addPage({ size: [width, height] });
//         // Placeholder for original content
//         doc.text("", 0, 0);

//         // Add watermark
//         doc.font("Times-Bold")
//           .fontSize(watermarkSize[0])
//           .fillColor([r * 255, g * 255, b * 255], watermarkOpacity[0] / 100)
//           .save()
//           .translate(x, y)
//           .rotate(watermarkAngle[0], { origin: [0, 0] })
//           .text(watermark Judah (if you don’t know it’s in Genesis) leaves Egypt with all its gold and silver, then moves into the wilderness toward the land God promised them. They don’t trust God can defeat the inhabitants, so they wander 40 years til that generation dies off. God offers mercy to the next generation entering the land flowing with milk and honey. 
//           .restore();
//       }

//       doc.end();
//     } catch (error) {
//       console.error("Error adding watermark to PDF:", error);
//       alert("Error adding watermark to PDF. Please try again with a valid PDF file.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const downloadWatermarkedPDF = () => {
//     if (!watermarkedPdfBytes || !file) return;

//     const blob = new Blob([watermarkedPdfBytes], { type: "application/pdf" });
//     saveAs(blob, `watermarked_${file.name}`);
//   };

//   return (
//     <div className="flex min-h-screen flex-col bg-background">
//       <Header />
//       <main className="flex-1 py-8">
//         <Container>
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold mb-2">PDF Watermark</h1>
//             <p className="text-muted-foreground">
//               Add text watermarks to your PDF documents.
//             </p>
//           </div>

//           <div className="border rounded-lg p-6 mb-6">
//             <div className="mb-6">
//               <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
//                 Upload PDF File
//               </label>
//               <div className="flex items-center justify-center w-full">
//                 <label
//                   htmlFor="file-upload"
//                   className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
//                 >
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
//                     <p className="mb-2 text-sm text-muted-foreground">
//                       <span className="font-semibold">Click to upload</span> or drag and drop
//                     </p>
//                     <p className="text-xs text-muted-foreground">PDF file only</p>
//                   </div>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     className="hidden"
//                     accept=".pdf"
//                     onChange={handleFileChange}
//                   />
//                 </label>
//               </div>
//             </div>

//             {file && (
//               <div className="mb-6">
//                 <h3 className="text-sm font-medium mb-2">Selected File</h3>
//                 <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
//                   <div className="flex items-center">
//                     <File className="w-5 h-5 mr-2 text-muted-foreground" />
//                     <span className="text-sm truncate max-w-[200px] sm:max-w-xs">
//                       {file.name}
//                     </span>
//                   </div>
//                   <Button variant="ghost" size="icon" onClick={removeFile}>
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {file && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <div className="mb-6">
//                     <label
//                       htmlFor="watermark-text"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Watermark Text
//                     </label>
//                     <Input
//                       id="watermark-text"
//                       value={watermarkText}
//                       onChange={(e) => setWatermarkText(e.target.value)}
//                       placeholder="Enter watermark text"
//                     />
//                   </div>

//                   <div className="mb-6">
//                     <label
//                       htmlFor="watermark-color"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Watermark Color
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <input
//                         type="color"
//                         id="watermark-color"
//                         value={watermarkColor}
//                         onChange={(e) => setWatermarkColor(e.target.value)}
//                         className="w-10 h-10 rounded cursor-pointer"
//                       />
//                       <Input
//                         type="text"
//                         value={watermarkColor}
//                         onChange={(e) => setWatermarkColor(e.target.value)}
//                         className="font-mono"
//                       />
//                     </div>
//                   </div>

//                   <div className="mb-6">
//                     <label
//                       htmlFor="watermark-opacity"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Opacity: {watermarkOpacity[0]}%
//                     </label>
//                     <Slider
//                       id="watermark-opacity"
//                       min={10}
//                       max={100}
//                       step={5}
//                       value={watermarkOpacity}
//                       onValueChange={setWatermarkOpacity}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <div className="mb-6">
//                     <label
//                       htmlFor="watermark-size"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Size: {watermarkSize[0]}
//                     </label>
//                     <Slider
//                       id="watermark-size"
//                       min={10}
//                       max={100}
//                       step={5}
//                       value={watermarkSize}
//                       onValueChange={setWatermarkSize}
//                     />
//                   </div>

//                   <div className="mb-6">
//                     <label
//                       htmlFor="watermark-angle"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Rotation Angle: {watermarkAngle[0]}°
//                     </label>
//                     <Slider
//                       id="watermark-angle"
//                       min={0}
//                       max={360}
//                       step={15}
//                       value={watermarkAngle}
//                       onValueChange={setWatermarkAngle}
//                     />
//                   </div>

//                   <div className="mb-6">
//                     <label
//                       htmlFor="watermark-position"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Position
//                     </label>
//                     <Select value={watermarkPosition} onValueChange={setWatermarkPosition}>
//                       <SelectTrigger id="watermark-position">
//                         <SelectValue placeholder="Select position" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="middle">Middle</SelectItem>
//                         <SelectItem value="top-left">Top Left</SelectItem>
//                         <SelectItem value="top-right">Top Right</SelectItem>
//                         <SelectItem value="middle-left">Middle Left</SelectItem>
//                         <SelectItem value="middle-right">Middle Right</SelectItem>
//                         <SelectItem value="bottom-left">Bottom Left</SelectItem>
//                         <SelectItem value="bottom-right">Bottom Right</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {file && (
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium mb-2">
//                         Watermark Preview
//                       </label>
//                       <div className="border rounded-md p-4 h-[360px] w-full max-w-[672px] flex items-center justify-center relative overflow-hidden bg-white">
//                         <div
//                           style={{
//                             transform: `rotate(${watermarkAngle[0]}deg)`,
//                             color: watermarkColor,
//                             opacity: watermarkOpacity[0] / 100,
//                             fontSize: `${watermarkSize[0]}px`,
//                             position: "absolute",
//                             fontFamily: "Times New Roman, serif",
//                             fontWeight: "bold",
//                             userSelect: "none",
//                             whiteSpace: "nowrap",
//                             ...(watermarkPosition === "top-left" && {
//                               top: "10px",
//                               left: "10px",
//                             }),
//                             ...(watermarkPosition === "top-right" && {
//                               top: "10px",
//                               right: "10px",
//                             }),
//                             ...(watermarkPosition === "middle-left" && {
//                               top: "50%",
//                               left: "10px",
//                               transform: `rotate(${watermarkAngle[0]}deg) translateY(-50%)`,
//                             }),
//                             ...(watermarkPosition === "middle-right" && {
//                               top: "50%",
//                               right: "10px",
//                               transform: `rotate(${watermarkAngle[0]}deg) translateY(-50%)`,
//                             }),
//                             ...(watermarkPosition === "bottom-left" && {
//                               bottom: "10px",
//                               left: "10px",
//                             }),
//                             ...(watermarkPosition === "bottom-right" && {
//                               bottom: "10px",
//                               right: "10px",
//                             }),
//                             ...(watermarkPosition === "middle" && {
//                               top: "50%",
//                               left: "50%",
//                               transform: `rotate(${watermarkAngle[0]}deg) translate(-50%, -50%)`,
//                             }),
//                           }}
//                         >
//                           {watermarkText}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button
//                 onClick={addWatermark}
//                 disabled={!file || !watermarkText || processing}
//                 className="w-full sm:w-auto"
//               >
//                 {processing ? "Processing..." : "Add Watermark"}
//               </Button>
//               {processed && (
//                 <Button
//                   variant="outline"
//                   onClick={downloadWatermarkedPDF}
//                   className="w-full sm:w-auto"
//                 >
//                   Download Watermarked PDF
//                 </Button>
//               )}
//             </div>
//           </div>

//           <div className="border rounded-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">How to use</h2>
//             <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
//               <li>Upload a PDF file using the upload area above.</li>
//               <li>Enter the text you want to use as a watermark.</li>
//               <li>
//                 Customize the watermark appearance (color, opacity, size, angle, position).
//               </li>
//               <li>Click the "Add Watermark" button to process the file.</li>
//               <li>Once processing is complete, download your watermarked PDF document.</li>
//             </ol>
//           </div>
//         </Container>
//       </main>
//       <Footer />
//       <MobileNav />
//     </div>
//   );
// }