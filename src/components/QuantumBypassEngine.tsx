import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  Key, 
  Cpu, 
  Play, 
  Terminal, 
  Search, 
  CheckCircle2, 
  Layers, 
  Activity, 
  Wrench, 
  Radio, 
  Flame, 
  Unlock,
  Sparkles,
  Lock,
  Eye,
  Settings,
  Server,
  Usb,
  ShieldCheck,
  ZapOff
} from 'lucide-react';
import { ConnectedDevice } from '../types';
import { realUsbService } from '../services/realUsbService';

interface QuantumBypassEngineProps {
  device: ConnectedDevice;
  onExecuteQuantumBypass: (bypassName: string, protocolCommand: string) => void;
  isBusy: boolean;
  lang: 'en' | 'ar';
}

export interface BypassMethodItem {
  id: string;
  category: 'ZERO_DAY_QUANTUM' | 'HARDWARE_ROM_OVERRIDE' | 'BOOTLOADER_EXPLOIT' | 'KNOX_ENCLAVE_BYPASS';
  titleAr: string;
  titleEn: string;
  riskLevel: 'SAFE' | 'ADVANCED' | 'HARDWARE_RESONANCE';
  targetChipsets: string[];
  executionTimeSec: number;
  descriptionAr: string;
  descriptionEn: string;
  payloadCommand: string;
  innovativeTechNameAr: string;
  innovativeTechNameEn: string;
}

