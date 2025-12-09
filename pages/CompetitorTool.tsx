
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { analyzeCompetitor, CompetitorAnalysisResult } from '../services/geminiService';
import { Swords, Search, TrendingUp, Users, Target, ShieldAlert, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

const CompetitorTool: React.FC = () => {
  const { t, isRTL, language } = useApp();
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<CompetitorAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const analysis = await analyzeCompetitor(url, notes, language === 'ar' ? 'ar' : 'en');
      setResult(analysis);
    } catch (err) {
      console.error(err);
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Unified Banner - Indigo/Violet */}
      <div className="relative w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex flex-col items-center md:items-start text-center md:text-start flex-1">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-white/20 text-white shadow-sm">
                     <Swords size={16} />
                     <span>Market Analysis</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                     {t('competitor_tool')}
                 </h1>
                 <p className="text-indigo-100 text-lg font-medium max-w-xl leading-relaxed opacity-90">
                     {t('app_desc')}
                 </p>
             </div>
             
             {/* Decorative Icon */}
             <div className="hidden md:flex w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl items-center justify-center text-white border border-white/20 shadow-inner">
                 <Swords size={48} />
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT SECTION */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                  <Search size={20} className="text-indigo-500" />
                  {t('competitor_tool')}
              </h2>
              
              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('comp_input_url')}</label>
                      <input 
                          type="url" 
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://instagram.com/competitor"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('comp_input_desc')}</label>
                      <textarea 
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="..."
                          className="w-full h-24 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-slate-900 dark:text-white"
                      />
                  </div>

                  <button
                      onClick={handleAnalyze}
                      disabled={loading || !url}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {loading ? (
                          <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{t('loading')}</span>
                          </>
                      ) : (
                          <>
                              <Swords size={20} />
                              <span>{t('comp_analyze_btn')}</span>
                          </>
                      )}
                  </button>
              </div>
           </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-7">
           {!result && !loading && (
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400 text-center">
                   <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                       <Target size={40} className="text-slate-300 dark:text-slate-600" />
                   </div>
                   <p className="max-w-xs">Enter a competitor's URL to reveal their strategy, strengths, and weaknesses using AI search.</p>
               </div>
           )}

           {loading && (
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-indigo-500 gap-4">
                   <div className="relative">
                       <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                       <Search className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={24} />
                   </div>
                   <p className="font-bold animate-pulse">Analyzing market data...</p>
               </div>
           )}

           {result && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   {/* Strengths & Weaknesses Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="bg-green-50 dark:bg-green-900/10 rounded-3xl p-6 border border-green-100 dark:border-green-900/30">
                           <h3 className="font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                               <TrendingUp size={20} />
                               {t('comp_section_strengths')}
                           </h3>
                           <ul className="space-y-2">
                               {result.strengths.map((point, idx) => (
                                   <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                       {point}
                                   </li>
                               ))}
                           </ul>
                       </div>

                       <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-6 border border-red-100 dark:border-red-900/30">
                           <h3 className="font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                               <ShieldAlert size={20} />
                               {t('comp_section_weaknesses')}
                           </h3>
                           <ul className="space-y-2">
                               {result.weaknesses.map((point, idx) => (
                                   <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                       {point}
                                   </li>
                               ))}
                           </ul>
                       </div>
                   </div>

                   {/* Marketing & Audience */}
                   <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div>
                               <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                   <Target size={20} />
                                   {t('comp_section_marketing')}
                               </h3>
                               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                   {result.marketing_style}
                               </p>
                           </div>
                           <div>
                               <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-2">
                                   <Users size={20} />
                                   {t('comp_section_audience')}
                               </h3>
                               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                   {result.audience}
                               </p>
                           </div>
                       </div>
                   </div>

                   {/* Content Strategy */}
                   <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
                       <h3 className="font-bold text-indigo-100 mb-3 flex items-center gap-2">
                           <Sparkles size={20} />
                           {t('comp_section_content')}
                       </h3>
                       <p className="text-sm font-medium leading-relaxed opacity-95">
                           {result.best_content}
                       </p>
                   </div>
               </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default CompetitorTool;
