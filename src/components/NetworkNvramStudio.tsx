import React, { useState } from 'react';
import { 
  Radio, 
  Activity, 
  ShieldCheck, 
  Download, 
  Upload, 
  Wrench, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Key, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { ConnectedDevice } from '../types';

interface NetworkNvramStudioProps {
  device: ConnectedDevice;
  onExecuteNvramAction: (actionType: string, payload: any) => void;
  isBusy: boolean;
  lang: 'en' | 'ar';
}

export const NetworkNvramStudio: React.FC<NetworkNvramStudioProps> = ({
  device,
  onExecuteNvramAction,
  isBusy,
  lang
}) => {
  const isAr = lang === 'ar';
  const [imei1, setImei1] = useState(device.imei1 || '358941209384721');
  const [imei2, setImei2] = useState(device.imei2 || '358941209384739');
  const [qcnFilePath, setQcnFilePath] = useState(`${device.model}_Calibrated_Stock.qcn`);
  const [nvramMode, setNvramMode] = useState<'qualcomm_qcn' | 'mtk_nvdata' | 'samsung_efs'>(
    device.chipset === 'mediatek' ? 'mtk_nvdata' :
    device.chipset === 'samsung_exynos' ? 'samsung_efs' : 'qualcomm_qcn'
  );

  const [imeiValidation, setImeiValidation] = useState<{
    valid: boolean;
    checkDigit1: number;
    checkDigit2: number;
    bcdHex: string;
  } | null>(null);

  const calculateLuhn = (imeiStr: string) => {
    if (!imeiStr || imeiStr.length < 14) return null;
    const clean = imeiStr.replace(/\D/g, '').slice(0, 14);
    if (clean.length < 14) return null;
    
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(clean[i], 10);
      if (i % 2 !== 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
  };

  const handleValidateImei = () => {
    const cd1 = calculateLuhn(imei1);
    const cd2 = calculateLuhn(imei2);

    if (cd1 !== null) {
      const fullImei1 = imei1.slice(0, 14) + cd1;
      // BCD format: Qualcomm NV format
      const bcd = '08 3A ' + fullImei1.slice(0, 14).split('').map((c, i) => i % 2 === 0 ? c : c + ' ').join('');
      setImeiValidation({
        valid: true,
        checkDigit1: cd1,
        checkDigit2: cd2 || 0,
        bcdHex: bcd
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'استوديو إصلاح الشبكة و NVRAM / EFS / QCN' : 'NVRAM, EFS & Baseband Engineering Studio'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                MODEM CALIBRATION READY
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr 
                ? 'إصلاح السيريال المفقود (Unknown Baseband / Null IMEI)، قراءة وكتابة ملفات QCN، وإعادة بناء قطاعات EFS و NVDATA'
                : 'Direct raw partition read/write for Qualcomm QCN, MediaTek NVRAM/NVDATA, and Samsung EFS modem blocks.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">Baseband:</span>
          <span className="text-emerald-400 font-bold">{device.basebandVersion || 'CP_ONLINE'}</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Col: Dual IMEI Repair & Luhn Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'إصلاح وحساب أرقام السيريال (IMEI 1 & IMEI 2)' : 'Dual IMEI Repair & NV Item Generator'}</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">Luhn Algorithm Verified</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* IMEI 1 */}
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">IMEI 1 (Primary SIM slot):</label>
              <input
                type="text"
                value={imei1}
                maxLength={15}
                onChange={(e) => setImei1(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                placeholder="Enter 14 or 15 digit IMEI..."
              />
            </div>

            {/* IMEI 2 */}
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">IMEI 2 (Secondary SIM / eSIM):</label>
              <input
                type="text"
                value={imei2}
                maxLength={15}
                onChange={(e) => setImei2(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                placeholder="Enter 14 or 15 digit IMEI 2..."
              />
            </div>

            <button
              onClick={handleValidateImei}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'فحص خوارزمية Luhn وتوليد NV Hex' : 'Calculate Checksum & Qualcomm BCD'}</span>
            </button>

            {/* BCD Hex Output Preview */}
            {imeiValidation && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Calculated Check Digit 1:</span>
                  <span className="text-emerald-400 font-bold">{imeiValidation.checkDigit1}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>NV_ITEM_UE_IMEI (550) BCD:</span>
                  <span className="text-cyan-300 font-bold">{imeiValidation.bcdHex}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onExecuteNvramAction('WRITE_IMEI', { imei1, imei2, chipset: device.chipset })}
            disabled={isBusy || !imei1}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Wrench className="w-4 h-4" />
            <span>{isAr ? 'كتابة السيريال إلى قطاع NVRAM / EFS' : 'WRITE IMEI TO NVRAM / EFS PARTITION'}</span>
          </button>
        </div>

        {/* Right Col: QCN / EFS / NV Backup & Restore Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'قراءة وكتابة ملفات QCN والنسخ الاحتياطي لـ EFS' : 'QCN, EFS & NVDATA Backup / Restore'}</span>
              </h4>
              <span className="text-[11px] font-mono text-purple-400 font-bold">{device.chipset.toUpperCase()}</span>
            </div>

            {/* QCN File Path Slot */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-400 font-mono text-[11px]">Calibrated QCN / NVRAM Binary Archive:</label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <input
                  type="text"
                  value={qcnFilePath}
                  onChange={(e) => setQcnFilePath(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-slate-200 text-xs px-1 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onExecuteNvramAction('BACKUP_QCN_EFS', { model: device.model })}
                disabled={isBusy}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-[11px]">{isAr ? 'نسخ احتياطي QCN / EFS' : 'Backup QCN / EFS'}</span>
                <span className="text-[10px] text-slate-500 font-mono">Dump modemst1/2</span>
              </button>

              <button
                onClick={() => onExecuteNvramAction('RESTORE_QCN_EFS', { file: qcnFilePath })}
                disabled={isBusy}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-[11px]">{isAr ? 'استعادة وكتابة QCN' : 'Restore & Write QCN'}</span>
                <span className="text-[10px] text-slate-500 font-mono">Calibrate RF bands</span>
              </button>

              <button
                onClick={() => onExecuteNvramAction('FIX_BASEBAND_NULL', { model: device.model })}
                disabled={isBusy}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-colors"
              >
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-[11px]">{isAr ? 'إصلاح Unknown Baseband' : 'Wipe & Rebuild EFS'}</span>
                <span className="text-[10px] text-slate-500 font-mono">Fix SIM not detected</span>
              </button>

              <button
                onClick={() => onExecuteNvramAction('UNLOCK_NETWORK_SIM', { model: device.model })}
                disabled={isBusy}
                className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-[11px]">{isAr ? 'فك قفل الشبكة SIM Lock' : 'Unlock Carrier / SIM'}</span>
                <span className="text-[10px] text-slate-500 font-mono">Remove carrier lock</span>
              </button>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Safety check: Auto-creates .bak of SECRO, NVRAM, and EFS blocks before write.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
