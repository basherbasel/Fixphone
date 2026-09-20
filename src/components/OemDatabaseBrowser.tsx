import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Copy, 
  Check, 
  Cpu, 
  Terminal, 
  Smartphone, 
  Filter, 
  Layers, 
  Code, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  Download
} from 'lucide-react';
import { OEM_DEVICE_DATABASE } from '../data/oemDeviceDatabase';
import { OemDeviceRecord } from '../types';

interface OemDatabaseBrowserProps {
  onSelectModelToTarget?: (record: OemDeviceRecord) => void;
  lang: 'en' | 'ar';
}

export const OemDatabaseBrowser: React.FC<OemDatabaseBrowserProps> = ({
  onSelectModelToTarget,
  lang
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [copiedItemCode, setCopiedItemCode] = useState<string | null>(null);

  const brands = ['ALL', 'Samsung', 'Xiaomi', 'POCO', 'Oppo', 'Realme', 'Vivo', 'iQOO', 'Infinix', 'Tecno', 'Huawei', 'Honor', 'Motorola', 'Nokia', 'Apple', 'Google'];

  const filteredRecords = OEM_DEVICE_DATABASE.filter((rec) => {
    const matchesBrand = selectedBrand === 'ALL' || rec.brand.toLowerCase() === selectedBrand.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesBrand;
    return matchesBrand && (
      rec.model.toLowerCase().includes(q) ||
      rec.code_name.toLowerCase().includes(q) ||
      rec.chipset.toLowerCase().includes(q) ||
      rec.supported_operations.some(op => op.toLowerCase().includes(q))
    );
  });

  const handleCopyFullJson = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredRecords, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopySingleJson = (rec: OemDeviceRecord) => {
    navigator.clipboard.writeText(JSON.stringify(rec, null, 2));
    setCopiedItemCode(rec.model);
    setTimeout(() => setCopiedItemCode(null), 1500);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-2xl space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isAr ? 'قاعدة بيانات الموديلات والمعالجات الشاملة (2018 - 2026 OEM Database)' : '2018-2026 Master OEM Device & Chipset Database'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {OEM_DEVICE_DATABASE.length} RECORDS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'قائمة مفصلة وشاملة لموديلات سامسونج، شاومي، أوبو، فيفو، إنفينيكس، هواوي، نوكيا بترميز JSON نظيف للربط المباشر'
                : 'Exhaustive JSON device registry covering Samsung, Xiaomi, Oppo, Vivo, Transsion, Huawei, Nokia, Apple & Pixel.'}
            </p>
          </div>
        </div>

        {/* Copy All Filtered JSON Button */}
        <button
          onClick={handleCopyFullJson}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          {copiedJson ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copiedJson ? (isAr ? 'تم نسخ JSON بنجاح!' : 'Copied JSON!') : (isAr ? 'نسخ كود JSON بالكامل' : 'Copy Full JSON')}</span>
        </button>
      </div>

      {/* Brand Tabs bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
              selectedBrand === b
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? 'ابحث باسم الموديل أو المعالج أو العمليات (مثلاً: S24 Ultra, Dimensity 7200, BROM)...' : 'Search model, code name, chipset or operation...'}
          className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Grid List of Device JSON Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredRecords.map((rec, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {rec.brand}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {rec.code_name}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white">{rec.model}</h4>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{rec.chipset}</span>
              </div>

              {/* Supported Operations list */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">
                  {isAr ? 'العمليات المدعومة:' : 'Supported Operations:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {rec.supported_operations.map((op, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-emerald-300 border border-slate-700">
                      {op}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleCopySingleJson(rec)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[10px] font-mono text-indigo-300 border border-slate-800 cursor-pointer"
              >
                {copiedItemCode === rec.model ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
                <span>{copiedItemCode === rec.model ? 'Copied JSON' : 'JSON'}</span>
              </button>

              <span className="text-[9px] font-mono text-slate-500">2018-2026 READY</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
