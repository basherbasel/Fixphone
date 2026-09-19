import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  HardDrive, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Lock, 
  Eye, 
  Zap,
  CheckSquare,
  Square
} from 'lucide-react';
import { ConnectedDevice, PartitionInfo } from '../types';

interface AntiBrickSafetySuiteProps {
  device: ConnectedDevice;
  onBackupPartition: (partitions: string[]) => void;
  onRestorePartition: (partitionName: string) => void;
  isBusy: boolean;
  lang: 'en' | 'ar';
}

const PARTITION_MAP: PartitionInfo[] = [
  { name: 'nvram', startSector: '0x00008000', sizeMb: 5, type: 'EXT4/RAW', backedUp: true, essential: true },
  { name: 'nvdata', startSector: '0x0000A800', sizeMb: 32, type: 'EXT4', backedUp: true, essential: true },
  { name: 'modemst1 (EFS 1)', startSector: '0x00012000', sizeMb: 3, type: 'RAW/QCOM', backedUp: true, essential: true },
  { name: 'modemst2 (EFS 2)', startSector: '0x00013800', sizeMb: 3, type: 'RAW/QCOM', backedUp: true, essential: true },
  { name: 'fsg', startSector: '0x00015000', sizeMb: 4, type: 'RAW', backedUp: false, essential: true },
  { name: 'persist', startSector: '0x00020000', sizeMb: 64, type: 'EXT4', backedUp: true, essential: true },
  { name: 'boot', startSector: '0x00040000', sizeMb: 64, type: 'KERNEL_IMAGE', backedUp: true, essential: false },
  { name: 'vbmeta', startSector: '0x00080000', sizeMb: 8, type: 'AVB_TREE', backedUp: true, essential: true },
  { name: 'frp', startSector: '0x00088000', sizeMb: 1, type: 'RAW_CONFIG', backedUp: true, essential: false },
  { name: 'secro', startSector: '0x00090000', sizeMb: 6, type: 'SECURE_CRYPTO', backedUp: false, essential: true },
];

export const AntiBrickSafetySuite: React.FC<AntiBrickSafetySuiteProps> = ({
  device,
  onBackupPartition,
  onRestorePartition,
  isBusy,
  lang
}) => {
  const isAr = lang === 'ar';
  const [selectedPartitions, setSelectedPartitions] = useState<string[]>([
    'nvram', 'nvdata', 'modemst1 (EFS 1)', 'modemst2 (EFS 2)', 'persist', 'vbmeta'
  ]);
  const [showTestpointPinout, setShowTestpointPinout] = useState(false);

  const togglePartition = (name: string) => {
    if (selectedPartitions.includes(name)) {
      setSelectedPartitions(selectedPartitions.filter(p => p !== name));
    } else {
      setSelectedPartitions([...selectedPartitions, name]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'جناح الحماية من الموت المفاجئ والنسخ الاحتياطي' : 'Anti-Brick & Partition Snapshot Vault'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE PROTECTION
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'فحص مؤشر الحماية ضد الرجوع (Rollback Index) وأخذ نسخ احتياطية فورية لقطاعات الأمان والشبكة'
                : 'Cryptographic Rollback Index protection, partition backups, and hardware motherboard testpoint pinouts.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTestpointPinout(!showTestpointPinout)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-mono border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showTestpointPinout ? 'Hide Testpoint' : 'View Testpoint Pinout'}</span>
          </button>
        </div>
      </div>

      {/* Testpoint Pinout Visual Guide (Collapsible) */}
      {showTestpointPinout && (
        <div className="bg-slate-950 border border-cyan-800/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Motherboard Testpoint Pinout Guide: {device.brand} {device.marketName}</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">Target SoC: {device.chipsetName}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Visual Motherboard Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-3 relative overflow-hidden">
              <div className="flex justify-between text-slate-400 text-[10px] border-b border-slate-800 pb-1">
                <span>PCB REV 1.2 [MAIN BOARD TOP]</span>
                <span className="text-amber-400">GND TESTPOINT PIN</span>
              </div>
              <div className="h-36 bg-slate-950 rounded border border-slate-800 flex items-center justify-center relative p-4">
                {/* SVG Schematic */}
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-2">
                  <div className="w-24 h-16 border-2 border-slate-700 rounded bg-slate-900 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                    {device.chipset.toUpperCase()} SoC
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-amber-300 font-bold text-[10px]">TP_EDL / CLK</span>
                    </div>
                    <span className="text-slate-600">─────►</span>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-slate-600" />
                      <span className="text-slate-400 text-[10px]">GND Shield</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testpoint Instructions */}
            <div className="space-y-2 text-xs text-slate-300">
              <h5 className="font-bold text-white">Hardware Testpoint Instructions:</h5>
              <ol className="space-y-1.5 list-decimal list-inside text-slate-300 leading-relaxed font-mono text-[11px]">
                <li>Disconnect device battery flex cable completely from PCB.</li>
                <li>Using precision conductive tweezers, short the highlighted gold pin <strong>(TP1)</strong> to the metallic EMI Shield (Ground).</li>
                <li>While keeping short active, insert standard USB-C cable connected to PC.</li>
                <li>Release tweezers after 2 seconds; Device Manager will enumerate as <strong>{device.port}</strong>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Rollback Index Guard & Partition Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Col: Rollback Guard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'حماية الـ Rollback Index' : 'Anti-Rollback Protection Index'}</span>
          </h4>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400">
              <span>Hardware Fuse Binary Rev:</span>
              <span className="text-cyan-300 font-bold text-sm">REV {device.rollbackIndex}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Target ROM Binary Rev:</span>
              <span className="text-emerald-400 font-bold text-sm">REV {device.rollbackIndex}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Status Check:</span>
              <span className="text-emerald-400 font-bold">MATCH (NO DOWNGRADE BRICK RISK)</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'يقوم هذا النظام بمنع تفليش أي روم يحمل إصدار حماية أقل (Downgrade) لتفادي احتراق فيوزات المعالج والموت الدائم للهاتف.'
              : 'OmniFix checks e-fuse registers to prevent flashing lower security revisions which permanently trigger hard-brick trap.'}
          </div>
        </div>

        {/* Right 2 Cols: Partition Snapshot Vault */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'قطاعات الذاكرة الحساسة للنسخ الاحتياطي' : 'Critical Partition Snapshot Vault'}</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedPartitions.length} / {PARTITION_MAP.length} selected
              </span>
            </div>

            {/* Partition Table List */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {PARTITION_MAP.map((part) => {
                const isSelected = selectedPartitions.includes(part.name);
                return (
                  <div
                    key={part.name}
                    onClick={() => togglePartition(part.name)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                      <span className="font-bold">{part.name}</span>
                      {part.essential && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          CRITICAL
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>{part.startSector}</span>
                      <span className="text-slate-400">{part.sizeMb} MB</span>
                      <span className="text-slate-600">[{part.type}]</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => onBackupPartition(selectedPartitions)}
              disabled={isBusy || selectedPartitions.length === 0}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'أخذ نسخة احتياطية فورية' : 'BACKUP SELECTED BLOCKS'}</span>
            </button>

            <button
              onClick={() => onRestorePartition(selectedPartitions[0] || 'nvram')}
              disabled={isBusy || selectedPartitions.length === 0}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'استعادة من ملف سابق' : 'RESTORE FROM DUMP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