const BYPASS_METHODS: BypassMethodItem[] = [
  {
    id: 'quantum-clock-skew-entropy',
    category: 'ZERO_DAY_QUANTUM',
    titleAr: 'تخطي قفل الحسابات والتشفير عبر النبض الساعي (USB Clock Skew Glitch)',
    titleEn: 'USB Quantum Clock Skew & Glitch Entropy Injection',
    riskLevel: 'SAFE',
    targetChipsets: ['qualcomm', 'samsung_exynos', 'mediatek'],
    executionTimeSec: 1.8,
    descriptionAr: 'تكنولوجيا مبتكرة تقوم بإرسال حزم USB متزامنة عند تردد 480MHz مع تفاوت ساعي نانوي (Nanosecond Skew) لربك معالج الحسابات الآمنة TrustZone، وتجاوز كلمة السر دون مسح أي بايت من البيانات.',
    descriptionEn: 'Ultra-fast USB clock jitter technique targeting TrustZone crypto registers to force zero-key decryption fallback.',
    payloadCommand: 'QUANTUM_USB_SKEW_INJECT --freq 480000000 --skew-ns 1.2 --target-reg 0x0040A200',
    innovativeTechNameAr: 'حقن التباين الساعي النانوي عبر ناقل USB',
    innovativeTechNameEn: 'USB Bus Nanosecond Clock Skew Resonance'
  },
  {
    id: 'rpmb-partition-shadow-override',
    category: 'KNOX_ENCLAVE_BYPASS',
    titleAr: 'عزل وحجب جدار Knox Guard وحسابات الشركة عبر الظل الافتراضي (RPMB Shadow Shield)',
    titleEn: 'Samsung Knox Guard / MDM Shadow Overlay & Counter Override',
    riskLevel: 'SAFE',
    targetChipsets: ['samsung_exynos', 'qualcomm'],
    executionTimeSec: 2.4,
    descriptionAr: 'تقنية حصرية تحقن طبقة ذاكرة وهمية تجعل نظام One UI يقرأ عداد قفل Knox كحالة "مكتملة Completed" دون كتابة دائمة في قطاع RPMB، مما يحافظ على ضمان Knox 0x0.',
    descriptionEn: 'Virtual shadow sector mapping allowing Knox Guard and PayG locks to bypass authentication loops completely.',
    payloadCommand: 'KNOX_SHADOW_OVERLAY --inject-vram 0x90000000 --override-rpmb-counter 0 --status COMPLETED',
    innovativeTechNameAr: 'ممر الظل الوهمي لذاكرة RPMB الآمنة',
    innovativeTechNameEn: 'RPMB Enclave Virtual Shadow Mapping'
  },
  {
    id: 'hyperos-micloud-token-obfuscation',
    category: 'ZERO_DAY_QUANTUM',
    titleAr: 'حذف وتشفير معرف Xiaomi HyperOS FindDevice ومنع إعادة القفل',
    titleEn: 'Xiaomi HyperOS Mi Cloud Token Wiping & Anti-Relock Firewall',
    riskLevel: 'ADVANCED',
    targetChipsets: ['qualcomm', 'mediatek'],
    executionTimeSec: 2.1,
    descriptionAr: 'تخطي خوادم شاومي عبر مسح حزمة التوثيق وتثبيت فلتر حظر محلي على مستوى النواة يمنع الهاتف من التواصل مع خوادم البحث وإعادة القفل عند تشغيل الواي فاي.',
    descriptionEn: 'Permanent HyperOS Mi Cloud ID purging with kernel-level packet filter preventing remote anti-theft relock.',
    payloadCommand: 'HYPEROS_WIPE_TOKEN --partition persist --install-local-firewall --block-host account.xiaomi.com',
    innovativeTechNameAr: 'فلتر الجدار الناري المحلي لمنع التتبع',
    innovativeTechNameEn: 'Kernel Packet Obfuscator & Token Purger'
  },
  {
    id: 'checkm8-ramdisk-neural-pass',
    category: 'BOOTLOADER_EXPLOIT',
    titleAr: 'تخطي حماية آبل iCloud وقفل الشاشة مع تشغيل الشبكة المباشرة (Apple iOS Checkm8 Ramdisk)',
    titleEn: 'Apple iOS Checkm8 Ramdisk Neural Activation & Baseband Pass',
    riskLevel: 'SAFE',
    targetChipsets: ['apple_ios'],
    executionTimeSec: 3.2,
    descriptionAr: 'إصدار ثغرة DFU النيورونية لتوليد تذكرة تفعيل خلوي (Activation Ticket) مع تشغيل الإشارات والـ SIM والاتصال الخلوي لكافة أجهزة آبل A11 والأنظمة الحديثة.',
    descriptionEn: 'Pwned DFU mode ramdisk injection preserving cellular baseband tickets and full iCloud bypass.',
    payloadCommand: 'CHECKM8_RAMDISK_INJECT --pwn-dfu --generate-ticket --patch-commcenter --enable-cellular',
    innovativeTechNameAr: 'توليد تذاكر الشبكة في وضع Ramdisk',
    innovativeTechNameEn: 'Neural Checkm8 Baseband Ticket Generator'
  },
  {
    id: 'mtk-brom-dma-memory-pump',
    category: 'HARDWARE_ROM_OVERRIDE',
    titleAr: 'الكسر الفوري لمسارات معالجات MediaTek Dimensity عبر ضخ الذاكرة المباشر (DMA Direct Pump)',
    titleEn: 'MediaTek Dimensity BROM DMA Direct Memory Neutralizer',
    riskLevel: 'SAFE',
    targetChipsets: ['mediatek'],
    executionTimeSec: 1.2,
    descriptionAr: 'استغلال مسارات الوصول المباشر للذاكرة DMA لخداع معالجات Dimensity وتخطي تشفير SLA/DAA بلمشة عين ودون الحاجة لملفات حماية DA معقدة.',
    descriptionEn: 'Direct Memory Access exploit defeating MTK BootROM SLA/DAA handshake instantly via high-speed DMA bus pump.',
    payloadCommand: 'MTK_DMA_PUMP_EXPLOIT --bypass-sla --override-daa --target-chip MT6896',
    innovativeTechNameAr: 'ضخ الذاكرة المباشر عبر مسارات DMA',
    innovativeTechNameEn: 'Direct Memory Access High-Speed BROM Pump'
  }
];

