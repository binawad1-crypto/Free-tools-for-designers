
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Scaling, Upload, Image as ImageIcon, X, Download, Settings, Lock, Unlock, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProcessedImage {
  id: string;
  originalFile: File;
  previewUrl: string;
  processedUrl: string | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  size: number;
}

const ResizeTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [files, setFiles] = useState<ProcessedImage[]>([]);
  const [dragging, setDragging] = useState(false);
  
  // Settings
  const [mode, setMode] = useState<'dimensions' | 'percentage'>('percentage');
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [percent, setPercent] = useState<number>(50);
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(0.9);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    // Convert to array and limit to 10
    const newFiles = Array.from(fileList)
      .filter(file => file.type.startsWith('image/'))
      .slice(0, 10 - files.length);

    const processedNewFiles: ProcessedImage[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      previewUrl: URL.createObjectURL(file),
      processedUrl: null,
      status: 'pending',
      originalWidth: 0,
      originalHeight: 0,
      newWidth: 0,
      newHeight: 0,
      size: file.size
    }));

    setFiles(prev => [...prev, ...processedNewFiles]);

    // Load dimensions
    processedNewFiles.forEach(item => {
      const img = new Image();
      img.onload = () => {
        setFiles(current => current.map(f => {
          if (f.id === item.id) {
            return {
              ...f,
              originalWidth: img.width,
              originalHeight: img.height,
              newWidth: Math.round(img.width * 0.5), // Default 50%
              newHeight: Math.round(img.height * 0.5)
            };
          }
          return f;
        }));
      };
      img.src = item.previewUrl;
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processImages = async () => {
    const updatedFiles = await Promise.all(files.map(async (file) => {
      if (file.status === 'done') return file;

      try {
        const result = await resizeImage(file);
        return { ...file, processedUrl: result, status: 'done' as const };
      } catch (e) {
        return { ...file, status: 'error' as const };
      }
    }));
    setFiles(updatedFiles);
  };

  const resizeImage = (fileItem: ProcessedImage): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let targetW = 0;
        let targetH = 0;

        if (mode === 'percentage') {
          targetW = Math.round(img.width * (percent / 100));
          targetH = Math.round(img.height * (percent / 100));
        } else {
          // Dimensions mode
          if (width && height) {
            targetW = Number(width);
            targetH = Number(height);
          } else if (width) {
            targetW = Number(width);
            targetH = lockRatio ? Math.round(img.height * (Number(width) / img.width)) : img.height;
          } else if (height) {
            targetH = Number(height);
            targetW = lockRatio ? Math.round(img.width * (Number(height) / img.height)) : img.width;
          } else {
            // Fallback if no input
            targetW = img.width;
            targetH = img.height;
          }
        }

        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No context');
        
        ctx.drawImage(img, 0, 0, targetW, targetH);
        
        const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject('Blob failed');
          }
        }, mimeType, quality);
      };
      img.onerror = reject;
      img.src = fileItem.previewUrl;
    });
  };

  const handleDownload = (file: ProcessedImage) => {
    if (!file.processedUrl) return;
    const link = document.createElement('a');
    link.href = file.processedUrl;
    link.download = `resized_${file.originalFile.name.split('.')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to format bytes
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
           <Scaling size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('resize_tool')}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t('app_desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Settings & Processing */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Settings size={20} className="text-indigo-500" />
                 {t('resize_settings_title')}
              </h2>

              {/* Mode Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                 <button
                   onClick={() => setMode('percentage')}
                   className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'percentage' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                 >
                   % {t('resize_mode_percentage')}
                 </button>
                 <button
                   onClick={() => setMode('dimensions')}
                   className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'dimensions' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                 >
                   PX {t('resize_mode_dimensions')}
                 </button>
              </div>

              {/* Controls */}
              <div className="space-y-4 mb-6">
                 {mode === 'percentage' ? (
                   <div>
                      <div className="flex justify-between text-sm mb-2">
                         <label className="text-slate-600 dark:text-slate-400">{t('resize_percent')}</label>
                         <span className="font-bold">{percent}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="200" 
                        value={percent} 
                        onChange={(e) => setPercent(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{t('resize_width')}</label>
                        <input 
                          type="number" 
                          value={width}
                          onChange={(e) => setWidth(Number(e.target.value))}
                          placeholder="Auto"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{t('resize_height')}</label>
                        <input 
                          type="number" 
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          placeholder="Auto"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <button 
                          onClick={() => setLockRatio(!lockRatio)}
                          className={`flex items-center gap-2 text-sm ${lockRatio ? 'text-indigo-500' : 'text-slate-400'}`}
                        >
                          {lockRatio ? <Lock size={14} /> : <Unlock size={14} />}
                          {t('resize_lock_ratio')}
                        </button>
                      </div>
                   </div>
                 )}
              </div>
              
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-6" />

              {/* Output Settings */}
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">{t('resize_format')}</label>
                    <select 
                      value={format}
                      onChange={(e) => setFormat(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                 </div>
                 {format !== 'png' && (
                   <div>
                      <div className="flex justify-between text-sm mb-2">
                         <label className="text-slate-600 dark:text-slate-400">{t('resize_quality')}</label>
                         <span className="font-bold">{Math.round(quality * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1" 
                        step="0.1"
                        value={quality} 
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                   </div>
                 )}
              </div>

              {/* Action Button */}
              <button 
                onClick={processImages}
                disabled={files.length === 0}
                className="w-full mt-8 py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Scaling size={20} />
                {t('resize_btn')}
              </button>
           </div>
        </div>

        {/* RIGHT: Dropzone & List */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Dropzone */}
           <div 
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}
             className={`
               relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[200px]
               ${dragging 
                 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                 : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
               }
             `}
           >
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={(e) => handleFiles(e.target.files)} 
               className="hidden" 
               multiple 
               accept="image/*"
             />
             <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                <Upload size={24} className="text-indigo-500" />
             </div>
             <p className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-1">
               {t('resize_drop_label')}
             </p>
             <p className="text-sm text-slate-400">JPG, PNG, WEBP (Max 10 files)</p>
           </div>

           {/* Files List */}
           {files.length > 0 && (
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="font-bold text-slate-700 dark:text-slate-300">
                     {files.length} Images Selected
                   </h3>
                   <button 
                     onClick={() => setFiles([])}
                     className="text-sm text-red-500 hover:text-red-600"
                   >
                     {t('resize_clear_btn')}
                   </button>
                </div>

                {files.map((file) => (
                  <div key={file.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm group">
                     {/* Thumbnail */}
                     <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0">
                        <img src={file.processedUrl || file.previewUrl} className="w-full h-full object-cover" alt="prev" />
                     </div>

                     {/* Info */}
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate pr-4">{file.originalFile.name}</h4>
                           <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                             file.status === 'done' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                             file.status === 'error' ? 'bg-red-100 text-red-600' : 
                             'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                           }`}>
                             {file.status === 'done' ? t('resize_status_done') : t('resize_status_pending')}
                           </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                           <span>{Math.round(file.originalWidth)} x {Math.round(file.originalHeight)}</span>
                           {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                           <span className="text-indigo-500 font-bold">
                             {mode === 'percentage' 
                               ? `${Math.round(file.originalWidth * (percent/100))} x ${Math.round(file.originalHeight * (percent/100))}`
                               : width || height ? 'Custom' : '...'
                             }
                           </span>
                           <span className="text-xs border-l border-slate-200 dark:border-slate-700 pl-3">
                             {formatSize(file.size)}
                           </span>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex items-center gap-2">
                        {file.status === 'done' && (
                          <button 
                            onClick={() => handleDownload(file)}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 transition-colors"
                          >
                            <Download size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <X size={18} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default ResizeTool;
