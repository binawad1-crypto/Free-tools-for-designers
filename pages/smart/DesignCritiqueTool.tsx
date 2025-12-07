
import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { critiqueDesign } from '../../services/geminiService';
import { Glasses, Upload, Loader2, Sparkles } from 'lucide-react';

const DesignCritiqueTool: React.FC = () => {
  const { t } = useApp();
  const [image, setImage] = useState<{data: string, mime: string, preview: string} | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const res = reader.result as string;
              setImage({ data: res.split(',')[1], mime: f.type, preview: res });
              setFeedback('');
          };
          reader.readAsDataURL(f);
      }
  };

  const handleCritique = async () => {
      if (!image) return;
      setLoading(true);
      try {
          const res = await critiqueDesign(image.data, image.mime);
          setFeedback(res || 'No feedback generated.');
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
                <Glasses size={32} />
            </div>
            <h1 className="text-3xl font-bold dark:text-white">{t('tool_critique')}</h1>
            <p className="text-slate-500">{t('desc_critique')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 min-h-[400px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors relative overflow-hidden"
                >
                    <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
                    {image ? (
                        <img src={image.preview} alt="Design" className="absolute inset-0 w-full h-full object-contain p-4" />
                    ) : (
                        <div className="text-center p-8">
                            <Upload size={40} className="mx-auto mb-4 text-slate-400" />
                            <p className="font-bold text-slate-600 dark:text-slate-300">{t('critique_upload_label')}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleCritique}
                    disabled={!image || loading}
                    className="py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                    {t('critique_btn')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto max-h-[600px]">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4 text-rose-500">
                        <Loader2 size={40} className="animate-spin" />
                        <p className="animate-pulse font-medium">Analyzing layout, color, and UX...</p>
                    </div>
                ) : feedback ? (
                    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                        <h3 className="font-bold text-2xl mb-6 text-slate-900 dark:text-white">{t('critique_result_title')}</h3>
                        <div className="whitespace-pre-line leading-relaxed">
                            {feedback}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                        <Glasses size={48} className="mb-4 opacity-20" />
                        <p>Upload your UI design, flyer, or ad creative to get AI-powered feedback.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default DesignCritiqueTool;
