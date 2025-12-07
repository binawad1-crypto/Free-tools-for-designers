
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { SPECIAL_TOOLS_DATA, Language } from '../types';
import { Bot, AudioWaveform, ScanEye, Mic2, ArrowRight, ArrowLeft } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot size={28} />,
  AudioWaveform: <AudioWaveform size={28} />,
  ScanEye: <ScanEye size={28} />,
  Mic2: <Mic2 size={28} />,
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
  indigo: {
    border: 'border-indigo-100 dark:border-indigo-900/30',
    hoverBorder: 'group-hover:border-indigo-500/50',
    shadow: 'shadow-indigo-500/5',
    bgIcon: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    glow: 'from-indigo-500/20 to-blue-500/20'
  },
  red: {
    border: 'border-red-100 dark:border-red-900/30',
    hoverBorder: 'group-hover:border-red-500/50',
    shadow: 'shadow-red-500/5',
    bgIcon: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    glow: 'from-red-500/20 to-orange-500/20'
  },
  gold: {
    border: 'border-amber-100 dark:border-amber-900/30',
    hoverBorder: 'group-hover:border-amber-500/50',
    shadow: 'shadow-amber-500/5',
    bgIcon: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'from-amber-500/20 to-yellow-500/20'
  },
  emerald: {
    border: 'border-emerald-100 dark:border-emerald-900/30',
    hoverBorder: 'group-hover:border-emerald-500/50',
    shadow: 'shadow-emerald-500/5',
    bgIcon: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'from-emerald-500/20 to-green-500/20'
  }
};

const SpecialToolsHub: React.FC = () => {
  const { language, t, isRTL } = useApp();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
       <div className="flex flex-col gap-4 items-center text-center py-4">
            <h1 className="text-4xl font-black dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                {t('special_hub_title')}
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
                {t('special_hub_desc')}
            </p>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0">
        {SPECIAL_TOOLS_DATA.map((tool) => {
          const style = themeStyles[tool.colorTheme] || themeStyles.indigo;
          
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

export default SpecialToolsHub;
