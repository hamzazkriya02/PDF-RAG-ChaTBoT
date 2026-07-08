import { pineconeIndex } from './pinecone';

async function embedQuery(question) {
  const apiKey = process.env.GOOGLE_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: {
          parts: [{ text: question }],
        },
        outputDimensionality: 768,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data?.embedding?.values) {
    console.error("GEMINI QUERY EMBEDDING ERROR:", data);
    throw new Error("Failed to embed the question.");
  }

  return data.embedding.values;
}

export async function queryRAG(question, docId) {
  const queryVector = await embedQuery(question);

  const results = await pineconeIndex.query({
    vector: queryVector,
    topK: 5,
    includeMetadata: true,
    filter: docId ? { docId: { $eq: docId } } : undefined,
  });

  const context = results.matches.map((m) => m.metadata.text).join("\n\n");

  const apiKey = process.env.GOOGLE_API_KEY;
  const chatResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Answer the question using only the context below. If the answer isn't in the context, say you don't know.\n\nContext: ${context}\n\nQuestion: ${question}`,
              },
            ],
          },
        ],
      }),
    }
  );

  const chatData = await chatResponse.json();

  if (!chatResponse.ok) {
    console.error("GEMINI CHAT ERROR:", chatData);
    throw new Error(chatData?.error?.message || "Failed to generate answer.");
  }

  const answer = chatData?.candidates?.[0]?.content?.parts?.[0]?.text;

  return answer || "Sorry, I couldn't generate an answer.";
}