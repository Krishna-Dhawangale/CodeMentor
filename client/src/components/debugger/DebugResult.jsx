import { CheckCircle, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';

// ── Diff Block ────────────────────────────────────────────────────────────────
function DiffBlock({ before, after }) {
  const beforeLines = (before || '').split('\n');
  const afterLines = (after || '').split('\n');

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-2 bg-surface-700/80 border-b border-white/10">
        <span className="text-xs text-slate-400 font-sans font-medium">Suggested Fix</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-red-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500/30 border border-red-500/50 inline-block" />
            Before
          </span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500/50 inline-block" />
            After
          </span>
        </span>
      </div>
      <div className="bg-[#12121f] overflow-x-auto">
        {beforeLines.map((line, i) => (
          <div key={`b-${i}`} className="diff-line-before flex">
            <span className="select-none px-3 py-0.5 text-red-500/50 text-xs min-w-[2.5rem] text-right border-r border-red-500/20">−</span>
            <span className="px-4 py-0.5 whitespace-pre">{line || ' '}</span>
          </div>
        ))}
        {afterLines.map((line, i) => (
          <div key={`a-${i}`} className="diff-line-after flex">
            <span className="select-none px-3 py-0.5 text-emerald-500/50 text-xs min-w-[2.5rem] text-right border-r border-emerald-500/20">+</span>
            <span className="px-4 py-0.5 whitespace-pre">{line || ' '}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Error type → color mapping ─────────────────────────────────────────────
const ERROR_TYPE_STYLES = {
  'Syntax Error':    'bg-red-500/15 border-red-500/30 text-red-300',
  'Logic Error':     'bg-orange-500/15 border-orange-500/30 text-orange-300',
  'Runtime Error':   'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
  'Type Error':      'bg-purple-500/15 border-purple-500/30 text-purple-300',
  'Name Error':      'bg-pink-500/15 border-pink-500/30 text-pink-300',
  'Index Error':     'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
  'Infinite Loop':   'bg-rose-500/15 border-rose-500/30 text-rose-300',
  'Missing Return':  'bg-amber-500/15 border-amber-500/30 text-amber-300',
  'Wrong Operator':  'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300',
  'Other':           'bg-slate-500/15 border-slate-500/30 text-slate-300',
};

// ── Error Card ────────────────────────────────────────────────────────────────
function ErrorCard({ error, index }) {
  const typeStyle = ERROR_TYPE_STYLES[error.errorType] || ERROR_TYPE_STYLES['Other'];

  return (
    <div className="glass-light p-5 animate-slide-up space-y-4" style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-red-300">Error Found</span>
            {error.errorType && (
              <span className={`px-2 py-0.5 text-xs font-semibold border rounded-full ${typeStyle}`}>
                {error.errorType}
              </span>
            )}
            {error.lineNumber && (
              <span className="px-2 py-0.5 text-xs font-mono bg-red-500/15 border border-red-500/25 text-red-400 rounded-full">
                Line {error.lineNumber}
              </span>
            )}
          </div>
          {error.problematicLine && (
            <code className="block mt-2 text-xs bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2 rounded-lg font-mono overflow-x-auto">
              {error.problematicLine}
            </code>
          )}
        </div>
      </div>

      {/* Plain-English Explanation */}
      <div>
        <p className="text-sm font-medium text-slate-300 mb-1">What's wrong?</p>
        <p className="text-sm text-slate-400 leading-relaxed">{error.explanation}</p>
      </div>

      {/* Diff */}
      {(error.beforeCode || error.afterCode) && (
        <DiffBlock before={error.beforeCode} after={error.afterCode} />
      )}

      {/* Tip */}
      {error.tip && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <Lightbulb className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-200">{error.tip}</p>
        </div>
      )}
    </div>
  );
}

// ── Success Card ──────────────────────────────────────────────────────────────
function SuccessCard({ qualityTip }) {
  return (
    <div className="glass-light p-5 animate-slide-up">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold text-emerald-300">No errors found! 🎉</p>
          <p className="text-xs text-slate-500">Your code looks good syntactically.</p>
        </div>
      </div>
      {qualityTip && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-2">
          <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-200">{qualityTip}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DebugResult({ result }) {
  if (!result) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ArrowRight className="w-3.5 h-3.5" />
        <span>Analysis complete
          {result.detectedLanguage && result.detectedLanguage !== 'auto'
            ? ` · Detected as ${result.detectedLanguage}`
            : ''}
          {result.mock ? ' · (Demo mode — add API key for real AI)' : ''}
        </span>
      </div>

      {result.hasErrors ? (
        <>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm font-medium text-red-300">
              Found {result.errors?.length ?? 0} issue{result.errors?.length !== 1 ? 's' : ''} in your code
            </span>
          </div>
          {result.errors?.map((err, i) => (
            <ErrorCard key={i} error={err} index={i} />
          ))}
        </>
      ) : (
        <SuccessCard qualityTip={result.qualityTip} />
      )}
    </div>
  );
}
