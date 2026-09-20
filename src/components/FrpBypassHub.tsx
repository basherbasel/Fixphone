import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  AlertTriangle, 
  Play, 
  Terminal, 
  Cpu, 
  Sparkles, 
  HelpCircle,
  Clock,
  Key,
  Search,
  Lock,
  Unlock,
  Layers,
  Smartphone,
  Check
} from 'lucide-react';
import { ConnectedDevice, FrpMethod } from '../types';
import { FRP_METHODS } from '../data/frpMethods';

interface FrpBypassHubProps {
  device: ConnectedDevice;
  onExecuteBypass: (method: FrpMethod) => void;
  isBusy: boolean;
  lang: 'en' | 'ar';
}

export const FrpBypassHub: React.FC<FrpBypassHubProps> = ({
  device,
  onExecuteBypass,
  isBusy,
  lang
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');
  const [selectedMethodId, setSelectedMethodId] = useState<string>(FRP_METHODS[0].id);

  const brandFilters = [
    { id: 'ALL', nameAr: 'الكل', nameEn: 'All Brands' },
    { id: 'SAMSUNG', nameAr: 'سامسونج (Knox/MTP)', nameEn: 'Samsung Knox' },
    { id: 'XIAOMI', nameAr: 'شاومي (Mi Cloud/EDL)', nameEn: 'Xiaomi/POCO' },
    { id: 'APPLE', nameAr: 'آبل (iCloud/Ramdisk)', nameEn: 'Apple iOS' },
    { id: 'HUAWEI', nameAr: 'هواوي (COM1/ID)', nameEn: 'Huawei/Honor' },
    { id: 'BBK', nameAr: 'أوبو/فيفو/ريلمي', nameEn: 'Oppo/Vivo/Realme' },
    { id: 'MEDIATEK', nameAr: 'ميدياتك (BROM)', nameEn: 'MediaTek' },
    { id: 'UNISOC', nameAr: 'يونيسوك (SPRD)', nameEn: 'Unisoc/Transsion' },
  ];

  const filteredMethods = FRP_METHODS.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      m.name.toLowerCase().includes(q) || 
      m.description.toLowerCase().includes(q) ||
      m.supportedAndroid.toLowerCase().includes(q) ||
      m.targetChipsets.some(c => c.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (selectedBrandFilter === 'ALL') return true;
    if (selectedBrandFilter === 'SAMSUNG') return m.name.toLowerCase().includes('samsung') || m.targetChipsets.includes('samsung_exynos');
    if (selectedBrandFilter === 'XIAOMI') return m.name.toLowerCase().includes('xiaomi') || m.name.toLowerCase().includes('mi account');
    if (selectedBrandFilter === 'APPLE') return m.targetChipsets.includes('apple_ios') || m.name.toLowerCase().includes('apple') || m.name.toLowerCase().includes('icloud');
    if (selectedBrandFilter === 'HUAWEI') return m.targetChipsets.includes('hisilicon_kirin') || m.name.toLowerCase().includes('huawei');
    if (selectedBrandFilter === 'BBK') return m.name.toLowerCase().includes('oppo') || m.name.toLowerCase().includes('vivo') || m.name.toLowerCase().includes('realme');
    if (selectedBrandFilter === 'MEDIATEK') return m.targetChipsets.includes('mediatek');
    if (selectedBrandFilter === 'UNISOC') return m.targetChipsets.includes('unisoc_spd');

    return true;
  });

  const activeMethod = FRP_METHODS.find(m => m.id === selectedMethodId) || filteredMethods[0] || FRP_METHODS[0];

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'مركز تخطي وفك كافة الأقفال والحسابات والتشفير العالمي' : 'Universal Account, Lock & Encryption Decryption Hub'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {FRP_METHODS.length} EXPLOIT ENGINES
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr 
                ? 'تخطي حسابات Google FRP، شاومي Mi Cloud، آبل iCloud Ramdisk، هواوي ID، حماية سامسونج Knox Guard و KG، وأقفال الشاشة والشبكة'
                : 'Zero-trip low-level FRP, Mi Account, Apple iCloud Ramdisk, Huawei ID, Knox Guard, Screen Lock, and Carrier Sim Unlock.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">{isAr ? 'الجهاز المتصل:' : 'Target:'}</span>
          <span className="text-cyan-300 font-bold">{device.brand} {device.model}</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">{device.mode}</span>
        </div>
      </div>

      {/* Brand Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن طريقة التخطي (مثل: Knox, Mi Cloud, iCloud, BROM, MTP, قفل الشاشة, NCK)...' : 'Search exploit (e.g. Knox, Mi Account, iCloud, BROM, MTP, Screen Lock, NCK)...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 pb-1">
          {brandFilters.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrandFilter(b.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                selectedBrandFilter === b.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {isAr ? b.nameAr : b.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Methods on Left, Detailed Protocol Execution on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Available Method Cards (5 Columns) */}
        <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredMethods.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
              <Key className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">{isAr ? 'لم يتم العثور على أداة فك تشفير مطابقة' : 'No matching unlock methods found'}</p>
            </div>
          ) : (
            filteredMethods.map((method) => {
              const isSelected = method.id === activeMethod.id;
              const isChipsetCompatible = method.targetChipsets.includes(device.chipset);

              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethodId(method.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-rose-500 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/40'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className={`text-xs font-bold ${isSelected ? 'text-rose-300' : 'text-slate-200'}`}>
                      {method.name}
                    </h5>
                    {isChipsetCompatible && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                        MATCHED
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {method.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                    <span className="text-amber-400 font-bold">Req: {method.modeRequired}</span>
                    <span className="text-emerald-400 font-bold">{method.successRate}% Success</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Protocol Details & One-Click Execution View (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{activeMethod.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeMethod.riskLevel === 'SAFE' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {activeMethod.riskLevel} RISK
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{activeMethod.description}</p>
              </div>
            </div>

            {/* Requirements & Target Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">{isAr ? 'الوضع المطلوب' : 'REQUIRED MODE'}</span>
                <span className="text-amber-400 font-bold">{activeMethod.modeRequired}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">{isAr ? 'الأنظمة المدعومة' : 'SUPPORTED OS'}</span>
                <span className="text-slate-200 font-medium truncate">{activeMethod.supportedAndroid}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block text-[10px]">{isAr ? 'نسبة النجاح' : 'SUCCESS RATE'}</span>
                <span className="text-emerald-400 font-bold">{activeMethod.successRate}% Verified</span>
              </div>
            </div>

            {/* Sequential Execution Pipeline */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'خطوات تنفيذ البروتوكول الأمني:' : 'Hardware Protocol Execution Pipeline:'}</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">{activeMethod.protocolSteps.length} Steps</span>
              </h5>
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
                {activeMethod.protocolSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning / Safety Notice */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                {isAr
                  ? 'سيقوم محرك الحماية OmniFix Safety Suite بعمل نسخة احتياطية مشفرة لقطاعات EFS / NVRAM / PERSIST قبل المعالجة.'
                  : 'OmniFix Safety Suite will automatically snapshot critical security partitions prior to execution.'}
              </span>
            </div>
          </div>

          {/* Execute Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              <span>Status: </span>
              <span className="text-rose-400 font-bold">{device.frpStatus}</span>
            </div>

            <button
              onClick={() => onExecuteBypass(activeMethod)}
              disabled={isBusy}
              className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                isBusy
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/30'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {isBusy
                  ? (isAr ? 'جاري تنفيذ بروتوكول التخطي...' : 'EXECUTING UNLOCK PROTOCOL...')
                  : (isAr ? `تخطي وإلغاء القفل الآن (${activeMethod.name.split(' ')[0]})` : `EXECUTE UNLOCK PROTOCOL`)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
