
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { generateIconSvg } from '../../services/geminiService';
import { Shapes, Sparkles, Loader2, Download, Copy, Check } from 'lucide-react';

const IconGeneratorTool: React.FC = () => {
  const { t } = useApp();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('flat');
  const [svgCode, setSvgCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
      if (!prompt.trim()) return;
      setLoading(true);
      try {
          const result = await generateIconSvg(prompt, style);
          setSvgCode(result);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  const copyCode = () => {
      navigator.clipboard.writeText(svgCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
      const blob = new Blob([svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'icon.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
             <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto text-purple-600">
                 <Shapes size={32} />
             </div>
             <h1 className="text-3xl font-bold dark:text-white">{t('tool_icon_gen')}</h1>
             <p className="text-slate-500">{t('desc_icon_gen')}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Icon Description</label>
                    <input 
                        type="text" 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('icon_prompt_placeholder')}
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Style</label>
                    <div className="flex gap-2 flex-wrap">
                        {['flat', 'outline', 'filled', 'gradient'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStyle(s)}
                                className={`px-4 py-2 rounded-lg border text-sm font-bold capitalize ${
                                    style === s 
                                    ? 'bg-purple-600 text-white border-purple-600' 
                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {t('icon_generate_btn')}
                </button>
            </div>
        </div>

        {/* Result */}
        {svgCode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm min-h-[300px]">
                    <div className="w-48 h-48" dangerouslySetInnerHTML={{ __html: svgCode }} />
                </div>
                
                <div className="bg-slate-950 rounded-3xl p-6 relative group overflow-hidden">
                    <pre className="text-xs font-mono text-green-400 overflow-auto h-[250px]">
                        {svgCode}
                    </pre>
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={copyCode} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <button onClick={downloadSvg} className="p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700">
                            <Download size={16} />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default IconGeneratorTool;
