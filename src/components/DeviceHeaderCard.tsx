import React from 'react';
import { 
  Smartphone, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Battery, 
  Lock, 
  Unlock, 
  Radio, 
  Terminal,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  Activity,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { ConnectedDevice, DeviceMode } from '../types';

interface DeviceHeaderCardProps {
  device: ConnectedDevice;
  onRebootToMode: (mode: DeviceMode) => void;
  onReadInfo: () => void;
  onOpenSmartAgent?: () => void;
  onTriggerDiagnostic?: (type: 'LOGCAT' | 'KERNEL' | 'MEMORY' | 'THERMAL') => void;
  lang: 'en' | 'ar';
}

export const DeviceHeaderCard: React.FC<DeviceHeaderCardProps> = ({
  device,
  onRebootToMode,
  onReadInfo,
  onOpenSmartAgent,
  onTriggerDiagnostic,
  lang
}) => {
  const isAr = lang === 'ar';

  const getModeBadgeColor = (mode: DeviceMode) => {
    switch (mode) {
      case 'EDL_9008': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MTK_BROM': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'SAMSUNG_DOWNLOAD': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'FASTBOOT':
      case 'FASTBOOTD': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'SPD_DIAG': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'HUAWEI_COM1': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'APPLE_DFU':
      case 'APPLE_RECOVERY': return 'bg-slate-300/20 text-slate-200 border-slate-400/40';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const isBatterySafe = device.batteryLevel >= 20;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3.5">
      {/* Top Row: Device Identity & Security Status */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Device Identity */}
        <div className="flex items-start gap-3.5">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wide">
                {device.brand} {device.marketName}
              </h2>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {device.model}
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-semibold ${getModeBadgeColor(device.mode)}`}>
                ● {device.mode}
              </span>
            </div>

            {/* Sub-specifications Bar */}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>{device.chipsetName}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                <span>{device.storageType} {device.storageSizeGb}GB</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1">
                <Battery className={`w-3.5 h-3.5 ${isBatterySafe ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`} />
                <span className={isBatterySafe ? 'text-slate-300' : 'text-rose-400 font-bold'}>{device.batteryLevel}%</span>
              </div>
              {device.cscCode && (
                <>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300 font-medium">CSC: {device.cscCode}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Security, Rollback Index & Actions */}
        <div className="flex items-center gap-2 flex-wrap self-end lg:self-center">
          {/* Bootloader State */}
          <div className={`px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 border ${
            device.bootloaderStatus === 'UNLOCKED' 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {device.bootloaderStatus === 'UNLOCKED' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>BL: {device.bootloaderStatus}</span>
          </div>

          {/* FRP Status */}
          <div className={`px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 border ${
            device.frpStatus === 'ON' || device.frpStatus === 'LOCKED'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FRP: {device.frpStatus}</span>
          </div>

          {/* Rollback Protection Gate */}
          <div className="px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-cyan-300">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>ARB Index: <strong>{device.rollbackIndex}</strong></span>
          </div>

          {/* Read Info Action */}
          <button
            onClick={onReadInfo}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isAr ? 'قراءة بيانات الهاتف' : 'Read Info'}</span>
          </button>

          {/* Smart AI Agent Autonomous Inspector Button */}
          {onOpenSmartAgent && (
            <button
              onClick={onOpenSmartAgent}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-200" />
              <span>{isAr ? 'العميل الذكي القارئ للتشخيص' : 'AI Agent Auto-Inspect'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Telemetry & Health Metrics Dashboard Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* CPU Load & Temperature */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono">{isAr ? 'حمل وحرارة المعالج' : 'CPU Load & Temp'}</p>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
                <span>{device.cpuUsagePercent || 15}%</span>
                <span className="text-slate-600">/</span>
                <span className="text-cyan-400">{device.cpuTempCelsius || 34.5}°C</span>
              </div>
            </div>
          </div>
          <div className="w-10 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-400 h-full rounded-full" 
              style={{ width: `${device.cpuUsagePercent || 15}%` }} 
            />
          </div>
        </div>

        {/* Battery Health & Voltage */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md border ${
              isBatterySafe 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <Battery className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono">{isAr ? 'صحة وفولت البطارية' : 'Battery & mV'}</p>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
                <span className={isBatterySafe ? 'text-emerald-400' : 'text-rose-400'}>{device.batteryVoltageMv || 4150}mV</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">{device.batteryCycleCount || 120} cyc</span>
              </div>
            </div>
          </div>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
            isBatterySafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {device.batteryHealth || (isBatterySafe ? 'SAFE' : 'LOW')}
          </span>
        </div>

        {/* RAM Usage */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono">{isAr ? 'استهلاك الذاكرة العشوائية' : 'RAM Telemetry'}</p>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
                <span>{device.ramUsagePercent || 45}%</span>
                <span className="text-slate-600">/</span>
                <span className="text-indigo-400">{device.ramTotalGb || 8}GB</span>
              </div>
            </div>
          </div>
          <div className="w-10 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-400 h-full rounded-full" 
              style={{ width: `${device.ramUsagePercent || 45}%` }} 
            />
          </div>
        </div>

        {/* Storage State */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <HardDrive className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono">{isAr ? 'المساحة المستخدمة' : 'Storage State'}</p>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
                <span>{device.storageUsedGb || 64}GB</span>
                <span className="text-slate-600">/</span>
                <span className="text-purple-300">{device.storageSizeGb}GB</span>
              </div>
            </div>
          </div>
          <div className="w-10 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-purple-400 h-full rounded-full" 
              style={{ width: `${Math.round(((device.storageUsedGb || 64) / device.storageSizeGb) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Auto-Diagnostic Triggers & Mode Switching Quick Bar */}
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs">
        {/* Auto-Diagnostic Quick Triggers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {isAr ? 'فحص تلقائي:' : 'Auto-Diagnose:'}
          </span>
          <button
            onClick={() => onTriggerDiagnostic?.('LOGCAT')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-mono transition-colors"
          >
            Logcat Scan
          </button>
          <button
            onClick={() => onTriggerDiagnostic?.('KERNEL')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-[11px] font-mono transition-colors"
          >
            Kernel Panic Check
          </button>
          <button
            onClick={() => onTriggerDiagnostic?.('MEMORY')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-[11px] font-mono transition-colors"
          >
            Memory Leak / OOM
          </button>
          <button
            onClick={() => onTriggerDiagnostic?.('THERMAL')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-mono transition-colors"
          >
            Thermal & Voltage
          </button>
        </div>

        {/* Mode Switching Quick Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] font-semibold hidden md:inline">{isAr ? 'الأوضاع:' : 'Modes:'}</span>
          <button
            onClick={() => onRebootToMode('EDL_9008')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-900/30 hover:text-amber-300 border border-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
          >
            EDL 9008
          </button>
          <button
            onClick={() => onRebootToMode('FASTBOOT')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-blue-900/30 hover:text-blue-300 border border-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
          >
            Fastboot
          </button>
          <button
            onClick={() => onRebootToMode('SAMSUNG_DOWNLOAD')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-900/30 hover:text-cyan-300 border border-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
          >
            Odin Download
          </button>
          <button
            onClick={() => onRebootToMode('MTK_BROM')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-purple-900/30 hover:text-purple-300 border border-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
          >
            BROM Mode
          </button>
          <button
            onClick={() => onRebootToMode('ADB_ONLINE')}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-900/30 hover:text-emerald-300 border border-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
          >
            Reboot System
          </button>
        </div>
      </div>
    </div>
  );
};

