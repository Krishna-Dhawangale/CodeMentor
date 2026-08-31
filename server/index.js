require('dotenv').config();
const express = require('express');
const cors = require('cors');
const debugRouter = require('./routes/debug');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '1mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/debug', debugRouter);
app.use('/api/chat', chatRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  const hasKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({ status: 'ok', aiEnabled: hasKey });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[CodeMentor Server Error]', err);
  res.status(500).json({
    error: "Something went wrong on our end. Please try again in a moment.",
  });
});

app.listen(PORT, () => {
  const hasKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  console.log(`\n🎓 CodeMentor server running on http://localhost:${PORT}`);
  console.log(`   AI mode: ${hasKey ? '✅ Gemini API connected' : '⚠️  No API key — using mock responses'}\n`);
});
