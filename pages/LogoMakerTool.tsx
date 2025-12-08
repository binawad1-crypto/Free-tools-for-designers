
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateLogo, getApiKey } from '../services/geminiService';
import { Hexagon, Sparkles, Download, Wand2, Box, Layers, Palette, CircleDot, Type, Key } from 'lucide-react';

const LogoMakerTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [prompt, setPrompt] = useState('');
  const [brandName, setBrandName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('minimal');
  const [loading, setLoading] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [apiKeySelected, setApiKeySelected] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
       // Check for System Key first
       const systemKey = await getApiKey();
       if (systemKey) {
           setApiKeySelected(true);
           return;
       }

       // Then check User Selection
       if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
           const hasKey = await (window as any).aistudio.hasSelectedApiKey();
           setApiKeySelected(hasKey);
       }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
      if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
          await (window as any).aistudio.openSelectKey();
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          setApiKeySelected(hasKey);
      }
  };

  const styles = [
    { id: 'minimal', icon: Box, label: 'logo_style_minimal' },
    { id: '3d', icon: Layers, label: 'logo_style_3d' },
    { id: 'vintage', icon: CircleDot, label: 'logo_style_vintage' },
    { id: 'abstract', icon: Palette, label: 'logo_style_abstract' },
    { id: 'mascot', icon: Sparkles, label: 'logo_style_mascot' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!apiKeySelected) {
        await handleSelectKey();
        return;
    }

    setLoading(true);
    setLogoImage(null);
    try {
      const imageBase64 = await generateLogo(prompt, t(`logo_style_${selectedStyle}` as any), brandName);
      if (imageBase64) {
          setLogoImage(imageBase64);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!logoImage) return;
    const link = document.createElement('a');
    link.href = logoImage;
    link.download = `logo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/10">
           <Hexagon size={32} />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500">
          {t('logo_tool')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('app_desc')}
        </p>
        
        {!apiKeySelected && (
            <div className="flex justify-center mt-4">
                 <button onClick={handleSelectKey} className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl font-bold text-black transition-all shadow-lg shadow-amber-500/30 animate-pulse">
                     <Key size={18} /> {t('studio_select_key')}
                 </button>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Controls */}
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                
                {/* Brand Name Input */}
                <div className="mb-4">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block flex items-center gap-2">
                        <Type size={16} className="text-amber-500" />
                        {t('logo_brand_name')}
                    </label>
                    <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder={t('logo_brand_placeholder')}
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all text-slate-900 dark:text-white"
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    />
                </div>

                {/* Prompt Input */}
                <div className="mb-6">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                        {t('logo_prompt_label')}
                    </label>
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ex: A futuristic rocket ship logo for a tech startup..."
                            className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all resize-none text-slate-900 dark:text-white"
                        />
                        <Wand2 className="absolute right-4 bottom-4 text-slate-400" size={20} />
                    </div>
                </div>

                {/* Style Selection */}
                <div className="mb-8">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 block">
                        {t('logo_style_label')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {styles.map((style) => {
                            const Icon = style.icon;
                            const isSelected = selectedStyle === style.id;
                            return (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        isSelected 
                                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500' 
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{t(style.label as any)}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           <span>{t('loading')}</span>
                        </>
                    ) : (
                        <>
                           <Sparkles size={20} />
                           <span>{t('generate_btn')}</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden group">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>

                {loading ? (
                    <div className="flex flex-col items-center gap-4 z-10">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                            <Sparkles className="absolute inset-0 m-auto text-amber-500 animate-pulse" size={32} />
                        </div>
                        <p className="text-slate-500 font-medium animate-pulse">{t('loading')}</p>
                        <p className="text-xs text-slate-400">AI is crafting your logo...</p>
                    </div>
                ) : logoImage ? (
                    <div className="w-full flex flex-col items-center gap-8 z-10 animate-in fade-in zoom-in duration-500">
                        <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 ring-1 ring-slate-100 dark:ring-slate-800">
                             <img src={logoImage} alt="Generated Logo" className="w-64 h-64 md:w-80 md:h-80 object-contain" />
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleDownload}
                                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                            >
                                <Download size={20} />
                                {t('download_btn')}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">{t('logo_generated_title')}</p>
                    </div>
                ) : (
                    <div className="text-center z-10 opacity-60 max-w-sm">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Hexagon size={48} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Ready to Design</h3>
                        <p className="text-slate-500">Describe your vision, enter your brand name (supports Arabic), and generate a unique logo in seconds.</p>
                    </div>
                )}

            </div>
        </div>

      </div>
    </div>
  );
};

export default LogoMakerTool;
