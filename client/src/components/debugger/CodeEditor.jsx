import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

const languageExtensions = {
  javascript: [javascript({ jsx: true })],
  python: [python()],
  java: [java()],
  cpp: [cpp()],
  html: [html()],
  css: [css()],
  auto: [javascript({ jsx: true })], // default fallback
};

export default function CodeEditor({ value, onChange, language = 'auto' }) {
  const extensions = languageExtensions[language] || languageExtensions.javascript;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl">
      <CodeMirror
        value={value}
        onChange={onChange}
        theme={oneDark}
        extensions={extensions}
        minHeight="220px"
        maxHeight="420px"
        placeholder="// Paste your code here and click 'Analyze My Code'..."
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          autocompletion: false,
        }}
        style={{ fontSize: '14px' }}
      />
    </div>
  );
}
