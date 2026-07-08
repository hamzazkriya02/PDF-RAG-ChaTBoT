export async function embedDocuments(chunks) {
  const apiKey = process.env.GOOGLE_API_KEY;

  const vectors = [];

  for (const chunk of chunks) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: {
            parts: [{ text: chunk }],
          },
          outputDimensionality: 768,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("GEMINI EMBEDDING API ERROR:", data);
      throw new Error(data?.error?.message || "Gemini embedding request failed.");
    }

    const values = data?.embedding?.values;

    if (!values || values.length === 0) {
      console.error("EMPTY EMBEDDING RESPONSE:", data);
      throw new Error("Gemini returned an empty embedding.");
    }

    vectors.push(values);
  }

  console.log("DEBUG embeddings.js - vector[0] length:", vectors?.[0]?.length);

  return vectors;
}