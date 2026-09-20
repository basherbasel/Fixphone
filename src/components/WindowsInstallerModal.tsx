import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Monitor, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  X, 
  Laptop, 
  Layers, 
  Sparkles, 
  Terminal, 
  HardDrive, 
  Check, 
  Cpu, 
  Usb
} from 'lucide-react';

interface WindowsInstallerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
}

export const WindowsInstallerModal: React.FC<WindowsInstallerModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Direct instructions for Chrome/Edge Desktop App
      alert(isAr 
        ? 'لتثبيت المنظومة كبرنامج ناتيف على ويندوز:\n1. انقر على قائمة المتصفح (⋮) في أعلى اليسار/اليمين.\n2. اختر "تثبيت OmniFix Pro..." أو "Install OmniFix Pro...".\n3. سيعمل التطبيق كبرنامج مستقر على سطح المكتب مع وصول مباشر لمنافذ USB COM.'
        : 'To install OmniFix Pro on Windows Desktop:\n1. Click browser menu (⋮) top right.\n2. Select "Install OmniFix Pro..."\n3. The app will launch as a native desktop workstation with WebUSB support.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-cyan-700/50 rounded-2xl max-w-2xl w-full p-5 shadow-2xl shadow-cyan-950/50 space-y-4 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10">
              <Monitor className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'تثبيت المنظومة كبرنامج ناتيف على سطح المكتب (Windows Desktop Workstation App)' : 'Install Desktop App on Windows'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  WINDOWS 10/11
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'تشغيل المنظومة كبرنامج مستقل على سطح مكتب ويندوز مع دعم مباشر لتعاريف USB ومنافذ COM بضغطة واحدة'
                  : 'Run as a standalone native Windows desktop application with full direct WebUSB & COM port passthrough.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Usb className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'وصول مباشر لمنافذ USB COM' : 'Direct USB COM Access'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isAr ? 'ربط منخفض التأخير ببروتوكولات BROM, EDL 9008, Fastboot دون الحاجة لتنصيب برامج محاكاة.' : 'Zero-latency driver binding for BROM, EDL 9008, and Fastboot protocols.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تحديث تلقائي مستمر عبر السحابة' : 'Cloud Auto-Update'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isAr ? 'تحديث ثغرات 0-Day وقواعد الفلاشات تلقائياً بمجرد الاتصال بالإنترنت.' : 'Automated sync of 0-day exploits and stock ROM metadata upon launch.'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-400">
            <span>Platform: </span>
            <strong className="text-cyan-400">Windows x64 Native PWA Container</strong>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {isInstalled 
                ? (isAr ? 'التطبيق مثبت بالفعل على سطح المكتب' : 'DESKTOP APP INSTALLED')
                : (isAr ? 'تثبيت البرنامج على سطح مكتب ويندوز الآن' : 'INSTALL DESKTOP WORKSTATION APP')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
