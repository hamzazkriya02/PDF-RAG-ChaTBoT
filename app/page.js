"use client";

import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
     const data = await response.json();
if (!response.ok) {
  throw new Error(data.message || "Upload failed");
}

localStorage.setItem("activeDocId", data.docId);
localStorage.setItem("activeFileName", data.fileName);

setMessage("PDF uploaded successfully. Redirecting to chat...");
window.location.href = "/chat";
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC]">
      <Header />

      <main>
        <section className="mx-auto flex min-h-[calc(100vh-150px)] max-w-6xl items-center px-6 py-14">
          <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-[#263244] bg-[#111827] px-4 py-2 text-sm text-[#14B8A6]">
                AI Document Assistant
              </div>

              <h1 className="mb-5 text-4xl font-bold leading-tight md:text-6xl">
                Chat with your PDF using smart RAG search.
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-8 text-[#94A3B8]">
                Upload a PDF, ask questions in natural language, and get answers
                based on your document content. Built with a clean AI workflow
                for fast and focused document search.
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-[#94A3B8]">
                <span className="rounded-full border border-[#263244] px-4 py-2">
                  PDF Upload
                </span>
                <span className="rounded-full border border-[#263244] px-4 py-2">
                  RAG Pipeline
                </span>
                <span className="rounded-full border border-[#263244] px-4 py-2">
                  AI Chat
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-[#263244] bg-[#111827] p-6 shadow-2xl">
              <div className="mb-6 rounded-2xl border border-dashed border-[#263244] bg-[#172033] p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4F46E5]/20 text-3xl">
                  📄
                </div>

                <h2 className="mb-2 text-2xl font-semibold">
                  Upload your PDF
                </h2>

                <p className="mb-6 text-sm leading-6 text-[#94A3B8]">
                  Choose a PDF document and prepare it for AI-powered question
                  answering.
                </p>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full cursor-pointer rounded-xl border border-[#263244] bg-[#0B1120] p-3 text-sm text-[#94A3B8] file:mr-4 file:rounded-lg file:border-0 file:bg-[#4F46E5] file:px-4 file:py-2 file:text-white hover:file:bg-[#4338CA]"
                />

                {file && (
                  <p className="mt-4 text-sm text-[#14B8A6]">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full rounded-xl bg-[#4F46E5] px-6 py-4 font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? "Uploading PDF..." : "Upload PDF"}
              </button>

              {message && (
                <p className="mt-4 text-center text-sm text-[#94A3B8]">
                  {message}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}