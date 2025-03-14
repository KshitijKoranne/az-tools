declare module "/pdfkit.standalone.js" {
    interface PDFDocumentOptions {
      size?: [number, number];
    }
  
    class PDFDocument {
      constructor(options?: PDFDocumentOptions);
      on(event: "data", callback: (chunk: Buffer) => void): void;
      on(event: "end", callback: () => void): void;
      font(font: string): this;
      fontSize(size: number): this;
      fillColor(color: [number, number, number], opacity?: number): this;
      save(): this;
      translate(x: number, y: number): this;
      rotate(angle: number, options?: { origin: [number, number] }): this;
      text(text: string, x: number, y: number, options?: { align?: string }): this;
      restore(): this;
      addPage(options?: PDFDocumentOptions): this;
      end(): void;
    }
  
    export default PDFDocument;
  }