
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { enhancePrompt } from '../../services/geminiService';
import { Wand2, Sparkles, Copy, Check, Loader2 } from 'lucide-react';

const PromptEnhancerTool: React.FC = () => {
  const { t } = useApp();
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{cinematic?: string, artistic?: string, minimal?: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleEnhance = async () => {
      if (!input.trim()) return;
      setLoading(true);
      try {
          const res = await enhancePrompt(input);
          setResults(res);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  const copy = (text: string, key: string) => {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                <Wand2 size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-bold dark:text-white">{t('tool_prompt_enhancer')}</h1>
                <p className="text-slate-500">{t('desc_prompt_enhancer')}</p>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. A cat sitting on a roof..."
                className="w-full h-32 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-lg"
            />
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleEnhance}
                    disabled={loading || !input}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                    {t('prompt_enhance_btn')}
                </button>
            </div>
        </div>

        {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { key: 'cinematic', title: 'Cinematic', color: 'bg-blue-50 text-blue-800 border-blue-200' },
                    { key: 'artistic', title: 'Artistic', color: 'bg-purple-50 text-purple-800 border-purple-200' },
                    { key: 'minimal', title: 'Minimal', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
                ].map((item) => {
                    const text = results[item.key as keyof typeof results];
                    if (!text) return null;
                    return (
                        <div key={item.key} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 w-fit ${item.color}`}>
                                {item.title}
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1">
                                {text}
                            </p>
                            <button 
                                onClick={() => copy(text, item.key)}
                                className="mt-6 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                            >
                                {copiedKey === item.key ? <Check size={14} /> : <Copy size={14} />}
                                {copiedKey === item.key ? 'Copied' : 'Copy Prompt'}
                            </button>
                        </div>
                    )
                })}
            </div>
        )}
    </div>
  );
};

export default PromptEnhancerTool;
