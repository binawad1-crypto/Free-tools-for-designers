

import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { generateSocialPost, generateImage, getApiKey } from '../../services/geminiService';
import { Share2, Twitter, Linkedin, Instagram, Facebook, Sparkles, Copy, Download, Loader2, Check, Key, Video, Youtube } from 'lucide-react';

type Platform = 'tiktok' | 'youtube' | 'linkedin' | 'instagram' | 'facebook' | 'twitter';

const TweetMakerTool: React.FC = () => {
  const { t, isRTL, language } = useApp();
  const [platform, setPlatform] = useState<Platform>('tiktok');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [resultText, setResultText] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKeySelected, setApiKeySelected] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
       // Check for System Key first
       const systemKey = await getApiKey();
       if (systemKey) {
           setApiKeySelected(true);
           return;
       }

       // Then check user selection
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
          // Mitigate race condition: Assume key selection was successful
          setApiKeySelected(true);
      }
  };

  const platforms = [
    { id: 'tiktok', icon: Video, color: 'bg-black text-white hover:bg-slate-900 border border-slate-700', name: 'TikTok' },
    { id: 'youtube', icon: Youtube, color: 'bg-red-600 text-white hover:bg-red-700', name: 'YouTube' },
    { id: 'linkedin', icon: Linkedin, color: 'bg-[#0077b5] text-white hover:bg-[#006097]', name: 'LinkedIn' },
    { id: 'instagram', icon: Instagram, color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white hover:opacity-90', name: 'Instagram' },
    { id: 'facebook', icon: Facebook, color: 'bg-[#1877F2] text-white hover:bg-[#166fe5]', name: 'Facebook' },
    { id: 'twitter', icon: Twitter, color: 'bg-sky-500 text-white hover:bg-sky-600', name: 'Twitter' },
  ];

  const handleGenerate = async () => {
    if (!title.trim() && !details.trim()) return;
    
    // Explicitly check if we have a usable key before starting
    const hasKey = await getApiKey();
    if (!hasKey) {
        await handleSelectKey();
        return; 
    }

    setLoading(true);
    setResultText('');
    setResultImage(null);

    try {
        // 1. Generate Text
        const text = await generateSocialPost(title, details, platform, language === 'ar' ? 'ar' : 'en');
        setResultText(text);

        // 2. Generate Image (based on context)
        const imagePrompt = `Expressive high quality illustration or photo for a social media post about: ${title}. ${details.slice(0, 100)}. Style: Modern, clean, professional for ${platform}.`;
        
        // Determine aspect ratio based on platform
        let ratio: '16:9' | '1:1' | '9:16' = '1:1';
        if (platform === 'instagram' || platform === 'facebook') ratio = '1:1';
        if (platform === 'twitter' || platform === 'linkedin' || platform === 'youtube') ratio = '16:9';
        if (platform === 'tiktok') ratio = '9:16';
        
        const imageUrl = await generateImage(imagePrompt, { aspectRatio: ratio as any });
        setResultImage(imageUrl);

    } catch (e: any) {
        console.error(e);
        // If error implies missing key, prompt user again
        if (e.message?.includes('API key') || e.toString().includes('API key')) {
            setApiKeySelected(false);
            await handleSelectKey();
        } else {
            alert(t('error'));
        }
    } finally {
        setLoading(false);
    }
  };

  const copyText = () => {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
      if (!resultImage) return;
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `post-${platform}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header Banner - Purple Theme */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/30 text-white">
                    <Share2 size={14} />
                    <span>Social Media AI</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{t('tool_tweet_maker')}</h1>
                <p className="text-purple-100 max-w-xl">{t('desc_tweet_maker')}</p>
            </div>
            
            <div className="relative z-10">
                {!apiKeySelected ? (
                    <button onClick={handleSelectKey} className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 rounded-xl font-bold text-purple-600 transition-all shadow-lg animate-pulse">
                        <Key size={18} /> {t('studio_select_key')}
                    </button>
                ) : (
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
                        <Share2 size={32} />
                    </div>
                )}
            </div>
            
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Controls */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    
                    {/* Platform Selector */}
                    <div className="mb-6">
                        <label className="text-xs font-bold uppercase text-slate-400 mb-3 block">{t('tweet_platform_select')}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {platforms.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPlatform(p.id as Platform)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all gap-2 h-20 ${
                                        platform === p.id 
                                        ? `${p.color} shadow-lg scale-105 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-indigo-500` 
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                    title={p.name}
                                >
                                    <p.icon size={24} />
                                    <span className="text-[10px] font-bold">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('tweet_input_title')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:text-white"
                                placeholder="..."
                                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('tweet_input_details')}</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all dark:text-white"
                                placeholder="..."
                                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !title.trim()}
                        className="w-full mt-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        {t('tweet_btn_generate')}
                    </button>
                </div>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-7 space-y-6">
                
                {/* Result Card */}
                <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl min-h-[500px] flex flex-col ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
                    
                    {resultText || resultImage ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Generated Image */}
                            {resultImage && (
                                <div className="rounded-2xl overflow-hidden shadow-sm relative group bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <img 
                                        src={resultImage} 
                                        alt="Generated Visual" 
                                        className={`object-cover ${platform === 'tiktok' ? 'max-w-[300px] w-full aspect-[9/16]' : 'w-full h-auto max-h-[400px]'}`} 
                                    />
                                    <button 
                                        onClick={downloadImage}
                                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    >
                                        <Download size={20} />
                                    </button>
                                </div>
                            )}

                            {/* Generated Text */}
                            {resultText && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl relative group border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Generated Content</span>
                                        <button 
                                            onClick={copyText}
                                            className="p-2 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-lg shadow-sm hover:text-purple-500 transition-all"
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                    <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                                        {resultText}
                                    </p>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 p-10">
                            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                                <Sparkles size={40} className="text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">AI Content Creator</h3>
                            <p className="max-w-sm mx-auto mt-2">Enter your topic and details to generate platform-optimized posts with matching visuals.</p>
                        </div>
                    )}

                </div>
            </div>

        </div>
    </div>
  );
};

export default TweetMakerTool;
