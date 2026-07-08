"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [docId, setDocId] = useState("");
  const [fileName, setFileName] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Your PDF is ready. Ask a question about your document.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedDocId = localStorage.getItem("activeDocId") || "";
    const savedFileName = localStorage.getItem("activeFileName") || "";

    setDocId(savedDocId);
    setFileName(savedFileName);
  }, []);

  const handleSend = async () => {
    if (!question.trim()) return;

    if (!docId) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please upload a PDF first before asking questions.",
        },
      ]);
      return;
    }

    const currentQuestion = question;

    const userMessage = {
      role: "user",
      content: currentQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: currentQuestion,
          docId,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No answer returned.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC]">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-150px)] max-w-5xl flex-col px-6 py-10">
        <div className="mb-8">
          <p className="mb-3 inline-flex rounded-full border border-[#263244] bg-[#111827] px-4 py-2 text-sm text-[#14B8A6]">
            Document Chat
          </p>

          <h1 className="text-3xl font-bold md:text-5xl">
            Ask questions from your PDF.
          </h1>

          <p className="mt-4 max-w-2xl text-[#94A3B8]">
            Type a question below. The chatbot will answer using your uploaded
            PDF and the stored RAG context.
          </p>

          {fileName && (
            <p className="mt-3 text-sm text-[#14B8A6]">
              Active PDF: {fileName}
            </p>
          )}
        </div>

        <div className="flex flex-1 flex-col rounded-3xl border border-[#263244] bg-[#111827]">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-auto bg-[#4F46E5] text-white"
                    : "bg-[#172033] text-[#F8FAFC]"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[85%] rounded-2xl bg-[#172033] px-5 py-4 text-sm text-[#94A3B8]">
                Thinking...
              </div>
            )}
          </div>

          <div className="border-t border-[#263244] p-4">
            <div className="flex gap-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask something about your PDF..."
                className="flex-1 rounded-xl border border-[#263244] bg-[#0B1120] px-4 py-3 text-sm text-[#F8FAFC] outline-none placeholder:text-[#94A3B8]"
              />

              <button
                onClick={handleSend}
                disabled={isLoading}
                className="rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4338CA] disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}