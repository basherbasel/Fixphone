import React from 'react';
import { 
  Cpu, 
  Usb, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Globe, 
  RefreshCw,
  Power,
  ChevronDown,
  Sparkles,
  Zap,
  Wrench,
  Smartphone,
  Radio,
  Flame,
  Cloud
} from 'lucide-react';
import { ConnectedDevice } from '../types';
import { DEVICE_PRESETS } from '../data/devicePresets';

interface NavbarProps {
  currentDevice: ConnectedDevice;
  onSelectDevice: (device: ConnectedDevice) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBusy: boolean;
  onEmergencyStop: () => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  onOpenUsbModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDevice,
  onSelectDevice,
  activeTab,
  setActiveTab,
  isBusy,
  onEmergencyStop,
  lang,
  setLang,
  onOpenUsbModal
}) => {
  const isAr = lang === 'ar';

  const navTabs = [
    { id: 'cloud-security', labelEn: '0-Day Cloud & Exploit Hub', labelAr: 'سحابة الثغرات والتحديثات 0-Day', icon: Flame, badge: 'LIVE 2026' },
    { id: 'fault-repair', labelEn: 'Universal Fault Repair', labelAr: 'مركز إصلاح كافة الأعطال', icon: Wrench, badge: 'PRO' },
    { id: 'device-reader', labelEn: 'Multi-Mode Telemetry', labelAr: 'قارئ الهاتف بكافة الأوضاع', icon: Smartphone },
    { id: 'hardware-workbench', labelEn: 'Hardware & Micro-Soldering', labelAr: 'المخططات والمايكروسولدرينغ', icon: Cpu, badge: 'SCHEMATICS' },
    { id: 'firmware-matching', labelEn: 'Verified Stock ROMs', labelAr: 'الفلاشات الرسمية المعتمدة', icon: ShieldAlert, badge: 'SHA-256' },
    { id: 'flasher', labelEn: 'Multi-ROM Flasher', labelAr: 'تفليش الأنظمة والرومات', icon: Zap },
    { id: 'frp', labelEn: 'FRP & Account Bypass', labelAr: 'تخطي الحسابات و FRP', icon: ShieldAlert },
    { id: 'ai-diagnostics', labelEn: 'AI Diagnostics & Panic', labelAr: 'التشخيص الذكي واللوج', icon: Sparkles },
    { id: 'network', labelEn: 'NVRAM & IMEI Repair', labelAr: 'إصلاح الشبكة والسيريال', icon: Activity },
    { id: 'localization', labelEn: 'Language & CSC Switch', labelAr: 'التعريب وتغيير CSC', icon: Globe },
    { id: 'safety', labelEn: 'Anti-Brick & Backups', labelAr: 'الحماية والنسخ الاحتياطي', icon: ShieldAlert },
    { id: 'codelab', labelEn: 'Native Protocol Code Lab', labelAr: 'أكواد ومكتبات البروتوكول', icon: Terminal },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Top Bar: Brand & USB Connection Header */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white bg-clip-text">OMNIFIX</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">PRO v4.8</span>
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CLOUD SYNCED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              {isAr ? 'منظومة الصيانة الذكية الشاملة لكافة شركات وموديلات الهواتف مع التحديث الفوري للثغرات والحمايات' : 'Intelligent Universal Mobile Repair Workstation with Real-time 0-Day Exploit & Firmware Sync'}
            </p>
          </div>
        </div>

        {/* Device Switcher & USB Connection Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct Live USB Hardware Connect Trigger */}
          <button
            onClick={onOpenUsbModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            title="Connect Real Physical Phone via WebUSB"
          >
            <Usb className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>{isAr ? '⚡ اتصال USB مباشر' : '⚡ Connect USB'}</span>
          </button>

          {/* Quick Preset Selector */}
          <div className="relative">
            <select
              aria-label="Target Test Device"
              value={currentDevice.id}
              onChange={(e) => {
                const found = DEVICE_PRESETS.find(d => d.id === e.target.value);
                if (found) onSelectDevice(found);
              }}
              className="bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700 rounded-md px-3 py-1.5 pr-8 appearance-none hover:border-slate-600 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {DEVICE_PRESETS.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  [{dev.brand.toUpperCase()}] {dev.marketName} ({dev.mode})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Port Status Badge */}
          <div 
            onClick={onOpenUsbModal}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-750 border border-slate-700 text-xs font-mono transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold truncate max-w-[140px]">{currentDevice.port}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 font-medium transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Emergency Stop Button */}
          {isBusy && (
            <button
              onClick={onEmergencyStop}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded shadow-lg shadow-rose-600/30 animate-pulse transition-colors cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isAr ? 'إيقاف طوارئ' : 'ABORT'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="px-4 flex items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 py-1 bg-slate-950/60">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded border ${
                  tab.id === 'cloud-security'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                    : 'bg-indigo-500/30 text-indigo-300 border-indigo-500/40'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
