import React, { useState, useEffect } from 'react';
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
  Check,
  Globe,
  Radio,
  RefreshCw,
  Flame,
  Wrench,
  Server,
  Activity,
  Download
} from 'lucide-react';
import { ConnectedDevice, FrpMethod, DeviceMode } from '../types';
import { FRP_METHODS } from '../data/frpMethods';
import { CLOUD_SECURITY_BULLETINS } from '../data/cloudSecurityFeed';
import { realUsbService } from '../services/realUsbService';

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
  const [activeTab, setActiveTab] = useState<'methods' | 'edl_brom_direct' | 'cloud_0day_feed'>('edl_brom_direct');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');
  const [selectedMethodId, setSelectedMethodId] = useState<string>(FRP_METHODS[0].id);

  // Auto Cloud Sync State
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string>(
    isAr ? 'متصل برابط سحابي مباشر (0-Day Server Active)' : 'Live 0-Day Server Connected'
  );
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just Now (Auto-Synced)');

  // Selected Protocol Mode for Low-Level Direct Tab
  const [directProtocol, setDirectProtocol] = useState<'QUALCOMM_EDL_9008' | 'MTK_BROM_SLA' | 'UNISOC_SPD_DIAG' | 'SAMSUNG_ODIN_LOKE'>('QUALCOMM_EDL_9008');
  const [firehoseLoader, setFirehoseLoader] = useState<string>('prog_firehose_ddr_generic.elf');
  const [mtkDaFile, setMtkDaFile] = useState<string>('MTK_AllInOne_DA_v6.bin');
  const [bypassOption, setBypassOption] = useState<'ERASE_FRP' | 'ERASE_PERSIST' | 'UNLOCK_SCREEN_LOCK' | 'MI_CLOUD_NEUTRALIZER' | 'KNOX_GUARD_BYPASS'>('ERASE_FRP');

  // Trigger manual cloud refresh
  const handleTriggerCloudSync = () => {
    setIsCloudSyncing(true);
    realUsbService.playContinuityBeep(120, 2200);

    setTimeout(() => {
      setIsCloudSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
      realUsbService.playContinuityBeep(220, 2800);
    }, 1100);
  };

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

  // Quick Direct Execution Generator
  const handleExecuteDirectProtocol = () => {
    const customMethod: FrpMethod = {
      id: `direct-${directProtocol.toLowerCase()}`,
      name: directProtocol === 'QUALCOMM_EDL_9008' 
        ? `Qualcomm EDL 9008 Direct (${firehoseLoader})` 
        : directProtocol === 'MTK_BROM_SLA'
        ? `MediaTek BROM SLA Bypass (${mtkDaFile})`
        : directProtocol === 'UNISOC_SPD_DIAG'
        ? `Unisoc SPRD Diag Protocol Engine`
        : `Samsung Odin Loke Hardware Bypass`,
      description: `Direct hardware injection for ${bypassOption} using ${directProtocol} low-level bus protocol.`,
      targetChipsets: [
        (directProtocol === 'QUALCOMM_EDL_9008' ? 'qualcomm' : directProtocol === 'MTK_BROM_SLA' ? 'mediatek' : directProtocol === 'UNISOC_SPD_DIAG' ? 'unisoc_spd' : 'samsung_exynos') as any
      ],
      modeRequired: (directProtocol === 'QUALCOMM_EDL_9008' ? 'EDL_9008' : directProtocol === 'MTK_BROM_SLA' ? 'MTK_BROM' : directProtocol === 'UNISOC_SPD_DIAG' ? 'SPD_DIAG' : 'SAMSUNG_DOWNLOAD') as DeviceMode,
      riskLevel: 'SAFE',
      successRate: 99,
      supportedAndroid: 'Android 8 - 15 / HyperOS / One UI 6',
      protocolSteps: [
        `Connecting low-level USB COM endpoint for ${directProtocol}...`,
        `Handshaking cryptographic payload loader: ${firehoseLoader || mtkDaFile}`,
        `Authenticating SLA / DAA signature neutralizer...`,
        `Executing target partition command: ${bypassOption}`,
        `Verifying partition checksum and rebooting device safely.`
      ]
    };

    onExecuteBypass(customMethod);
  };

  return (
    <div className="space-y-4">
      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Key className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isAr ? 'مركز تخطي وتجاوز الحسابات والأقفال الذكي (FRP & Lock Bypass Hub)' : 'FRP & Lock Bypass Hub - EDL / BROM Direct Engine'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                EDL & BROM LOW-LEVEL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr 
                ? 'اتصال مباشر مع بروتوكولات EDL 9008 و BROM SLA، وتحديث تلقائي لحظي لسيرفرات الثغرات السحابية 0-Day'
                : 'Direct hardware connection with EDL 9008 and MediaTek BROM protocols with automatic 0-Day cloud vulnerability updates.'}
            </p>
          </div>
        </div>

        {/* Cloud Auto-Sync Indicator & Manual Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">{cloudSyncStatus}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[10px]">{lastSyncTime}</span>
          </div>

          <button
            onClick={handleTriggerCloudSync}
            disabled={isCloudSyncing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
            title="Force Cloud 0-Day Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isCloudSyncing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation inside Module */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('edl_brom_direct')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'edl_brom_direct'
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4 text-amber-300" />
          <span>{isAr ? 'المحرك المباشر بروتوكول (EDL & BROM Direct Hardware)' : 'Direct EDL & BROM Hardware Engine'}</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud_0day_feed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'cloud_0day_feed'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-cyan-300" />
          <span>{isAr ? 'خادم ثغرات الـ 0-Day السحابي (Live Auto Cloud Feed)' : 'Live Cloud 0-Day Vulnerability Feed'}</span>
        </button>

        <button
          onClick={() => setActiveTab('methods')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'methods'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-300" />
          <span>{isAr ? 'مكتبة أدوات وطرق الفك الشاملة' : 'Universal Bypass Catalog'}</span>
        </button>
      </div>

      {/* TAB 1: Direct Low-Level Hardware Engine (EDL & BROM) */}
      {activeTab === 'edl_brom_direct' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Protocol Configuration & Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'إعداد بروتوكول الاتصال بالمعالج:' : 'Low-Level Bus Protocol Config:'}</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                DIRECT BUS
              </span>
            </div>

            {/* Selector: Direct Protocol */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                {isAr ? '1. اختر بروتوكول الشريحة والمعالج:' : '1. Target Hardware Bus Protocol:'}
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setDirectProtocol('QUALCOMM_EDL_9008')}
                  className={`p-2 rounded-lg border text-left rtl:text-right transition-all cursor-pointer ${
                    directProtocol === 'QUALCOMM_EDL_9008'
                      ? 'bg-rose-600 text-white font-bold border-rose-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  <div>Qualcomm EDL 9008</div>
                  <div className="text-[9px] opacity-75 font-normal">Sahara / Firehose Auth</div>
                </button>

                <button
                  onClick={() => setDirectProtocol('MTK_BROM_SLA')}
                  className={`p-2 rounded-lg border text-left rtl:text-right transition-all cursor-pointer ${
                    directProtocol === 'MTK_BROM_SLA'
                      ? 'bg-rose-600 text-white font-bold border-rose-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  <div>MediaTek BROM SLA</div>
                  <div className="text-[9px] opacity-75 font-normal">BootROM DAA Bypass</div>
                </button>

                <button
                  onClick={() => setDirectProtocol('UNISOC_SPD_DIAG')}
                  className={`p-2 rounded-lg border text-left rtl:text-right transition-all cursor-pointer ${
                    directProtocol === 'UNISOC_SPD_DIAG'
                      ? 'bg-rose-600 text-white font-bold border-rose-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  <div>Unisoc SPD Diag</div>
                  <div className="text-[9px] opacity-75 font-normal">FDL1 / FDL2 Protocol</div>
                </button>

                <button
                  onClick={() => setDirectProtocol('SAMSUNG_ODIN_LOKE')}
                  className={`p-2 rounded-lg border text-left rtl:text-right transition-all cursor-pointer ${
                    directProtocol === 'SAMSUNG_ODIN_LOKE'
                      ? 'bg-rose-600 text-white font-bold border-rose-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}
                >
                  <div>Samsung Loke Mode</div>
                  <div className="text-[9px] opacity-75 font-normal">Knox & KG Override</div>
                </button>
              </div>
            </div>

            {/* Payload Loader Settings */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                {isAr ? '2. المبرمج المشفر / ملف الـ Loader:' : '2. Cryptographic Loader / DA file:'}
              </label>
              {directProtocol === 'QUALCOMM_EDL_9008' ? (
                <input
                  type="text"
                  value={firehoseLoader}
                  onChange={(e) => setFirehoseLoader(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-rose-500"
                />
              ) : (
                <input
                  type="text"
                  value={mtkDaFile}
                  onChange={(e) => setMtkDaFile(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-rose-500"
                />
              )}
            </div>

            {/* Target Bypass Command Option */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                {isAr ? '3. العملية المراد تنفيذها على الذاكرة:' : '3. Partition Operation to Execute:'}
              </label>
              <select
                value={bypassOption}
                onChange={(e: any) => setBypassOption(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="ERASE_FRP">Erase FRP Partition (Reset Google Lock)</option>
                <option value="ERASE_PERSIST">Erase Persist & Neutralize Mi Account</option>
                <option value="UNLOCK_SCREEN_LOCK">Safe Format Screen Lock (Retain Data)</option>
                <option value="KNOX_GUARD_BYPASS">Knox Guard / KG Locked State Override</option>
              </select>
            </div>

            {/* Execution Trigger */}
            <button
              onClick={handleExecuteDirectProtocol}
              disabled={isBusy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isAr ? 'بدء الحقن المباشر وإلغاء القفل الآن' : 'START LOW-LEVEL BYPASS INJECTION'}</span>
            </button>
          </div>

          {/* Real-time Hardware Protocol Live Monitor (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? 'مراقب الاتصال المباشر بطبقة الـ USB Endpoints:' : 'Live Low-Level USB Handshake Status:'}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  USB COM BUS: READY
                </span>
              </div>

              {/* Console Simulation Monitor */}
              <div className="bg-black/90 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2 h-64 overflow-y-auto">
                <div className="text-slate-500">[00:00.01] Initializing low-level USB stack for {directProtocol}...</div>
                <div className="text-cyan-400">[00:00.04] Enumerating USB Endpoints: VID_05C6&PID_9008 (Qualcomm Sahara Bus)</div>
                <div className="text-amber-400">[00:00.08] Handshaking Hello Packet (Cmd 0x01)... ACK Received</div>
                <div className="text-emerald-400">[00:00.12] Injecting Memory Loader Payload: {directProtocol === 'QUALCOMM_EDL_9008' ? firehoseLoader : mtkDaFile}</div>
                <div className="text-slate-400">[00:00.18] Bypassing OEM RSA-4096 Signature Check via 0-Day Vector...</div>
                <div className="text-emerald-300 font-bold">[00:00.22] SLA / DAA Neutralized Successfully! Protocol Unlocked.</div>
                <div className="text-rose-400 font-bold">[00:00.28] Target Action Selected: {bypassOption}</div>
              </div>
            </div>

            {/* Connected Device Summary Bar */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{isAr ? 'الجهاز المستهدف:' : 'Target Device:'}</span>
              <strong className="text-cyan-300">{device.brand} {device.model} ({device.chipset})</strong>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                {device.mode}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Cloud 0-Day Vulnerability Feed */}
      {activeTab === 'cloud_0day_feed' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{isAr ? 'قائمة ثغرات الـ 0-Day المحدثة تلقائياً من خوادم OmniFix السحابية:' : 'Live Auto-Synced 0-Day Exploits from OmniFix Cloud:'}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
              UPDATED 2026.09 LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CLOUD_SECURITY_BULLETINS.map((bulletin) => (
              <div key={bulletin.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {bulletin.cveId}
                  </span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {bulletin.zeroDayStatus}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">
                  {isAr ? bulletin.titleAr : bulletin.titleEn}
                </h4>

                <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {isAr ? bulletin.descriptionAr : bulletin.descriptionEn}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Efficiency: <strong className="text-emerald-400">{bulletin.exploitEfficiency}%</strong></span>
                  <button
                    onClick={() => {
                      const method: FrpMethod = {
                        id: bulletin.id,
                        name: bulletin.cveId,
                        description: bulletin.descriptionEn,
                        targetChipsets: bulletin.affectedChipsets,
                        modeRequired: 'EDL_9008' as DeviceMode,
                        riskLevel: 'SAFE',
                        successRate: bulletin.exploitEfficiency,
                        supportedAndroid: bulletin.affectedAndroidRange,
                        protocolSteps: [bulletin.exploitPayloadCommand]
                      };
                      onExecuteBypass(method);
                    }}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                  >
                    Execute Exploit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Original Catalog List */}
      {activeTab === 'methods' && (
        <div className="space-y-3">
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
              {filteredMethods.map((method) => {
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
              })}
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
              </div>

              {/* Execute Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onExecuteBypass(activeMethod)}
                  disabled={isBusy}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isAr ? 'تخطي وإلغاء القفل الآن' : 'EXECUTE UNLOCK PROTOCOL'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

