import React, { useState } from 'react';
import { 
  Wrench, 
  RotateCcw, 
  Zap, 
  ShieldAlert, 
  AlertOctagon, 
  Radio, 
  Key, 
  RefreshCw, 
  Layers, 
  HardDrive, 
  Lock, 
  BatteryCharging, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Terminal, 
  Check, 
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Search,
  Filter,
  CheckCheck,
  HelpCircle
} from 'lucide-react';
import { ConnectedDevice, FaultRepairItem } from '../types';
import { FAULT_REPAIRS } from '../data/faultRepairs';

interface UltimateFaultRepairHubProps {
  device: ConnectedDevice;
  onExecuteRepairPipeline: (repair: FaultRepairItem) => void;
  isBusy: boolean;
  lang: 'en' | 'ar';
}

const ICON_MAP: Record<string, any> = {
  RotateCcw,
  Zap,
  ShieldAlert,
  AlertOctagon,
  Radio,
  Key,
  RefreshCw,
  Layers,
  HardDrive,
  Lock,
  BatteryCharging,
  Download
};

export const UltimateFaultRepairHub: React.FC<UltimateFaultRepairHubProps> = ({
  device,
  onExecuteRepairPipeline,
  isBusy,
  lang
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeRepair, setActiveRepair] = useState<FaultRepairItem>(FAULT_REPAIRS[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const categories = [
    { id: 'ALL', nameAr: `كافة الأعطال (${FAULT_REPAIRS.length})`, nameEn: `All Engines (${FAULT_REPAIRS.length})` },
    { id: 'BOOT', nameAr: 'أعطال الإقلاع والشعار', nameEn: 'Boot & Startup' },
    { id: 'NETWORK', nameAr: 'الشبكة والمودم و IMEI', nameEn: 'Network & Modem' },
    { id: 'SECURITY', nameAr: 'الأقفال والحماية و FRP', nameEn: 'Security & Locks' },
    { id: 'HARDWARE', nameAr: 'الهاردوير والذاكرة والصوت', nameEn: 'Hardware & Storage' },
    { id: 'DATA', nameAr: 'استخراج البيانات المحذوفة', nameEn: 'Forensic Dump' },
  ];

  const filteredRepairs = FAULT_REPAIRS.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      item.titleAr.toLowerCase().includes(q) || 
      item.titleEn.toLowerCase().includes(q) || 
      item.descriptionAr.toLowerCase().includes(q) ||
      item.descriptionEn.toLowerCase().includes(q) ||
      item.supportedModes.some(m => m.toLowerCase().includes(q)) ||
      item.supportedChipsets.some(c => c.toLowerCase().includes(q));
    
    return matchesCategory && matchesSearch;
  });

  const CurrentIcon = ICON_MAP[activeRepair.icon] || Wrench;

  return (
    <div className="space-y-4">
      {/* Hub Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'مركز الهندسة والإصلاح الشامل لكافة أعطال الهواتف المحمولة' : 'Universal Mobile Fault Diagnostics & Deep Hardware Repair Hub'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                {FAULT_REPAIRS.length} REPAIR ENGINES
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'إصلاح تلقائي بنقرة واحدة للتعليق على الشعار، الموت المفاجئ 9008، فقدان الشبكة، قفل الشاشة، والذاكرة لكافة الشركات والمعالجات'
                : 'Automated 1-click multi-stage repair pipelines for Bootloop, Hardbrick 9008, Red State, Null IMEI, Screen Lock, and Flash Wear.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{device.brand} {device.model} ({device.chipset.toUpperCase()})</span>
          </div>
        </div>
      </div>

      {/* Search Bar & Category Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن أي عطل (مثال: تعليق على الشعار، شبكة، 9008، قفل شاشة، واي فاي، موت مفاجئ)...' : 'Search any fault (e.g., bootloop, IMEI, 9008, screen lock, Wi-Fi, dead boot)...'}
            className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {isAr ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left List / Right Active Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Repairs List (5 Columns) */}
        <div className="lg:col-span-5 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {filteredRepairs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">{isAr ? 'لم يتم العثور على عطل مطابق للبحث' : 'No matching faults found'}</p>
            </div>
          ) : (
            filteredRepairs.map((repair) => {
              const ItemIcon = ICON_MAP[repair.icon] || Wrench;
              const isSelected = activeRepair.id === repair.id;

              return (
                <div
                  key={repair.id}
                  onClick={() => {
                    setActiveRepair(repair);
                    setActiveStepIndex(0);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      isSelected ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      <ItemIcon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">
                          {isAr ? repair.titleAr : repair.titleEn}
                        </h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          repair.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          repair.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {repair.severity}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {isAr ? repair.descriptionAr : repair.descriptionEn}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                        <span>{repair.protocolPipeline.length} {isAr ? 'مراحل برمجية' : 'Stages'}</span>
                        <span className="text-emerald-400 truncate max-w-[180px]">{isAr ? repair.riskAr : repair.riskEn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Active Repair Pipeline & Execution Stage (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header of Active Repair */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? activeRepair.titleAr : activeRepair.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                    <span>{isAr ? 'الأوضاع المتوافقة:' : 'Target Modes:'}</span>
                    <span className="text-cyan-400">{activeRepair.supportedModes.join(' | ')}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {activeRepair.category}
              </span>
            </div>

            {/* Description Card */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? 'شرح العطل وآلية المعالجة المتبعة:' : 'Root Cause & Protocol Remediation:'}</span>
              </div>
              <p>{isAr ? activeRepair.descriptionAr : activeRepair.descriptionEn}</p>
            </div>

            {/* Step-by-Step Protocol Pipeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>{isAr ? 'مسار خطوات الإصلاح التلقائي (Sequential Pipeline):' : 'Automated Repair Protocol Pipeline:'}</span>
                <span className="text-[10px] font-mono text-cyan-400">{activeRepair.protocolPipeline.length} Steps</span>
              </h4>

              <div className="space-y-2">
                {activeRepair.protocolPipeline.map((step, idx) => (
                  <div
                    key={step.stepNumber}
                    className={`p-3 rounded-lg border transition-all ${
                      idx === activeStepIndex
                        ? 'bg-slate-900 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-slate-950 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {step.stepNumber}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-200">
                          {isAr ? step.actionAr : step.actionEn}
                        </div>

                        {step.commandPreview && (
                          <div className="mt-1.5 px-2.5 py-1 rounded bg-black/70 border border-slate-800 text-[11px] font-mono text-cyan-400 truncate">
                            {step.commandPreview}
                          </div>
                        )}

                        {step.protocolCode && (
                          <div className="mt-1.5 px-2.5 py-1 rounded bg-black/70 border border-slate-800 text-[11px] font-mono text-amber-300 truncate">
                            {step.protocolCode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk & Safety Badge */}
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isAr ? `مستوى الأمان: ${activeRepair.riskAr}` : `Safety: ${activeRepair.riskEn}`}</span>
            </div>
          </div>

          {/* 1-Click Execution Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              <span>Target: </span>
              <span className="text-cyan-400 font-bold">{device.model} ({device.mode})</span>
            </div>

            <button
              onClick={() => onExecuteRepairPipeline(activeRepair)}
              disabled={isBusy}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>
                {isBusy
                  ? (isAr ? 'جاري تنفيذ خطوات الإصلاح...' : 'EXECUTING REPAIR PROTOCOL...')
                  : (isAr ? 'بدء الإصلاح التلقائي للعطل الآن' : 'EXECUTE AUTOMATED REPAIR NOW')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
