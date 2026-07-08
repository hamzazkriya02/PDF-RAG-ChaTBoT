import { queryRAG } from "@/lib/ragChain";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { question, docId } = await req.json();

    if (!question) {
      return Response.json(
        { answer: "Please ask a valid question." },
        { status: 400 }
      );
    }

    if (!docId) {
      return Response.json(
        { answer: "Please upload a PDF first." },
        { status: 400 }
      );
    }

    const answer = await queryRAG(question, docId);

    return Response.json({ answer });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);

    return Response.json(
      {
        answer: error.message || "Something went wrong while answering.",
      },
      { status: 500 }
    );
  }
}