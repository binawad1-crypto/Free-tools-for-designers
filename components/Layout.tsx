
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Moon, Sun, Languages, Command, Wrench, Palette, Settings, LifeBuoy, Menu, X, ChevronRight, ChevronLeft, Crown, Sparkles } from 'lucide-react';
import { Theme, Language } from '../types';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, language, toggleLanguage, t, isRTL } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'tools', label: 'nav_tools', icon: Wrench, path: '/' },
    { id: 'special', label: 'nav_special', icon: Sparkles, path: '/special' },
    { id: 'studio', label: 'nav_studio', icon: Palette, path: '/studio' },
    { id: 'support', label: 'nav_support', icon: LifeBuoy, path: '/support' },
    { id: 'settings', label: 'nav_settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-cairo">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 bottom-0 z-50 w-72 bg-[#151925] text-white transition-transform duration-300 shadow-2xl
        ${isRTL ? 'right-0' : 'left-0'}
        ${sidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')}
        lg:translate-x-0 lg:static lg:shrink-0 flex flex-col
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Command size={20} />
            </div>
            <div>
                <h1 className="text-xl font-bold font-cairo">{t('app_title')}</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Designer Suite</p>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = item.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(item.path);
                
                return (
                    <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                            isActive 
                            ? 'bg-white/10 text-white font-bold shadow-sm' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon size={20} className={isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-white'} />
                            <span>{t(item.label)}</span>
                        </div>
                        {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                        )}
                    </Link>
                )
            })}
        </nav>

        {/* Footer Settings */}
        <div className="p-4 border-t border-white/5">
             <div className="flex items-center justify-between bg-[#0B0F19] rounded-xl p-1">
                <button
                  onClick={toggleTheme}
                  className="flex-1 p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex justify-center"
                >
                  {theme === Theme.LIGHT ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <div className="w-px h-4 bg-white/10"></div>
                <button
                  onClick={toggleLanguage}
                  className="flex-1 p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex justify-center font-bold text-xs"
                >
                   {language === Language.EN ? 'AR' : 'EN'}
                </button>
             </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          
          {/* Top Bar (Mobile Toggle + Title) */}
          <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-slate-200 dark:border-slate-800/50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-30">
             <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300"
                 >
                     <Menu size={24} />
                 </button>
                 
                 {/* Breadcrumb / Page Title */}
                 <div className="flex flex-col">
                    <h2 className="text-xl font-bold dark:text-white">
                        {t(navItems.find(i => location.pathname === i.path || (i.path !== '/' && location.pathname.startsWith(i.path)))?.label || 'app_title')}
                    </h2>
                 </div>
             </div>

             {/* User Profile Snippet */}
             <div className="flex items-center gap-4">
                <div className="text-end hidden md:block">
                    <p className="text-sm font-bold dark:text-white">binawad alraiany</p>
                    <p className="text-xs text-slate-500">binawad1@gmail.com</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    B
                </div>
             </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden">
             {children}
          </main>
      </div>
    </div>
  );
};

export default Layout;
