import { FrpMethod } from '../types';

export const FRP_METHODS: FrpMethod[] = [
  {
    id: 'samsung-mtp-2024',
    name: 'Samsung MTP *#0*# Emergency Dial Exploit',
    targetChipsets: ['samsung_exynos', 'qualcomm', 'mediatek'],
    supportedAndroid: 'Android 9 - 14 (Security Patch < July 2024)',
    modeRequired: 'ADB_ONLINE',
    successRate: 98,
    riskLevel: 'SAFE',
    description: 'Enables Test Mode via Emergency Call dialer, leverages AT+KNOX/AT+SYSSCOPE modem commands to force ADB authorization popup, and sends standard FRP package disable intent.',
    protocolSteps: [
      '1. In Welcome/Setup screen, tap "Emergency Call" and dial *#0*# or *#*#88#*#*.',
      '2. Send AT Command: AT+SWAT=1,18; AT+ACTIVATE_ADB via Samsung Modem AT Port.',
      '3. Send ADB authorization ping token to initiate RSA key pair handshake.',
      '4. Execute: adb shell content insert --uri content://settings/secure --bind name:s:user_setup_complete --bind value:s:1',
      '5. Execute: adb shell am start -n com.google.android.gsf.login/',
      '6. Force soft reboot: adb reboot.'
    ]
  },
  {
    id: 'samsung-edl-frp',
    name: 'Samsung Qualcomm EDL 9008 Partition Reset',
    targetChipsets: ['qualcomm'],
    supportedAndroid: 'Android 10 - 15 (All Security Patches)',
    modeRequired: 'EDL_9008',
    successRate: 99,
    riskLevel: 'SAFE',
    description: 'Bypasses Knox and Google FRP by formatting persistent FRP and config partitions directly via Firehose raw storage commands without triggering Knox bit 0x1.',
    protocolSteps: [
      '1. Connect device in EDL mode (Testpoint short to GND or EDL cable).',
      '2. Send Sahara Hello Handshake and load matching prog_firehose_ddr.elf.',
      '3. Read Partition Table (GPT) to verify persistent/frp sector offsets.',
      '4. Execute Firehose XML command: <erase label="persistent" /> and <erase label="frp" />.',
      '5. Execute Firehose XML command: <erase label="misc" />.',
      '6. Send Sahara Reset command: <power value="reset" />.'
    ]
  },
  {
    id: 'mtk-brom-bypass-frp',
    name: 'MediaTek BROM SLA/DA Auth Bypass & FRP Wipe',
    targetChipsets: ['mediatek'],
    supportedAndroid: 'Android 8 - 15 (All Security Patches)',
    modeRequired: 'MTK_BROM',
    successRate: 100,
    riskLevel: 'SAFE',
    description: 'Exploits bootrom USB stack to bypass SLA (Serial Link Auth) and DAA verification, initializes DRAM with custom DA, and directly zeros out the FRP partition address.',
    protocolSteps: [
      '1. Power off device, hold Vol- or Vol+ and insert USB cable into BROM port.',
      '2. Send handshake sequence 0xA0 0x0A 0x50 0x05, receive ACK 0x5F.',
      '3. Send SLA bypass payload to disable crypto verification engine.',
      '4. Load MTK Download Agent (DA_PL.bin) at DRAM offset 0x40000000.',
      '5. Locate FRP partition start address and length from Scatter file.',
      '6. Write 0x00 fill bytes across FRP partition (size ~1MB-2MB).',
      '7. Send Disconnect and reboot command.'
    ]
  },
  {
    id: 'xiaomi-mi-account-edl',
    name: 'Xiaomi Mi Account & Fastboot Micloud Disable',
    targetChipsets: ['qualcomm', 'mediatek'],
    supportedAndroid: 'HyperOS 1.0 / MIUI 12 - 14',
    modeRequired: 'EDL_9008',
    successRate: 96,
    riskLevel: 'MODERATE',
    description: 'Wipes Find Device tokens in persist partition, patches mi account daemon in vendor framework, and disables OTA anti-relock server check.',
    protocolSteps: [
      '1. Place phone in EDL 9008 or BROM mode.',
      '2. Dump original persist.img as safety backup.',
      '3. Format persist partition and write patched persist_clean.img.',
      '4. Wipe devinfo and frp blocks.',
      '5. Inject DNS blocker and block account.xiaomi.com / find.mi.com.',
      '6. Reboot device to system.'
    ]
  },
  {
    id: 'unisoc-spd-diag-frp',
    name: 'UNISOC / SPD Diag Mode One-Click FRP Reset',
    targetChipsets: ['unisoc_spd'],
    supportedAndroid: 'Android 10 - 14 (Tecno / Infinix / Realme)',
    modeRequired: 'SPD_DIAG',
    successRate: 97,
    riskLevel: 'SAFE',
    description: 'Communicates over SPRD Diag U2S protocol on COM port, sends Diag security unlock token, and clears the FRP flag in miscdata partition.',
    protocolSteps: [
      '1. Boot device into Factory / Diag mode (Hold Vol- + Power, select Diag).',
      '2. Open COM port at 115200 baud.',
      '3. Send SPRD HDLC Frame: 7E 00 00 00 00 00 00 00 00 7E (Connect).',
      '4. Send Diag Read/Write Miscdata Command (0x67).',
      '5. Clear FRP byte flag at offset 0x00000180 in miscdata.',
      '6. Send SPRD Reboot frame (0x7E 0x0D ... 0x7E).'
    ]
  },
  {
    id: 'huawei-com1-id-bypass',
    name: 'Huawei HiSilicon Testpoint COM 1.0 Factory Restore',
    targetChipsets: ['hisilicon_kirin'],
    supportedAndroid: 'HarmonyOS 2 / 3 / 4 & EMUI 10 - 13',
    modeRequired: 'HUAWEI_COM1',
    successRate: 95,
    riskLevel: 'MODERATE',
    description: 'Shorts testpoint to ground, accesses USB COM 1.0 bootstrap, loads Kirin xloader and fastboot stub, then executes factory oem erase-frp command.',
    protocolSteps: [
      '1. Connect motherboard Testpoint to Ground and insert USB cable.',
      '2. Detect port "HUAWEI USB COM 1.0" (VID 12D1, PID 3609).',
      '3. Upload Kirin Bootloader stub (xloader.bin + uce.bin + fastboot.bin).',
      '4. Switch device state to temporary Factory Fastboot.',
      '5. Execute OEM Command: fastboot oem erase-frp and fastboot oem erase-huawei-id.',
      '6. Disconnect testpoint and reboot.'
    ]
  }
];
