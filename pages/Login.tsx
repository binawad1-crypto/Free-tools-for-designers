

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { LogIn, Lock, Mail, AlertCircle, UserPlus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithEmail, register, currentUser } = useAuth();
  const { t, isRTL } = useApp();
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
      // Only log if it's not a standard auth error
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-10 transition-all duration-300">
          
          <div className="text-center space-y-4 mb-8">
             <div className="w-20 h-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                 {isRegistering ? <UserPlus size={40} /> : <Lock size={40} />}
             </div>
             <div>
                <h1 className="text-3xl font-bold dark:text-white">
                    {isRegistering ? (isRTL ? 'إنشاء حساب جديد' : 'Create Account') : t('auth_login')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {isRegistering 
                        ? (isRTL ? 'سجل بريدك الإلكتروني للبدء' : 'Register your email to get started') 
                        : t('auth_login_desc')}
                </p>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
             {error && (
                 <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
                     <AlertCircle size={18} className="shrink-0 mt-0.5" />
                     <span>{error}</span>
                 </div>
             )}

             <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t('auth_email')}</label>
                 <div className="relative">
                     <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                        placeholder="name@example.com"
                        required
                     />
                     <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 </div>
             </div>

             <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t('auth_password')}</label>
                 <div className="relative">
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                        placeholder="••••••••"
                        required
                        minLength={6}
                     />
                     <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 </div>
             </div>

             <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                ) : (
                    <>
                        {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                        <span>{isRegistering ? (isRTL ? 'تسجيل حساب' : 'Sign Up') : t('auth_signin_btn')}</span>
                    </>
                )}
             </button>

             <div className="pt-2 text-center">
                 <button
                    type="button"
                    onClick={() => { setIsRegistering(!isRegistering); setError(null); }}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
                 >
                    {isRegistering 
                        ? (isRTL ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign In')
                        : (isRTL ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'Don\'t have an account? Sign Up')
                    }
                    <ArrowRight size={14} className={`transition-transform ${isRegistering ? 'rotate-180' : ''}`} />
                 </button>
             </div>
          </form>

      </div>
    </div>
  );
};

export default Login;