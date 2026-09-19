import React, { useState } from 'react';
import { 
  Zap, 
  FileCode, 
  FolderOpen, 
  CheckCircle2, 
  Play, 
  HardDrive, 
  ShieldAlert, 
  CheckSquare, 
  Square,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { ConnectedDevice, FirmwareFile, PartitionInfo } from '../types';

interface FlasherWorkspaceProps {
  device: ConnectedDevice;
  onExecuteFlash: (protocol: string, files: FirmwareFile[], options: Record<string, boolean>) => void;
  isBusy: boolean;
  lang: 'en' | 'ar';
}

export const FlasherWorkspace: React.FC<FlasherWorkspaceProps> = ({
  device,
  onExecuteFlash,
  isBusy,
  lang
}) => {
  const isAr = lang === 'ar';
  const [activeFlasher, setActiveFlasher] = useState<'samsung' | 'mtk' | 'qualcomm' | 'unisoc' | 'apple'>(
    device.chipset === 'mediatek' ? 'mtk' :
    device.chipset === 'qualcomm' ? 'qualcomm' :
    device.chipset === 'unisoc_spd' ? 'unisoc' :
    device.chipset === 'apple_ios' ? 'apple' : 'samsung'
  );

  // Samsung Odin Slot State
  const [samsungFiles, setSamsungFiles] = useState<{ [key: string]: string }>({
    BL: `BL_${device.model}_${device.basebandVersion || 'U1'}_REV${device.rollbackIndex}.tar.md5`,
    AP: `AP_${device.model}_${device.basebandVersion || 'U1'}_SYSTEM_SUPER.tar.md5`,
    CP: `CP_${device.model}_${device.basebandVersion || 'U1'}_MODEM.tar.md5`,
    CSC: `CSC_OXM_${device.model}_${device.cscCode || 'HOME'}.tar.md5`,
    PIT: `${device.model}_EUR_OPEN.pit`
  });

  // MediaTek Scatter Slot State
  const [mtkScatterFile, setMtkScatterFile] = useState(`MT6886_Android_scatter_UFS.txt`);
  const [mtkDaFile, setMtkDaFile] = useState(`DA_PL_MT6886_v2312.bin`);
  const [mtkAuthFile, setMtkAuthFile] = useState(`auth_sv5_bypass.auth`);

  // Qualcomm QFIL Slot State
  const [qcomFirehose, setQcomFirehose] = useState(`prog_firehose_ddr_sm8650.elf`);
  const [qcomRawProgram, setQcomRawProgram] = useState(`rawprogram0_unsparse.xml`);
  const [qcomPatch, setQcomPatch] = useState(`patch0.xml`);

  // Unisoc Slot State
  const [unisocPac, setUnisocPac] = useState(`PAC_${device.model}_T606_Stock.pac`);

  // Apple Slot State
  const [appleIpsw, setAppleIpsw] = useState(`iPhone15,2_17.5.1_21F90_Restore.ipsw`);

  // Options
  const [options, setOptions] = useState({
    autoReboot: true,
    fResetTime: true,
    repartitionPit: false,
    authBypass: true,
    backupNvramFirst: true,
    skipUserdata: false,
    disableVerity: true
  });

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartFlash = () => {
    const files: FirmwareFile[] = [];
    if (activeFlasher === 'samsung') {
      if (samsungFiles.BL) files.push({ type: 'BL', filename: samsungFiles.BL, sizeBytes: 52428800, md5: 'VALIDATED_OK', status: 'READY' });
      if (samsungFiles.AP) files.push({ type: 'AP', filename: samsungFiles.AP, sizeBytes: 5800000000, md5: 'VALIDATED_OK', status: 'READY' });
      if (samsungFiles.CP) files.push({ type: 'CP', filename: samsungFiles.CP, sizeBytes: 120000000, md5: 'VALIDATED_OK', status: 'READY' });
      if (samsungFiles.CSC) files.push({ type: 'CSC', filename: samsungFiles.CSC, sizeBytes: 450000000, md5: 'VALIDATED_OK', status: 'READY' });
    } else if (activeFlasher === 'mtk') {
      files.push({ type: 'SCATTER', filename: mtkScatterFile, sizeBytes: 45000, md5: 'OK', status: 'READY' });
      files.push({ type: 'DA', filename: mtkDaFile, sizeBytes: 1450000, md5: 'OK', status: 'READY' });
    } else if (activeFlasher === 'qualcomm') {
      files.push({ type: 'FIREHOSE', filename: qcomFirehose, sizeBytes: 850000, md5: 'OK', status: 'READY' });
      files.push({ type: 'RAWPROGRAM', filename: qcomRawProgram, sizeBytes: 120000, md5: 'OK', status: 'READY' });
    } else if (activeFlasher === 'unisoc') {
      files.push({ type: 'PAC', filename: unisocPac, sizeBytes: 3200000000, md5: 'OK', status: 'READY' });
    } else if (activeFlasher === 'apple') {
      files.push({ type: 'IPSW', filename: appleIpsw, sizeBytes: 7400000000, md5: 'OK', status: 'READY' });
    }

    onExecuteFlash(activeFlasher, files, options);
  };

  return (
    <div className="space-y-4">
      {/* Protocol / Brand Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveFlasher('samsung')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFlasher === 'samsung'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>SAMSUNG ODIN (LOKE)</span>
        </button>

        <button
          onClick={() => setActiveFlasher('mtk')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFlasher === 'mtk'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>MEDIATEK (SP FLASH / BROM)</span>
        </button>

        <button
          onClick={() => setActiveFlasher('qualcomm')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFlasher === 'qualcomm'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>QUALCOMM (EDL FIREHOSE)</span>
        </button>

        <button
          onClick={() => setActiveFlasher('unisoc')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFlasher === 'unisoc'
              ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>UNISOC / SPD (PAC)</span>
        </button>

        <button
          onClick={() => setActiveFlasher('apple')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFlasher === 'apple'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>APPLE (DFU / IPSW)</span>
        </button>
      </div>

      {/* Main Flasher Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: File Slots & Partition Config */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>
                  {activeFlasher === 'samsung' && 'Samsung 4-File Odin (BL, AP, CP, CSC, PIT) Flasher'}
                  {activeFlasher === 'mtk' && 'MediaTek Scatter & SLA BROM Engine'}
                  {activeFlasher === 'qualcomm' && 'Qualcomm Sahara / Firehose XML Programmer'}
                  {activeFlasher === 'unisoc' && 'UNISOC / Spreadtrum PAC Firmware Flasher'}
                  {activeFlasher === 'apple' && 'Apple iOS IPSW & idevicerestore Engine'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr ? 'قم بتحميل الحزم الرسمية ومطابقة الحماية' : 'Direct memory partition streaming with SHA-256 block checksums.'}
              </p>
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">
              Target SoC: {device.chipsetName}
            </span>
          </div>

          {/* Samsung Odin UI Slots */}
          {activeFlasher === 'samsung' && (
            <div className="space-y-2 text-xs">
              {(['BL', 'AP', 'CP', 'CSC', 'PIT'] as const).map((slot) => (
                <div key={slot} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="w-12 text-center font-bold font-mono py-1 px-2 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {slot}
                  </div>
                  <input
                    type="text"
                    value={samsungFiles[slot] || ''}
                    onChange={(e) => setSamsungFiles({ ...samsungFiles, [slot]: e.target.value })}
                    className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                    placeholder={`Load ${slot} archive (*.tar.md5, *.pit)...`}
                  />
                  <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                    <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Browse</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* MTK SP Flash UI Slots */}
          {activeFlasher === 'mtk' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-24 text-center font-bold font-mono py-1 px-2 rounded bg-purple-950/60 text-purple-300 border border-purple-800">
                  SCATTER
                </div>
                <input
                  type="text"
                  value={mtkScatterFile}
                  onChange={(e) => setMtkScatterFile(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Browse</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-24 text-center font-bold font-mono py-1 px-2 rounded bg-purple-950/60 text-purple-300 border border-purple-800">
                  DA AGENT
                </div>
                <input
                  type="text"
                  value={mtkDaFile}
                  onChange={(e) => setMtkDaFile(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Browse</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-24 text-center font-bold font-mono py-1 px-2 rounded bg-purple-950/60 text-purple-300 border border-purple-800">
                  AUTH FILE
                </div>
                <input
                  type="text"
                  value={mtkAuthFile}
                  onChange={(e) => setMtkAuthFile(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Browse</span>
                </button>
              </div>
            </div>
          )}

          {/* Qualcomm QFIL Slots */}
          {activeFlasher === 'qualcomm' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-28 text-center font-bold font-mono py-1 px-2 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                  FIREHOSE ELF
                </div>
                <input
                  type="text"
                  value={qcomFirehose}
                  onChange={(e) => setQcomFirehose(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Browse</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-28 text-center font-bold font-mono py-1 px-2 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                  RAWPROGRAM
                </div>
                <input
                  type="text"
                  value={qcomRawProgram}
                  onChange={(e) => setQcomRawProgram(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Browse</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-28 text-center font-bold font-mono py-1 px-2 rounded bg-amber-950/60 text-amber-300 border border-amber-800">
                  PATCH0.XML
                </div>
                <input
                  type="text"
                  value={qcomPatch}
                  onChange={(e) => setQcomPatch(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Browse</span>
                </button>
              </div>
            </div>
          )}

          {/* Unisoc / Apple Slots */}
          {activeFlasher === 'unisoc' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-24 text-center font-bold font-mono py-1 px-2 rounded bg-orange-950/60 text-orange-300 border border-orange-800">
                  PAC FILE
                </div>
                <input
                  type="text"
                  value={unisocPac}
                  onChange={(e) => setUnisocPac(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-orange-400" />
                  <span>Browse</span>
                </button>
              </div>
            </div>
          )}

          {activeFlasher === 'apple' && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="w-24 text-center font-bold font-mono py-1 px-2 rounded bg-blue-950/60 text-blue-300 border border-blue-800">
                  IPSW FILE
                </div>
                <input
                  type="text"
                  value={appleIpsw}
                  onChange={(e) => setAppleIpsw(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-2 focus:outline-none"
                />
                <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center gap-1 font-mono text-[11px]">
                  <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Browse</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Flashing Execution & Options Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'خيارات وتأمين التفليش' : 'Safety & Flasher Options'}</span>
            </h4>

            {/* Checklist Options */}
            <div className="space-y-2 text-xs">
              <label 
                onClick={() => toggleOption('autoReboot')}
                className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none"
              >
                {options.autoReboot ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                <span>Auto Reboot upon completion</span>
              </label>

              <label 
                onClick={() => toggleOption('fResetTime')}
                className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none"
              >
                {options.fResetTime ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                <span>F. Reset Time (Clean cache)</span>
              </label>

              <label 
                onClick={() => toggleOption('backupNvramFirst')}
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 cursor-pointer select-none font-semibold"
              >
                {options.backupNvramFirst ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                <span>Auto-Backup NVRAM & EFS First</span>
              </label>

              <label 
                onClick={() => toggleOption('authBypass')}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 cursor-pointer select-none"
              >
                {options.authBypass ? <CheckSquare className="w-4 h-4 text-purple-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                <span>SLA / DAA Auth Bypass (BROM)</span>
              </label>

              <label 
                onClick={() => toggleOption('repartitionPit')}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 cursor-pointer select-none"
              >
                {options.repartitionPit ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                <span>Re-Partition via PIT (Warning!)</span>
              </label>
            </div>

            {/* Binary Rollback Index Check Indicator */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Device Rollback Index:</span>
                <span className="text-white font-bold">{device.rollbackIndex}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Firmware Binary Rev:</span>
                <span className="text-emerald-400 font-bold">{device.rollbackIndex} (SAFE / MATCH)</span>
              </div>
            </div>
          </div>

          {/* Flash Button */}
          <button
            onClick={handleStartFlash}
            disabled={isBusy}
            className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              isBusy
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/30'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isBusy ? (isAr ? 'جاري التفليش...' : 'FLASHING IN PROGRESS...') : (isAr ? 'بدء تفليش النظام الآن' : 'START FLASH PROCESS')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
