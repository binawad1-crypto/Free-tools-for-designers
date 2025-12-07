
import React, { useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { generateSpeech, transcribeAudio } from '../../services/geminiService';
import { Mic2, FileAudio, PlayCircle, Mic, Loader2, Type, Upload } from 'lucide-react';

const AudioTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [activeTab, setActiveTab] = useState<'tts' | 'transcribe'>('tts');
  const [loading, setLoading] = useState(false);
  
  // TTS State
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Transcribe State
  const [uploadFile, setUploadFile] = useState<{data: string, mime: string, name: string} | null>(null);
  const [transcript, setTranscript] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- TTS Handlers ---
  const handleTTS = async () => {
      if (!text.trim()) return;
      setLoading(true);
      try {
          const base64 = await generateSpeech(text);
          if (base64) {
              setAudioSrc(`data:audio/mp3;base64,${base64}`);
          }
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  // --- Transcribe Handlers ---
  const handleTranscribeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setUploadFile({ data: base64, mime: f.type, name: f.name });
      };
      reader.readAsDataURL(f);
  };

  const processTranscription = async () => {
      if (!uploadFile) return;
      setLoading(true);
      try {
          const result = await transcribeAudio(uploadFile.data, uploadFile.mime);
          setTranscript(result || 'No transcription generated.');
      } catch (err) {
          console.error(err);
          setTranscript('Error processing audio.');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400">
                <Mic2 size={32} />
            </div>
            <h1 className="text-3xl font-bold dark:text-white">{t('tool_audio')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('desc_audio')}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
            <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl inline-flex">
                <button
                    onClick={() => setActiveTab('tts')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'tts' ? 'bg-white dark:bg-slate-700 shadow text-teal-600 dark:text-teal-400' : 'text-slate-500'
                    }`}
                >
                    <PlayCircle size={18} /> {t('audio_tab_tts')}
                </button>
                <button
                    onClick={() => setActiveTab('transcribe')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'transcribe' ? 'bg-white dark:bg-slate-700 shadow text-teal-600 dark:text-teal-400' : 'text-slate-500'
                    }`}
                >
                    <FileAudio size={18} /> {t('audio_tab_transcribe')}
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl min-h-[400px]">
            
            {activeTab === 'tts' ? (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <div>
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">{t('audio_input_text')}</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none resize-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Type something amazing..."
                        />
                    </div>
                    
                    <button
                        onClick={handleTTS}
                        disabled={loading || !text.trim()}
                        className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <PlayCircle />}
                        {t('audio_btn_speak')}
                    </button>

                    {audioSrc && (
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-2xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="w-12 h-12 bg-white dark:bg-teal-800 rounded-full flex items-center justify-center shadow">
                                <PlayCircle size={24} className="text-teal-600 dark:text-white" />
                            </div>
                            <audio controls src={audioSrc} className="w-full" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <input type="file" ref={fileInputRef} onChange={handleTranscribeFile} className="hidden" accept="audio/*" />
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                            <Upload size={28} />
                        </div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{uploadFile ? uploadFile.name : 'Upload Audio File'}</p>
                    </div>

                    <button
                        onClick={processTranscription}
                        disabled={loading || !uploadFile}
                        className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Type />}
                        Convert to Text
                    </button>

                    {transcript && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl">
                            <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Transcription</h3>
                            <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{transcript}</p>
                        </div>
                    )}
                </div>
            )}

        </div>
    </div>
  );
};

export default AudioTool;
