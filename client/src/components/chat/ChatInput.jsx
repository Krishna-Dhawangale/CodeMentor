import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const QUICK_PROMPTS = [
  "What is a variable?",
  "Explain a for loop",
  "What is a function?",
  "What is recursion?",
  "Explain closures",
];

export default function ChatInput({ onSend, loading, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [text]);

  return (
    <div className="space-y-2">
      {/* Quick prompts */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map(prompt => (
          <button
            key={prompt}
            onClick={() => { setText(prompt); textareaRef.current?.focus(); }}
            className="px-2.5 py-1 text-xs rounded-full border border-white/10 bg-white/5
                       text-slate-400 hover:text-slate-200 hover:border-brand-500/40 hover:bg-brand-500/10
                       transition-all duration-150 whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2 glass p-2 rounded-2xl">
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about coding... (Enter to send)"
          disabled={loading || disabled}
          rows={1}
          className="flex-1 bg-transparent resize-none text-sm text-slate-200 placeholder-slate-600
                     focus:outline-none px-2 py-2 leading-relaxed max-h-36 overflow-y-auto"
        />
        <button
          id="send-btn"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                     bg-gradient-to-br from-brand-600 to-violet-600
                     hover:from-brand-500 hover:to-violet-500
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200 active:scale-95 shadow-lg shadow-brand-900/30"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      <p className="text-xs text-slate-600 text-center">Shift+Enter for a new line · Enter to send</p>
    </div>
  );
}
