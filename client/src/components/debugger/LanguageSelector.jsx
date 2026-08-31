import { LANGUAGES } from '../../utils/languageDetect';

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-xs font-medium text-slate-400 whitespace-nowrap">
        Language:
      </label>
      <select
        id="language-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-surface-700 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-1.5
                   focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50
                   transition-all cursor-pointer hover:border-brand-500/30"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.value} value={lang.value}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
}
