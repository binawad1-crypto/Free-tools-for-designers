
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { sendChatMessage, ChatConfig } from '../../services/geminiService';
import { Bot, Zap, Search, MapPin, BrainCircuit, Send, User, Sparkles, Loader2, Link as LinkIcon } from 'lucide-react';

const SmartChatTool: React.FC = () => {
  const { t, isRTL } = useApp();
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string, sources?: any[]}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ChatConfig['mode']>('pro');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
        // Only keep limited history for simplicity in this demo, or full history
        const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
        const response = await sendChatMessage(userMsg, { mode }, history);
        
        let text = response.text || "I couldn't generate a response.";
        let sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        setMessages(prev => [...prev, { role: 'model', content: text, sources }]);
    } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error." }]);
    } finally {
        setLoading(false);
    }
  };

  const modes = [
      { id: 'pro', icon: Bot, label: 'chat_mode_pro', color: 'text-indigo-500' },
      { id: 'flash', icon: Zap, label: 'chat_mode_flash', color: 'text-yellow-500' },
      { id: 'search', icon: Search, label: 'chat_mode_search', color: 'text-blue-500' },
      { id: 'maps', icon: MapPin, label: 'chat_mode_maps', color: 'text-green-500' },
      { id: 'think', icon: BrainCircuit, label: 'chat_mode_think', color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-6">
        
        {/* Header / Mode Switcher */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-sm border border-slate-200 dark:border-slate-800 flex overflow-x-auto">
            {modes.map(m => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all whitespace-nowrap min-w-[140px] ${
                            active 
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Icon size={18} className={active ? '' : m.color} />
                        <span className="font-bold text-sm">{t(m.label as any)}</span>
                    </button>
                )
            })}
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col relative">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                            <Sparkles size={40} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold dark:text-white mb-2">{t('tool_smart_chat')}</h2>
                        <p className="text-slate-500">{t('desc_smart_chat')}</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                        }`}>
                            {msg.role === 'user' ? <User size={20} className="text-slate-500 dark:text-slate-300" /> : <Bot size={20} />}
                        </div>
                        
                        <div className={`max-w-[80%] space-y-2`}>
                            <div className={`p-4 rounded-2xl ${
                                msg.role === 'user' 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tr-none' 
                                : 'bg-indigo-50 dark:bg-indigo-900/20 text-slate-800 dark:text-indigo-100 rounded-tl-none border border-indigo-100 dark:border-indigo-900/30'
                            }`}>
                                <div className="prose dark:prose-invert text-sm max-w-none whitespace-pre-wrap">
                                    {msg.content}
                                </div>
                            </div>

                            {/* Sources (Search/Maps) */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="flex gap-2 flex-wrap text-xs">
                                    <span className="font-bold text-slate-400">{t('chat_sources')}:</span>
                                    {msg.sources.map((source: any, idx: number) => {
                                        if (source.web) {
                                            return (
                                                <a key={idx} href={source.web.uri} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-blue-500 hover:underline">
                                                    <LinkIcon size={10} /> {source.web.title}
                                                </a>
                                            )
                                        }
                                        return null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                            <Bot size={20} />
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl rounded-tl-none border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-2 text-sm text-indigo-500">
                            <Loader2 size={16} className="animate-spin" />
                            {mode === 'think' ? t('chat_thinking') : t('loading')}
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('chat_input_placeholder')}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-6 pr-16 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SmartChatTool;
