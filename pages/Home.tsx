

import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { TOOLS_DATA, Language } from '../types';
import { QrCode, Palette, Type, Pipette, ArrowRight, ArrowLeft, Scaling, Ruler, ScrollText, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  QrCode: <QrCode size={28} />,
  Palette: <Palette size={28} />,
  Type: <Type size={28} />,
  Pipette: <Pipette size={28} />,
  Scaling: <Scaling size={28} />,
  Ruler: <Ruler size={28} />,
  ScrollText: <ScrollText size={28} />,
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
  }
};

const Home: React.FC = () => {
  const { language, t, isRTL } = useApp();

  return (
    <div className="space-y-12 py-8 lg:py-10">
      
      {/* New Dashboard Banner Hero */}
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-8 group">
          
          {/* Noise & Glow Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 brightness-125 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500 pointer-events-none"></div>

          {/* Content Side (Title) */}
          <div className="relative z-10 flex items-center gap-6 text-center md:text-start flex-col md:flex-row w-full md:w-auto">
             <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner shrink-0">
                <Sparkles size={32} className="text-white fill-white/20" />
             </div>
             <div>
                <h1 className="text-3xl md:text-5xl font-black text-white font-cairo mb-2 tracking-wide leading-tight">
                   {t('hero_title')}
                </h1>
                <p className="text-purple-100 text-lg font-medium opacity-90 leading-relaxed max-w-lg">
                   {t('hero_desc')}
                </p>
             </div>
          </div>

          {/* Pill Side (Tokens) */}
          <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end">
             <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/25 transition-colors cursor-default min-w-[240px] justify-center md:justify-start">
                 <span className="text-purple-100 font-bold text-sm uppercase tracking-wider whitespace-nowrap">{t('tokens_remaining')}:</span>
                 <span className="text-white font-black text-2xl font-mono tracking-tight">99970</span>
             </div>
          </div>

        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {TOOLS_DATA.map((tool, index) => {
          const style = themeStyles[tool.colorTheme] || themeStyles.blue;
          
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className={`
                group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1
                bg-white dark:bg-[#151925]/80 backdrop-blur-md 
                border ${style.border} ${style.hoverBorder}
                hover:shadow-2xl hover:shadow-${tool.colorTheme}-500/10
                ${index === 0 ? 'lg:col-span-2' : ''}
              `}
            >
              {/* Dynamic Glow Background */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tool.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${style.glow} opacity-0 group-hover:opacity-100 rounded-full blur-3xl transition-all duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full gap-6">
                
                {/* Header with Colored Icon Container */}
                <div className="flex items-center justify-between">
                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500
                    bg-gradient-to-br ${tool.gradient}
                  `}>
                    {iconMap[tool.icon]}
                  </div>
                  
                  {/* Subtle Arrow */}
                  <div className={`
                    w-10 h-10 rounded-full border border-slate-100 dark:border-white/5 flex items-center justify-center 
                    text-slate-300 group-hover:${style.text} transition-colors bg-slate-50 dark:bg-white/5
                  `}>
                     {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className={`text-2xl font-bold text-slate-900 dark:text-white mb-2 font-cairo group-hover:${style.text} transition-colors`}>
                    {language === Language.EN ? tool.titleEn : tool.titleAr}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">
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

export default Home;
