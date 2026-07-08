import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function parsePDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text || "";
}