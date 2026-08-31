import { useRef } from 'react';
import { Loader2, Sparkles, Trash2, Bug } from 'lucide-react';
import CodeEditor from './CodeEditor';
import LanguageSelector from './LanguageSelector';
import DebugResult from './DebugResult';
import { useDebugger } from '../../hooks/useDebugger';
import { detectLanguage } from '../../utils/languageDetect';

export default function DebugPanel() {
  const { code, setCode, language, setLanguage, result, loading, error, analyze, reset } = useDebugger();
  const resultRef = useRef(null);

  const handleAnalyze = async () => {
    await analyze();
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  // Determine actual language for CodeMirror
  const editorLang = language === 'auto' ? detectLanguage(code) : language;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
          <Bug className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Debug My Code</h2>
          <p className="text-xs text-slate-500">Paste your code and get a plain-English explanation of any errors.</p>
        </div>
      </div>

      {/* Editor Controls */}
      <div className="glass p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <LanguageSelector value={language} onChange={setLanguage} />
          {code && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        <CodeEditor value={code} onChange={setCode} language={editorLang} />

        <button
          id="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || !code.trim()}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm
                     bg-gradient-to-r from-brand-600 to-violet-600 text-white
                     hover:from-brand-500 hover:to-violet-500
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg shadow-brand-900/30
                     active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing your code...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze My Code
            </>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-300 animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      <div ref={resultRef}>
        {loading && !result && (
          <div className="space-y-3 animate-fade-in">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl shimmer" style={{ opacity: 1 - i * 0.2 }} />
            ))}
          </div>
        )}
        <DebugResult result={result} />
      </div>
    </div>
  );
}
