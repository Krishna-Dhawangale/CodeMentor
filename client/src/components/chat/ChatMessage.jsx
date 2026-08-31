import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2 animate-slide-up">
        <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-sm bg-gradient-to-br from-brand-600 to-violet-600 text-white text-sm leading-relaxed shadow-lg shadow-brand-900/20">
          {message.content}
        </div>
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-brand-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 animate-slide-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500/30 to-violet-500/30 border border-brand-500/30 flex items-center justify-center mt-0.5">
        <Bot className="w-4 h-4 text-brand-400" />
      </div>
      <div className="flex-1 min-w-0 glass-light px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="prose-chat">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const isBlock = !inline;
                if (isBlock) {
                  return (
                    <pre className="!bg-[#12121f] !border !border-brand-500/20 !rounded-xl !p-4 !overflow-x-auto !my-3">
                      <code className="!text-sm !font-mono !text-slate-200" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                }
                return (
                  <code className="bg-brand-500/15 border border-brand-500/20 px-1.5 py-0.5 rounded text-brand-200 font-mono text-[0.85em]" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {message.mock && (
          <p className="text-xs text-slate-600 mt-2 pt-2 border-t border-white/5">
            Demo response — add a Gemini API key for real AI answers
          </p>
        )}
      </div>
    </div>
  );
}
