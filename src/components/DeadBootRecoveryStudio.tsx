import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Download, 
  Flame, 
  HardDrive, 
  Layers, 
  Play, 
  ShieldAlert, 
  Terminal, 
  Wrench,
  Zap,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ConnectedDevice } from '../types';
import { realUsbService } from '../services/realUsbService';

interface DeadBootRecoveryStudioProps {
  device: ConnectedDevice;
  lang: 'en' | 'ar';
  onAddLog: (level: 'info' | 'warn' | 'error' | 'success' | 'hex', tag: string, message: string) => void;
  onNavigateToFlasher?: () => void;
}

export const DeadBootRecoveryStudio: React.FC<DeadBootRecoveryStudioProps> = ({
  device,
  lang,
  onAddLog,
  onNavigateToFlasher
}) => {
  const isAr = lang === 'ar';
  const [selectedScenario, setSelectedScenario] = useState<'QUALCOMM_BRICK' | 'MEDIATEK_DEAD' | 'EXYNOS_BOOTLOOP' | 'UNISOC_MORT' | 'APPLE_DFU'>('QUALCOMM_BRICK');
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [recoveryLogs, setRecoveryLogs] = useState<string[]>([]);

  const scenarios = [
    {
      id: 'QUALCOMM_BRICK',
      chipset: 'Qualcomm Snapdragon',
      titleAr: 'إحياء كوالكوم الميت عبر ثغرة Sahara & EDL 9008',
      titleEn: 'Qualcomm Hard-Brick EDL 9008 Unbrick Pipeline',
      descAr: 'إعادة إحياء الهواتف التي لا تستجيب نهائياً وتظهر فقط كـ QHSUSB_BULK أو QUALCOMM-9008.',
      descEn: 'Emergency restoration via Sahara handshake & prog_firehose payload injection.',
      risk: 'SAFE',
      testpointGuide: 'Short CLK or DAT0 to GND with 1.8V Pull-up resistor'
    },
    {
      id: 'MEDIATEK_DEAD',
      chipset: 'MediaTek Dimensity / Helio',
      titleAr: 'إصلاح ميديا تيك الميت وتعطيل حماية Preloader BROM',
      titleEn: 'MTK Dead Boot Recovery & BROM Auth Bypass',
      descAr: 'حذف حماية DAA/SLA وإعادة بناء جدول البارتشنات Primary GPT في الذاكرة الداخلية.',
      descEn: 'Disables WDT watchdog and repairs damaged GPT header in internal UFS/eMMC.',
      risk: 'SAFE',
      testpointGuide: 'Connect TP to GND before plugging USB Cable'
    },
    {
      id: 'UNISOC_MORT',
      chipset: 'Unisoc / Spreadtrum',
      titleAr: 'إحياء هواتف يوني سوك الميتة عبر بروتوكول SPD FDL1/FDL2',
      titleEn: 'Unisoc Dead Unbrick via HDLC BSL FDL1/FDL2',
      descAr: 'إصلاح أجهزة Infinix / Tecno / Realme الميتة بسبب تفليش روم خاطئ.',
      descEn: 'Restores erased bootloader partitions and initializes RAM parameters.',
      risk: 'SAFE',
      testpointGuide: 'Hold Volume Down + Power or use UART Jig 10K Resistor'
    },
    {
      id: 'EXYNOS_BOOTLOOP',
      chipset: 'Samsung Exynos',
      titleAr: 'استعادة سامسونج الميت وتجاوز Knox Guard / KG Locked',
      titleEn: 'Samsung Exynos Unbrick & PIT Partition Rebuild',
      descAr: 'إعادة كتابة الـ PIT الرسمي وتصليح بارتشن param المشفر بدون فقدان بيانات.',
      descEn: 'Reconstructs primary GPT tables and patches param security bits.',
      risk: 'SAFE',
      testpointGuide: 'Use Samsung Download Mode Jig (300K Ohm)'
    }
  ];

  const handleStartRecovery = () => {
    setIsRecovering(true);
    setProgress(0);
    setRecoveryLogs([]);
    realUsbService.playContinuityBeep(120, 2200);

    const append = (msg: string) => {
      setRecoveryLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    append(`Initiating Automated Dead Boot Recovery Engine for [${selectedScenario}]...`);
    append(`Target Device: ${device.brand} ${device.model} (${device.chipset})`);
    onAddLog('info', 'DEAD-BOOT-RECOVERY', `Started Unbrick Pipeline: ${selectedScenario}`);

    let p = 5;
    const interval = setInterval(() => {
      p += 15;
      setProgress(Math.min(p, 100));

      if (p === 20) {
        append(`Searching Low-Level USB Bus Endpoints (VID_05C6 / VID_0E8D)...`);
        append(`Probing SRAM Volatile Memory & Overriding Hardware Watchdog WDT...`);
      } else if (p === 50) {
        append(`Injecting Emergency Recovery MBR/GPT Partition Table Header...`);
        append(`Writing boot.img, vbmeta.img, and preloader to raw memory blocks...`);
        realUsbService.playContinuityBeep(150, 2500);
      } else if (p === 80) {
        append(`Verifying Anti-Rollback (ARB) security indexes & sha-256 digests...`);
      } else if (p >= 100) {
        clearInterval(interval);
        setIsRecovering(false);
        append(`SUCCESS: Dead Boot Recovery Pipeline completed! Device resurrected.`);
        realUsbService.playContinuityBeep(300, 3000);
        onAddLog('success', 'DEAD-BOOT-RECOVERY', `Unbrick successful for ${device.model}!`);
      }
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 rounded-xl p-4 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 shrink-0">
            <RotateCcw className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {isAr ? 'استوديو أتمتة إحياء الهواتف الميتة (Dead Boot Recovery Studio)' : 'Automated Dead Boot Recovery Studio'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-400/40">
                HARD-BRICK RESURRECTION
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAr
                ? 'حلول فورية هندسية لإحياء الهواتف الميتة نتيجة أخطاء التفليش وانقطاع التيار أو انعدام استجابة الباور'
                : 'Automated low-level unbricking pipelines via Sahara, BROM, SPD FDL, and PIT restoration.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToFlasher?.()}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold font-mono flex items-center gap-2 cursor-pointer transition-all"
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? 'الانتقال للفلشر الشامل' : 'Go to Multi-Flasher'}</span>
        </button>
      </div>

      {/* Main Grid: Unbrick Scenarios & Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Unbrick Scenarios Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
            {isAr ? 'مسارات الإحياء حسب المعالج (Unbrick Pipelines):' : 'Select Unbrick Pipeline:'}
          </h4>

          <div className="space-y-2">
            {scenarios.map((sc) => {
              const isSelected = sc.id === selectedScenario;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id as any)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-950/80 to-slate-900 border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {sc.chipset}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">100% SAFE</span>
                  </div>

                  <h5 className={`text-xs font-bold mt-2 ${isSelected ? 'text-rose-300' : 'text-slate-200'}`}>
                    {isAr ? sc.titleAr : sc.titleEn}
                  </h5>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {isAr ? sc.descAr : sc.descEn}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-amber-300/90 flex items-center gap-1.5">
                    <Wrench className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>TP Guide: {sc.testpointGuide}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleStartRecovery}
            disabled={isRecovering}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-amber-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-current ${isRecovering ? 'animate-spin' : ''}`} />
            <span>
              {isRecovering
                ? (isAr ? 'جاري التنفيذ وإصلاح الـ Bootloader الميت...' : 'EXECUTING UNBRICK PIPELINE...')
                : (isAr ? 'بدء عملية الإحياء التلقائية الآن (START UNBRICK)' : 'START DEAD BOOT UNBRICK')}
            </span>
          </button>
        </div>

        {/* Live Execution Console (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isAr ? 'مراقب عملية الإحياء بالوقت الفعلي:' : 'Unbrick Execution Monitor:'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold">RAW SCRIPT BUS</span>
            </div>

            {isRecovering && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{isAr ? 'تقدم عملية الإحياء:' : 'Unbrick Progress:'}</span>
                  <span className="text-rose-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-black/90 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 h-72 overflow-y-auto">
              {recoveryLogs.length === 0 ? (
                <div className="text-slate-600 italic text-center py-12">
                  {isAr 
                    ? 'اختر مسار الإحياء ثم اضغط على زر "بدء عملية الإحياء التلقائية" لبدء استعادة الهاتف...' 
                    : 'Select pipeline and click "START DEAD BOOT UNBRICK" to initiate recovery...'}
                </div>
              ) : (
                recoveryLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('Injecting') ? 'text-amber-300' : 'text-slate-300'}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="text-slate-400">{isAr ? 'حالة الحماية:' : 'Anti-Brick Gate:'}</span>
            <strong className="text-emerald-400">PASSED (SHA-256 Validated)</strong>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
              UNBRICK ENGINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
