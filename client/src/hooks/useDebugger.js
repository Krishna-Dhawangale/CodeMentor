import { useState, useCallback } from 'react';
import { analyzeCode } from '../utils/api';
import { detectLanguage } from '../utils/languageDetect';

export function useDebugger() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async () => {
    if (!code.trim()) {
      setError('Please paste some code first!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const lang = language === 'auto' ? detectLanguage(code) : language;
      const data = await analyzeCode(code, lang);
      setResult({ ...data, detectedLanguage: lang });
    } catch (err) {
      const msg = err?.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [code, language]);

  const reset = useCallback(() => {
    setCode('');
    setResult(null);
    setError(null);
  }, []);

  return { code, setCode, language, setLanguage, result, loading, error, analyze, reset };
}
