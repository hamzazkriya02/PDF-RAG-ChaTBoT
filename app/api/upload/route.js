import { parsePDF } from "@/lib/pdfParser";
import { chunkText } from "@/utils/chunkText";
import { pineconeIndex } from "@/lib/pinecone";
import { embedDocuments } from "@/lib/embeddings";

export const runtime = "nodejs";

function createDocId(fileName) {
  const cleanName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${cleanName}-${Date.now()}`;
}

function isQuotaError(error) {
  return (
    error?.status === 429 &&
    (
      error?.code === "insufficient_quota" ||
      error?.type === "insufficient_quota" ||
      error?.error?.code === "insufficient_quota" ||
      error?.error?.type === "insufficient_quota" ||
      error?.message?.toLowerCase()?.includes("exceeded your current quota")
    )
  );
}

function isRateLimitError(error) {
  return (
    error?.status === 429 ||
    error?.lc_error_code === "MODEL_RATE_LIMIT" ||
    error?.rateLimitType
  );
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        {
          success: false,
          message: "No PDF file uploaded.",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        {
          success: false,
          message: "Only PDF files are allowed.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const text = await parsePDF(buffer);

    console.log("DEBUG - text length:", text?.length);

    if (!text || !text.trim()) {
      return Response.json(
        {
          success: false,
          message:
            "This PDF does not contain readable text. Please upload a text-based PDF.",
        },
        { status: 400 }
      );
    }

    const chunks = chunkText(text);

    console.log("DEBUG - chunks count:", chunks?.length);
    console.log("DEBUG - first chunk preview:", chunks?.[0]?.slice(0, 100));

    if (!chunks || chunks.length === 0) {
      return Response.json(
        {
          success: false,
          message: "PDF text was extracted, but no valid chunks were created.",
        },
        { status: 400 }
      );
    }

    const docId = createDocId(file.name);

    let vectors;

    try {
      vectors = await embedDocuments(chunks);
      console.log("DEBUG - vectors count:", vectors?.length);
      console.log("DEBUG - first vector length:", vectors?.[0]?.length);
    } catch (error) {
      console.error("EMBEDDING ERROR:", error);

      if (isQuotaError(error)) {
        return Response.json(
          {
            success: false,
            errorType: "OPENAI_QUOTA_EXCEEDED",
            message:
              "Your OpenAI API quota is finished or billing is not active. Please add API credits/billing or use a local model like Ollama for testing.",
          },
          { status: 402 }
        );
      }

      if (isRateLimitError(error)) {
        return Response.json(
          {
            success: false,
            errorType: "OPENAI_RATE_LIMIT",
            message:
              "OpenAI rate limit reached. Please wait and try again, or reduce the PDF size/chunks.",
          },
          { status: 429 }
        );
      }

      return Response.json(
        {
          success: false,
          errorType: "EMBEDDING_FAILED",
          message: error.message || "Failed to create embeddings.",
        },
        { status: 500 }
      );
    }

    if (!vectors || vectors.length !== chunks.length) {
      console.log("DEBUG - MISMATCH: vectors=", vectors?.length, "chunks=", chunks?.length);
      return Response.json(
        {
          success: false,
          message: "Embedding count does not match chunk count.",
        },
        { status: 500 }
      );
    }

    const records = vectors.map((values, index) => ({
      id: `${docId}-chunk-${index}`,
      values,
      metadata: {
        docId,
        fileName: file.name,
        chunkIndex: index,
        text: chunks[index],
      },
    }));

    console.log("DEBUG - records count before upsert:", records?.length);

    try {
      await pineconeIndex.upsert(records);
    } catch (error) {
      console.error("PINECONE UPSERT ERROR:", error);

      return Response.json(
        {
          success: false,
          errorType: "PINECONE_FAILED",
          message: error.message || "Failed to store PDF data in Pinecone.",
        },
        { status: 500 }
      );
    }

    console.log("PDF Name:", file.name);
    console.log("Extracted text length:", text.length);
    console.log("Total chunks:", chunks.length);
    console.log("Stored in Pinecone:", records.length);

    return Response.json({
      success: true,
      message: "PDF uploaded, embedded, and stored successfully.",
      docId,
      fileName: file.name,
      chunksCount: chunks.length,
    });
  } catch (error) {
    console.error("UPLOAD ROUTE ERROR:", error);

    return Response.json(
      {
        success: false,
        errorType: "UPLOAD_FAILED",
        message: error.message || "Failed to process PDF.",
      },
      { status: 500 }
    );
  }
}