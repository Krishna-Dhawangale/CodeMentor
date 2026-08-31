import { useState, useEffect } from 'react';
import DebugPanel from './components/debugger/DebugPanel';
import ChatPanel from './components/chat/ChatPanel';
import { checkHealth } from './utils/api';
import { Bug, MessageSquare, GraduationCap, Wifi, WifiOff } from 'lucide-react';

const MODES = [
  { id: 'debug', label: 'Debug My Code', icon: Bug, color: 'brand' },
  { id: 'chat',  label: 'Explain a Concept', icon: MessageSquare, color: 'violet' },
];

export default function App() {
  const [mode, setMode] = useState('debug');
  const [aiStatus, setAiStatus] = useState(null); // null | { aiEnabled: boolean }

  useEffect(() => {
    checkHealth().then(setAiStatus).catch(() => setAiStatus({ aiEnabled: false }));
  }, []);

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* ── Nav Bar ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/8 backdrop-blur-xl bg-surface-900/70">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-900/40">
              <GraduationCap className="w-4.5 h-4.5 text-white" style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">CodeMentor</span>
              <span className="hidden sm:inline text-slate-500 text-xs ml-2">Your friendly coding guide</span>
            </div>
          </div>

          {/* AI Status pill */}
          {aiStatus !== null && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border
              ${aiStatus.aiEnabled
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/25 text-amber-400'}`}
            >
              {aiStatus.aiEnabled
                ? <><Wifi className="w-3 h-3" /> AI Ready</>
                : <><WifiOff className="w-3 h-3" /> Demo Mode</>
              }
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-6">

        {/* Hero */}
        <div className="text-center py-4 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2 tracking-tight">
            Learn to Code, Fearlessly
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Paste code to find errors, or ask any programming question — explained in everyday English.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 glass rounded-2xl gap-1">
          {MODES.map(m => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                id={`mode-${m.id}`}
                onClick={() => setMode(m.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-250
                  ${active
                    ? 'bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden">{m.id === 'debug' ? 'Debug' : 'Explain'}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="animate-fade-in">
          {mode === 'debug' ? <DebugPanel /> : <ChatPanel />}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-4 text-center">
        <p className="text-xs text-slate-600">
          CodeMentor — Powered by Gemini AI · Built for curious beginners 🎓
        </p>
      </footer>
    </div>
  );
}
