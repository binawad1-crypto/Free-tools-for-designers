
import React, { useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { ScrollText, Download, Sliders, Languages } from 'lucide-react';
import html2canvas from 'html2canvas';
import { TranslationKey } from '../types';

const NutritionTool: React.FC = () => {
  const { t, isRTL, language } = useApp();
  const labelRef = useRef<HTMLDivElement>(null);

  // Toggle for Label Language (separate from App Language)
  const [labelLang, setLabelLang] = useState<'en' | 'ar'>('en');

  // Daily Values (FDA 2000 calorie diet)
  const DAILY_VALUES = {
    totalFat: 78,
    satFat: 20,
    cholesterol: 300,
    sodium: 2300,
    totalCarb: 275,
    fiber: 28,
    addedSugars: 50,
    protein: 50, // general baseline
    vitD: 20,
    calcium: 1300,
    iron: 18,
    potassium: 4700
  };

  const [values, setValues] = useState({
    servingSize: '1 cup (227g)',
    servingsPerContainer: '8',
    calories: 230,
    totalFat: 8,
    satFat: 1,
    transFat: 0,
    cholesterol: 0,
    sodium: 160,
    totalCarb: 37,
    fiber: 4,
    totalSugars: 12,
    addedSugars: 10,
    protein: 3,
    vitD: 2,
    calcium: 260,
    iron: 8,
    potassium: 235
  });

  const handleChange = (key: string, val: string | number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const calculatePercent = (value: number, base: number) => {
    if (!value || !base) return 0;
    return Math.round((value / base) * 100);
  };

  // Specialized translation helper for the label independent of app language
  const lt = (key: TranslationKey) => {
    // We import translations directly to force specific language for the label
    // But since we can't easily import the object here without circular deps or code duplication, 
    // we will rely on a simple switch or just use the current t() if languages match, 
    // or a simple mapping for the other language. 
    // For simplicity in this structure: The t() function is bound to app state.
    // To support bilingual label correctly, we need manual mapping for the specific label terms.
    
    const terms: Record<string, { en: string, ar: string }> = {
      nutri_title_facts: { en: 'Nutrition Facts', ar: 'حقائق تغذوية' },
      nutri_serving_size: { en: 'Serving Size', ar: 'حجم الحصة' },
      nutri_servings_per: { en: 'Servings Per Container', ar: 'عدد الحصص في العبوة' },
      nutri_amount_per: { en: 'Amount Per Serving', ar: 'الكمية للحصة' },
      nutri_calories: { en: 'Calories', ar: 'السعرات الحرارية' },
      nutri_daily_value: { en: '% Daily Value*', ar: '% القيمة اليومية*' },
      nutri_total_fat: { en: 'Total Fat', ar: 'الدهون الكلية' },
      nutri_sat_fat: { en: 'Saturated Fat', ar: 'دهون مشبعة' },
      nutri_trans_fat: { en: 'Trans Fat', ar: 'دهون متحولة' },
      nutri_cholesterol: { en: 'Cholesterol', ar: 'كوليسترول' },
      nutri_sodium: { en: 'Sodium', ar: 'صوديوم' },
      nutri_total_carb: { en: 'Total Carbohydrate', ar: 'الكربوهيدرات الكلية' },
      nutri_fiber: { en: 'Dietary Fiber', ar: 'ألياف غذائية' },
      nutri_sugars: { en: 'Total Sugars', ar: 'السكريات الكلية' },
      nutri_added_sugars: { en: 'Includes Added Sugars', ar: 'يتضمن سكريات مضافة' },
      nutri_protein: { en: 'Protein', ar: 'بروتين' },
      nutri_vit_d: { en: 'Vitamin D', ar: 'فيتامين د' },
      nutri_calcium: { en: 'Calcium', ar: 'كالسيوم' },
      nutri_iron: { en: 'Iron', ar: 'حديد' },
      nutri_potassium: { en: 'Potassium', ar: 'بوتاسيوم' },
      nutri_footnote: { 
        en: '* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.', 
        ar: '* تخبرك نسبة القيمة اليومية (DV) بمدى مساهمة عنصر غذائي في حصة طعام في النظام الغذائي اليومي. يستخدم 2000 سعرة حرارية في اليوم لنصائح التغذية العامة.' 
      },
    };

    // key is TranslationKey, convert to string key
    const k = key as string;
    if (terms[k]) {
        return terms[k][labelLang];
    }
    return t(key);
  };

  const handleDownload = async () => {
    if (!labelRef.current) return;
    try {
      const canvas = await html2canvas(labelRef.current, {
        scale: 2,
        backgroundColor: null // Transparent background
      });
      const link = document.createElement('a');
      link.download = 'nutrition-label.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-700 dark:text-slate-300">
           <ScrollText size={32} />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-400">
          {t('nutri_tool')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('app_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SETTINGS PANEL */}
        <div className="lg:col-span-6 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <Sliders size={20} />
                        {t('nutri_settings')}
                    </h2>
                    
                    {/* Label Language Toggle */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setLabelLang('en')}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${labelLang === 'en' ? 'bg-white dark:bg-slate-700 shadow text-slate-800 dark:text-white' : 'text-slate-500'}`}
                        >
                            English Label
                        </button>
                        <button
                            onClick={() => setLabelLang('ar')}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all ${labelLang === 'ar' ? 'bg-white dark:bg-slate-700 shadow text-slate-800 dark:text-white' : 'text-slate-500'}`}
                        >
                            ملصق عربي
                        </button>
                    </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* General */}
                    <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold uppercase text-slate-400">General Info</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_serving_size')}</label>
                                <input type="text" value={values.servingSize} onChange={e => handleChange('servingSize', e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400" />
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_servings_per')}</label>
                                <input type="text" value={values.servingsPerContainer} onChange={e => handleChange('servingsPerContainer', e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_calories')}</label>
                                <input type="number" value={values.calories} onChange={e => handleChange('calories', Number(e.target.value))} 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Fats & Chol */}
                    <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Fats & Cholesterol</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_total_fat')} (g)</label>
                                <input type="number" value={values.totalFat} onChange={e => handleChange('totalFat', Number(e.target.value))} className="input-std" />
                            </div>
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_sat_fat')} (g)</label>
                                <input type="number" value={values.satFat} onChange={e => handleChange('satFat', Number(e.target.value))} className="input-std" />
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_trans_fat')} (g)</label>
                                <input type="number" value={values.transFat} onChange={e => handleChange('transFat', Number(e.target.value))} className="input-std" />
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_cholesterol')} (mg)</label>
                                <input type="number" value={values.cholesterol} onChange={e => handleChange('cholesterol', Number(e.target.value))} className="input-std" />
                            </div>
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_sodium')} (mg)</label>
                                <input type="number" value={values.sodium} onChange={e => handleChange('sodium', Number(e.target.value))} className="input-std" />
                            </div>
                        </div>
                    </div>

                    {/* Carbs & Protein */}
                    <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Carbs & Protein</h3>
                        <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_total_carb')} (g)</label>
                                <input type="number" value={values.totalCarb} onChange={e => handleChange('totalCarb', Number(e.target.value))} className="input-std" />
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_fiber')} (g)</label>
                                <input type="number" value={values.fiber} onChange={e => handleChange('fiber', Number(e.target.value))} className="input-std" />
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_sugars')} (g)</label>
                                <input type="number" value={values.totalSugars} onChange={e => handleChange('totalSugars', Number(e.target.value))} className="input-std" />
                            </div>
                            <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">Added Sugars (g)</label>
                                <input type="number" value={values.addedSugars} onChange={e => handleChange('addedSugars', Number(e.target.value))} className="input-std" />
                            </div>
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_protein')} (g)</label>
                                <input type="number" value={values.protein} onChange={e => handleChange('protein', Number(e.target.value))} className="input-std" />
                            </div>
                        </div>
                    </div>

                    {/* Vitamins */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase text-slate-400">Vitamins & Minerals</h3>
                        <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_vit_d')} (mcg)</label>
                                <input type="number" value={values.vitD} onChange={e => handleChange('vitD', Number(e.target.value))} className="input-std" />
                            </div>
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_calcium')} (mg)</label>
                                <input type="number" value={values.calcium} onChange={e => handleChange('calcium', Number(e.target.value))} className="input-std" />
                            </div>
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_iron')} (mg)</label>
                                <input type="number" value={values.iron} onChange={e => handleChange('iron', Number(e.target.value))} className="input-std" />
                            </div>
                             <div>
                                <label className="text-xs font-medium block mb-1 text-slate-600 dark:text-slate-400">{t('nutri_potassium')} (mg)</label>
                                <input type="number" value={values.potassium} onChange={e => handleChange('potassium', Number(e.target.value))} className="input-std" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button onClick={handleDownload} className="w-full py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                        <Download size={18} />
                        {t('nutri_export_png')}
                    </button>
                </div>
            </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="lg:col-span-6 flex items-start justify-center">
            {/* The Actual Nutrition Label Component */}
            <div className="p-8 bg-white rounded-3xl shadow-2xl relative">
                
                {/* Reference to capture */}
                <div 
                    ref={labelRef}
                    className="w-[340px] border-2 border-black bg-white text-black p-2 font-sans antialiased box-border"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif', direction: labelLang === 'ar' ? 'rtl' : 'ltr' }}
                >
                    <h1 className="text-[40px] font-black leading-none border-b-[10px] border-black pb-1 mb-1">
                        {lt('nutri_title_facts')}
                    </h1>
                    
                    <div className="border-b border-black pb-1 mb-1">
                        <div className="flex justify-between items-end mb-1">
                             <span className="font-bold text-lg">{lt('nutri_servings_per')}</span>
                             <span className="font-bold text-lg">{values.servingsPerContainer}</span>
                        </div>
                        <div className="flex justify-between items-end font-bold text-lg">
                            <span>{lt('nutri_serving_size')}</span>
                            <span>{values.servingSize}</span>
                        </div>
                    </div>

                    <div className="border-b-[10px] border-black pb-1 mb-1">
                         <div className="text-sm font-bold">{lt('nutri_amount_per')}</div>
                         <div className="flex justify-between items-end leading-none">
                             <span className="text-3xl font-black">{lt('nutri_calories')}</span>
                             <span className="text-5xl font-black">{values.calories}</span>
                         </div>
                    </div>

                    <div className="text-right text-sm font-bold border-b border-black pb-1 mb-1">
                        {lt('nutri_daily_value')}
                    </div>

                    {/* Nutrient Rows */}
                    <div className="text-sm">
                        <div className="border-b border-gray-400 py-1 flex justify-between">
                            <span><span className="font-bold">{lt('nutri_total_fat')}</span> {values.totalFat}g</span>
                            <span className="font-bold">{calculatePercent(values.totalFat, DAILY_VALUES.totalFat)}%</span>
                        </div>
                        
                        <div className="border-b border-gray-400 py-1 flex justify-between pl-6 rtl:pr-6 rtl:pl-0">
                            <span>{lt('nutri_sat_fat')} {values.satFat}g</span>
                            <span className="font-bold">{calculatePercent(values.satFat, DAILY_VALUES.satFat)}%</span>
                        </div>

                        <div className="border-b border-gray-400 py-1 flex justify-between pl-6 rtl:pr-6 rtl:pl-0">
                            <span className="italic">{lt('nutri_trans_fat')} {values.transFat}g</span>
                        </div>

                        <div className="border-b border-gray-400 py-1 flex justify-between">
                            <span><span className="font-bold">{lt('nutri_cholesterol')}</span> {values.cholesterol}mg</span>
                            <span className="font-bold">{calculatePercent(values.cholesterol, DAILY_VALUES.cholesterol)}%</span>
                        </div>

                        <div className="border-b border-gray-400 py-1 flex justify-between">
                            <span><span className="font-bold">{lt('nutri_sodium')}</span> {values.sodium}mg</span>
                            <span className="font-bold">{calculatePercent(values.sodium, DAILY_VALUES.sodium)}%</span>
                        </div>

                        <div className="border-b border-gray-400 py-1 flex justify-between">
                            <span><span className="font-bold">{lt('nutri_total_carb')}</span> {values.totalCarb}g</span>
                            <span className="font-bold">{calculatePercent(values.totalCarb, DAILY_VALUES.totalCarb)}%</span>
                        </div>

                        <div className="border-b border-gray-400 py-1 flex justify-between pl-6 rtl:pr-6 rtl:pl-0">
                            <span>{lt('nutri_fiber')} {values.fiber}g</span>
                            <span className="font-bold">{calculatePercent(values.fiber, DAILY_VALUES.fiber)}%</span>
                        </div>

                        <div className="border-b border-gray-400 py-1 pl-6 rtl:pr-6 rtl:pl-0">
                            <span>{lt('nutri_sugars')} {values.totalSugars}g</span>
                        </div>
                        
                        <div className="border-b border-gray-400 py-1 flex justify-between pl-10 rtl:pr-10 rtl:pl-0">
                            <span>{lt('nutri_added_sugars').replace('Includes', 'Includes').replace('Added Sugars', `${values.addedSugars}g Added Sugars`)}</span>
                            <span className="font-bold">{calculatePercent(values.addedSugars, DAILY_VALUES.addedSugars)}%</span>
                        </div>

                         <div className="border-b-[10px] border-black py-1 flex justify-between">
                            <span><span className="font-bold">{lt('nutri_protein')}</span> {values.protein}g</span>
                            <span className="font-bold">{calculatePercent(values.protein, DAILY_VALUES.protein)}%</span>
                        </div>
                    </div>

                    {/* Micronutrients */}
                    <div className="text-sm">
                        <div className="border-b border-gray-400 py-1 flex justify-between">
                            <span>{lt('nutri_vit_d')} {values.vitD}mcg</span>
                            <span>{calculatePercent(values.vitD, DAILY_VALUES.vitD)}%</span>
                        </div>
                        <div className="border-b border-gray-400 py-1 flex justify-between">
                            <span>{lt('nutri_calcium')} {values.calcium}mg</span>
                            <span>{calculatePercent(values.calcium, DAILY_VALUES.calcium)}%</span>
                        </div>
                        <div className="border-b border-gray-400 py-1 flex justify-between">
                            <span>{lt('nutri_iron')} {values.iron}mg</span>
                            <span>{calculatePercent(values.iron, DAILY_VALUES.iron)}%</span>
                        </div>
                        <div className="border-b border-black py-1 flex justify-between">
                            <span>{lt('nutri_potassium')} {values.potassium}mg</span>
                            <span>{calculatePercent(values.potassium, DAILY_VALUES.potassium)}%</span>
                        </div>
                    </div>

                    <div className="text-[10px] leading-tight pt-2">
                        {lt('nutri_footnote')}
                    </div>
                </div>

            </div>
        </div>

      </div>

      <style>{`
        .input-std {
            width: 100%;
            background-color: ${isRTL ? '#f8fafc' : '#f8fafc'};
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
        }
        .dark .input-std {
            background-color: #1e293b;
            border-color: #334155;
            color: white;
        }
        .input-std:focus {
            ring: 2px solid #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default NutritionTool;