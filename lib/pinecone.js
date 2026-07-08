import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is missing.");
}

if (!process.env.PINECONE_INDEX) {
  throw new Error("PINECONE_INDEX is missing.");
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX);