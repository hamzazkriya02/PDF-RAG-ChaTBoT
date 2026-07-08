export default function Header() {
  return (
    <header className="border-b border-[#263244] bg-[#0B1120]/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5] font-bold text-white">
            R
          </div>

          <div>
            <p className="text-lg font-semibold text-[#F8FAFC]">
              PDF RAG Chatbot
            </p>
            <p className="text-xs text-[#94A3B8]">
              AI Document Assistant
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-[#94A3B8] md:flex">
          <a href="/" className="hover:text-[#F8FAFC]">
            Home
          </a>
          <a href="/chat" className="hover:text-[#F8FAFC]">
            Chat
          </a>
          <span className="rounded-full border border-[#263244] px-4 py-2 text-[#14B8A6]">
            RAG Powered
          </span>
        </nav>
      </div>
    </header>
  );
}