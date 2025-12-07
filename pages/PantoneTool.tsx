
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { findPantoneMatch } from '../services/geminiService';
import { PantoneMatch } from '../types';
import { Pipette, Sparkles, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';

const PantoneTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [hex, setHex] = useState('#3b82f6');
  const [result, setResult] = useState<PantoneMatch | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await findPantoneMatch(hex);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
          {t('pms_tool')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {isRTL 
            ? 'احصل على مطابقة بانتون الدقيقة لأي لون رقمي باستخدام الذكاء الاصطناعي.' 
            : 'Get accurate Pantone matching for any digital color using AI.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
              <Pipette size={24} />
            </div>
            <h2 className="text-xl font-bold">{t('pms_input_label')}</h2>
          </div>

          <div className="space-y-4">
            <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-inner ring-1 ring-slate-200 dark:ring-slate-700">
              <input 
                type="color" 
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                 <span className="bg-black/20 backdrop-blur-md text-white font-mono px-4 py-2 rounded-lg text-lg">
                   {hex.toUpperCase()}
                 </span>
              </div>
            </div>

            <div className="flex gap-4">
              <input 
                type="text" 
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-center uppercase focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <button
                onClick={handleMatch}
                disabled={loading}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
                <span>{t('pms_find_btn')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="relative">
           {loading ? (
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col items-center justify-center space-y-4 opacity-70">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-orange-600 font-medium animate-pulse">{t('loading')}</p>
             </div>
           ) : result ? (
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
                {/* The Pantone Card Look */}
                <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
                   {/* Top Color Block */}
                   <div 
                     className="h-64 w-full transition-colors duration-500"
                     style={{ backgroundColor: result.hex }}
                   />
                   
                   {/* Bottom Info Block */}
                   <div className="p-8 space-y-4 bg-white text-slate-900">
                      <div className="flex justify-between items-start">
                         <div>
                            <h2 className="text-3xl font-black tracking-tight mb-1">
                               {result.code}
                            </h2>
                            <p className="text-lg font-semibold text-slate-500">
                               {result.name || 'Solid Coated'}
                            </p>
                         </div>
                         <div className="text-right">
                           <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 mb-1">HEX</span>
                           <p className="font-mono text-lg">{result.hex}</p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-6">
                         <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">{t('pms_cmyk_values')}</span>
                            <p className="font-mono text-slate-700">{result.cmyk}</p>
                         </div>
                         <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Match Accuracy</span>
                            <p className="text-sm text-slate-600 leading-snug">{result.description}</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Comparison Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full" style={{ backgroundColor: hex }} />
                       <span>Your Color</span>
                    </div>
                    {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-4 rounded-full" style={{ backgroundColor: result.hex }} />
                       <span>Pantone Match</span>
                    </div>
                </div>
             </div>
           ) : (
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px]">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Pipette size={40} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p>{t('pms_input_label')}</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PantoneTool;
