export function chunkText(text, chunkSize = 500, overlap = 80) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const chunk = text.slice(start, start + chunkSize).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}