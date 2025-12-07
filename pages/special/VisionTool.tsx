
import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { analyzeMedia } from '../../services/geminiService';
import { ScanEye, Upload, Image as ImageIcon, Video, Sparkles, Loader2, X } from 'lucide-react';

const VisionTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<{data: string, mime: string, preview: string} | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          setFile({
              data: base64Data,
              mime: f.type,
              preview: base64String
          });
          setResult('');
      };
      reader.readAsDataURL(f);
  };

  const handleAnalyze = async () => {
      if (!file) return;
      setLoading(true);
      try {
          const text = await analyzeMedia(file.data, file.mime, '', activeTab === 'video');
          setResult(text || 'No insights found.');
      } catch (err) {
          console.error(err);
          setResult('Error analyzing media.');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                <ScanEye size={32} />
            </div>
            <h1 className="text-3xl font-bold dark:text-white">{t('tool_vision')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('desc_vision')}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl inline-flex">
                <button
                    onClick={() => { setActiveTab('image'); setFile(null); setResult(''); }}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'image' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500'
                    }`}
                >
                    <ImageIcon size={18} /> {t('vision_tab_image')}
                </button>
                <button
                    onClick={() => { setActiveTab('video'); setFile(null); setResult(''); }}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'video' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500'
                    }`}
                >
                    <Video size={18} /> {t('vision_tab_video')}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Upload Area */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-3xl min-h-[400px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                    ${file 
                        ? 'border-amber-500 bg-black' 
                        : 'border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }
                `}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept={activeTab === 'image' ? "image/*" : "video/*"} 
                />
                
                {file ? (
                    <>
                        {activeTab === 'image' ? (
                            <img src={file.preview} alt="Upload" className="w-full h-full object-contain" />
                        ) : (
                            <video src={file.preview} controls className="w-full h-full object-contain" />
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold flex items-center gap-2"><Upload size={20} /> Change File</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-8">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Upload size={32} />
                        </div>
                        <p className="font-bold text-slate-600 dark:text-slate-300">{t('vision_upload_label')}</p>
                        <p className="text-xs text-slate-400 mt-2">{activeTab === 'image' ? 'JPG, PNG, WEBP' : 'MP4, MOV, WEBM'}</p>
                    </div>
                )}
            </div>

            {/* Analysis Result */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
                    <span>{t('vision_analyze_btn')}</span>
                </button>

                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto min-h-[320px]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-amber-500 gap-4">
                            <Loader2 size={40} className="animate-spin" />
                            <p className="text-sm font-medium animate-pulse">Gemini 3 Pro is analyzing...</p>
                        </div>
                    ) : result ? (
                        <div className="prose dark:prose-invert text-sm">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                                <ScanEye size={20} className="text-amber-500" /> Analysis Result
                            </h3>
                            <div className="whitespace-pre-line text-slate-600 dark:text-slate-300 leading-relaxed">
                                {result}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                            <ScanEye size={48} className="mb-4 opacity-20" />
                            <p>Upload a file and click analyze to see Gemini's visual understanding capabilities.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    </div>
  );
};

export default VisionTool;
