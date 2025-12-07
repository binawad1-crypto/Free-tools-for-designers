
import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { imageToCode } from '../../services/geminiService';
import { Code2, Upload, Loader2, Play, Code, Eye } from 'lucide-react';

const ScreenshotToCodeTool: React.FC = () => {
  const { t } = useApp();
  const [image, setImage] = useState<{data: string, mime: string, preview: string} | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const res = reader.result as string;
            setImage({ data: res.split(',')[1], mime: f.type, preview: res });
        };
        reader.readAsDataURL(f);
    }
  };

  const handleGenerate = async () => {
      if (!image) return;
      setLoading(true);
      try {
          const result = await imageToCode(image.data, image.mime);
          setCode(result);
          setActiveTab('preview');
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 h-[calc(100vh-140px)] flex flex-col">
       <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600">
               <Code2 size={24} />
           </div>
           <div>
               <h1 className="text-2xl font-bold dark:text-white">{t('tool_img_code')}</h1>
               <p className="text-slate-500">{t('desc_img_code')}</p>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
           {/* Upload Side */}
           <div className="flex flex-col gap-4">
               <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative overflow-hidden"
               >
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                   {image ? (
                       <img src={image.preview} alt="Upload" className="absolute inset-0 w-full h-full object-contain p-4" />
                   ) : (
                       <div className="text-center p-8">
                           <Upload size={32} className="mx-auto mb-4 text-slate-400" />
                           <p className="font-bold text-slate-600 dark:text-slate-300">{t('code_upload_label')}</p>
                       </div>
                   )}
               </div>
               <button
                   onClick={handleGenerate}
                   disabled={!image || loading}
                   className="py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
               >
                   {loading ? <Loader2 className="animate-spin" /> : <Play size={20} />}
                   {t('code_generate_btn')}
               </button>
           </div>

           {/* Result Side */}
           <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
               {/* Tabs */}
               <div className="flex border-b border-slate-800">
                   <button 
                       onClick={() => setActiveTab('preview')}
                       className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                   >
                       <Eye size={16} /> {t('code_preview_tab')}
                   </button>
                   <button 
                       onClick={() => setActiveTab('code')}
                       className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'code' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                   >
                       <Code size={16} /> {t('code_code_tab')}
                   </button>
               </div>

               <div className="flex-1 relative bg-white">
                   {loading ? (
                       <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
                           <div className="text-center text-white">
                               <Loader2 size={40} className="animate-spin mx-auto mb-2" />
                               <p>Writing code...</p>
                           </div>
                       </div>
                   ) : null}

                   {code ? (
                       activeTab === 'preview' ? (
                           <iframe 
                               srcDoc={code} 
                               className="w-full h-full border-none bg-white" 
                               title="Preview"
                           />
                       ) : (
                           <pre className="w-full h-full overflow-auto p-4 text-xs font-mono bg-slate-950 text-green-400">
                               {code}
                           </pre>
                       )
                   ) : (
                       <div className="h-full flex items-center justify-center text-slate-400">
                           <p>Generated code will appear here</p>
                       </div>
                   )}
               </div>
           </div>
       </div>
    </div>
  );
};

export default ScreenshotToCodeTool;
