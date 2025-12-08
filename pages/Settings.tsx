
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import { updateProfile, updatePassword } from 'firebase/auth';
import { Theme, Language } from '../types';
import { 
    User, Settings as SettingsIcon, Shield, CreditCard, 
    Users, Bell, Moon, Sun, Laptop, Lock, Loader2, AlertTriangle,
    Globe, Check
} from 'lucide-react';

type SettingsTab = 'general' | 'account' | 'security' | 'team' | 'billing';

interface UserSettings {
    bio?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    themePreference?: string;
    languagePreference?: string;
    role?: string;
}

const Settings: React.FC = () => {
    const { t, theme, toggleTheme, language, toggleLanguage, isRTL } = useApp();
    const { currentUser, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loadingData, setLoadingData] = useState(true);

    // Form States
    const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
    const [bio, setBio] = useState('');
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(false);
    
    // Password States
    const [newPassword, setNewPassword] = useState('');
    
    // Team Data States
    const [teamUsers, setTeamUsers] = useState<any[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(false);

    // Helper: Local Storage Fallback
    const loadLocalSettings = (uid: string) => {
        try {
            const local = localStorage.getItem(`user_settings_${uid}`);
            if (local) return JSON.parse(local);
        } catch (e) {
            console.error("Local storage error", e);
        }
        return null;
    };

    const saveLocalSettings = (uid: string, data: any) => {
        localStorage.setItem(`user_settings_${uid}`, JSON.stringify(data));
    };

    // Load User Data from Firestore (with Fallback)
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;
            try {
                // Try Firestore first
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserSettings;
                    if (data.bio) setBio(data.bio);
                    if (data.emailNotifications !== undefined) setEmailNotif(data.emailNotifications);
                    if (data.pushNotifications !== undefined) setPushNotif(data.pushNotifications);
                } else {
                    // If doc doesn't exist, check local storage in case we failed to write to cloud previously
                    const localData = loadLocalSettings(currentUser.uid);
                    if (localData) {
                        if (localData.bio) setBio(localData.bio);
                        if (localData.emailNotifications !== undefined) setEmailNotif(localData.emailNotifications);
                        if (localData.pushNotifications !== undefined) setPushNotif(localData.pushNotifications);
                    }
                }
            } catch (error: any) {
                // Silently handle permission errors by falling back
                if (error.code !== 'permission-denied') {
                     console.warn("Firestore access issue:", error.message);
                }
                
                // Fallback to Local Storage
                const localData = loadLocalSettings(currentUser.uid);
                if (localData) {
                    if (localData.bio) setBio(localData.bio);
                    if (localData.emailNotifications !== undefined) setEmailNotif(localData.emailNotifications);
                    if (localData.pushNotifications !== undefined) setPushNotif(localData.pushNotifications);
                }
            } finally {
                setLoadingData(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    // Fetch Team Users from Firestore
    useEffect(() => {
        if (activeTab === 'team' && isAdmin) {
            const fetchTeam = async () => {
                setLoadingTeam(true);
                try {
                    const q = query(collection(db, "users"));
                    const querySnapshot = await getDocs(q);
                    const users: any[] = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        users.push({
                            id: doc.id,
                            name: data.displayName || 'Unknown',
                            email: data.email || 'No Email',
                            role: data.role || 'User',
                            status: 'Active', 
                            lastActive: data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : 'Unknown'
                        });
                    });
                    
                    // If list is empty (first run or just created), ensure current user is there
                    if (users.length === 0 && currentUser) {
                         users.push({
                            id: currentUser.uid,
                            name: currentUser.displayName || 'Me',
                            email: currentUser.email,
                            role: 'Admin',
                            status: 'Active',
                            lastActive: 'Now'
                        });
                    }
                    setTeamUsers(users);
                } catch (err: any) {
                    // Handle permission errors silently and fallback
                    if (err.code !== 'permission-denied') {
                        console.error("Failed to fetch team", err);
                    }
                    
                    // Fallback: Show current user
                    if (currentUser) {
                         setTeamUsers([{
                            id: currentUser.uid,
                            name: currentUser.displayName || 'Me',
                            email: currentUser.email,
                            role: 'Admin',
                            status: 'Active',
                            lastActive: 'Now'
                        }]);
                    }
                } finally {
                    setLoadingTeam(false);
                }
            };
            fetchTeam();
        }
    }, [activeTab, isAdmin, currentUser]);

    const handleSave = async () => {
        if (!currentUser) return;
        setSaving(true);
        setErrorMsg('');
        setSuccessMsg('');

        const settingsData = {
            displayName, // Save display name to doc for team listing
            email: currentUser.email, // Save email to doc for team listing
            bio,
            emailNotifications: emailNotif,
            pushNotifications: pushNotif,
            lastUpdated: new Date().toISOString(),
            role: isAdmin ? 'Admin' : 'User'
        };

        try {
            // 1. Update Auth Profile (Display Name)
            if (displayName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName });
            }

            // 2. Update Data (Try Firestore, Fallback to Local)
            try {
                const userRef = doc(db, "users", currentUser.uid);
                await setDoc(userRef, settingsData, { merge: true });
            } catch (fsError: any) {
                // If permission denied or offline, save locally
                if (fsError.code === 'permission-denied' || fsError.code === 'unavailable' || fsError.message.includes('permission')) {
                    // console.warn("Saving to local storage due to Firestore permissions.");
                    saveLocalSettings(currentUser.uid, settingsData);
                } else {
                    throw fsError;
                }
            }

            setSuccessMsg(t('settings_success_msg'));
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error: any) {
            console.error("Error saving settings:", error);
            setErrorMsg("Failed to save settings. " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!currentUser || !newPassword) return;
        setSaving(true);
        setErrorMsg('');
        
        try {
            await updatePassword(currentUser, newPassword);
            setSuccessMsg("Password updated successfully.");
            setNewPassword('');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error: any) {
             console.error("Error updating password:", error);
             setErrorMsg("Failed to update password. You may need to re-login recently.");
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'settings_tab_account', icon: User },
        { id: 'general', label: 'settings_tab_general', icon: SettingsIcon },
        { id: 'security', label: 'settings_tab_security', icon: Shield },
        { id: 'team', label: 'settings_tab_team', icon: Users, adminOnly: true },
        { id: 'billing', label: 'settings_tab_billing', icon: CreditCard },
    ];

    if (loadingData) {
        return (
            <div className="flex h-[500px] items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* SIDEBAR NAVIGATION */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    <h1 className="text-2xl font-bold px-4 mb-6 dark:text-white flex items-center gap-2">
                        <SettingsIcon className="text-purple-500" /> 
                        {t('settings_page_title')}
                    </h1>
                    
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm">
                        {tabs.map(tab => {
                            if (tab.adminOnly && !isAdmin) return null;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm mb-1 last:mb-0 ${
                                        activeTab === tab.id 
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400'
                                    }`}
                                >
                                    <Icon size={18} />
                                    {t(tab.label as any)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        
                        {/* Messages Toast */}
                        {successMsg && (
                            <div className="bg-green-500 text-white px-6 py-3 font-bold text-center animate-in slide-in-from-top-4 flex items-center justify-center gap-2">
                                <Check size={18} /> {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="bg-red-500 text-white px-6 py-3 font-bold text-center animate-in slide-in-from-top-4 flex items-center justify-center gap-2">
                                <AlertTriangle size={18} /> {errorMsg}
                            </div>
                        )}

                        {/* --- ACCOUNT TAB --- */}
                        {activeTab === 'account' && (
                            <div className="p-8 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white mb-6">{t('settings_profile_header')}</h2>
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative group cursor-pointer">
                                            {currentUser?.photoURL ? (
                                                <img src={currentUser.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-800 object-cover" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                                    {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold dark:text-white">{displayName || 'User'}</h3>
                                            <p className="text-slate-500 text-sm">{currentUser?.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('settings_profile_name')}</label>
                                            <input 
                                                type="text" 
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('settings_profile_email')}</label>
                                            <input 
                                                type="email" 
                                                value={currentUser?.email || ''}
                                                disabled
                                                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('settings_profile_bio')}</label>
                                            <textarea 
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell us about yourself..."
                                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- GENERAL TAB --- */}
                        {activeTab === 'general' && (
                            <div className="p-8 space-y-8">
                                {/* Theme */}
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white mb-4">{t('settings_general_theme')}</h2>
                                    <div className="grid grid-cols-2 gap-4 max-w-md">
                                        <button 
                                            onClick={() => theme === Theme.DARK && toggleTheme()}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === Theme.LIGHT ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                                        >
                                            <Sun size={32} className={theme === Theme.LIGHT ? 'text-purple-600' : 'text-slate-400'} />
                                            <span className="font-bold text-sm">Light Mode</span>
                                        </button>
                                        <button 
                                            onClick={() => theme === Theme.LIGHT && toggleTheme()}
                                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === Theme.DARK ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                                        >
                                            <Moon size={32} className={theme === Theme.DARK ? 'text-purple-600' : 'text-slate-400'} />
                                            <span className="font-bold text-sm">Dark Mode</span>
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* Language */}
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white mb-4">{t('settings_general_lang')}</h2>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl max-w-xs">
                                        <button 
                                            onClick={() => language === Language.AR && toggleLanguage()}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${language === Language.EN ? 'bg-white dark:bg-slate-700 shadow text-purple-600' : 'text-slate-500'}`}
                                        >
                                            English
                                        </button>
                                        <button 
                                            onClick={() => language === Language.EN && toggleLanguage()}
                                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${language === Language.AR ? 'bg-white dark:bg-slate-700 shadow text-purple-600' : 'text-slate-500'}`}
                                        >
                                            العربية
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                {/* Notifications */}
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white mb-4">{t('settings_general_notifications')}</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                                    <Globe size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold dark:text-white">Email Notifications</p>
                                                    <p className="text-xs text-slate-500">Receive weekly updates and alerts</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setEmailNotif(!emailNotif)}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${emailNotif ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${emailNotif ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600">
                                                    <Bell size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold dark:text-white">Push Notifications</p>
                                                    <p className="text-xs text-slate-500">Get instant alerts in browser</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setPushNotif(!pushNotif)}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${pushNotif ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${pushNotif ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- SECURITY TAB --- */}
                        {activeTab === 'security' && (
                            <div className="p-8 space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white mb-6">{t('settings_security_password')}</h2>
                                    <div className="space-y-4 max-w-md">
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-3 rtl:left-auto" />
                                            <input 
                                                type="password" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="New Password" 
                                                className="w-full pl-10 rtl:pr-10 rtl:pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" 
                                            />
                                        </div>
                                        <button 
                                            onClick={handlePasswordUpdate}
                                            disabled={saving || !newPassword}
                                            className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-slate-100 dark:border-slate-800" />

                                <div>
                                    <h2 className="text-xl font-bold dark:text-white mb-4">{t('settings_security_sessions')}</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Laptop size={20} className="text-slate-400" />
                                                <div>
                                                    <p className="font-bold text-sm dark:text-white">Current Session</p>
                                                    <p className="text-xs text-green-500 font-medium">Active Now</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded">Current</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- TEAM TAB (Admin Only) --- */}
                        {activeTab === 'team' && isAdmin && (
                             <div className="p-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold dark:text-white">{t('settings_team_header')}</h2>
                                    <button className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-purple-700 transition-colors">
                                        {t('settings_team_invite')}
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto">
                                    {loadingTeam ? (
                                        <div className="flex justify-center p-8">
                                            <Loader2 className="animate-spin text-purple-600" />
                                        </div>
                                    ) : (
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-xs">
                                                    <th className="pb-4 pl-4">{t('settings_profile_name')}</th>
                                                    <th className="pb-4">{t('settings_team_role')}</th>
                                                    <th className="pb-4">{t('settings_team_status')}</th>
                                                    <th className="pb-4 pr-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {teamUsers.map(user => (
                                                    <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="py-4 pl-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
                                                                    {user.name ? user.name[0] : 'U'}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold dark:text-white">{user.name}</p>
                                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'Active' ? 'text-green-500' : 'text-slate-400'}`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 pr-4">
                                                            <button className="text-slate-400 hover:text-purple-500 font-bold text-xs">Edit</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                             </div>
                        )}

                        {/* --- BILLING TAB --- */}
                        {activeTab === 'billing' && (
                             <div className="p-8 space-y-8">
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                                    <div>
                                        <p className="text-white/80 text-sm font-bold uppercase mb-1">{t('settings_billing_plan')}</p>
                                        <h2 className="text-3xl font-black">Professional Plan</h2>
                                        <p className="text-sm opacity-90 mt-1">Next billing date: Oct 24, 2024</p>
                                    </div>
                                    <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-xl hover:bg-slate-50 transition-colors">
                                        Upgrade
                                    </button>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-4 dark:text-white">{t('settings_billing_usage')}</h3>
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                            <div className="flex justify-between mb-2 text-sm font-bold">
                                                <span className="text-slate-600 dark:text-slate-300">AI Tokens</span>
                                                <span className="text-purple-600">85% Used</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-purple-500 h-full rounded-full" style={{ width: '85%' }}></div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">85,400 / 100,000 tokens</p>
                                        </div>
                                         <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                            <div className="flex justify-between mb-2 text-sm font-bold">
                                                <span className="text-slate-600 dark:text-slate-300">Storage</span>
                                                <span className="text-blue-500">40% Used</span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">4GB / 10GB</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}

                        {/* Footer Actions */}
                        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                            <button className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                {t('settings_cancel_btn')}
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving || activeTab === 'billing'}
                                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 disabled:opacity-70 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="animate-spin" size={16} />}
                                {t('settings_save_btn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
