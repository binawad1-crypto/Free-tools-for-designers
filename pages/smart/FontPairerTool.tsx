
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { pairFonts } from '../../services/geminiService';
import { Type, ArrowRight, Loader2, Search } from 'lucide-react';

const FontPairerTool: React.FC = () => {
  const { t } = useApp();
  const [desc, setDesc] = useState('');
  const [pairs, setPairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePair = async () => {
      if (!desc.trim()) return;
      setLoading(true);
      try {
          const res = await pairFonts(desc);
          setPairs(res);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
             <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                 <Type size={32} />
             </div>
             <h1 className="text-3xl font-bold dark:text-white">{t('tool_font_pairer')}</h1>
             <p className="text-slate-500">{t('desc_font_pairer')}</p>
        </div>

        <div className="flex gap-4">
            <input 
                type="text" 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)}
                placeholder={t('font_input_label')}
                className="flex-1 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <button
                onClick={handlePair}
                disabled={loading || !desc}
                className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                {t('font_pair_btn')}
            </button>
        </div>

        <div className="space-y-6">
            {pairs.map((pair, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Header Font</span>
                                <h3 className="text-4xl md:text-5xl text-slate-900 dark:text-white leading-tight" style={{ fontFamily: 'serif' }}>
                                    {pair.header}
                                </h3>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Body Font</span>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                                    The quick brown fox jumps over the lazy dog. 
                                    <span className="block mt-1 text-sm opacity-70">Font: {pair.body}</span>
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl h-full flex flex-col justify-center">
                            <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-2">
                                <ArrowRight size={16} /> Why this works
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {pair.reason}
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                                <a 
                                    href={`https://fonts.google.com/specimen/${pair.header.replace(' ', '+')}`} 
                                    target="_blank" rel="noreferrer"
                                    className="text-xs font-bold text-slate-500 hover:text-emerald-500"
                                >
                                    Get {pair.header}
                                </a>
                                <span className="text-slate-300">|</span>
                                <a 
                                    href={`https://fonts.google.com/specimen/${pair.body.replace(' ', '+')}`} 
                                    target="_blank" rel="noreferrer"
                                    className="text-xs font-bold text-slate-500 hover:text-emerald-500"
                                >
                                    Get {pair.body}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default FontPairerTool;
