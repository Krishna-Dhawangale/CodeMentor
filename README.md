# 🎓 CodeMentor — Your Friendly AI Coding Mentor

CodeMentor is a beginner-friendly chatbot that helps you:
- **Debug your code** — paste code, get a plain-English error explanation + fix
- **Understand concepts** — ask anything, get a clear definition, analogy, example, and tip

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) *(optional — the app works in demo mode without one)*

### 2. Clone & Install

```bash
cd codementor

# Install all dependencies at once
npm run install:all
```

### 3. Set Up Your API Key *(optional but recommended)*

```bash
# Create the server environment file
copy .env.example server\.env
```

Open `server/.env` and replace `your_gemini_api_key_here` with your real key:

```
GEMINI_API_KEY=AIza...your_key_here...
PORT=3001
```

> **No key?** The app runs in **Demo Mode** with pre-written sample responses — great for reviewing the UI.

### 4. Run the App

```bash
npm run dev
```

This starts both the backend (port 3001) and the frontend (port 5173) together.

Open your browser at **http://localhost:5173** 🎉

---

## 🗂 Project Structure

```
codementor/
├── server/               # Node.js + Express backend
│   ├── index.js          # Server entry point
│   ├── routes/
│   │   ├── debug.js      # POST /api/debug — code analysis
│   │   └── chat.js       # POST /api/chat — concept explainer
│   └── prompts/
│       ├── debugPrompt.js   # Gemini system prompt for debugging
│       └── chatPrompt.js    # Gemini system prompt for chat
│
└── client/               # React + Tailwind frontend (Vite)
    └── src/
        ├── App.jsx        # Root component + mode toggle
        ├── components/
        │   ├── debugger/  # Code editor, result display
        │   └── chat/      # Chat bubbles, input, panel
        ├── hooks/         # useDebugger, useChat
        └── utils/         # API helpers, language detector
```

---

## ✨ Features

### Debug My Code
- **CodeMirror 6 editor** with syntax highlighting for JS, Python, Java, C++, HTML/CSS
- **Auto language detection** — no need to manually select most of the time
- **Plain-English error cards**: exact line number, what's wrong, before/after fix, and a "why this happens" tip
- **No errors?** Get a code quality tip instead

### Explain a Concept
- **4-part explanations**: definition → real-world analogy → runnable code example → common mistake
- **Conversation memory**: follow-up questions ("show that in Python") work naturally
- **Quick prompt chips**: tap a suggestion to get started instantly
- **Markdown rendering** with syntax-highlighted code blocks

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | No (uses demo mode) | Google Gemini API key |
| `PORT` | No (default: 3001) | Port for the Express server |

---

## 🛠 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both server + client (recommended) |
| `npm run dev:server` | Start server only |
| `npm run dev:client` | Start client only |
| `npm run build` | Build client for production |
| `npm run install:all` | Install all dependencies |

---

## 📝 Known Limitations

- **Demo mode responses** are static and cover only a subset of questions (JS for-loop). Add a Gemini API key for full AI-powered responses.
- **Language detection** is heuristic-based — complex polyglot snippets may be misidentified. Use the manual selector when in doubt.
- **No auth** — this is an MVP; do not expose the server publicly without adding rate limiting and authentication.
- **Context window** — very long chat conversations may exceed Gemini's token limit. The conversation is cleared when this happens on the client side.

---

## 🙏 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, CodeMirror 6, react-markdown
- **Backend**: Node.js, Express, `@google/generative-ai` SDK
- **AI**: Google Gemini 1.5 Flash
