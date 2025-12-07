

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { SMART_TOOLS_DATA, Language } from '../types';
import { QrCode, Palette, Type, Pipette, ArrowRight, ArrowLeft, Scaling, Ruler, ScrollText, FileStack, LayoutGrid, Hexagon, Megaphone, Swords, Bot, AudioWaveform, ScanEye, Mic2, Code2, Shapes, Wand2, Glasses } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  QrCode: <QrCode size={28} />,
  Palette: <Palette size={28} />,
  Type: <Type size={28} />,
  Pipette: <Pipette size={28} />,
  Scaling: <Scaling size={28} />,
  Ruler: <Ruler size={28} />,
  ScrollText: <ScrollText size={28} />,
  FileStack: <FileStack size={28} />,
  LayoutGrid: <LayoutGrid size={28} />,
  Hexagon: <Hexagon size={28} />,
  Megaphone: <Megaphone size={28} />,
  Swords: <Swords size={28} />,
  Bot: <Bot size={28} />,
  AudioWaveform: <AudioWaveform size={28} />,
  ScanEye: <ScanEye size={28} />,
  Mic2: <Mic2 size={28} />,
  Code2: <Code2 size={28} />,
  Shapes: <Shapes size={28} />,
  Wand2: <Wand2 size={28} />,
  Glasses: <Glasses size={28} />,
};

// Map themes to Tailwind classes
const themeStyles: Record<string, {
  border: string;
  shadow: string;
  bgIcon: string;
  text: string;
  hoverBorder: string;
  glow: string;
}> = {
  blue: {
    border: 'border-blue-100 dark:border-blue-900/30',
    hoverBorder: 'group-hover:border-blue-500/50',
    shadow: 'shadow-blue-500/5',
    bgIcon: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'from-blue-500/20 to-cyan-500/20'
  },
  purple: {
    border: 'border-purple-100 dark:border-purple-900/30',
    hoverBorder: 'group-hover:border-purple-500/50',
    shadow: 'shadow-purple-500/5',
    bgIcon: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'from-purple-500/20 to-pink-500/20'
  },
  emerald: {
    border: 'border-emerald-100 dark:border-emerald-900/30',
    hoverBorder: 'group-hover:border-emerald-500/50',
    shadow: 'shadow-emerald-500/5',
    bgIcon: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'from-emerald-500/20 to-green-500/20'
  },
  orange: {
    border: 'border-orange-100 dark:border-orange-900/30',
    hoverBorder: 'group-hover:border-orange-500/50',
    shadow: 'shadow-orange-500/5',
    bgIcon: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'from-orange-500/20 to-red-500/20'
  },
  indigo: {
    border: 'border-indigo-100 dark:border-indigo-900/30',
    hoverBorder: 'group-hover:border-indigo-500/50',
    shadow: 'shadow-indigo-500/5',
    bgIcon: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    glow: 'from-indigo-500/20 to-violet-500/20'
  },
  rose: {
    border: 'border-rose-100 dark:border-rose-900/30',
    hoverBorder: 'group-hover:border-rose-500/50',
    shadow: 'shadow-rose-500/5',
    bgIcon: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'from-rose-500/20 to-orange-500/20'
  },
  slate: {
    border: 'border-slate-200 dark:border-slate-800',
    hoverBorder: 'group-hover:border-slate-400',
    shadow: 'shadow-slate-500/5',
    bgIcon: 'bg-slate-600',
    text: 'text-slate-700 dark:text-slate-300',
    glow: 'from-slate-500/20 to-gray-500/20'
  },
  red: {
    border: 'border-red-100 dark:border-red-900/30',
    hoverBorder: 'group-hover:border-red-500/50',
    shadow: 'shadow-red-500/5',
    bgIcon: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    glow: 'from-red-500/20 to-rose-500/20'
  },
  cyan: {
    border: 'border-cyan-100 dark:border-cyan-900/30',
    hoverBorder: 'group-hover:border-cyan-500/50',
    shadow: 'shadow-cyan-500/5',
    bgIcon: 'bg-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'from-cyan-500/20 to-teal-500/20'
  },
  gold: {
    border: 'border-amber-100 dark:border-amber-900/30',
    hoverBorder: 'group-hover:border-amber-500/50',
    shadow: 'shadow-amber-500/5',
    bgIcon: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'from-amber-500/20 to-yellow-500/20'
  },
  pink: {
    border: 'border-pink-100 dark:border-pink-900/30',
    hoverBorder: 'group-hover:border-pink-500/50',
    shadow: 'shadow-pink-500/5',
    bgIcon: 'bg-pink-500',
    text: 'text-pink-600 dark:text-pink-400',
    glow: 'from-pink-500/20 to-rose-500/20'
  }
};

const DesignerTools = () => {
  const { language, t, isRTL } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
       <div className="flex flex-col gap-4 items-center text-center py-4">
            <h1 className="text-4xl font-black dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400">
                {t('nav_tools')}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
                {t('app_desc')}
            </p>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        {SMART_TOOLS_DATA.map((tool, index) => {
          const style = themeStyles[tool.colorTheme] || themeStyles.blue;
          
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className={`
                group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-300 hover:-translate-y-2
                bg-white dark:bg-[#151925] border ${style.border} ${style.hoverBorder}
                shadow-sm hover:shadow-2xl hover:shadow-${tool.colorTheme}-500/20
              `}
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${tool.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${style.glow} opacity-0 group-hover:opacity-100 rounded-full blur-3xl transition-all duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full gap-8">
                <div className="flex items-center justify-between">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500
                    bg-gradient-to-br ${tool.gradient}
                  `}>
                    {iconMap[tool.icon]}
                  </div>
                  
                  <div className={`
                    w-12 h-12 rounded-full border border-slate-100 dark:border-white/5 flex items-center justify-center 
                    text-slate-300 group-hover:${style.text} transition-all bg-slate-50 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10
                  `}>
                     {isRTL ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
                  </div>
                </div>

                <div>
                  <h3 className={`text-2xl font-bold text-slate-900 dark:text-white mb-3 font-cairo group-hover:${style.text} transition-colors`}>
                    {language === Language.EN ? tool.titleEn : tool.titleAr}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {language === Language.EN ? tool.descEn : tool.descAr}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DesignerTools;