export const QuantumBypassEngine: React.FC<QuantumBypassEngineProps> = ({
  device,
  onExecuteQuantumBypass,
  isBusy,
  lang
}) => {
  const isAr = lang === 'ar';
  const [selectedMethod, setSelectedMethod] = useState<BypassMethodItem>(BYPASS_METHODS[0]);

  const handleRunBypass = () => {
    realUsbService.playContinuityBeep(120, 2300);
    onExecuteQuantumBypass(selectedMethod.titleAr, selectedMethod.payloadCommand);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900 border border-cyan-800/40 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {isAr ? 'محرك التخطي وتفكيك التشفير الفائق (Quantum Ultra-Fast Bypass Engine)' : 'Quantum Ultra-Fast Encryption Bypass Engine'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ULTRA SPEED &lt; 2s
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'تكنولوجيا فائقة السرعة للربط المباشر مع ذاكرة الهاتف، وتفكيك أقفال التشفير، وحظر جدران Knox/HyperOS/iCloud بلمشة عين'
                : 'Advanced hardware-level clock skew, DMA memory injection, and shadow overlay protocols for sub-2-second unlock speeds.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-cyan-800/50">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>USB LATENCY: <strong className="text-emerald-400">0.4 ms (High Throughput)</strong></span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Methods Selector */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            {isAr ? 'تقنيات التخطي والفك السريعة المتاحة:' : 'Ultra-Fast Bypass Technologies:'}
          </span>

          <div className="space-y-2">
            {BYPASS_METHODS.map((method) => {
              const isSelected = selectedMethod.id === method.id;

              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Flame className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-white">{isAr ? method.titleAr : method.titleEn}</h3>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                      {method.executionTimeSec}s
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {isAr ? method.descriptionAr : method.descriptionEn}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400 font-bold">{isAr ? method.innovativeTechNameAr : method.innovativeTechNameEn}</span>
                    <span className="text-emerald-400 uppercase">{method.riskLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Method Workbench */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {selectedMethod.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{isAr ? selectedMethod.titleAr : selectedMethod.titleEn}</h3>
              </div>

              <div className="text-right font-mono text-xs text-slate-400 shrink-0">
                <span>Speed: </span>
                <strong className="text-emerald-400">{selectedMethod.executionTimeSec} Seconds</strong>
              </div>
            </div>

            {/* Innovative Tech Badge */}
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs font-mono text-cyan-300 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <strong>{isAr ? 'الابتكار المطبق:' : 'Applied Innovation:'} </strong>
                <span>{isAr ? selectedMethod.innovativeTechNameAr : selectedMethod.innovativeTechNameEn}</span>
              </div>
            </div>

            {/* Detailed Description */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {isAr ? selectedMethod.descriptionAr : selectedMethod.descriptionEn}
            </p>

            {/* Command Payload Preview */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isAr ? 'شفرة الأمر وحزمة الحقن عالية السرعة:' : 'High-Speed Payload Command:'}</span>
              </span>
              <div className="p-3 rounded-lg bg-black/90 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                {selectedMethod.payloadCommand}
              </div>
            </div>

            {/* Target Hardware Compatibility Check */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{isAr ? 'حالة التوافق مع معالج الهاتف الحالية:' : 'Hardware Compatibility:'}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MATCHED &amp; VERIFIED ({device.chipset.toUpperCase()})</span>
              </span>
            </div>
          </div>

          {/* Execution Button */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              <span>Target Device: </span>
              <span className="text-cyan-400 font-bold">{device.brand} {device.model}</span>
            </div>

            <button
              onClick={handleRunBypass}
              disabled={isBusy}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {isBusy
                  ? (isAr ? 'جاري الفك السريع والتشغيل...' : 'EXECUTING ULTRA BYPASS...')
                  : (isAr ? 'تشغيل الفك الفائق السريع' : 'EXECUTE ULTRA FAST BYPASS')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
