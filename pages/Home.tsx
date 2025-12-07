
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { TOOLS_DATA, Language } from '../types';
import { QrCode, Palette, Type, Pipette, ArrowRight, ArrowLeft, Zap, Star, ShieldCheck, Scaling, Ruler, ScrollText } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  QrCode: <QrCode size={32} />,
  Palette: <Palette size={32} />,
  Type: <Type size={32} />,
  Pipette: <Pipette size={32} />,
  Scaling: <Scaling size={32} />,
  Ruler: <Ruler size={32} />,
  ScrollText: <ScrollText size={32} />,
};

const Home: React.FC = () => {
  const { language, t, isRTL } = useApp();

  return (
    <div className="space-y-20 py-8 lg:py-16">
      
      {/* Hero Section */}
      <div className="relative text-center max-w-4xl mx-auto space-y-8">
        
        {/* Floating Badges */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Star size={12} className="fill-purple-500/50" />
            <span>مجاني 100%</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Zap size={12} className="fill-blue-500/50" />
            <span>سريع وسهل</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <ShieldCheck size={12} className="fill-emerald-500/50" />
            <span>احترافي</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-purple-500/30 mb-8 transform hover:rotate-6 transition-transform duration-500">
             <Palette size={40} className="text-white -rotate-12" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block text-slate-800 dark:text-white mb-2 font-cairo">خدمات مجانية</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 animate-gradient-x font-cairo">
              للمصممين المبدعين
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
             مجموعة شاملة من الأدوات المجانية للمصممين. صممت لتسريع عملك وإلهام إبداعك، مدعومة بأحدث تقنيات الذكاء الاصطناعي.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {TOOLS_DATA.map((tool, index) => (
          <Link
            key={tool.id}
            to={tool.path}
            className={`group relative overflow-hidden rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2
              bg-white/70 dark:bg-[#151925]/60 backdrop-blur-xl border border-white/50 dark:border-white/10
              shadow-xl shadow-slate-200/40 dark:shadow-black/20 hover:shadow-2xl hover:shadow-purple-500/10
              ${index === 0 || index === 6 ? 'lg:col-span-2' : ''}
            `}
          >
            {/* Background Gradient Blob */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${tool.gradient} opacity-[0.05] group-hover:opacity-[0.1] rounded-full blur-3xl transition-opacity duration-500`} />
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div className="flex items-start justify-between">
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500
                  bg-gradient-to-br ${tool.gradient}
                `}>
                  {iconMap[tool.icon]}
                </div>
                
                <div className="w-10 h-10 rounded-full border border-white/50 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors bg-white/50 dark:bg-white/5 backdrop-blur-md">
                   {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-cairo">
                  {language === Language.EN ? tool.titleEn : tool.titleAr}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                  {language === Language.EN ? tool.descEn : tool.descAr}
                </p>
              </div>

              <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;