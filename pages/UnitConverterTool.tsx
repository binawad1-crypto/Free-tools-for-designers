
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Ruler, ArrowRightLeft, Copy, Check } from 'lucide-react';

type UnitCategory = 'length' | 'typography' | 'digital' | 'mass';

interface UnitDefinition {
  id: string;
  label: string;
  factor?: number; // Factor relative to base unit of category
}

const UnitConverterTool: React.FC = () => {
  const { t, isRTL } = useApp();
  
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('px');
  const [toUnit, setToUnit] = useState<string>('cm');
  const [inputValue, setInputValue] = useState<number | ''>(100);
  const [result, setResult] = useState<string>('');
  const [baseFontSize, setBaseFontSize] = useState<number>(16);
  const [copied, setCopied] = useState(false);

  // Unit Definitions
  const units: Record<UnitCategory, UnitDefinition[]> = {
    length: [
      { id: 'px', label: 'Pixels (96dpi)' },
      { id: 'cm', label: 'Centimeters' },
      { id: 'mm', label: 'Millimeters' },
      { id: 'in', label: 'Inches' },
      { id: 'pt', label: 'Points' },
      { id: 'm', label: 'Meters' },
    ],
    typography: [
      { id: 'px', label: 'Pixels (px)' },
      { id: 'rem', label: 'REM' },
      { id: 'em', label: 'EM' },
      { id: 'percent', label: 'Percent (%)' },
      { id: 'pt', label: 'Points (pt)' },
    ],
    digital: [
      { id: 'b', label: 'Bytes (B)' },
      { id: 'kb', label: 'Kilobytes (KB)' },
      { id: 'mb', label: 'Megabytes (MB)' },
      { id: 'gb', label: 'Gigabytes (GB)' },
      { id: 'tb', label: 'Terabytes (TB)' },
    ],
    mass: [
      { id: 'g', label: 'Grams (g)' },
      { id: 'kg', label: 'Kilograms (kg)' },
      { id: 'oz', label: 'Ounces (oz)' },
      { id: 'lb', label: 'Pounds (lb)' },
    ]
  };

  // Conversion Logic
  // Length Base: Meter (m) (Using 96dpi for px approx: 1in = 96px = 0.0254m)
  // Digital Base: Byte (b)
  // Mass Base: Gram (g)
  // Typography Base: Pixel (px)
  
  const factors: any = {
    length: {
      m: 1,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      px: 0.0002645833, // 0.0254 / 96
      pt: 0.0003527778, // 1/72 inch
    },
    digital: {
      b: 1,
      kb: 1024,
      mb: 1048576,
      gb: 1073741824,
      tb: 1099511627776,
    },
    mass: {
      g: 1,
      kg: 1000,
      oz: 28.34952,
      lb: 453.59237,
    },
    // Typography handled separately due to variable base size
  };

  useEffect(() => {
    // Reset units when category changes
    if (category === 'length') { setFromUnit('px'); setToUnit('cm'); }
    if (category === 'typography') { setFromUnit('px'); setToUnit('rem'); }
    if (category === 'digital') { setFromUnit('mb'); setToUnit('kb'); }
    if (category === 'mass') { setFromUnit('kg'); setToUnit('lb'); }
  }, [category]);

  useEffect(() => {
    if (inputValue === '') {
      setResult('');
      return;
    }

    const val = Number(inputValue);
    if (isNaN(val)) return;

    let res = 0;

    if (category === 'typography') {
      // Logic for Web Units
      // Normalize to px first
      let pxVal = 0;
      if (fromUnit === 'px') pxVal = val;
      else if (fromUnit === 'rem' || fromUnit === 'em') pxVal = val * baseFontSize;
      else if (fromUnit === 'percent') pxVal = val * baseFontSize / 100;
      else if (fromUnit === 'pt') pxVal = val * (96/72);

      // Convert from px to target
      if (toUnit === 'px') res = pxVal;
      else if (toUnit === 'rem' || toUnit === 'em') res = pxVal / baseFontSize;
      else if (toUnit === 'percent') res = (pxVal / baseFontSize) * 100;
      else if (toUnit === 'pt') res = pxVal * (72/96);

    } else {
      // Standard Factor Conversion
      // fromVal * fromFactor = baseVal
      // baseVal / toFactor = result
      const catFactors = factors[category];
      const baseVal = val * catFactors[fromUnit];
      res = baseVal / catFactors[toUnit];
    }

    // Formatting: clean decimals
    const formatted = parseFloat(res.toFixed(4)).toString();
    setResult(formatted);

  }, [inputValue, fromUnit, toUnit, category, baseFontSize]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
           <Ruler size={32} />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-500">
          {t('unit_tool')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('app_desc')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {(Object.keys(units) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              category === cat
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {t(`unit_cat_${cat}` as any)}
          </button>
        ))}
      </div>

      {/* Converter Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        
        {/* Typography Special Config */}
        {category === 'typography' && (
          <div className="absolute top-0 left-0 right-0 bg-rose-50 dark:bg-rose-900/10 px-6 py-3 border-b border-rose-100 dark:border-rose-900/20 flex justify-center items-center gap-3 text-sm">
            <label className="font-medium text-rose-800 dark:text-rose-300">{t('unit_label_base')}:</label>
            <input 
              type="number" 
              value={baseFontSize}
              onChange={(e) => setBaseFontSize(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-800 text-center font-bold text-rose-700 bg-white dark:bg-black/20 outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center ${category === 'typography' ? 'mt-8' : ''}`}>
          
          {/* FROM */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block px-1">
              {t('unit_label_from')}
            </label>
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-rose-500 transition-all">
              <input 
                type="number" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-transparent text-3xl font-bold p-4 outline-none text-slate-800 dark:text-white placeholder:text-slate-300"
                placeholder="0"
              />
              <div className="px-2 pb-2">
                <select 
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium outline-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {units[category].map(u => (
                    <option key={u.id} value={u.id}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SWAP ACTION */}
          <div className="flex justify-center md:pt-6">
            <button 
              onClick={handleSwap}
              className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-500 hover:text-rose-600 transition-colors shadow-sm active:scale-90"
            >
              <ArrowRightLeft size={24} />
            </button>
          </div>

          {/* TO */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block px-1">
              {t('unit_label_to')}
            </label>
            <div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl p-2 border border-rose-100 dark:border-rose-900/30">
              <div className="w-full bg-transparent text-3xl font-bold p-4 text-rose-600 dark:text-rose-400 break-all min-h-[72px] flex items-center">
                 {result || '...'}
              </div>
              <div className="px-2 pb-2">
                <select 
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium outline-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {units[category].map(u => (
                    <option key={u.id} value={u.id}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Result */}
        {result && (
           <div className="mt-8 flex justify-center">
             <button 
               onClick={handleCopy}
               className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform shadow-lg"
             >
               {copied ? <Check size={18} /> : <Copy size={18} />}
               {copied ? 'Copied' : t('copy_btn')}
             </button>
           </div>
        )}

      </div>
    </div>
  );
};

export default UnitConverterTool;
