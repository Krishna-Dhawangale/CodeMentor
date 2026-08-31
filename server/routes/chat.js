const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { CHAT_SYSTEM_PROMPT } = require('../prompts/chatPrompt');

// ── Mock responses for when no API key is set ─────────────────────────────────
const MOCK_RESPONSES = {
  default: `## 💡 What it is
A for loop is a way to make your computer repeat a set of instructions a specific number of times without you having to write them out over and over.

## 🌍 Real-world analogy
Imagine you're stamping 10 envelopes. Instead of stamping each one separately in your head, you just say "stamp the next envelope" and repeat that action 10 times. A for loop does exactly that — it repeats an action a set number of times automatically.

## 💻 Quick example
\`\`\`javascript
// This loop prints a greeting 5 times
for (let i = 0; i < 5; i++) {
  console.log("Hello, world! This is message #" + i);
}
\`\`\`

## ⚠️ Common beginner mistake
Many beginners accidentally write \`i <= 5\` instead of \`i < 5\` when they want exactly 5 repetitions, which causes the loop to run 6 times instead. Always double-check your stopping condition — picture the loop running step by step in your head.`,
};

// ── Route handler ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Please type a question before sending!" });
  }

  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';

  // ── Use mock if no API key ─────────────────────────────────────────────────
  if (!hasApiKey) {
    console.log('[chat] Using mock response (no API key)');
    await new Promise(r => setTimeout(r, 800)); // simulate latency
    return res.json({ content: MOCK_RESPONSES.default, mock: true });
  }

  // ── Real Gemini call ───────────────────────────────────────────────────────
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: CHAT_SYSTEM_PROMPT,
    });

    // Convert message history to Gemini format
    // Gemini uses 'user' and 'model' roles (not 'assistant')
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return res.json({ content: text });
  } catch (err) {
    console.error('[chat] Gemini API error:', err.message);
    if (err.message?.includes('API_KEY')) {
      return res.status(401).json({ error: "The AI service couldn't be reached — the API key may be invalid." });
    }
    return res.status(500).json({ error: "The AI service is temporarily unavailable. Please try again in a moment." });
  }
});

module.exports = router;
