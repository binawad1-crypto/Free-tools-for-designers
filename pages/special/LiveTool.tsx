

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, Loader2, Activity } from 'lucide-react';
import { getApiKey } from '../../services/geminiService';

const LiveTool: React.FC = () => {
  const { t } = useApp();
  const [connected, setConnected] = useState(false);
  const [speaking, setSpeaking] = useState(false); // Model speaking
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null); // To store the session object
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  
  // Audio Playback
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Visualizer
  const [visualData, setVisualData] = useState<number[]>([10, 20, 15, 30, 25, 40, 30, 20]);

  const disconnect = () => {
      if (sessionRef.current) {
          sessionRef.current.close(); // Assuming .close() exists on session or handle disconnection
      }
      if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
          audioContextRef.current.close();
      }
      
      setConnected(false);
      setSpeaking(false);
      nextStartTimeRef.current = 0;
      sourcesRef.current.forEach(s => s.stop());
      sourcesRef.current.clear();
  };

  const connect = async () => {
      setError(null);
      
      try {
          // Initialize AI with dynamic key
          const apiKey = await getApiKey();
          if (!apiKey) throw new Error("No API Key available");
          
          const ai = new GoogleGenAI({ apiKey });
          
          // Audio Context
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
          const outputNode = audioContextRef.current.createGain();
          outputNode.connect(audioContextRef.current.destination);

          // Input Stream
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStreamRef.current = stream;
          
          const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
              if (!connected) return; // Guard
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // Send if session active
              if (sessionRef.current) {
                  sessionRef.current.sendRealtimeInput({ media: pcmBlob });
              }
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);

          // Connect Live API
          const sessionPromise = ai.live.connect({
              model: 'gemini-2.5-flash-native-audio-preview-09-2025',
              config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: {
                      voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                  }
              },
              callbacks: {
                  onopen: () => {
                      setConnected(true);
                  },
                  onmessage: async (msg: LiveServerMessage) => {
                      const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                      if (audioData && audioContextRef.current) {
                          setSpeaking(true);
                          
                          // Decode & Play
                          const audioCtx = audioContextRef.current;
                          nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                          
                          const buffer = await decodeAudioData(decode(audioData), audioCtx, 24000, 1);
                          const source = audioCtx.createBufferSource();
                          source.buffer = buffer;
                          source.connect(outputNode);
                          
                          source.addEventListener('ended', () => {
                              sourcesRef.current.delete(source);
                              if (sourcesRef.current.size === 0) setSpeaking(false);
                          });

                          source.start(nextStartTimeRef.current);
                          nextStartTimeRef.current += buffer.duration;
                          sourcesRef.current.add(source);
                      }

                      if (msg.serverContent?.interrupted) {
                          sourcesRef.current.forEach(s => s.stop());
                          sourcesRef.current.clear();
                          nextStartTimeRef.current = 0;
                          setSpeaking(false);
                      }
                  },
                  onclose: () => {
                      setConnected(false);
                  },
                  onerror: (err) => {
                      console.error(err);
                      setError("Connection Error");
                      setConnected(false);
                  }
              }
          });

          const session = await sessionPromise;
          sessionRef.current = session;

      } catch (err) {
          console.error(err);
          setError("Failed to connect. Check mic access or API Key.");
          setConnected(false);
      }
  };

  useEffect(() => {
      // Fake visualizer animation
      if (connected) {
          const interval = setInterval(() => {
              setVisualData(Array.from({length: 8}, () => Math.random() * 40 + 10));
          }, 100);
          return () => clearInterval(interval);
      } else {
          setVisualData([10, 10, 10, 10, 10, 10, 10, 10]);
      }
  }, [connected]);

  // Cleanup
  useEffect(() => {
      return () => disconnect();
  }, []);

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-140px)] flex flex-col items-center justify-center relative">
        
        {/* Main Circle UI */}
        <div className={`
            relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-700
            ${connected 
                ? 'bg-red-500 shadow-[0_0_100px_rgba(239,68,68,0.4)]' 
                : 'bg-slate-200 dark:bg-slate-800 shadow-xl'
            }
        `}>
            {/* Ripples when speaking */}
            {speaking && (
                <>
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-[ping_1.5s_infinite]" />
                </>
            )}

            {/* Inner Content */}
            <div className="z-10 flex flex-col items-center gap-4 text-white">
                {connected ? (
                    <Activity size={48} className="animate-pulse" />
                ) : (
                    <MicOff size={48} className="text-slate-400" />
                )}
            </div>
        </div>

        {/* Status Text */}
        <div className="mt-12 text-center space-y-2">
            <h2 className="text-2xl font-bold dark:text-white">
                {connected ? (speaking ? 'Gemini Speaking...' : 'Listening...') : t('tool_live')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
                {error ? <span className="text-red-500">{error}</span> : t('desc_live')}
            </p>
        </div>

        {/* Visualizer Bar */}
        <div className="mt-8 flex gap-2 h-12 items-center">
            {visualData.map((h, i) => (
                <div 
                    key={i} 
                    className={`w-3 rounded-full transition-all duration-100 ${connected ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    style={{ height: `${h}px` }} 
                />
            ))}
        </div>

        {/* Toggle Button */}
        <button
            onClick={connected ? disconnect : connect}
            className={`
                mt-12 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all active:scale-95
                ${connected 
                    ? 'bg-slate-800 text-white hover:bg-slate-900' 
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/30'
                }
            `}
        >
            {connected ? t('live_end') : t('live_start')}
        </button>

    </div>
  );
};

// Utils for Live API
function createBlob(data: Float32Array): { data: string, mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export default LiveTool;