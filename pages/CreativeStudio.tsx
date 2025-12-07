
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateVideo } from '../services/geminiService';
import { Clapperboard, Sparkles, AlertTriangle, Key, Play, Download, Film, Settings2 } from 'lucide-react';

interface Project {
  id: string;
  url: string;
  prompt: string;
  date: Date;
}

const CreativeStudio: React.FC = () => {
  const { t, isRTL } = useApp();
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Config
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');

  // Check API Key status
  useEffect(() => {
    const checkKey = async () => {
       if (window.aistudio && window.aistudio.hasSelectedApiKey) {
           const hasKey = await window.aistudio.hasSelectedApiKey();
           setApiKeySelected(hasKey);
       }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
      if (window.aistudio && window.aistudio.openSelectKey) {
          await window.aistudio.openSelectKey();
          // Assume success after dialog closes or re-check
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setApiKeySelected(hasKey);
      }
  };

  const handleGenerate = async () => {
      if (!prompt.trim()) return;
      setLoading(true);
      try {
          const videoUrl = await generateVideo(prompt, { aspectRatio, resolution });
          if (videoUrl) {
              const newProject: Project = {
                  id: Date.now().toString(),
                  url: videoUrl,
                  prompt,
                  date: new Date()
              };
              setProjects(prev => [newProject, ...prev]);
              setPrompt('');
          }
      } catch (err) {
          console.error(err);
          // If error is 404 entity not found, it might be the key problem
          alert('Generation failed. Please ensure you have selected a valid project with billing enabled.');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-violet-900 to-fuchsia-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 text-center md:text-start">
             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                 <Sparkles size={14} className="text-yellow-400" />
                 <span>Veo AI Powered</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('studio_title')}</h1>
             <p className="text-white/70 max-w-xl text-lg leading-relaxed">{t('studio_desc')}</p>
          </div>

          <div className="relative z-10 hidden md:block">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <Clapperboard size={40} className="text-fuchsia-300" />
              </div>
          </div>
      </div>

      {/* API Key Gate */}
      {!apiKeySelected && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-800/30 rounded-xl text-amber-600 dark:text-amber-400">
                      <Key size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-amber-800 dark:text-amber-200">{t('studio_key_required')}</h3>
                      <p className="text-sm text-amber-600 dark:text-amber-400/80">Connect your Google Cloud project to use Veo video generation.</p>
                  </div>
              </div>
              <button 
                onClick={handleSelectKey}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                  {t('studio_select_key')}
              </button>
          </div>
      )}

      {/* Main Studio Area */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${!apiKeySelected ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
          
          {/* Creator Panel */}
          <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                      <Settings2 size={20} className="text-fuchsia-500" />
                      <h2 className="font-bold text-lg dark:text-white">Configuration</h2>
                  </div>

                  <div className="space-y-5">
                      {/* Aspect Ratio */}
                      <div>
                          <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('studio_aspect_ratio')}</label>
                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => setAspectRatio('16:9')}
                                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${aspectRatio === '16:9' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-300' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                              >
                                  16:9 Landscape
                              </button>
                              <button 
                                onClick={() => setAspectRatio('9:16')}
                                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${aspectRatio === '9:16' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-300' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                              >
                                  9:16 Portrait
                              </button>
                          </div>
                      </div>

                      {/* Resolution */}
                      <div>
                          <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('studio_resolution')}</label>
                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => setResolution('720p')}
                                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${resolution === '720p' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-300' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                              >
                                  720p Fast
                              </button>
                              <button 
                                onClick={() => setResolution('1080p')}
                                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all ${resolution === '1080p' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-300' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                              >
                                  1080p HD
                              </button>
                          </div>
                      </div>

                      {/* Prompt */}
                      <div>
                          <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('studio_prompt_label')}</label>
                          <textarea
                             value={prompt}
                             onChange={(e) => setPrompt(e.target.value)}
                             className="w-full h-32 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none"
                             placeholder="A cinematic drone shot of a futuristic city..."
                          />
                      </div>

                      <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl shadow-lg shadow-fuchsia-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                         {loading ? (
                             <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{t('loading')}</span>
                             </>
                         ) : (
                             <>
                                <Film size={20} />
                                <span>{t('studio_btn_generate')}</span>
                             </>
                         )}
                      </button>
                  </div>
              </div>
          </div>

          {/* Gallery Panel */}
          <div className="lg:col-span-8">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                   <Film className="text-fuchsia-500" />
                   {t('studio_projects_title')}
               </h2>
               
               {loading && (
                   <div className="bg-slate-900 rounded-[2rem] p-8 aspect-video flex flex-col items-center justify-center text-white mb-8 border border-slate-800 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-fuchsia-900/20 animate-pulse" />
                       <div className="w-16 h-16 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mb-4 relative z-10" />
                       <p className="font-bold text-lg relative z-10">{t('studio_generating')}</p>
                   </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {projects.length === 0 && !loading && (
                       <div className="col-span-full py-20 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                               <Film size={32} />
                           </div>
                           <p>{t('studio_no_projects')}</p>
                       </div>
                   )}

                   {projects.map((project) => (
                       <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
                           <div className="aspect-video bg-black relative">
                               <video 
                                 src={project.url} 
                                 controls 
                                 className="w-full h-full object-cover"
                                 poster={undefined} // Could add a generated poster if available
                               />
                           </div>
                           <div className="p-4">
                               <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 font-medium">
                                   {project.prompt}
                               </p>
                               <div className="flex items-center justify-between text-xs text-slate-400">
                                   <span>{project.date.toLocaleTimeString()}</span>
                                   <a 
                                     href={project.url} 
                                     download={`video-${project.id}.mp4`}
                                     className="flex items-center gap-1 text-fuchsia-600 hover:text-fuchsia-500 font-bold"
                                   >
                                       <Download size={14} />
                                       Download
                                   </a>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
          </div>

      </div>
    </div>
  );
};

export default CreativeStudio;
