
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateColorPalette } from '../services/geminiService';
import { ColorPalette } from '../types';
import { Copy, Sparkles, RefreshCw, Layout, Smartphone, Code, Download, Check, Palette } from 'lucide-react';

const ColorTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [prompt, setPrompt] = useState('');
  const [palette, setPalette] = useState<ColorPalette[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'palette' | 'preview'>('palette');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const moods = [
    { label: 'color_mood_corporate', value: 'Professional Corporate Blue and Grey' },
    { label: 'color_mood_playful', value: 'Playful Vivid High Contrast' },
    { label: 'color_mood_dark', value: 'Dark Mode Cyberpunk Neon' },
    { label: 'color_mood_nature', value: 'Organic Nature Earth Tones' },
    { label: 'color_mood_pastel', value: 'Soft Dreamy Pastel' },
  ];

  const handleGenerate = async (moodQuery: string) => {
    if (!moodQuery.trim()) return;
    setLoading(true);
    setPrompt(moodQuery); // Sync state if clicked from chip
    try {
      const result = await generateColorPalette(moodQuery);
      setPalette(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const exportCSS = () => {
    if (palette.length === 0) return;
    const css = `:root {\n${palette.map(c => `  --color-${c.role}: ${c.hex};`).join('\n')}\n}`;
    copyToClipboard(css);
  };

  // Helper to find color by role
  const getColor = (role: string) => palette.find(c => c.role === role)?.hex || '#ccc';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Unified Banner - Purple/Fuchsia */}
      <div className="relative w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex flex-col items-center md:items-start text-center md:text-start flex-1">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/20 text-white shadow-sm">
                     <Palette size={16} />
                     <span>Color Design</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                     {t('color_tool')}
                 </h1>
                 <p className="text-purple-100 text-lg font-medium max-w-xl leading-relaxed opacity-95">
                     {t('app_desc')}
                 </p>
             </div>
             
             {/* Decorative Icon */}
             <div className="hidden md:flex w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl items-center justify-center text-white border border-white/20 shadow-inner">
                 <Palette size={48} />
             </div>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate(prompt)}
                    placeholder={t('color_prompt_label')}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-lg"
                />
                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" size={24} />
                <button 
                    onClick={() => handleGenerate(prompt)}
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-70"
                >
                    {loading ? <RefreshCw className="animate-spin" /> : t('generate_btn')}
                </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                {moods.map((mood) => (
                    <button
                        key={mood.label}
                        onClick={() => handleGenerate(mood.value)}
                        className="px-4 py-1.5 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
                    >
                        {t(mood.label)}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {palette.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Display Area */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* View Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                        <button
                            onClick={() => setViewMode('palette')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'palette' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Layout size={18} />
                            {t('color_view_palette')}
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Smartphone size={18} />
                            {t('color_view_preview')}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={exportCSS} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors" title={t('color_export_css')}>
                            <Code size={18} />
                            <span className="hidden sm:inline">CSS</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm border border-slate-200 dark:border-slate-800 min-h-[500px] flex">
                    {viewMode === 'palette' ? (
                        <div className="w-full flex flex-col sm:flex-row h-[500px] sm:h-auto rounded-2xl overflow-hidden">
                            {palette.map((color, idx) => (
                                <div 
                                    key={idx} 
                                    className="relative flex-1 group transition-all hover:flex-[1.5] flex flex-col justify-end p-4"
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => copyToClipboard(color.hex)}
                                >
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-pointer" />
                                    
                                    <div className="relative z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur rounded-xl p-3 shadow-lg">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                                {t(`color_role_${color.role}` as any)}
                                            </p>
                                            <h3 className="font-mono text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {color.hex}
                                                {copiedHex === color.hex && <Check size={16} className="text-green-500" />}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">{color.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full p-8 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                            {/* Mock UI Card */}
                            <div 
                                className="w-[320px] rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500"
                                style={{ backgroundColor: getColor('surface') }}
                            >
                                <div className="h-40 relative flex items-end p-6" style={{ backgroundColor: getColor('primary') }}>
                                    <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                        <div className="w-4 h-4 rounded-full bg-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">App UI Design</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="h-2 rounded w-1/2 opacity-30" style={{ backgroundColor: getColor('text') }} />
                                            <div className="h-2 rounded w-3/4 opacity-60" style={{ backgroundColor: getColor('text') }} />
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: getColor('secondary') }}>
                                            <Sparkles size={20} className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h4 className="font-bold" style={{ color: getColor('text') }}>Overview</h4>
                                        <p className="text-sm opacity-70 leading-relaxed" style={{ color: getColor('text') }}>
                                            This is a real-time preview of your generated color palette applied to a UI component.
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            className="flex-1 py-3 rounded-xl font-bold text-sm shadow-lg transition-transform active:scale-95"
                                            style={{ backgroundColor: getColor('accent'), color: 'white' }}
                                        >
                                            Action
                                        </button>
                                        <button 
                                            className="flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-transform active:scale-95"
                                            style={{ borderColor: getColor('text'), color: getColor('text'), opacity: 0.8 }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 h-full">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Download size={20} className="text-purple-500" />
                        {t('result_label')}
                    </h3>
                    
                    <div className="space-y-4">
                        {palette.map((color, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div 
                                    className="w-12 h-12 rounded-xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                                    style={{ backgroundColor: color.hex }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{color.name}</h4>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                                            {t(`color_role_${color.role}` as any)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <code className="text-xs text-slate-500 font-mono">{color.hex}</code>
                                        <button 
                                            onClick={() => copyToClipboard(color.hex)}
                                            className="text-slate-300 hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                        <strong>Pro Tip:</strong> Use the "UI Preview" mode to verify contrast between Surface and Text colors before exporting.
                    </div>
                </div>
            </div>

        </div>
      )}

      {/* Empty State */}
      {!loading && palette.length === 0 && (
         <div className="text-center py-20 opacity-50">
             <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Sparkles size={48} className="text-purple-400" />
             </div>
             <p className="text-lg text-slate-500">Select a mood or describe your vision above</p>
         </div>
      )}
    </div>
  );
};

export default ColorTool;
