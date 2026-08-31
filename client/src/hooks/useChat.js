import { useState, useCallback } from 'react';
import { sendChatMessage } from '../utils/api';

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `## 👋 Hi there! I'm CodeMentor.

I'm here to explain any programming concept in plain, friendly English — no jargon, no confusion.

Try asking me something like:
- *"What is a variable?"*
- *"Explain loops like I'm new to this"*
- *"What is a function and why do I need one?"*

What would you like to learn today?`,
      isWelcome: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      // Only send non-welcome messages to the API
      const apiMessages = updatedMessages.filter(m => !m.isWelcome);
      const data = await sendChatMessage(apiMessages);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        mock: data.mock,
      }]);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
      // Remove the user message if we couldn't get a response
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const clearChat = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: `## 👋 Hi there! I'm CodeMentor.\n\nI'm here to explain any programming concept in plain, friendly English — no jargon, no confusion.\n\nTry asking me something like:\n- *"What is a variable?"*\n- *"Explain loops like I'm new to this"*\n- *"What is a function and why do I need one?"*\n\nWhat would you like to learn today?`,
      isWelcome: true,
    }]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}
