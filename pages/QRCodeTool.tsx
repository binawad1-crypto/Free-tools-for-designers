import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Download, Link as LinkIcon, FileText, Mail, Phone, MessageSquare, Wifi, User, Palette, CheckCircle2 } from 'lucide-react';
import QRCode from 'qrcode';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';

const QRCodeTool = () => {
  const { t, isRTL } = useApp();
  const [activeTab, setActiveTab] = useState<QRType>('url');
  const [qrData, setQrData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Customization State
  const [colorDark, setColorDark] = useState('#000000');
  const [colorLight, setColorLight] = useState('#ffffff');

  // Input States
  const [values, setValues] = useState({
    url: '',
    text: '',
    email: '',
    subject: '',
    body: '',
    phone: '',
    sms: '',
    ssid: '',
    password: '',
    encryption: 'WPA',
    name: '',
    org: '',
    title: '',
    tel: '',
    v_email: ''
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Icons mapping
  const tabs = [
    { id: 'url', icon: LinkIcon, label: 'qr_type_url' },
    { id: 'text', icon: FileText, label: 'qr_type_text' },
    { id: 'email', icon: Mail, label: 'qr_type_email' },
    { id: 'phone', icon: Phone, label: 'qr_type_phone' },
    { id: 'sms', icon: MessageSquare, label: 'qr_type_sms' },
    { id: 'wifi', icon: Wifi, label: 'qr_type_wifi' },
    { id: 'vcard', icon: User, label: 'qr_type_vcard' },
  ];

  // Generate QR String based on type
  useEffect(() => {
    let stringToEncode = '';

    switch (activeTab) {
      case 'url':
        stringToEncode = values.url;
        break;
      case 'text':
        stringToEncode = values.text;
        break;
      case 'email':
        stringToEncode = `mailto:${values.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(values.body)}`;
        break;
      case 'phone':
        stringToEncode = `tel:${values.phone}`;
        break;
      case 'sms':
        stringToEncode = `smsto:${values.sms}:${values.body}`;
        break;
      case 'wifi':
        stringToEncode = `WIFI:T:${values.encryption};S:${values.ssid};P:${values.password};;`;
        break;
      case 'vcard':
        stringToEncode = `BEGIN:VCARD\nVERSION:3.0\nN:${values.name}\nORG:${values.org}\nTITLE:${values.title}\nTEL:${values.tel}\nEMAIL:${values.v_email}\nEND:VCARD`;
        break;
    }

    if (stringToEncode) {
        generateQR(stringToEncode);
    }
  }, [values, activeTab, colorDark, colorLight]);

  const generateQR = async (text: string) => {
    try {
      if (!text) return;
      setLoading(true);
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 1,
        color: {
          dark: colorDark,
          light: colorLight
        }
      });
      setQrData(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (!qrData) return;
    const link = document.createElement('a');
    link.download = `qrcode.${format}`;
    link.href = qrData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Main Card */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700 text-white overflow-hidden">
        
        {/* Top Navigation Tabs */}
        <div className="mb-8 border-b border-slate-700 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as QRType)}
                            className={`flex flex-col items-center gap-2 min-w-[80px] px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        >
                            <Icon size={24} className={isActive ? 'stroke-2' : 'stroke-1'} />
                            <span className="text-xs font-medium whitespace-nowrap">{t(tab.label)}</span>
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT COLUMN: Inputs */}
            <div className="lg:col-span-7 space-y-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{t(`qr_type_${activeTab}`)}</h2>
                    <p className="text-slate-400 text-sm">{t('qr_label')}</p>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 space-y-4 border border-slate-700/50">
                    {/* URL Input */}
                    {activeTab === 'url' && (
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_url')}</label>
                            <input 
                                type="url" 
                                placeholder="https://example.com"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                value={values.url}
                                onChange={(e) => handleChange('url', e.target.value)}
                            />
                        </div>
                    )}

                    {/* Text Input */}
                    {activeTab === 'text' && (
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_text')}</label>
                            <textarea 
                                rows={5}
                                placeholder={t('input_placeholder')}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                                value={values.text}
                                onChange={(e) => handleChange('text', e.target.value)}
                            />
                        </div>
                    )}

                    {/* Email Input */}
                    {activeTab === 'email' && (
                        <>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_email')}</label>
                                <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={values.email} onChange={(e) => handleChange('email', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_subject')}</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={values.subject} onChange={(e) => handleChange('subject', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_body')}</label>
                                <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    value={values.body} onChange={(e) => handleChange('body', e.target.value)} />
                            </div>
                        </>
                    )}

                    {/* WiFi Input */}
                    {activeTab === 'wifi' && (
                        <>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_ssid')}</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={values.ssid} onChange={(e) => handleChange('ssid', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_password')}</label>
                                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={values.password} onChange={(e) => handleChange('password', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Encryption</label>
                                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={values.encryption} onChange={(e) => handleChange('encryption', e.target.value)}>
                                    <option value="WPA">WPA/WPA2</option>
                                    <option value="WEP">WEP</option>
                                    <option value="nopass">None</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Phone/SMS Input */}
                    {(activeTab === 'phone' || activeTab === 'sms') && (
                        <>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_phone')}</label>
                                <input type="tel" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={activeTab === 'phone' ? values.phone : values.sms} 
                                    onChange={(e) => handleChange(activeTab === 'phone' ? 'phone' : 'sms', e.target.value)} />
                            </div>
                            {activeTab === 'sms' && (
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_body')}</label>
                                    <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                        value={values.body} onChange={(e) => handleChange('body', e.target.value)} />
                                </div>
                            )}
                        </>
                    )}

                    {/* VCard Input */}
                    {activeTab === 'vcard' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_name')}</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={values.name} onChange={(e) => handleChange('name', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_phone')}</label>
                                    <input type="tel" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={values.tel} onChange={(e) => handleChange('tel', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_email')}</label>
                                <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={values.v_email} onChange={(e) => handleChange('v_email', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-2">{t('qr_input_org')}</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={values.org} onChange={(e) => handleChange('org', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-2">Job Title</label>
                                    <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={values.title} onChange={(e) => handleChange('title', e.target.value)} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Toggles */}
                <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                            <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                            {t('qr_track')}
                        </span>
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded ml-2">PRO</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                             <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                            {t('qr_no_watermark')}
                        </span>
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded ml-2">PRO</span>
                    </label>
                </div>
            </div>

            {/* RIGHT COLUMN: Preview & Customize */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Preview Box */}
                <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center gap-6 shadow-inner relative overflow-hidden group">
                     {/* Background Pattern for 'Pro' feel */}
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    
                    <div className="relative z-10 p-4 bg-white rounded-xl shadow-lg ring-1 ring-slate-100">
                        {qrData ? (
                            <img src={qrData} alt="QR Code" className="w-48 h-48 md:w-56 md:h-56 object-contain" />
                        ) : (
                            <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                                <LinkIcon size={48} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Customization */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette size={20} className="text-blue-400" />
                        <h3 className="font-bold text-white">{t('qr_customize')}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-2">{t('qr_color_fg')}</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={colorDark}
                                    onChange={(e) => setColorDark(e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                />
                                <span className="text-sm font-mono text-slate-300 uppercase">{colorDark}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-2">{t('qr_color_bg')}</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={colorLight}
                                    onChange={(e) => setColorLight(e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                />
                                <span className="text-sm font-mono text-slate-300 uppercase">{colorLight}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleDownload('png')}
                        disabled={!qrData}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={18} />
                        PNG
                    </button>
                    <button
                        onClick={() => handleDownload('png')} // SVG requires different handling with this lib, stick to PNG for simplicity or use canvas to blob
                        disabled={!qrData}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/50"
                    >
                        <Download size={18} />
                        {t('download_btn')}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeTool;