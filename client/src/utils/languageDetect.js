/**
 * Very lightweight language auto-detector based on code patterns.
 * Returns a language string compatible with CodeMirror and our API.
 */
export function detectLanguage(code) {
  if (!code || code.trim().length < 5) return 'javascript';

  const c = code.trim();

  // Python: indentation + def/import/print
  if (/^\s*(def |class |import |from |print\(|elif |#)/.test(c)) return 'python';

  // Java: class declaration, System.out, public static
  if (/\b(public\s+class|System\.out|public\s+static\s+void\s+main)/.test(c)) return 'java';

  // C++: #include, std::, cout
  if (/#include\s*<|std::|cout\s*<</.test(c)) return 'cpp';

  // HTML: starts with < and has tags
  if (/^\s*<!DOCTYPE|<html|<head|<body|<div|<p\s/.test(c)) return 'html';

  // CSS: property:value pattern
  if (/^\s*[\w-]+\s*\{[\s\S]*?[\w-]+\s*:\s*[^;]+;/.test(c)) return 'css';

  // Default to JavaScript
  return 'javascript';
}

export const LANGUAGES = [
  { value: 'auto',       label: '✨ Auto-detect' },
  { value: 'javascript', label: '⚡ JavaScript' },
  { value: 'python',     label: '🐍 Python' },
  { value: 'java',       label: '☕ Java' },
  { value: 'cpp',        label: '⚙️ C++' },
  { value: 'html',       label: '🌐 HTML/CSS' },
];
