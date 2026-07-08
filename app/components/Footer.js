export default function Footer() {
  return (
    <footer className="border-t border-[#263244] bg-[#0B1120]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-[#94A3B8] md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} PDF RAG Chatbot. Built for smart document search.
        </p>

        <div className="flex gap-4">
          <span>Next.js</span>
          <span>LangChain</span>
          <span>Pinecone</span>
          <span>OpenAI</span>
        </div>
      </div>
    </footer>
  );
}