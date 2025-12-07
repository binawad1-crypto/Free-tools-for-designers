
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateDesignCopy } from '../services/geminiService';
import { Copy, PenTool, RefreshCw, Sparkles, Check, AlignLeft, MessageSquare, Tag, Mail, LayoutTemplate, Smile, Briefcase, Gem, Zap } from 'lucide-react';

const TextTool: React.FC = () => {
  const { t, language, isRTL } = useApp();
  
  // State
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Options
  const [selectedTemplate, setSelectedTemplate] = useState('free');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [targetLang, setTargetLang] = useState<'ar' | 'en'>(language === 'ar' ? 'ar' : 'en');

  const templates = [
    { id: 'free', icon: AlignLeft },
    { id: 'headline', icon: LayoutTemplate },
    { id: 'product', icon: Tag },
    { id: 'social', icon: MessageSquare },
    { id: 'email', icon: Mail },
    { id: 'ux', icon: PenTool },
  ];

  const tones = [
    { id: 'professional', icon: Briefcase },
    { id: 'friendly', icon: Smile },
    { id: 'luxury', icon: Gem },
    { id: 'witty', icon: Sparkles },
    { id: 'urgent', icon: Zap },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(''); // Clear previous result to show loading state clearly
    
    try {
      const text = await generateDesignCopy(prompt, {
        template: selectedTemplate,
        tone: selectedTone,
        language: targetLang
      });
      setResult(text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
        
        {/* LEFT SIDEBAR: CONFIGURATION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                <PenTool size={24} />
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                {t('text_tool')}
              </h2>
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-slate-400 mb-3 block tracking-wider">
                {t('text_label_template')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((tpl) => {
                  const Icon = tpl.icon;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                        selectedTemplate === tpl.id 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon size={20} className="mb-2" />
                      <span className="text-xs font-medium text-center">{t(`text_template_${tpl.id}` as any)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-slate-400 mb-3 block tracking-wider">
                {t('text_label_tone')}
              </label>
              <div className="flex flex-wrap gap-2">
                {tones.map((tone) => {
                  const Icon = tone.icon;
                  return (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${
                        selectedTone === tone.id 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon size={14} />
                      {t(`text_tone_${tone.id}` as any)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-8">
               <label className="text-xs font-bold uppercase text-slate-400 mb-3 block tracking-wider">
                {t('text_label_lang')}
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                 <button 
                  onClick={() => setTargetLang('ar')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${targetLang === 'ar' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                 >
                   {t('text_lang_ar')}
                 </button>
                 <button 
                  onClick={() => setTargetLang('en')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${targetLang === 'en' ? 'bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                 >
                   {t('text_lang_en')}
                 </button>
              </div>
            </div>

            {/* Generate Button (Mobile/Desktop) */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
              <span>{t('generate_btn')}</span>
            </button>

          </div>
        </div>

        {/* RIGHT AREA: EDITOR */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Input Area */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm border border-slate-200 dark:border-slate-800">
             <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('text_prompt_label')}
                className="w-full h-32 p-6 bg-transparent border-none outline-none resize-none text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
             />
          </div>

          {/* Result Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative min-h-[400px]">
            {/* Header Actions */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
               <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                 <PenTool size={16} className="text-emerald-500" />
                 {t('result_label')}
               </h3>
               {result && (
                 <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                 >
                   {copied ? <Check size={16} /> : <Copy size={16} />}
                   {copied ? 'Copied!' : t('copy_btn')}
                 </button>
               )}
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 overflow-y-auto">
               {loading ? (
                 <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-70">
                   <div className="relative">
                     <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles size={24} className="text-emerald-500 animate-pulse" />
                     </div>
                   </div>
                   <p className="text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">{t('loading')}</p>
                 </div>
               ) : result ? (
                 <div className={`prose dark:prose-invert max-w-none text-lg leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200 ${targetLang === 'ar' ? 'font-cairo' : 'font-sans'}`} dir={targetLang === 'ar' ? 'rtl' : 'ltr'}>
                   {result}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <LayoutTemplate size={40} className="text-slate-300 dark:text-slate-600" />
                   </div>
                   <p className="max-w-xs text-center">{t('input_placeholder')}</p>
                 </div>
               )}
            </div>
            
            {/* Footer status */}
            <div className="px-6 py-2 bg-slate-50 dark:bg-slate-950/30 text-xs text-slate-400 flex justify-between">
               <span>Generated by AI</span>
               <span>{result.length} chars</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TextTool;
