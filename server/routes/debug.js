const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { DEBUG_SYSTEM_PROMPT } = require('../prompts/debugPrompt');

// ── Mock response for when no API key is set ──────────────────────────────────
function getMockDebugResponse(code, language) {
  const lines = code.split('\n');
  const hasObviousIssue = code.includes('(') && !code.includes(')') ||
    code.includes('{') && (code.match(/\{/g) || []).length > (code.match(/\}/g) || []).length;

  if (hasObviousIssue) {
    return {
      hasErrors: true,
      errors: [{
        lineNumber: lines.length,
        problematicLine: lines[lines.length - 1],
        explanation: "It looks like you opened a bracket or parenthesis but never closed it. Think of brackets like doors — every door you open needs to be closed when you're done.",
        beforeCode: code,
        afterCode: code + '\n}',
        tip: "A good habit: whenever you type an opening bracket { or (, immediately type the closing one ) or } before filling in the middle."
      }]
    };
  }

  return {
    hasErrors: false,
    qualityTip: "Great job — your code looks clean! 🎉 As you grow, try adding short comments above each function explaining what it does, so future-you (and teammates) will thank you."
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { code, language = 'auto' } = req.body;

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ error: "Please paste some code before clicking Analyze!" });
  }

  const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';

  // ── Use mock if no API key ─────────────────────────────────────────────────
  if (!hasApiKey) {
    console.log('[debug] Using mock response (no API key)');
    return res.json({ ...getMockDebugResponse(code, language), mock: true });
  }

  // ── Real Gemini call ───────────────────────────────────────────────────────
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: DEBUG_SYSTEM_PROMPT,
    });

    const userPrompt = `Please analyze this ${language === 'auto' ? '' : language + ' '}code for syntax errors:\n\n\`\`\`${language === 'auto' ? '' : language}\n${code}\n\`\`\``;

    const result = await model.generateContent(userPrompt);
    const text = result.response.text().trim();

    // Strip markdown fences if Gemini adds them despite instructions
    const jsonText = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      console.error('[debug] Gemini returned non-JSON:', text);
      return res.status(500).json({ error: "We had trouble reading the AI's response. Please try again." });
    }

    return res.json(parsed);
  } catch (err) {
    console.error('[debug] Gemini API error:', err.message);
    if (err.message?.includes('API_KEY')) {
      return res.status(401).json({ error: "The AI service couldn't be reached — the API key may be invalid. Check your .env file." });
    }
    return res.status(500).json({ error: "The AI service is temporarily unavailable. Please try again in a moment." });
  }
});

module.exports = router;
