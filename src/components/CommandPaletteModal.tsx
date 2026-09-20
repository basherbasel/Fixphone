import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Cpu, 
  ShieldAlert, 
  Zap, 
  Wrench, 
  Database, 
  Terminal, 
  Globe, 
  Activity, 
  Smartphone, 
  RotateCcw,
  Flame,
  ArrowRight,
  HardDrive,
  X
} from 'lucide-react';
import { ConnectedDevice } from '../types';
import { DEVICE_PRESETS } from '../data/devicePresets';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
  onSelectDevice: (device: ConnectedDevice) => void;
  onOpenUsbModal: () => void;
  onOpenWindowsInstaller: () => void;
  lang: 'en' | 'ar';
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectDevice,
  onOpenUsbModal,
  onOpenWindowsInstaller,
  lang
}) => {
  const isAr = lang === 'ar';
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'smart-1click',
      titleAr: 'الاستوديو الذكي ضغطة واحدة (Smart 1-Click Studio)',
      titleEn: 'Smart 1-Click Studio',
      subtitleAr: 'إصلاح وتفكيك وفك حسابات تلقائي بضغط زر',
      subtitleEn: 'Auto FRP, Unbrick, Repair in 1-Click',
      icon: Sparkles,
      color: 'text-amber-400',
      tabId: 'smart-1click'
    },
    {
      id: 'dead-boot',
      titleAr: 'إحياء الهواتف الميتة (Dead Boot & Emergency Unbrick)',
      titleEn: 'Dead Boot & Emergency Unbrick',
      subtitleAr: 'استعادة BROM, EDL 9008, و FDL1 الميتة',
      subtitleEn: 'Restore BROM, EDL 9008 & FDL1 dead devices',
      icon: RotateCcw,
      color: 'text-rose-400',
      tabId: 'dead-boot'
    },
    {
      id: 'quantum-bypass',
      titleAr: 'التخطي السريع Quantum Ultra Bypass',
      titleEn: 'Quantum Ultra Bypass',
      subtitleAr: 'فك FRP وسيريال وسحابة بسرعة 0.4 ثانية',
      subtitleEn: 'Ultra-fast 0.4ms FRP & Account bypass',
      icon: Zap,
      color: 'text-cyan-400',
      tabId: 'quantum-bypass'
    },
    {
      id: 'ai-oscilloscope',
      titleAr: 'راسم الإشارات والأوسيلوسكوب (AI Oscilloscope & Signal Logic)',
      titleEn: 'AI Oscilloscope & Signal Logic Analyzer',
      subtitleAr: 'فحص ترددات I2C, MIPI, PWM بالساعة والجراف التفاعلي 60FPS',
      subtitleEn: 'Live 60FPS oscilloscope for I2C, MIPI, PWM & clock rails',
      icon: Activity,
      color: 'text-purple-400',
      tabId: 'ai-oscilloscope'
    },
    {
      id: 'thermal-rosin',
      titleAr: 'الكاميرا الحرارية وفاحص الشورت بالراتنج (Thermal & Rosin)',
      titleEn: 'Thermal Imaging & Rosin Short Isolation Workbench',
      subtitleAr: 'كشف المكثفات المحروقة بحقن الفولت المباشر وتبخير الدخان',
      subtitleEn: 'Isolate shorted SMD capacitors with DC injection & rosin vapor',
      icon: Flame,
      color: 'text-rose-500',
      tabId: 'thermal-rosin'
    },
    {
      id: 'voltage-bridge',
      titleAr: 'موديول جسر الفولتية VoltageBridge (تفتيش جهود V-Rail للمعالجات)',
      titleEn: 'VoltageBridge V-Rail & Multimeter Inspector',
      subtitleAr: 'مقارنة جهود التشغيل لـ Snapdragon, Kirin, Dimensity ببيانات الملتيميتر',
      subtitleEn: 'Cross-reference V-Nominal power rails for Snapdragon, Kirin & Dimensity',
      icon: Zap,
      color: 'text-amber-400',
      tabId: 'hardware-workbench'
    },
    {
      id: 'ufs-memory',
      titleAr: 'برمجية ذاكرات الـ UFS 4.0 / eMMC ونقاط لحام الـ ISP',
      titleEn: 'UFS 4.0 & eMMC Memory Programmer Studio',
      subtitleAr: 'فحص نسبة استهلاك الذاكرة Wear-out ومفاتيح RPMB ومخططات الـ BGA',
      subtitleEn: 'NAND wear-out estimation, RPMB key verification & BGA 254/153 ISP pinouts',
      icon: HardDrive,
      color: 'text-indigo-400',
      tabId: 'ufs-memory'
    },
    {
      id: 'hardware-workbench',
      titleAr: 'مخططات الـ PCB والمايكروسولدرينغ (Hardware Workbench)',
      titleEn: 'Hardware & Micro-Soldering Workbench',
      subtitleAr: 'خرائط بيتماپ تفاعلية وقياسات الملتيميتر والدايود',
      subtitleEn: 'Interactive PCB bitmap, diode drops & DMM',
      icon: Cpu,
      color: 'text-indigo-400',
      tabId: 'hardware-workbench'
    },
    {
      id: 'cloud-security',
      titleAr: 'سحابة الثغرات العالمية Live 0-Day Exploit Hub',
      titleEn: 'Live 0-Day Exploit Hub',
      subtitleAr: 'تحديثات الحمايات والثغرات الفورية لعام 2026',
      subtitleEn: 'Real-time security patch & exploit sync',
      icon: Flame,
      color: 'text-amber-500',
      tabId: 'cloud-security'
    },
    {
      id: 'oem-database',
      titleAr: 'قاعدة بيانات الموديلات OEM (JSON Registry)',
      titleEn: '2018-2026 OEM Device Registry',
      subtitleAr: 'تصفح مواصفات ومسارات البوت لـ +1000 موديل',
      subtitleEn: 'Search 1000+ device bootpaths & chipset specs',
      icon: Database,
      color: 'text-emerald-400',
      tabId: 'oem-database'
    }
  ];

  const filteredActions = quickActions.filter(act => 
    act.titleAr.toLowerCase().includes(query.toLowerCase()) ||
    act.titleEn.toLowerCase().includes(query.toLowerCase()) ||
    act.subtitleAr.toLowerCase().includes(query.toLowerCase()) ||
    act.subtitleEn.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDevices = DEVICE_PRESETS.filter(dev => 
    dev.marketName.toLowerCase().includes(query.toLowerCase()) ||
    dev.model.toLowerCase().includes(query.toLowerCase()) ||
    dev.brand.toLowerCase().includes(query.toLowerCase()) ||
    dev.chipset.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl max-w-2xl w-full shadow-2xl shadow-cyan-950/60 overflow-hidden space-y-0 animate-in fade-in zoom-in duration-200">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث عن عطل، موديل، ثغرة FRP، مخطط PCB، أو أداة تفليش... (Ctrl + K)'
                : 'Search repair task, OEM model, FRP exploit, PCB bitmap or command... (Ctrl + K)'
            }
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500 font-sans"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Quick Tools Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-2">
              {isAr ? 'الأدوات والأقسام السريعة' : 'QUICK WORKSTATION MODULES'}
            </span>

            {filteredActions.length > 0 ? (
              filteredActions.map((act) => {
                const IconComponent = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={() => {
                      onSelectTab(act.tabId);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between group cursor-pointer text-right rtl:text-right ltr:text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${act.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {isAr ? act.titleAr : act.titleEn}
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          {isAr ? act.subtitleAr : act.subtitleEn}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors rtl:rotate-180 shrink-0" />
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 px-2 py-1">{isAr ? 'لا توجد أدوات مطابقة' : 'No matching tools'}</p>
            )}
          </div>

          {/* Preset Devices Quick Selector */}
          {filteredDevices.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-2">
                {isAr ? 'اختيار هاتف مستهدف فوراً (Target OEM Devices)' : 'SELECT TARGET OEM DEVICE'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredDevices.slice(0, 4).map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => {
                      onSelectDevice(dev);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between cursor-pointer text-left rtl:text-right"
                  >
                    <div>
                      <span className="text-xs font-bold text-cyan-300 block">
                        {dev.brand} {dev.marketName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {dev.model} | {dev.chipsetName}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-950 text-emerald-400 border border-slate-800">
                      {dev.mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick System Controls */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs px-2 text-slate-400">
            <button
              onClick={() => {
                onOpenUsbModal();
                onClose();
              }}
              className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'ربط جهاز WebUSB مباشر' : 'Connect Raw WebUSB Device'}</span>
            </button>

            <button
              onClick={() => {
                onOpenWindowsInstaller();
                onClose();
              }}
              className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAr ? 'تعاريف ويندوز وبكج التثبيت' : 'Windows Setup & Drivers'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
