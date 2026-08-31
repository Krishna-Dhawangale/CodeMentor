import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

/**
 * Send code to the debugger endpoint.
 * @param {string} code
 * @param {string} language
 */
export async function analyzeCode(code, language) {
  const { data } = await api.post('/debug', { code, language });
  return data;
}

/**
 * Send a chat message with conversation history.
 * @param {{ role: 'user' | 'assistant', content: string }[]} messages
 */
export async function sendChatMessage(messages) {
  const { data } = await api.post('/chat', { messages });
  return data;
}

/**
 * Check server health and whether AI is enabled.
 */
export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}
