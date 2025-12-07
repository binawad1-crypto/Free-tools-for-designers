

import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { FileStack, Merge, Image, Scissors, Upload, FileText, X, Download, Loader2, Minimize2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

type PDFAction = 'merge' | 'img2pdf' | 'split' | 'compress';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

const PDFTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [activeTab, setActiveTab] = useState<PDFAction>('merge');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [processing, setProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'merge', icon: Merge, label: 'pdf_tab_merge' },
    { id: 'img2pdf', icon: Image, label: 'pdf_tab_img2pdf' },
    { id: 'split', icon: Scissors, label: 'pdf_tab_split' },
    { id: 'compress', icon: Minimize2, label: 'pdf_tab_compress' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileItem[] = Array.from(fileList).map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      name: f.name,
      size: f.size
    }));
    
    if (activeTab === 'split' || activeTab === 'compress') {
        // Only allow one file for split or compress
        setFiles([newFiles[0]]);
    } else {
        setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // --- ACTIONS ---

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      downloadPDF(pdfBytes, 'merged_document.pdf');
    } catch (err) {
      console.error(err);
      alert('Error merging files. Ensure they are valid PDFs.');
    } finally {
      setProcessing(false);
    }
  };

  const handleImgToPdf = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const item of files) {
        const imageBytes = await item.file.arrayBuffer();
        let image;
        if (item.file.type === 'image/jpeg') {
            image = await pdfDoc.embedJpg(imageBytes);
        } else if (item.file.type === 'image/png') {
            image = await pdfDoc.embedPng(imageBytes);
        } else {
            continue; // Skip unsupported
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      downloadPDF(pdfBytes, 'images_portfolio.pdf');
    } catch (err) {
      console.error(err);
      alert('Error converting images.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
        const arrayBuffer = await files[0].file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();

        // For simplicity in this demo, we extract the first page, or could extract all as separate files
        // Here we will extract ALL pages as individual PDFs (sequentially triggered downloads - simpler than zipping client side without extra libs)
        
        for (let i = 0; i < pageCount; i++) {
            const newPdf = await PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(pdf, [i]);
            newPdf.addPage(copiedPage);
            const bytes = await newPdf.save();
            downloadPDF(bytes, `${files[0].name.replace('.pdf', '')}_page_${i+1}.pdf`);
        }

    } catch (err) {
        console.error(err);
        alert('Error splitting PDF.');
    } finally {
        setProcessing(false);
    }
  }

  const handleCompress = async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
        const arrayBuffer = await files[0].file.arrayBuffer();
        // Load the PDF
        const pdf = await PDFDocument.load(arrayBuffer);
        
        // Saving the PDF essentially re-writes it, removing unused objects and incremental update history.
        // This is the most effective client-side compression available without heavy WASM libraries.
        const bytes = await pdf.save({ useObjectStreams: true });
        
        downloadPDF(bytes, `compressed_${files[0].name}`);
    } catch (err) {
        console.error(err);
        alert('Error compressing PDF.');
    } finally {
        setProcessing(false);
    }
  };

  const downloadPDF = (bytes: Uint8Array, name: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
           <FileStack size={32} />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-500">
          {t('pdf_tool')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('app_desc')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-1">
            {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as PDFAction); setFiles([]); }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Icon size={18} />
                        {t(tab.label as any)}
                    </button>
                )
            })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl border border-slate-200 dark:border-slate-800 min-h-[400px]">
        
        {/* Dropzone */}
        <div 
             onDragOver={handleDragOver}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => e.target.files && handleFiles(e.target.files)} 
                className="hidden" 
                multiple={activeTab !== 'split' && activeTab !== 'compress'}
                accept={activeTab === 'img2pdf' ? "image/jpeg, image/png" : "application/pdf"}
             />
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Upload size={24} />
             </div>
             <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                {activeTab === 'img2pdf' ? t('pdf_drop_imgs') : t('pdf_drop_pdfs')}
             </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
            <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">
                        {t('pdf_files_count')}: {files.length}
                    </h3>
                    <button onClick={() => setFiles([])} className="text-red-500 text-sm hover:underline">{t('resize_clear_btn')}</button>
                </div>

                <div className="space-y-2">
                    {files.map((file, idx) => (
                        <div key={file.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                                {activeTab === 'img2pdf' ? <Image size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                            </div>
                            <button onClick={() => removeFile(file.id)} className="p-2 text-slate-400 hover:text-red-500">
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Main Action Button */}
                <div className="pt-4">
                    <button
                        onClick={() => {
                            if (activeTab === 'merge') handleMerge();
                            if (activeTab === 'img2pdf') handleImgToPdf();
                            if (activeTab === 'split') handleSplit();
                            if (activeTab === 'compress') handleCompress();
                        }}
                        disabled={processing || files.length === 0}
                        className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {processing ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                        <span>
                            {processing ? t('pdf_processing') : 
                             activeTab === 'merge' ? t('pdf_btn_merge') :
                             activeTab === 'img2pdf' ? t('pdf_btn_convert') : 
                             activeTab === 'split' ? t('pdf_btn_split') :
                             t('pdf_btn_compress')
                            }
                        </span>
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default PDFTool;