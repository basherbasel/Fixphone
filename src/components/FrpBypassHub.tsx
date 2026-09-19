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
  Key
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
  const [selectedMethodId, setSelectedMethodId] = useState<string>(FRP_METHODS[0].id);

  // Recommended methods based on current chipset
  const matchedMethods = FRP_METHODS.filter(m => m.targetChipsets.includes(device.chipset));
  const activeMethod = FRP_METHODS.find(m => m.id === selectedMethodId) || FRP_METHODS[0];

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
              <span>{isAr ? 'مركز تخطي الحسابات وقفل FRP الذكي' : 'Automated FRP & Account Bypass Matrix'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {device.frpStatus === 'ON' || device.frpStatus === 'LOCKED' ? 'FRP LOCKED' : 'FRP CLEAR'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr 
                ? 'تخطي حسابات Google FRP و Mi Cloud و Huawei ID و Samsung Knox وحسابات iCloud عبر بروتوكولات الأجهزة المنخفضة'
                : 'Zero-trip low-level FRP, Mi Account, Knox, and Activation bypass protocols tailored to connected hardware.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Detected:</span>
          <span className="text-cyan-300 font-bold">{device.chipset.toUpperCase()}</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">{device.mode}</span>
        </div>
      </div>

      {/* Main Grid: Methods on Left, Detailed Protocol Execution on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Available Method Cards */}
        <div className="lg:col-span-1 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            {isAr ? 'الطرق المتوافقة مع هذا الهاتف:' : 'Available Exploits & Protocols:'}
          </h4>

          {FRP_METHODS.map((method) => {
            const isSelected = method.id === selectedMethodId;
            const isChipsetCompatible = method.targetChipsets.includes(device.chipset);

            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethodId(method.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {method.name}
                  </h5>
                  {isChipsetCompatible && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 font-mono">
                  <span>Req: {method.modeRequired}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-semibold">{method.successRate}% Success</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Protocol Details & One-Click Execution View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
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
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">REQUIRED MODE</span>
              <span className="text-amber-400 font-bold">{activeMethod.modeRequired}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SUPPORTED OS</span>
              <span className="text-slate-200 font-medium">{activeMethod.supportedAndroid}</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[10px]">SUCCESS METRIC</span>
              <span className="text-emerald-400 font-bold">{activeMethod.successRate}% Verified</span>
            </div>
          </div>

          {/* Sequential Execution Pipeline */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'خطوات تنفيذ البروتوكول:' : 'Hardware Protocol Execution Pipeline:'}</span>
            </h5>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs text-slate-300">
              {activeMethod.protocolSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">›</span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning / Safety Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>
              {isAr
                ? 'سيقوم النظام بأخذ نسخة احتياطية فورية لقطاعات EFS / NVRAM / PERSIST قبل مسح FRP.'
                : 'OmniFix Safety Suite will automatically snapshot critical security partitions prior to execution.'}
            </span>
          </div>

          {/* Execute Button */}
          <button
            onClick={() => onExecuteBypass(activeMethod)}
            disabled={isBusy}
            className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              isBusy
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/30'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isBusy
                ? (isAr ? 'جاري تنفيذ التخطي...' : 'EXECUTING FRP BYPASS ROUTINE...')
                : (isAr ? `تخطي قفل FRP عبر ${activeMethod.name}` : `START ${activeMethod.name.toUpperCase()}`)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
