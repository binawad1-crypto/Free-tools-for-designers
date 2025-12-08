
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateVideo, editImage, generateImage, getApiKey } from '../services/geminiService';
import { 
    Clapperboard, Sparkles, Key, Film, Settings2, Upload, 
    Image as ImageIcon, Mic, User, Eraser, RefreshCcw, ShoppingBag, 
    ScanFace, Box, ArrowUpCircle, Download, X, Type
} from 'lucide-react';

interface Project {
  id: string;
  type: 'video' | 'image';
  url: string;
  prompt: string;
  date: Date;
}

type StudioTool = 
 | 'upload' 
 | 'img2vid' 
 | 'txt2img'
 | 'audio' 
 | 'character' 
 | 'remove_bg' 
 | 'replace_bg' 
 | 'product' 
 | 'consistency' 
 | 'faceswap' 
 | '3d' 
 | 'upscale';

const CreativeStudio: React.FC = () => {
  const { t, isRTL } = useApp();
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [activeTool, setActiveTool] = useState<StudioTool>('img2vid');
  
  // Inputs
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<{data: string, mime: string, preview: string} | null>(null);
  
  // State
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Config
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
       // Check for System Key first
       const systemKey = await getApiKey();
       if (systemKey) {
           setApiKeySelected(true);
           return;
       }

       // Then check Veo wrapper key
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          const base64String = reader.result as string;
          // Extract base64 data (remove "data:image/png;base64,")
          const base64Data = base64String.split(',')[1];
          setUploadedImage({
              data: base64Data,
              mime: file.type,
              preview: base64String
          });
      };
      reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
      if (!apiKeySelected) return;
      setLoading(true);
      
      try {
          // --- VIDEO GENERATION (Veo) ---
          if (activeTool === 'img2vid' || activeTool === 'upload') {
              // 'upload' maps to img2vid logic if text prompt is also provided or implied
              const videoUrl = await generateVideo(prompt, { aspectRatio: aspectRatio === '1:1' ? '16:9' : aspectRatio, resolution }, uploadedImage ? { data: uploadedImage.data, mimeType: uploadedImage.mime } : undefined);
              
              if (videoUrl) {
                  setProjects(prev => [{
                      id: Date.now().toString(),
                      type: 'video',
                      url: videoUrl,
                      prompt: prompt || 'Image to Video',
                      date: new Date()
                  }, ...prev]);
              }
          } 
          // --- IMAGE GENERATION (Text to Image - Banana Pro) ---
          else if (activeTool === 'txt2img') {
              const imageUrl = await generateImage(prompt, { aspectRatio: aspectRatio as any });
              
              if (imageUrl) {
                   setProjects(prev => [{
                      id: Date.now().toString(),
                      type: 'image',
                      url: imageUrl,
                      prompt: prompt,
                      date: new Date()
                  }, ...prev]);
              }
          }
          // --- IMAGE EDITING (Gemini Image) ---
          else {
              let editPrompt = prompt;
              
              // Preset prompts for tools
              if (activeTool === 'remove_bg') editPrompt = "Remove the background, make it white or transparent. Keep the subject.";
              if (activeTool === 'replace_bg') editPrompt = `Replace the background with: ${prompt}`;
              if (activeTool === 'product') editPrompt = `Professional product photography shot, cinematic lighting, ${prompt}`;
              if (activeTool === '3d') editPrompt = "Convert this into a cute 3D render style.";
              if (activeTool === 'upscale') editPrompt = "Enhance the details and quality of this image, make it high resolution.";

              if (!uploadedImage) {
                  alert("Please upload an image first.");
                  setLoading(false);
                  return;
              }

              const newImageUrl = await editImage(uploadedImage.data, uploadedImage.mime, editPrompt);
              
              if (newImageUrl) {
                   setProjects(prev => [{
                      id: Date.now().toString(),
                      type: 'image',
                      url: newImageUrl,
                      prompt: editPrompt,
                      date: new Date()
                  }, ...prev]);
              }
          }
      } catch (err) {
          console.error(err);
          alert('Generation failed. Ensure you have a valid key and permissions.');
      } finally {
          setLoading(false);
      }
  };

  const tools = [
      { id: 'upload', icon: Upload, label: 'studio_tool_upload' },
      { id: 'img2vid', icon: ImageIcon, label: 'studio_tool_img2vid' },
      { id: 'txt2img', icon: Type, label: 'studio_tool_txt2img' },
      { id: 'audio', icon: Mic, label: 'studio_tool_audio' },
      { id: 'character', icon: User, label: 'studio_tool_character' },
  ];

  const proTools = [
      { id: 'remove_bg', icon: Eraser, label: 'studio_tool_remove_bg' },
      { id: 'replace_bg', icon: RefreshCcw, label: 'studio_tool_replace_bg' },
      { id: 'product', icon: ShoppingBag, label: 'studio_tool_product' },
      { id: 'consistency', icon: User, label: 'studio_tool_consistency' },
      { id: 'faceswap', icon: ScanFace, label: 'studio_tool_faceswap' },
      { id: '3d', icon: Box, label: 'studio_tool_3d' },
      { id: 'upscale', icon: ArrowUpCircle, label: 'studio_tool_upscale' },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
             <div className="inline-flex items-center gap-2 bg-fuchsia-500/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-4 border border-fuchsia-500/30 text-fuchsia-300">
                 <Sparkles size={14} />
                 <span>AI Creative Suite</span>
             </div>
             <h1 className="text-3xl font-bold mb-2">{t('studio_title')}</h1>
             <p className="text-slate-400 max-w-xl">{t('studio_desc')}</p>
          </div>
          {/* API Key Status */}
           <div className="relative z-10">
              {!apiKeySelected ? (
                 <button onClick={handleSelectKey} className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-bold text-black transition-all">
                     <Key size={18} /> {t('studio_select_key')}
                 </button>
              ) : (
                 <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 font-bold text-sm">
                     <Key size={16} /> API Key Connected
                 </div>
              )}
           </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR MENU */}
          <div className="lg:col-span-3">
              <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 sticky top-24">
                  <div className="space-y-1">
                      {tools.map((tool) => {
                          const Icon = tool.icon;
                          return (
                              <button
                                  key={tool.id}
                                  onClick={() => setActiveTool(tool.id as StudioTool)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                      activeTool === tool.id 
                                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                  }`}
                              >
                                  <Icon size={20} />
                                  <span className="font-medium text-sm">{t(tool.label as any)}</span>
                              </button>
                          );
                      })}
                  </div>

                  <div className="mt-6 mb-2 px-4">
                      <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                          <Sparkles size={12} /> {t('studio_section_pro')}
                      </h3>
                  </div>

                  <div className="space-y-1">
                      {proTools.map((tool) => {
                          const Icon = tool.icon;
                          return (
                              <button
                                  key={tool.id}
                                  onClick={() => setActiveTool(tool.id as StudioTool)}
                                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                      activeTool === tool.id 
                                      ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/50' 
                                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                  }`}
                              >
                                  <Icon size={20} />
                                  <span className="font-medium text-sm">{t(tool.label as any)}</span>
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="lg:col-span-6 space-y-6">
               
               {/* CONFIG CARD */}
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                   
                   {/* Tool Title */}
                   <div className="flex items-center gap-3 mb-6">
                       <div className={`p-3 rounded-2xl ${['img2vid','upload','txt2img'].includes(activeTool) ? 'bg-blue-100 text-blue-600' : 'bg-fuchsia-100 text-fuchsia-600'}`}>
                           <Settings2 size={24} />
                       </div>
                       <h2 className="text-2xl font-bold dark:text-white">
                           {t(`studio_tool_${activeTool}` as any)}
                       </h2>
                   </div>

                   {/* Upload Area */}
                   {activeTool !== 'txt2img' && (
                       <div className="mb-6">
                           <label className="text-xs font-bold uppercase text-slate-400 mb-3 block">{t('studio_tool_upload')}</label>
                           <div 
                               onClick={() => fileInputRef.current?.click()}
                               className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${uploadedImage ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                           >
                               <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                               
                               {uploadedImage ? (
                                   <div className="relative group w-full">
                                       <img src={uploadedImage.preview} alt="Upload" className="h-48 w-full object-contain rounded-lg" />
                                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                           <span className="text-white font-bold">Change Image</span>
                                       </div>
                                       <button 
                                          onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg"
                                       >
                                           <X size={16} />
                                       </button>
                                   </div>
                               ) : (
                                   <>
                                       <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                           <Upload size={24} className="text-slate-400" />
                                       </div>
                                       <p className="font-medium text-slate-600 dark:text-slate-300">{t('studio_drop_image')}</p>
                                   </>
                               )}
                           </div>
                       </div>
                   )}

                   {/* Prompt / Settings */}
                   <div className="space-y-4">
                       {(activeTool === 'img2vid' || activeTool === 'upload' || activeTool === 'txt2img' || activeTool === 'replace_bg' || activeTool === 'product') && (
                           <div>
                               <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                                   {activeTool === 'replace_bg' ? 'New Background Description' : 'Description / Prompt'}
                               </label>
                               <textarea
                                   value={prompt}
                                   onChange={(e) => setPrompt(e.target.value)}
                                   placeholder={activeTool === 'replace_bg' ? "A cozy coffee shop..." : activeTool === 'txt2img' ? "Describe the image you want to create (supports Arabic)..." : "Describe the motion or effect..."}
                                   className="w-full h-24 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                   style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                               />
                           </div>
                       )}

                       {/* Aspect Ratio / Resolution Settings */}
                       {(activeTool === 'img2vid' || activeTool === 'upload' || activeTool === 'txt2img') && (
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('studio_aspect_ratio')}</label>
                                   <select 
                                      value={aspectRatio} 
                                      onChange={(e) => setAspectRatio(e.target.value as any)}
                                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none"
                                   >
                                       <option value="16:9">16:9 Landscape</option>
                                       <option value="9:16">9:16 Portrait</option>
                                       {activeTool === 'txt2img' && <option value="1:1">1:1 Square</option>}
                                   </select>
                               </div>
                               {activeTool !== 'txt2img' && (
                                   <div>
                                       <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">{t('studio_resolution')}</label>
                                       <select 
                                          value={resolution} 
                                          onChange={(e) => setResolution(e.target.value as any)}
                                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none"
                                       >
                                           <option value="720p">720p Fast</option>
                                           <option value="1080p">1080p HD</option>
                                       </select>
                                   </div>
                               )}
                           </div>
                       )}
                   </div>

                   {/* Generate Action */}
                   <button
                       onClick={handleGenerate}
                       disabled={loading || (!uploadedImage && activeTool !== 'img2vid' && activeTool !== 'upload' && activeTool !== 'txt2img')} 
                       className={`w-full mt-8 py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                           ['img2vid','upload','txt2img'].includes(activeTool) ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-500/30'
                       }`}
                   >
                       {loading ? (
                           <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>{activeTool === 'img2vid' || activeTool === 'txt2img' ? t('studio_generating') : t('studio_processing_image')}</span>
                           </>
                       ) : (
                           <>
                              <Sparkles size={20} />
                              <span>Generate</span>
                           </>
                       )}
                   </button>
               </div>
          </div>

          {/* RIGHT: RESULTS GALLERY */}
          <div className="lg:col-span-3">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Film size={20} className="text-slate-400" /> {t('studio_projects_title')}
              </h3>

              <div className="space-y-4">
                  {projects.map((project) => (
                      <div key={project.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm group">
                          {project.type === 'video' ? (
                              <div className="aspect-video bg-black relative">
                                  <video src={project.url} controls className="w-full h-full object-cover" />
                              </div>
                          ) : (
                              <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                                  <img src={project.url} alt="Result" className="w-full h-full object-cover" />
                              </div>
                          )}
                          
                          <div className="p-3">
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">{project.prompt}</p>
                              <a 
                                href={project.url} 
                                download={`studio-result-${project.id}.${project.type === 'video' ? 'mp4' : 'png'}`}
                                className="block w-full text-center py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                              >
                                  <Download size={14} className="inline mr-1" /> Download
                              </a>
                          </div>
                      </div>
                  ))}
                  
                  {projects.length === 0 && (
                      <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                          <p className="text-sm text-slate-400">{t('studio_no_projects')}</p>
                      </div>
                  )}
              </div>
          </div>

      </div>
    </div>
  );
};

export default CreativeStudio;
