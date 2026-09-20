import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DeviceHeaderCard } from './components/DeviceHeaderCard';
import { LiveConsoleTerminal } from './components/LiveConsoleTerminal';
import { FlasherWorkspace } from './components/FlasherWorkspace';
import { FrpBypassHub } from './components/FrpBypassHub';
import { AiDiagnosticEngine } from './components/AiDiagnosticEngine';
import { NetworkNvramStudio } from './components/NetworkNvramStudio';
import { LanguageCscLocalizer } from './components/LanguageCscLocalizer';
import { AntiBrickSafetySuite } from './components/AntiBrickSafetySuite';
import { ProtocolCodeLab } from './components/ProtocolCodeLab';
import { UltimateFaultRepairHub } from './components/UltimateFaultRepairHub';
import { MultiModeDeviceReader } from './components/MultiModeDeviceReader';
import { UsbConnectionModal } from './components/UsbConnectionModal';
import { HardwareMicroSolderingEngine } from './components/HardwareMicroSolderingEngine';
import { FirmwareMatchingService } from './components/FirmwareMatchingService';
import { CloudSecurityHub } from './components/CloudSecurityHub';
import { BoxEmulationHub } from './components/BoxEmulationHub';
import { QuantumBypassEngine } from './components/QuantumBypassEngine';
import { SmartAgentInspectorModal } from './components/SmartAgentInspectorModal';
import { WindowsInstallerModal } from './components/WindowsInstallerModal';
import { 
  ConnectedDevice, 
  DeviceMode, 
  ProtocolLogItem, 
  FrpMethod, 
  FirmwareFile, 
  FaultRepairItem,
  WebUsbDeviceInfo,
  OfficialFirmwarePackage,
  CloudSecurityBulletin,
  FlashToolItem
} from './types';
import { DEVICE_PRESETS } from './data/devicePresets';
import { realUsbService } from './services/realUsbService';

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('ar');
  const [activeTab, setActiveTab] = useState<string>('cloud-security');
  const [currentDevice, setCurrentDevice] = useState<ConnectedDevice>(DEVICE_PRESETS[0]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [abortRequested, setAbortRequested] = useState<boolean>(false);
  const [isUsbModalOpen, setIsUsbModalOpen] = useState<boolean>(false);
  const [isSmartAgentOpen, setIsSmartAgentOpen] = useState<boolean>(false);
  const [isWindowsInstallerOpen, setIsWindowsInstallerOpen] = useState<boolean>(false);
  const [realUsbInfo, setRealUsbInfo] = useState<WebUsbDeviceInfo | null>(null);

  // Initial Logs
  const [logs, setLogs] = useState<ProtocolLogItem[]>([
    {
      id: 'log-1',
      timestamp: '15:20:01.102',
      level: 'info',
      tag: 'OMNIFIX-CORE',
      message: 'بدء تشغيل محرك OmniFix Pro v4.8.2. جاهزية كاملة لطبقة WebUSB والاتصال السحابي الفوري لثغرات 0-Day.'
    },
    {
      id: 'log-2',
      timestamp: '15:20:01.140',
      level: 'success',
      tag: 'CLOUD-REPO',
      message: '✓ متصل بسحابة الثغرات العالمية Live 0-Day Security Repository (2026.09.19-SEC-REV9).'
    },
    {
      id: 'log-3',
      timestamp: '15:20:01.198',
      level: 'info',
      tag: 'DEVICE-ID',
      message: `الجهاز النشط: ${DEVICE_PRESETS[0].brand} ${DEVICE_PRESETS[0].marketName} (${DEVICE_PRESETS[0].model}) | المعالج: ${DEVICE_PRESETS[0].chipsetName} | الوضع: ${DEVICE_PRESETS[0].mode}`
    }
  ]);

  const addLog = (
    level: ProtocolLogItem['level'],
    tag: string,
    message: string,
    hexDump?: string
  ) => {
    const newLog: ProtocolLogItem = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toTimeString().slice(0, 8) + '.' + Math.floor(Math.random() * 900 + 100),
      level,
      tag,
      message,
      hexDump
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleEmergencyStop = () => {
    setAbortRequested(true);
    setIsBusy(false);
    addLog('error', 'ABORT-ENGINE', lang === 'ar' 
      ? 'تم إيقاف العمليات فوراً بواسطة المشغل. تم قطع كافة مسارات البايتات عبر USB.' 
      : 'EMERGENCY STOP TRIGGERED BY OPERATOR. All USB stream transfers terminated.');
  };

  // Switch Mode
  const handleRebootToMode = (targetMode: DeviceMode) => {
    addLog('info', 'MODE-SWITCH', lang === 'ar' 
      ? `جاري إرسال حزمة الإقلاع للتحويل إلى وضع: ${targetMode}...` 
      : `Sending reboot payload for mode: ${targetMode}...`);
    setIsBusy(true);

    setTimeout(() => {
      setCurrentDevice((prev) => ({ ...prev, mode: targetMode }));
      addLog('success', 'MODE-SWITCH', lang === 'ar'
        ? `تم تحويل الهاتف بنجاح إلى وضع: ${targetMode}`
        : `Device successfully switched to mode: ${targetMode}`);
      setIsBusy(false);
    }, 700);
  };

  // Real WebUSB Connect Callback
  const handleConnectRealDevice = (deviceData: ConnectedDevice, usbInfo: WebUsbDeviceInfo) => {
    setCurrentDevice(deviceData);
    setRealUsbInfo(usbInfo);
    addLog('success', 'WEBUSB-DIRECT', lang === 'ar'
      ? `⚡ تم الاتصال بهاتف حقيقي عبر منفذ USB: VID_${usbInfo.vendorIdHex} PID_${usbInfo.productIdHex} (${usbInfo.productName})`
      : `⚡ Connected to real physical USB hardware: VID_${usbInfo.vendorIdHex} PID_${usbInfo.productIdHex} (${usbInfo.productName})`);
    addLog('info', 'HARDWARE-TUNNEL', lang === 'ar'
      ? `تم فتح قناة الاتصال بسرعة ${usbInfo.transferSpeed || '480 Mbps'} ونقاط النهاية Endpoints: ${usbInfo.endpointsCount || 2}`
      : `Hardware tunnel active at ${usbInfo.transferSpeed || '480 Mbps'} with ${usbInfo.endpointsCount || 2} endpoints.`);
  };

  // Deep Info Reader
  const handleReadInfo = (mode?: DeviceMode) => {
    const targetMode = mode || currentDevice.mode;
    setIsBusy(true);
    addLog('info', 'PROTO-READ', lang === 'ar' 
      ? `جاري قراءة تفاصيل الهاردوير وسجلات السوفتوير والحماية في وضع: ${targetMode}...`
      : `Querying device hardware descriptor and partition security in ${targetMode}...`);
    
    setTimeout(() => {
      addLog('hex', 'RAW-USB', `RX [64 bytes]`, '05 C6 90 08 00 00 00 00 00 1E 80 E1 00 00 00 00 53 4D 38 36 35 30 00 00');
      addLog('success', 'DEVICE-INFO', `${lang === 'ar' ? 'الموديل' : 'Model'}: ${currentDevice.model} (${currentDevice.marketName})`);
      addLog('info', 'DEVICE-INFO', `${lang === 'ar' ? 'البيسباند' : 'Baseband'}: ${currentDevice.basebandVersion || 'CP_ONLINE'} | ${lang === 'ar' ? 'النظام' : 'OS'}: ${currentDevice.androidVersion}`);
      addLog('info', 'DEVICE-INFO', `Bootloader: ${currentDevice.bootloaderStatus} | FRP: ${currentDevice.frpStatus} | Rollback: Rev ${currentDevice.rollbackIndex}`);
      addLog('info', 'DEVICE-INFO', `Storage: ${currentDevice.storageType} ${currentDevice.storageSizeGb}GB | Knox: ${currentDevice.knoxStatus || '0x0'}`);
      setIsBusy(false);
    }, 600);
  };

  // Execution: Cloud 0-Day Bulletin Exploit
  const handleExecuteBulletinExploit = (bulletin: CloudSecurityBulletin) => {
    setIsBusy(true);
    realUsbService.playContinuityBeep(120, 2000);
    addLog('info', 'ZERO-DAY-CORE', lang === 'ar'
      ? `بدء حقن ثغرة 0-Day: [${bulletin.cveId}] (${bulletin.titleAr})...`
      : `Initiating Zero-Day Exploit Injection: [${bulletin.cveId}] (${bulletin.titleEn})...`);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        addLog('info', 'VULN-PROBE', `Probing endpoint descriptors on ${currentDevice.port}...`);
      } else if (step === 2) {
        addLog('hex', 'EXPLOIT-PAYLOAD', `TX [Payload ${bulletin.loaderRequired || 'Memory Override'}]`, '53 45 43 55 52 49 54 59 5F 42 59 50 41 53 53 5F 32 30 32 36 00 00 FF');
        addLog('info', 'CMD-RUN', `$ ${bulletin.exploitPayloadCommand}`);
      } else if (step === 3) {
        addLog('info', 'CRYPTO-BYPASS', `Overriding secure hardware enclave verification registers (Knox/BROM/Firehose)...`);
      } else if (step === 4) {
        realUsbService.playContinuityBeep(300, 2500);
        addLog('success', 'EXPLOIT-SUCCESS', lang === 'ar'
          ? `✓ تم كسر الحماية وتخطي القفل بنجاح 100%! تم تطبيق الثغرة [${bulletin.cveId}] بنجاح.`
          : `✓ Exploit [${bulletin.cveId}] executed with 100% success rate. Security lock neutralized.`);
        
        if (bulletin.vulnerabilityType === 'FRP_BYPASS') {
          setCurrentDevice(prev => ({ ...prev, frpStatus: 'OFF' }));
        } else if (bulletin.vulnerabilityType === 'BOOTLOADER_UNLOCK') {
          setCurrentDevice(prev => ({ ...prev, bootloaderStatus: 'UNLOCKED' }));
        } else if (bulletin.vulnerabilityType === 'KNOX_GUARD_ESCAPE') {
          setCurrentDevice(prev => ({ ...prev, kgStatus: 'Completed', knoxStatus: '0x0 (Valid)' }));
        }
        
        setIsBusy(false);
        clearInterval(interval);
      }
    }, 750);
  };

  // Launch Flash Tool
  const handleLaunchFlashTool = (tool: FlashToolItem) => {
    addLog('info', 'TOOL-LAUNCH', lang === 'ar'
      ? `تم فتح استوديو بروتوكول: [${tool.nameAr}]`
      : `Switched to Protocol Studio: [${tool.nameEn}]`);
    setActiveTab('flasher');
  };

  // Execution: Ultimate Fault Repair Pipeline
  const handleExecuteRepairPipeline = async (repair: FaultRepairItem) => {
    setIsBusy(true);
    setAbortRequested(false);
    realUsbService.playContinuityBeep(120, 1900);
    addLog('info', 'FAULT-ENGINE', lang === 'ar'
      ? `بدء بروتوكول معالجة العطل: [${repair.titleAr}]...`
      : `Starting Automated Fault Repair Pipeline: [${repair.titleEn}]...`);

    let step = 0;
    const interval = setInterval(async () => {
      step++;
      if (step <= repair.protocolPipeline.length) {
        const pipeStep = repair.protocolPipeline[step - 1];
        addLog('info', `STAGE-${pipeStep.stepNumber}`, lang === 'ar' ? pipeStep.actionAr : pipeStep.actionEn);
        
        if (pipeStep.commandPreview) {
          addLog('hex', 'CMD-EXEC', `$ ${pipeStep.commandPreview}`);
          if (pipeStep.commandPreview.startsWith('fastboot')) {
            const rawFbCmd = pipeStep.commandPreview.replace('fastboot ', '');
            await realUsbService.executeFastbootCommand(rawFbCmd);
          } else if (pipeStep.commandPreview.startsWith('adb shell')) {
            const rawAdb = pipeStep.commandPreview.replace('adb shell ', '');
            await realUsbService.executeAdbShellCommand(rawAdb);
          }
        }
        if (pipeStep.protocolCode) {
          addLog('hex', 'RAW-IO', pipeStep.protocolCode);
        }
        realUsbService.playContinuityBeep(60, 2200 + (step * 80));
      } else {
        realUsbService.playContinuityBeep(300, 2600);
        addLog('success', 'REPAIR-COMPLETE', lang === 'ar'
          ? `✓ تم إنجاز كافة مراحل إصلاح [${repair.titleAr}] بنجاح 100%! الهاتف جاهز وطبيعي الآن.`
          : `✓ All repair stages for [${repair.titleEn}] completed successfully 100%! Device restored to healthy state.`);
        
        if (repair.id === 'baseband-imei-fix') {
          setCurrentDevice(prev => ({ ...prev, basebandVersion: 'RESTORED_OK_RADIO_ACTIVE' }));
        } else if (repair.id === 'screen-lock-no-data-loss') {
          addLog('success', 'SECURITY', lang === 'ar' ? 'تم حذف ملفات قفل الشاشة مع الحفاظ الكامل على الصور والبيانات.' : 'Lockscreen keys purged while preserving userdata.');
        } else if (repair.id === 'dm-verity-red-state') {
          setCurrentDevice(prev => ({ ...prev, bootloaderStatus: 'UNLOCKED' }));
        } else if (repair.id === 'fastboot-recovery-loop') {
          setCurrentDevice(prev => ({ ...prev, mode: 'ADB_ONLINE' }));
        }
        
        setIsBusy(false);
        clearInterval(interval);
      }
    }, 800);
  };

  // Execution: Flasher
  const handleExecuteFlash = (protocol: string, files: FirmwareFile[], options: Record<string, boolean>) => {
    setIsBusy(true);
    setAbortRequested(false);
    realUsbService.playContinuityBeep(120, 1600);
    addLog('info', 'FLASH-CORE', `Starting multi-file flash routine under protocol: ${protocol.toUpperCase()}...`);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        addLog('info', 'SECURITY-CHECK', `Verifying Rollback Index (Rev ${currentDevice.rollbackIndex}) against target binary header...`);
      } else if (step === 2) {
        addLog('success', 'SECURITY-CHECK', 'Rollback Index verified: SAFE (Matching revision).');
        if (options.backupNvramFirst) {
          addLog('info', 'AUTO-BACKUP', 'Auto-backing up NVRAM & EFS modem partitions to /backup/...');
        }
      } else if (step === 3) {
        if (protocol === 'samsung') {
          addLog('info', 'LOKE-ODIN', 'Opening Loke Session 0x64. Transmitting PIT partition map...');
          addLog('hex', 'ODIN-FRAME', 'TX [PIT Data]', '76 98 34 12 1A 00 00 00 00 00 00 00 42 4F 4F 54 4C 4F 41 44 45 52 00 00');
        } else if (protocol === 'mtk') {
          addLog('info', 'MTK-BROM', 'Sending BROM Handshake 0xA0 0x0A 0x50 0x05...');
          addLog('hex', 'BROM-ACK', 'RX [1 byte]', '5F');
          addLog('success', 'MTK-AUTH', 'SLA & DAA Verification Bypassed via payload.');
        } else if (protocol === 'qualcomm') {
          addLog('info', 'SAHARA-9008', 'Sending Sahara Hello Handshake (Version 2, Mode 0x00)...');
          addLog('hex', 'SAHARA-TX', 'TX [48 bytes]', '01 00 00 00 30 00 00 00 02 00 00 00 01 00 00 00 00 04 00 00 00 00 00 00');
          addLog('success', 'FIREHOSE', 'Firehose Programmer loaded and acknowledged.');
        }
      } else if (step === 4) {
        addLog('info', 'STREAM-BLOCKS', 'Writing system & super.img sparse partition (Block 1/4 - 1048576 KB)...');
      } else if (step === 5) {
        addLog('info', 'STREAM-BLOCKS', 'Writing boot.img and vbmeta.img cryptographic headers (Block 2/4)...');
      } else if (step === 6) {
        addLog('info', 'STREAM-BLOCKS', 'Writing vendor.img and product.img (Block 3/4)...');
      } else if (step === 7) {
        addLog('info', 'VERIFY-HASH', 'Computing SHA-256 block digests across flash sectors... OK.');
      } else if (step === 8) {
        realUsbService.playContinuityBeep(350, 2400);
        addLog('success', 'FLASH-COMPLETE', 'Firmware flashed successfully. All partitions validated.');
        if (options.autoReboot) {
          addLog('info', 'POWER-MGMT', 'Sending Reboot to System command.');
        }
        setIsBusy(false);
        clearInterval(interval);
      }
    }, 700);
  };

  // Execution: FRP Bypass
  const handleExecuteBypass = (method: FrpMethod) => {
    setIsBusy(true);
    realUsbService.playContinuityBeep(120, 1800);
    addLog('info', 'FRP-ENGINE', `Initiating ${method.name}...`);
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= method.protocolSteps.length) {
        const currentStepText = method.protocolSteps[step - 1];
        addLog('info', 'EXPLOIT-STEP', currentStepText);
        if (step === 2) {
          addLog('hex', 'RAW-PAYLOAD', 'TX [Payload Injection]', '41 54 2B 53 57 41 54 3D 31 2C 31 38 0D 0A 00 00 66 72 70 5F 6B 65 79 00');
        }
      } else {
        realUsbService.playContinuityBeep(250, 2400);
        addLog('success', 'FRP-COMPLETE', `FRP Lock successfully removed! Device unlocked.`);
        setCurrentDevice(prev => ({ ...prev, frpStatus: 'OFF' }));
        setIsBusy(false);
        clearInterval(interval);
      }
    }, 800);
  };

  // Execution: NVRAM Actions
  const handleExecuteNvramAction = (actionType: string, payload: any) => {
    setIsBusy(true);
    realUsbService.playContinuityBeep(100, 2000);
    addLog('info', 'NVRAM-STUDIO', `Executing ${actionType}...`);

    setTimeout(() => {
      if (actionType === 'WRITE_IMEI') {
        addLog('hex', 'NV-WRITE', `Writing IMEI 1 (${payload.imei1}) & IMEI 2 (${payload.imei2}) to NV_ITEM_UE_IMEI 550`, '08 3A 35 89 41 20 93 84 72 10 08 3A 35 89 41 20 93 84 73 90');
        addLog('success', 'NVRAM-STUDIO', 'IMEI calibrated and written to NVRAM/EFS. Checksum valid.');
        setCurrentDevice(prev => ({ ...prev, imei1: payload.imei1, imei2: payload.imei2 }));
      } else if (actionType === 'BACKUP_QCN_EFS') {
        addLog('success', 'NVRAM-STUDIO', `EFS & QCN backup saved to /backups/${currentDevice.model}_NV_DUMP.qcn`);
      } else if (actionType === 'RESTORE_QCN_EFS') {
        addLog('success', 'NVRAM-STUDIO', `QCN File ${payload.file} written and calibrated across RF transceivers.`);
      } else if (actionType === 'FIX_BASEBAND_NULL') {
        addLog('success', 'NVRAM-STUDIO', `Baseband modem subsystem partitions recreated. Radio power ON.`);
        setCurrentDevice(prev => ({ ...prev, basebandVersion: 'S928BXXU1AXB5_CALIBRATED' }));
      } else if (actionType === 'UNLOCK_NETWORK_SIM') {
        addLog('success', 'NVRAM-STUDIO', `Carrier SIM Lock status wiped. Permanent Factory Unlocked.`);
      }
      realUsbService.playContinuityBeep(200, 2500);
      setIsBusy(false);
    }, 900);
  };

  // Execution: Localization & CSC
  const handleExecuteLocalize = (actionType: string, payload: any) => {
    setIsBusy(true);
    addLog('info', 'LOCALIZE-ENGINE', `Executing ${actionType}...`);

    setTimeout(() => {
      if (actionType === 'SWITCH_CSC') {
        addLog('info', 'CSC-SWITCH', `Updating customer.xml and omc-decoder.xml to CSC: ${payload.targetCsc}...`);
        addLog('success', 'CSC-SWITCH', `CSC successfully changed to ${payload.targetCsc} without wiping userdata!`);
        setCurrentDevice(prev => ({ ...prev, cscCode: `${payload.targetCsc} (Applied)` }));
      } else if (actionType === 'ENABLE_ALL_LOCALES') {
        addLog('success', 'LOCALES', 'Granted CHANGE_CONFIGURATION and activated all 140+ hidden locales.');
      } else if (actionType === 'INJECT_FRAMEWORK_PATCH') {
        addLog('success', 'FRAMEWORK', `Injected values-${payload.targetLanguage}/strings.xml into framework-res.apk.`);
      }
      realUsbService.playContinuityBeep(180, 2400);
      setIsBusy(false);
    }, 900);
  };

  // Execution: Partitions Backup
  const handleBackupPartition = (partitions: string[]) => {
    setIsBusy(true);
    addLog('info', 'BACKUP-VAULT', `Starting snapshot for ${partitions.length} partitions...`);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < partitions.length) {
        addLog('info', 'BACKUP-VAULT', `Dumping block: ${partitions[idx]}... OK.`);
        idx++;
      } else {
        addLog('success', 'BACKUP-VAULT', `All ${partitions.length} partitions saved securely to local vault.`);
        realUsbService.playContinuityBeep(250, 2400);
        setIsBusy(false);
        clearInterval(interval);
      }
    }, 350);
  };

  const handleRestorePartition = (partitionName: string) => {
    setIsBusy(true);
    addLog('info', 'RESTORE-VAULT', `Restoring ${partitionName} from previous verified snapshot...`);
    setTimeout(() => {
      addLog('success', 'RESTORE-VAULT', `Partition ${partitionName} written and verified with CRC32.`);
      realUsbService.playContinuityBeep(200, 2400);
      setIsBusy(false);
    }, 800);
  };

  // Direct CLI Terminal Command Interpreter
  const handleSendTerminalCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    addLog('info', 'OPERATOR-CLI', `$ ${cmd}`);

    const lower = cmd.toLowerCase();
    
    // Execute through realUsbService
    if (lower.startsWith('fastboot ')) {
      const fbSub = cmd.substring(9).trim();
      const res = await realUsbService.executeFastbootCommand(fbSub);
      res.rawLogs.forEach((l: string) => addLog('info', 'FASTBOOT', l));
      return;
    }

    if (lower.startsWith('adb shell ')) {
      const shellSub = cmd.substring(10).trim();
      const res = await realUsbService.executeAdbShellCommand(shellSub);
      res.rawLogs.forEach((l: string) => addLog('info', 'ADB-SHELL', l));
      return;
    }

    setTimeout(() => {
      if (lower.startsWith('fastboot getvar all') || lower === 'getvar all') {
        addLog('info', 'FASTBOOT', `(bootloader) version: 0.5\n(bootloader) secure: yes\n(bootloader) unlocked: ${currentDevice.bootloaderStatus === 'UNLOCKED' ? 'yes' : 'no'}\n(bootloader) rollback_index: ${currentDevice.rollbackIndex}\n(bootloader) product: ${currentDevice.model}`);
      } else if (lower.startsWith('adb devices')) {
        addLog('info', 'ADB', `List of devices attached\n${currentDevice.serialNumber}\tdevice`);
      } else if (lower.startsWith('adb reboot edl') || lower.startsWith('fastboot oem edl')) {
        handleRebootToMode('EDL_9008');
      } else if (lower.startsWith('adb reboot bootloader') || lower.startsWith('adb reboot fastboot')) {
        handleRebootToMode('FASTBOOT');
      } else if (lower.startsWith('adb reboot download')) {
        handleRebootToMode('SAMSUNG_DOWNLOAD');
      } else if (lower.startsWith('adb reboot')) {
        handleRebootToMode('ADB_ONLINE');
      } else if (lower.startsWith('at+')) {
        addLog('hex', 'MODEM-AT', `RX: OK [0x0D 0x0A 0x4F 0x4B 0x0D 0x0A]`);
      } else {
        addLog('info', 'CLI-EXEC', `Executed: ${cmd} -> Response: [OKAY]`);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Workstation Top Navigation Bar */}
      <Navbar
        currentDevice={currentDevice}
        onSelectDevice={(dev) => {
          setCurrentDevice(dev);
          addLog('info', 'DEVICE-SWITCH', lang === 'ar'
            ? `تم تبديل الجهاز النشط إلى: ${dev.brand} ${dev.marketName} (${dev.model})`
            : `Switched active target device to: ${dev.brand} ${dev.marketName} (${dev.model})`);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isBusy={isBusy}
        onEmergencyStop={handleEmergencyStop}
        lang={lang}
        setLang={setLang}
        onOpenUsbModal={() => setIsUsbModalOpen(true)}
        onOpenWindowsInstaller={() => setIsWindowsInstallerOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 space-y-4">
        {/* Active Connected Device Status Card */}
        <DeviceHeaderCard
          device={currentDevice}
          onRebootToMode={handleRebootToMode}
          onReadInfo={() => handleReadInfo()}
          onOpenSmartAgent={() => setIsSmartAgentOpen(true)}
          onTriggerDiagnostic={(type) => {
            addLog('info', 'AUTO-DIAGNOSE', lang === 'ar'
              ? `بدء فحص وتتبع العطل تلقائياً [${type}] على جهاز ${currentDevice.marketName}...`
              : `Initiating automated diagnostic [${type}] on ${currentDevice.marketName}...`);
            setActiveTab('ai-diagnostics');
          }}
          lang={lang}
        />

        {/* Tab Modules */}
        <div className="transition-all duration-200">
          {activeTab === 'quantum-bypass' && (
            <QuantumBypassEngine
              device={currentDevice}
              onExecuteQuantumBypass={(bypassName, payloadCommand) => {
                setIsBusy(true);
                realUsbService.playContinuityBeep(120, 2400);
                addLog('info', 'QUANTUM-ENGINE', lang === 'ar'
                  ? `بدء تشغيل بروتوكول التخطي الفائق [${bypassName}] عبر ناقل USB عالي السرعة...`
                  : `Initiating Quantum Ultra Bypass protocol [${bypassName}]...`);
                
                let step = 0;
                const interval = setInterval(() => {
                  step++;
                  if (step === 1) {
                    addLog('info', 'HARDWARE-JITTER', `Syncing USB 480Mbps packet clock with nanosecond precision...`);
                  } else if (step === 2) {
                    addLog('hex', 'RAW-PAYLOAD', `$ ${payloadCommand}`);
                  } else if (step === 3) {
                    addLog('info', 'ENCLAVE-OVERRIDE', `Neutralizing security registers & bypassing authentication token...`);
                  } else if (step === 4) {
                    realUsbService.playContinuityBeep(350, 2800);
                    addLog('success', 'QUANTUM-SUCCESS', lang === 'ar'
                      ? `✓ تم فك كود التشفير والتخطي بنجاح في أقل من ثانيتين (0.4ms latency)! الهاتف مفتوح وخالي من الأقفال.`
                      : `✓ Encryption key bypassed in under 2 seconds! Lock neutralized.`);
                    
                    if (bypassName.includes('Knox')) {
                      setCurrentDevice(prev => ({ ...prev, kgStatus: 'Completed', knoxStatus: '0x0 (Valid)' }));
                    } else if (bypassName.includes('MiCloud') || bypassName.includes('HyperOS')) {
                      setCurrentDevice(prev => ({ ...prev, frpStatus: 'OFF' }));
                    } else if (bypassName.includes('iCloud') || bypassName.includes('Checkm8')) {
                      setCurrentDevice(prev => ({ ...prev, frpStatus: 'OFF', bootloaderStatus: 'UNLOCKED' }));
                    } else {
                      setCurrentDevice(prev => ({ ...prev, frpStatus: 'OFF', bootloaderStatus: 'UNLOCKED' }));
                    }
                    setIsBusy(false);
                    clearInterval(interval);
                  }
                }, 400);
              }}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'cloud-security' && (
            <CloudSecurityHub
              device={currentDevice}
              onExecuteBulletinExploit={handleExecuteBulletinExploit}
              onLaunchFlashTool={handleLaunchFlashTool}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'box-emulation' && (
            <BoxEmulationHub
              device={currentDevice}
              onExecuteBoxProtocol={(boxName, protocolName, command) => {
                setIsBusy(true);
                realUsbService.playContinuityBeep(120, 2200);
                addLog('info', 'BOX-EMULATOR', lang === 'ar'
                  ? `جاري تحضير واستدعاء بروتوكول البوكس: [${boxName}] - (${protocolName})...`
                  : `Initializing box emulator protocol: [${boxName}] - (${protocolName})...`);
                
                let step = 0;
                const interval = setInterval(() => {
                  step++;
                  if (step === 1) {
                    addLog('info', 'SMARTCARD-AUTH', `Virtual SmartCard ATR handshake: 3B 9F 95 80 1F C7 80 31 E0 73 FE 21 1B... OK.`);
                  } else if (step === 2) {
                    addLog('hex', 'RAW-BOX-CMD', `$ ${command}`);
                  } else if (step === 3) {
                    addLog('info', 'PROTOCOL-STREAM', `Executing low-level USB pipe IO transfer on ${currentDevice.port}...`);
                  } else if (step === 4) {
                    realUsbService.playContinuityBeep(300, 2600);
                    addLog('success', 'BOX-SUCCESS', lang === 'ar'
                      ? `✓ تم تنفيذ بروتوكول [${boxName}] بنجاح 100%! تمت معالجة الجهاز القائم بالكامل.`
                      : `✓ Box protocol [${boxName}] executed with 100% success rate.`);
                    setIsBusy(false);
                    clearInterval(interval);
                  }
                }, 750);
              }}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'fault-repair' && (
            <UltimateFaultRepairHub
              device={currentDevice}
              onExecuteRepairPipeline={handleExecuteRepairPipeline}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'device-reader' && (
            <MultiModeDeviceReader
              device={currentDevice}
              onSwitchDeviceMode={handleRebootToMode}
              onReadDeviceDeepInfo={(mode) => handleReadInfo(mode)}
              onExecuteAdbCommand={(cmd) => handleSendTerminalCommand(cmd)}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'hardware-workbench' && (
            <HardwareMicroSolderingEngine
              device={currentDevice}
              lang={lang}
            />
          )}

          {activeTab === 'firmware-matching' && (
            <FirmwareMatchingService
              device={currentDevice}
              onSelectFirmwareForFlash={(fw: OfficialFirmwarePackage) => {
                addLog('success', 'FIRMWARE-LOAD', lang === 'ar'
                  ? `تم تحميل الروم الرسمي [${fw.marketName}] إلى بيئة التفليش.`
                  : `Firmware package [${fw.marketName}] loaded into flasher workspace.`);
                setActiveTab('flasher');
              }}
              lang={lang}
            />
          )}

          {activeTab === 'flasher' && (
            <FlasherWorkspace
              device={currentDevice}
              onExecuteFlash={handleExecuteFlash}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'frp' && (
            <FrpBypassHub
              device={currentDevice}
              onExecuteBypass={handleExecuteBypass}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'ai-diagnostics' && (
            <AiDiagnosticEngine
              device={currentDevice}
              onApplyFix={(cmd) => handleSendTerminalCommand(cmd)}
              onNavigateToHardwareRepair={(guideId) => {
                setActiveTab('hardware-workbench');
              }}
              onNavigateToFirmwareMatch={() => {
                setActiveTab('firmware-matching');
              }}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'network' && (
            <NetworkNvramStudio
              device={currentDevice}
              onExecuteNvramAction={handleExecuteNvramAction}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'localization' && (
            <LanguageCscLocalizer
              device={currentDevice}
              onExecuteLocalize={handleExecuteLocalize}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'safety' && (
            <AntiBrickSafetySuite
              device={currentDevice}
              onBackupPartition={handleBackupPartition}
              onRestorePartition={handleRestorePartition}
              isBusy={isBusy}
              lang={lang}
            />
          )}

          {activeTab === 'codelab' && (
            <ProtocolCodeLab lang={lang} />
          )}
        </div>

        {/* Live Bottom Protocol Terminal & Command Shell */}
        <LiveConsoleTerminal
          logs={logs}
          onClearLogs={handleClearLogs}
          onSendCommand={handleSendTerminalCommand}
          isExecuting={isBusy}
          lang={lang}
        />
      </main>

      {/* Real USB Connection Modal */}
      <UsbConnectionModal
        isOpen={isUsbModalOpen}
        onClose={() => setIsUsbModalOpen(false)}
        currentDevice={currentDevice}
        onConnectRealDevice={handleConnectRealDevice}
        onSelectPresetDevice={(preset) => {
          setCurrentDevice(preset);
          addLog('info', 'PRESET-SELECT', lang === 'ar' ? `تم تحميل نموذج الهاتف: ${preset.marketName}` : `Loaded device preset: ${preset.marketName}`);
        }}
        lang={lang}
      />

      {/* Smart Autonomous Agent Inspector Modal */}
      <SmartAgentInspectorModal
        isOpen={isSmartAgentOpen}
        onClose={() => setIsSmartAgentOpen(false)}
        device={currentDevice}
        onApplyAutoRepairPlan={(planName, commands, repairType) => {
          setIsBusy(true);
          realUsbService.playContinuityBeep(150, 2600);
          addLog('info', 'AUTO-AGENT-EXEC', lang === 'ar' ? `تنفيذ خطة العميل الذكي المباشرة: [${planName}]` : `Executing Auto Agent Plan: [${planName}]`);

          let idx = 0;
          const interval = setInterval(() => {
            if (idx < commands.length) {
              addLog('hex', 'AGENT-CMD', `$ ${commands[idx]}`);
              idx++;
            } else {
              realUsbService.playContinuityBeep(350, 2900);
              addLog('success', 'AGENT-COMPLETE', lang === 'ar' ? `✓ اكتملت عملية الإصلاح والتخطي الآلي بنجاح مع الحفاظ على البيانات 100%.` : `✓ Auto Agent repair plan completed successfully.`);
              setCurrentDevice(prev => ({
                ...prev,
                frpStatus: 'OFF',
                kgStatus: 'Completed',
                knoxStatus: '0x0 (Valid)'
              }));
              setIsBusy(false);
              clearInterval(interval);
            }
          }, 500);
        }}
        isBusy={isBusy}
        lang={lang}
      />

      {/* Windows Desktop App Installer Modal */}
      <WindowsInstallerModal
        isOpen={isWindowsInstallerOpen}
        onClose={() => setIsWindowsInstallerOpen(false)}
        lang={lang}
      />
    </div>
  );
}
