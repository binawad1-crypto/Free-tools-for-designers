
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { LayoutGrid, Instagram, Facebook, Twitter, Linkedin, Youtube, Video, Image as ImageIcon, Smartphone, Monitor, Check, Copy } from 'lucide-react';

type PlatformId = 'insta' | 'tiktok' | 'twitter' | 'fb' | 'yt' | 'linkedin' | 'snap';

interface SizeFormat {
    id: string;
    nameKey: string;
    width: number;
    height: number;
    icon: React.ElementType;
}

interface PlatformData {
    id: PlatformId;
    nameKey: string;
    color: string;
    formats: SizeFormat[];
}

const SocialSizesTool: React.FC = () => {
  const { t } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('insta');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const platforms: PlatformData[] = [
    {
        id: 'insta',
        nameKey: 'social_platform_insta',
        color: 'from-pink-500 to-orange-500',
        formats: [
            { id: 'insta_post', nameKey: 'social_format_post', width: 1080, height: 1080, icon: ImageIcon },
            { id: 'insta_portrait', nameKey: 'social_format_post', width: 1080, height: 1350, icon: ImageIcon },
            { id: 'insta_story', nameKey: 'social_format_story', width: 1080, height: 1920, icon: Smartphone },
            { id: 'insta_reel', nameKey: 'social_format_reel', width: 1080, height: 1920, icon: Video },
        ]
    },
    {
        id: 'tiktok',
        nameKey: 'social_platform_tiktok',
        color: 'from-black to-slate-800',
        formats: [
            { id: 'tiktok_video', nameKey: 'social_format_reel', width: 1080, height: 1920, icon: Video },
            { id: 'tiktok_profile', nameKey: 'social_format_profile', width: 200, height: 200, icon: ImageIcon },
        ]
    },
    {
        id: 'twitter',
        nameKey: 'social_platform_twitter',
        color: 'from-blue-400 to-blue-600',
        formats: [
            { id: 'twitter_post', nameKey: 'social_format_post', width: 1600, height: 900, icon: ImageIcon },
            { id: 'twitter_header', nameKey: 'social_format_header', width: 1500, height: 500, icon: Monitor },
            { id: 'twitter_profile', nameKey: 'social_format_profile', width: 400, height: 400, icon: ImageIcon },
        ]
    },
    {
        id: 'fb',
        nameKey: 'social_platform_fb',
        color: 'from-blue-600 to-blue-800',
        formats: [
            { id: 'fb_post', nameKey: 'social_format_post', width: 1200, height: 630, icon: ImageIcon },
            { id: 'fb_story', nameKey: 'social_format_story', width: 1080, height: 1920, icon: Smartphone },
            { id: 'fb_cover', nameKey: 'social_format_cover', width: 820, height: 312, icon: Monitor },
        ]
    },
    {
        id: 'yt',
        nameKey: 'social_platform_yt',
        color: 'from-red-500 to-red-700',
        formats: [
            { id: 'yt_thumb', nameKey: 'social_format_thumbnail', width: 1280, height: 720, icon: ImageIcon },
            { id: 'yt_cover', nameKey: 'social_format_header', width: 2560, height: 1440, icon: Monitor },
            { id: 'yt_profile', nameKey: 'social_format_profile', width: 800, height: 800, icon: ImageIcon },
        ]
    },
    {
        id: 'linkedin',
        nameKey: 'social_platform_linkedin',
        color: 'from-blue-700 to-blue-900',
        formats: [
            { id: 'li_post', nameKey: 'social_format_post', width: 1200, height: 627, icon: ImageIcon },
            { id: 'li_cover', nameKey: 'social_format_cover', width: 1128, height: 191, icon: Monitor },
        ]
    },
    {
        id: 'snap',
        nameKey: 'social_platform_snap',
        color: 'from-yellow-300 to-yellow-500',
        formats: [
            { id: 'snap_story', nameKey: 'social_format_story', width: 1080, height: 1920, icon: Smartphone },
        ]
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeData = platforms.find(p => p.id === selectedPlatform) || platforms[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400">
           <LayoutGrid size={32} />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500">
          {t('social_tool')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('app_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sidebar / Top Nav */}
          <div className="md:col-span-3 lg:col-span-3">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
                  <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                      {platforms.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPlatform(p.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                                selectedPlatform === p.id 
                                ? `bg-gradient-to-r ${p.color} text-white shadow-lg` 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                             <div className={`w-2 h-2 rounded-full ${selectedPlatform === p.id ? 'bg-white' : `bg-gradient-to-r ${p.color}`}`} />
                             <span className="font-bold">{t(p.nameKey as any)}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* Main Grid */}
          <div className="md:col-span-9 lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeData.formats.map((format) => {
                      const Icon = format.icon;
                      const ratio = format.width / format.height;
                      
                      return (
                          <div key={format.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                              <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
                                      <Icon size={20} />
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                          {t(format.nameKey as any)}
                                      </h3>
                                      {format.id.includes('portrait') && (
                                          <span className="text-xs text-slate-400">Portrait 4:5</span>
                                      )}
                                  </div>
                              </div>

                              {/* Visual Preview Box */}
                              <div className="w-full bg-slate-100 dark:bg-slate-950/50 rounded-xl mb-6 flex items-center justify-center p-4 h-48">
                                  <div 
                                    className={`bg-gradient-to-br ${activeData.color} rounded-lg shadow-inner flex items-center justify-center text-white/90 font-mono text-xs opacity-90 transition-transform duration-500 group-hover:scale-105`}
                                    style={{ 
                                        aspectRatio: `${format.width}/${format.height}`,
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        width: ratio >= 1 ? '100%' : 'auto',
                                        height: ratio < 1 ? '100%' : 'auto'
                                    }}
                                  >
                                      {format.width}x{format.height}
                                  </div>
                              </div>

                              <div className="space-y-3">
                                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                      <span className="font-mono text-sm text-slate-600 dark:text-slate-400">{format.width}px</span>
                                      <span className="text-xs text-slate-400 uppercase font-bold">W</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                      <span className="font-mono text-sm text-slate-600 dark:text-slate-400">{format.height}px</span>
                                      <span className="text-xs text-slate-400 uppercase font-bold">H</span>
                                  </div>
                              </div>

                              <button 
                                onClick={() => handleCopy(`${format.width}x${format.height}`, format.id)}
                                className="w-full mt-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95"
                              >
                                  {copiedId === format.id ? <Check size={16} /> : <Copy size={16} />}
                                  {copiedId === format.id ? 'Copied' : t('social_copy_dims')}
                              </button>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>
    </div>
  );
};

export default SocialSizesTool;
