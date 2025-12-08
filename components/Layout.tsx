import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Languages, Command, Wrench, Palette, Settings, LifeBuoy, Menu, X, ChevronRight, ChevronLeft, Crown, Sparkles, LogOut, LogIn } from 'lucide-react';
import { Theme, Language } from '../types';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, language, toggleLanguage, t, isRTL } = useApp();
  const { currentUser, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // User Menu State
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return (
      // Updated background to match requested colors (Deep Dark Purple/Blue Gradient)
      <div className="min-h-screen bg-gradient-to-br from-[#2E243D] via-[#1E1B2E] to-[#121217] font-cairo text-slate-100">
          <main className="w-full min-h-screen flex items-center justify-center">
              {children}
          </main>
      </div>
    );
  }

  const navItems = [
    { id: 'studio', label: 'nav_studio', icon: Palette, path: '/studio' },
    { id: 'tools', label: 'nav_tools', icon: Wrench, path: '/' },
    { id: 'special', label: 'nav_special', icon: Sparkles, path: '/special' },
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
        lg:translate-x-0 lg:shrink-0 flex flex-col
      `}>
        {/* Logo Area */}
        <div className="h-24 flex items-center gap-3 px-6 border-b border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
                <Command size={24} />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-black font-cairo leading-none mb-1">{t('app_title')}</h1>
                <p className="text-[10px] text-slate-400 font-medium leading-tight opacity-80">{t('app_desc')}</p>
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
                {currentUser ? (
                  <>
                    <div className="text-end hidden md:block">
                        <p className="text-sm font-bold dark:text-white flex items-center justify-end gap-2">
                           {currentUser.displayName || t('auth_guest')}
                           {isAdmin && <Crown size={14} className="text-yellow-500" fill="currentColor" />}
                        </p>
                        <p className="text-xs text-slate-500">{isAdmin ? t('auth_admin') : 'User'}</p>
                    </div>
                    
                    {/* User Menu Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button 
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="focus:outline-none transition-transform active:scale-95"
                        >
                            {currentUser.photoURL ? (
                                <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                                </div>
                            )}
                        </button>
                        
                        {/* Dropdown */}
                        {userMenuOpen && (
                            <div className={`absolute top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ${isRTL ? 'left-0' : 'right-0'}`}>
                                {/* Mobile-only User Info inside dropdown */}
                                <div className="md:hidden px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                    <p className="text-sm font-bold dark:text-white truncate">{currentUser.displayName || t('auth_guest')}</p>
                                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        logout();
                                        setUserMenuOpen(false);
                                    }} 
                                    className="w-full text-start px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors font-medium"
                                >
                                    <LogOut size={16} /> {t('auth_logout')}
                                </button>
                            </div>
                        )}
                    </div>
                  </>
                ) : (
                   <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors">
                      <LogIn size={16} />
                      <span className="hidden sm:inline">{t('auth_login')}</span>
                   </Link>
                )}
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