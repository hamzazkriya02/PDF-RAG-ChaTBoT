# 📄 PDF-RAG-ChatBot

A full-stack **RAG (Retrieval Augmented Generation)** chatbot that lets users upload a PDF and ask natural language questions about it. The AI answers using only the content extracted from the uploaded document — no hallucinations, just grounded, context-aware responses.

---

## 🚀 Live Demo

🔗 **[Try it live](https://pdf-rag-chatbot-app.vercel.app/)**

---

## ✨ Features

- 📤 Drag-and-drop PDF upload
- ✂️ Automatic text extraction and chunking
- 🧠 Semantic vector embeddings (Google Gemini)
- 🔍 Fast similarity search with Pinecone vector database
- 💬 Context-aware AI chat interface
- ⚡ Built on Next.js 14 App Router

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Backend | Next.js API Routes |
| AI Model | Google Gemini (`gemini-2.5-flash`) |
| Embeddings | Google Gemini (`gemini-embedding-001`) |
| Vector Database | Pinecone (Serverless, Dense, 768-dim) |
| PDF Parsing | `pdf-parse` |
| Deployment | Vercel |

---

## 🏗️ How It Works

1. User uploads a PDF on the home page
2. Backend extracts raw text using `pdf-parse`
3. Text is split into overlapping chunks (~500 characters)
4. Each chunk is converted into a 768-dimension vector embedding using Gemini
5. Vectors are stored in Pinecone along with metadata (document ID, chunk text)
6. User asks a question on the chat page
7. The question is embedded and used to query Pinecone for the top 5 most relevant chunks
8. Gemini generates an answer using only the retrieved chunks as context
9. The answer is displayed in the chat window

---

## 📂 Folder Structure

```
pdf-rag-chatbot/
├── app/
│   ├── api/
│   │   ├── upload/route.js       ← PDF upload endpoint
│   │   └── chat/route.js         ← Chat query endpoint
│   ├── page.jsx                  ← Home page (upload UI)
│   ├── chat/page.jsx             ← Chat interface
│   └── layout.js                 ← Root layout
│
├── components/                   ← UI components
├── lib/
│   ├── pinecone.js                ← Pinecone client setup
│   ├── embeddings.js              ← Generate vector embeddings
│   ├── pdfParser.js                ← Extract text from PDF
│   └── ragChain.js                 ← Core RAG logic
│
├── utils/
│   └── chunkText.js               ← Split text into chunks
│
├── .env.local                     ← API keys (not committed)
└── package.json
```

---

## ⚙️ Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/pdf-rag-chatbot.git
cd pdf-rag-chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```
GOOGLE_API_KEY=your-gemini-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX=your-pinecone-index-name
```

- Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- Get a free Pinecone API key from [Pinecone](https://app.pinecone.io)

> ⚠️ When creating your Pinecone index, set **Dimensions = 768**, **Metric = Cosine**, **Vector type = Dense**.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Screenshots

| Upload Page | Chat Interface |
|---|---|
| <img width="1913" height="1019" alt="PDF RAG Chatbot _ Chat with your PDFs - Google Chrome 7_8_2026 8_53_37 PM" src="https://github.com/user-attachments/assets/b006b024-add8-4cc9-bafc-dc9000a81ac5" />
 | <img width="1920" height="993" alt="PDF RAG Chatbot _ Chat with your PDFs - Google Chrome 7_8_2026 8_55_39 PM" src="https://github.com/user-attachments/assets/98430430-8d73-4305-8443-8d7c25d7df7c" />
|

---

## 🛣️ Roadmap / Future Improvements

- [ ] Support multiple PDFs per session
- [ ] Chat history persistence
- [ ] Streaming responses
- [ ] Support for DOCX and TXT files

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

Built by **[Hamza Zakriya]** — feel free to connect on [LinkedIn](www.linkedin.com/in/muhammad-hamza-315hz02) or check out more projects on [GitHub](https://github.com/hamzazkriya02).
