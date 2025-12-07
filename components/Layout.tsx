import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Moon, Sun, Languages, ArrowLeft, ArrowRight, Command } from 'lucide-react';
import { Theme, Language } from '../types';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, language, toggleLanguage, t, isRTL } = useApp();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-500 selection:bg-purple-500/30">
      
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] dark:bg-purple-900/10" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-900/10" />
      </div>

      {/* Floating Navbar */}
      <div className="sticky top-6 z-50 px-4 mb-8">
        <nav className="max-w-7xl mx-auto rounded-2xl border border-white/20 dark:border-white/5 bg-white/70 dark:bg-[#151925]/70 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo / Back */}
              <div className="flex items-center gap-4">
                {!isHome && (
                  <Link 
                    to="/" 
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400"
                    title={t('back_home')}
                  >
                    {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                  </Link>
                )}
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
                    <Command size={18} />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 font-cairo tracking-wide">
                    {t('app_title')}
                  </span>
                </Link>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                >
                  <Languages size={14} />
                  <span>{language === Language.EN ? 'العربية' : 'EN'}</span>
                </button>
                
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-yellow-400"
                >
                  {theme === Theme.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 relative z-10">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 mt-20 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0B0F19]/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-500 font-medium">
            <p>{t('footer_text')}</p>
            <div className="flex items-center gap-6">
               <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors">Privacy</span>
               <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors">Terms</span>
               <span className="hover:text-slate-800 dark:hover:text-slate-300 cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;