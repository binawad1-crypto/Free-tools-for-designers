

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { LogIn, Lock, Mail, AlertCircle, UserPlus, ArrowRight, Command, Moon, Sun, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Theme, Language } from '../types';

const Login = () => {
  const { loginWithEmail, register, currentUser } = useAuth();
  const { t, isRTL, theme, toggleTheme, language, toggleLanguage } = useApp();
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      const code = err.code;
      if (code !== 'auth/email-already-in-use' && code !== 'auth/invalid-credential' && code !== 'auth/user-not-found' && code !== 'auth/wrong-password') {
          console.error("Auth Error:", err);
      }
      
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          setError(t('auth_error_invalid'));
      } else if (code === 'auth/email-already-in-use') {
          setError(t('auth_email_in_use'));
      } else if (code === 'auth/weak-password') {
          setError(t('auth_weak_password'));
      } else {
          setError(t('auth_error_generic'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Decorative Gradients */}
       <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 blur-[150px] rounded-full" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 blur-[150px] rounded-full" />
       </div>

       <div className="w-full max-w-[420px] relative z-10">
           
           {/* Logo Section */}
           <div className="flex flex-col items-center justify-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20 mb-4 transform hover:scale-105 transition-transform">
                    <Command size={28} />
               </div>
               <h1 className="text-3xl font-black text-white tracking-tight">
                   {t('app_title')}
               </h1>
           </div>

           {/* Main Card */}
           <div className="bg-[#1e2330] rounded-[2rem] p-8 shadow-2xl border border-white/5 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
                
                <div className="text-center mb-8 space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                        {isRegistering ? (isRTL ? 'إنشاء حساب جديد' : 'Create Account') : t('auth_login')}
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">
                        {isRegistering 
                            ? (isRTL ? 'سجل بريدك الإلكتروني للبدء' : 'Register your email to get started') 
                            : t('auth_login_desc')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">{t('auth_email')}</label>
                        <div className="relative group">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 pl-10 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                placeholder="name@company.com"
                                required
                            />
                            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 ml-1">{t('auth_password')}</label>
                        <div className="relative group">
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 pl-10 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                        </div>
                    </div>

                    {!isRegistering && (
                        <div className="flex items-center justify-between text-xs font-medium px-1">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                                <input type="checkbox" className="rounded border-slate-600 bg-slate-700/50 text-purple-500 focus:ring-offset-0 focus:ring-purple-500" />
                                <span>{t('auth_remember')}</span>
                            </label>
                            <button type="button" className="text-pink-500 hover:text-pink-400 transition-colors">
                                {t('auth_forgot_pass')}
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] hover:from-[#d946efdd] hover:to-[#8b5cf6dd] text-white font-bold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                                <span>{isRegistering ? (isRTL ? 'تسجيل حساب' : 'Sign Up') : t('auth_signin_btn')}</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto group"
                    >
                        {isRegistering 
                            ? (isRTL ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign In')
                            : (isRTL ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'Don\'t have an account? Sign Up')
                        }
                        <ArrowRight size={14} className={`transition-transform group-hover:translate-x-1 ${isRegistering ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Bottom Toggles - Integrated inside the card template */}
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-center items-center gap-4">
                     <button
                        onClick={toggleTheme}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5"
                        title="Toggle Theme"
                     >
                        {theme === Theme.LIGHT ? <Moon size={14} /> : <Sun size={14} />}
                     </button>
                     <div className="w-px h-4 bg-white/10" />
                     <button
                        onClick={toggleLanguage}
                        className="h-8 px-3 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white transition-colors border border-white/5 gap-2"
                        title="Toggle Language"
                     >
                        <Globe size={12} />
                        {language === Language.EN ? 'العربية' : 'English'}
                     </button>
                </div>
           </div>
       </div>
    </div>
  );
};

export default Login;