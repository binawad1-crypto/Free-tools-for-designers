import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Sparkles, Infinity as InfinityIcon, FolderOpen, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { t, language } = useApp();

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-emerald-500/20">
          {/* Decor */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-center md:text-start text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
                   {t('dash_welcome')} <span className="text-4xl">👋</span>
                </h1>
                <p className="text-emerald-50 font-medium opacity-90 text-lg">
                   {t('hero_desc')}
                </p>
                <Link to="/tools" className="mt-6 inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-colors">
                   <Zap size={20} fill="currentColor" />
                   {t('nav_tools')}
                </Link>
             </div>
             
             {/* Stats Cards in Banner (Mobile Only or Condensed) */}
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white min-w-[200px] text-center">
                 <p className="text-sm font-medium opacity-80 mb-1">{t('dash_stat_tokens')}</p>
                 <div className="text-3xl font-black font-mono">99,970</div>
                 <div className="text-xs opacity-60 mt-1">/ 100,000</div>
             </div>
          </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Recent Activity (Left Column - 2 Spans) */}
         <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <Clock size={20} className="text-slate-400" />
                    {t('dash_recent_activity')}
                </h3>
             </div>
             
             <div className="bg-white dark:bg-[#151925] rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                 {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${
                             i === 1 ? 'bg-indigo-500' : i === 2 ? 'bg-purple-500' : i === 3 ? 'bg-amber-500' : 'bg-rose-500'
                         }`}>
                             {i === 1 ? <Sparkles size={20} /> : <FolderOpen size={20} />}
                         </div>
                         <div className="flex-1">
                             <h4 className="font-bold dark:text-white group-hover:text-purple-500 transition-colors">Project Alpha Design</h4>
                             <p className="text-xs text-slate-500">Edited 2 hours ago • AI Color Palette</p>
                         </div>
                         <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
                             <ArrowRight size={16} className={language === 'ar' ? 'rotate-180' : ''} />
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* Right Column Stats */}
         <div className="space-y-6">
             <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <Sparkles size={20} className="text-slate-400" />
                {t('dash_stats_title')}
             </h3>

             <div className="grid grid-cols-1 gap-4">
                 <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
                     <div className="relative z-10">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                            <FolderOpen size={20} />
                        </div>
                        <h4 className="text-3xl font-bold mb-1">12</h4>
                        <p className="text-sm text-slate-400">{t('dash_stat_projects')}</p>
                     </div>
                     <div className="absolute right-0 bottom-0 opacity-10">
                         <FolderOpen size={100} />
                     </div>
                 </div>

                 <div className="bg-white dark:bg-[#151925] rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                         <Zap size={20} />
                     </div>
                     <h4 className="text-3xl font-bold mb-1 dark:text-white">84</h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400">{t('dash_stat_completed')}</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

// Simple Arrow icon helper
const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default Home;