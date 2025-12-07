

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateDesignCopy } from '../services/geminiService';
import { Copy, Megaphone, RefreshCw, Sparkles, Check, Instagram, Zap, Type, Tag, Smile, Briefcase, Star, Lightbulb } from 'lucide-react';

const MarketingTool: React.FC = () => {
  const { t, language, isRTL } = useApp();
  
  // State
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Options
  const [selectedType, setSelectedType] = useState('instagram');
  const [selectedTone, setSelectedTone] = useState('enthusiastic');
  const [targetLang, setTargetLang] = useState<'ar' | 'en'>(language === 'ar' ? 'ar' : 'en');

  const contentTypes = [
    { id: 'instagram', icon: Instagram },
    { id: 'ad_short', icon: Zap },
    { id: 'headlines_catchy', icon: Type },
    { id: 'offer_discount', icon: Tag },
  ];

  const tones = [
    { id: 'enthusiastic', icon: Star },
    { id: 'professional', icon: Briefcase },
    { id: 'urgent', icon: Lightbulb },
    { id: 'friendly', icon: Smile },
  ];

  const handleGenerate = async () => {
    if (!productName.trim()) return;

    setLoading(true);
    setResult(''); // Clear previous result
    
    try {
      // Construct a richer prompt context from inputs
      let fullPrompt = `Product/Service: ${productName}.`;
      if (audience) fullPrompt += ` Target Audience: ${audience}.`;
      
      const text = await generateDesignCopy(fullPrompt, {
        template: selectedType,
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
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                <Megaphone size={24} />
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500">
                {t('marketing_tool')}
              </h2>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-wider">
                        {t('marketing_input_product')}
                    </label>
                    <textarea
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder={isRTL ? "مثلاً: قهوة مختصة، تطبيق توصيل، خصومات نهاية العام..." : "e.g., Specialty Coffee, Delivery App, Year-end Sale..."}
                        className="w-full h-24 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 outline-none resize-none transition-all text-slate-900 dark:text-white"
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-slate-400 mb-2 block tracking-wider">
                        {t('marketing_input_audience')}
                    </label>
                    <input
                        type="text"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder={isRTL ? "مثلاً: الشباب، أصحاب الشركات، ربات المنازل..." : "e.g., Youth, Business Owners, Homemakers..."}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 outline-none transition-all text-slate-900 dark:text-white"
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    />
                </div>
            </div>

            {/* Content Type Selection */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase text-slate-400 mb-3 block tracking-wider">
                {t('text_label_template')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                        selectedType === type.id 
                          ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-500 text-pink-700 dark:text-pink-400 ring-1 ring-pink-500' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon size={20} className="mb-2" />
                      <span className="text-xs font-medium text-center">{t(`marketing_type_${type.id}` as any)}</span>
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
                          ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-500 text-pink-700 dark:text-pink-400' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon size={14} />
                      {t(`marketing_tone_${tone.id}` as any)}
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
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${targetLang === 'ar' ? 'bg-white dark:bg-slate-700 shadow text-pink-600 dark:text-pink-400' : 'text-slate-500'}`}
                 >
                   {t('text_lang_ar')}
                 </button>
                 <button 
                  onClick={() => setTargetLang('en')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${targetLang === 'en' ? 'bg-white dark:bg-slate-700 shadow text-pink-600 dark:text-pink-400' : 'text-slate-500'}`}
                 >
                   {t('text_lang_en')}
                 </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !productName.trim()}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-lg shadow-pink-900/20 hover:shadow-pink-900/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
              <span>{t('generate_btn')}</span>
            </button>

          </div>
        </div>

        {/* RIGHT AREA: EDITOR */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Result Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative min-h-[400px]">
            {/* Header Actions */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
               <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                 <Sparkles size={16} className="text-pink-500" />
                 {t('result_label')}
               </h3>
               {result && (
                 <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
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
                     <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <Sparkles size={24} className="text-pink-500 animate-pulse" />
                     </div>
                   </div>
                   <p className="text-pink-600 dark:text-pink-400 font-medium animate-pulse">{t('loading')}</p>
                 </div>
               ) : result ? (
                 <div className={`prose dark:prose-invert max-w-none text-lg leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200 ${targetLang === 'ar' ? 'font-cairo' : 'font-sans'}`} dir={targetLang === 'ar' ? 'rtl' : 'ltr'}>
                   {result}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400">
                   <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Megaphone size={40} className="text-slate-300 dark:text-slate-600" />
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

export default MarketingTool;