import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  Wrench, 
  FileText, 
  HardDrive, 
  Cpu, 
  Layers, 
  Terminal,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ConnectedDevice } from '../types';
import { FaultDecisionTree } from './FaultDecisionTree';
import { HARDWARE_REPAIR_GUIDES } from '../data/hardwareRepairGuides';

const detectHardwareGuideId = (text: string): string => {
  const lower = (text || '').toLowerCase();
  if (lower.includes('charg') || lower.includes('vbus') || lower.includes('type-c') || lower.includes('battery')) {
    return 'charging-vbus-failure';
  }
  if (lower.includes('display') || lower.includes('lcd') || lower.includes('amoled') || lower.includes('backlight') || lower.includes('screen')) {
    return 'display-backlight-oled';
  }
  if (lower.includes('baseband') || lower.includes('ril') || lower.includes('sim') || lower.includes('modem') || lower.includes('imei') || lower.includes('nvram')) {
    return 'baseband-rf-transceiver';
  }
  return 'power-pmic-buck-rail-failure';
};

const HardwarePcbLinkCard: React.FC<{
  guideId: string;
  onNavigateToHardwareRepair?: (guideId: string) => void;
  lang: 'en' | 'ar';
}> = ({ guideId, onNavigateToHardwareRepair, lang }) => {
  const isAr = lang === 'ar';
  const guide = HARDWARE_REPAIR_GUIDES.find(g => g.id === guideId) || HARDWARE_REPAIR_GUIDES[0];

  return (
    <div className="p-3.5 bg-gradient-to-r from-indigo-950/90 via-slate-950 to-slate-900 border border-indigo-500/50 rounded-xl space-y-3 shadow-xl">
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            {isAr ? 'خريطة الـ PCB والخطوات التوجيهية للإصلاح الفيزيائي (Auto-Linked PCB Hardware Guide)' : 'Auto-Linked Hardware PCB & Micro-Soldering Guide'}
          </h5>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          HARDWARE DIAGNOSIS LINKED
        </span>
      </div>

      <div className="space-y-1">
        <h6 className="text-xs font-bold text-white">
          {isAr ? guide.titleAr : guide.titleEn}
        </h6>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          {isAr ? guide.symptomAr : guide.symptomEn}
        </p>
      </div>

      {/* Target Chips & Testpads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">{isAr ? 'الآيسيهات المسببة للعطل:' : 'Affected Board Chips:'}</span>
          <span className="text-cyan-300 font-bold">{guide.affectedComponents.join(', ')}</span>
        </div>
        <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 block mb-0.5">{isAr ? 'حرارة الهوت أير الموصى بها:' : 'Recommended Hot-Air Temp:'}</span>
          <span className="text-amber-300 font-bold">{guide.microSolderingSteps[0]?.hotAirTemp || '350°C - 365°C'}</span>
        </div>
      </div>

      {/* Test points preview */}
      {guide.testPoints?.length > 0 && (
        <div className="p-2 rounded bg-black/80 border border-slate-800 space-y-1 font-mono text-[10px]">
          <span className="text-slate-400 font-bold block">{isAr ? 'نقاط فحص الملتيميتر المباشرة (DMM Testpads):' : 'Key Multimeter Test Points:'}</span>
          {guide.testPoints.slice(0, 2).map((tp, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-300 border-b border-slate-800/60 pb-1 last:border-0 last:pb-0">
              <span className="text-cyan-400 font-bold">{tp.name}</span>
              <span className="text-emerald-400 font-bold">Diode: {tp.diodeModeHealthy}</span>
              <span className="text-slate-400">{tp.voltageWorking}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation button */}
      <button
        onClick={() => onNavigateToHardwareRepair?.(guide.id)}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
      >
        <Wrench className="w-4 h-4" />
        <span>
          {isAr
            ? `فتح خريطة الـ PCB والمايكروسولدرينغ التفاعلية لـ (${guide.affectedComponents[0] || 'Hardware'})`
            : `OPEN INTERACTIVE PCB BITMAP & DMM WORKBENCH (${guide.affectedComponents[0] || 'Hardware'})`}
        </span>
        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </div>
  );
};

interface AiDiagnosticEngineProps {
  device: ConnectedDevice;
  onApplyFix: (fixCommand: string) => void;
  onNavigateToHardwareRepair?: (guideId?: string) => void;
  onNavigateToFirmwareMatch?: () => void;
  isBusy: boolean;
  lang: 'en' | 'ar';
}

const SAMPLE_LOGS = {
  kernel_panic: `[   14.281902] c1   1042 Unable to handle kernel NULL pointer dereference at virtual address 0000000000000048
[   14.281920] c1   1042 Mem abort info:
[   14.281925] c1   1042   ESR = 0x96000005
[   14.281931] c1   1042   EC = 0x25: DABT (current EL), IL = 32 bits
[   14.281936] c1   1042   SET = 0, FnV = 0
[   14.281941] c1   1042   EA = 0, S1PTW = 0
[   14.281946] c1   1042   FSC = 0x05: level 1 translation fault
[   14.281951] c1   1042 Data abort info:
[   14.281956] c1   1042   ISV = 0, ISS = 0x00000005
[   14.281961] c1   1042   CM = 0, WnR = 0
[   14.281969] c1   1042 Internal error: Oops: 96000005 [#1] PREEMPT SMP
[   14.281977] c1   1042 Modules linked in: qcom_q6v5_pas qcom_q6v5 qcom_common smd_rpm msm_drm
[   14.282045] c1   1042 CPU: 1 PID: 1042 Comm: system_server Tainted: G        W  O      5.15.123-android14-9-g8a9 #1
[   14.282052] c1   1042 Hardware name: Qualcomm Technologies, Inc. SM8650 (DT)
[   14.282058] c1   1042 pstate: 60400005 (nZCv daif +PAN -UAO -TCO -DIT -SSBS BTYPE=--)
[   14.282067] c1   1042 pc : q6v5_wcss_start+0x88/0x1a4 [qcom_q6v5]
[   14.282078] c1   1042 lr : qcom_subdev_start+0x4c/0x90
[   14.282210] c1   1042 Kernel panic - not syncing: Fatal exception in interrupt`,
  
  dm_verity: `[    2.109281] init: [libfs_avb] [AVB Failed]: Error verifying vbmeta digest (hash mismatch).
[    2.109310] init: [libfs_avb] super partition hash tree root 9a4f8b2c does not match vbmeta struct.
[    2.109335] init: Failed to verify partition 'system' with error -2.
[    2.109350] init: Entering recovery mode: RED STATE (Your device has failed verification and may not work properly).
[    2.109380] init: Halting system boot. Bootloader lock state: LOCKED. Rollback index: 2`,

  baseband_null: `09-19 15:21:04.120   890  1204 E RILC    : RIL_onRequestComplete: [0012] < GET_SIM_STATUS failed with E_RADIO_NOT_AVAILABLE
09-19 15:21:04.122   890  1204 E QMI_RIL : qmi_err=0x000e (QMI_ERR_DEVICE_NOT_READY)
09-19 15:21:04.125   890  1204 E QC-QMI  : [qmi_client] open failed: /dev/subsys_modem not responding
09-19 15:21:04.130  1042  1042 E TelephonyRegistry: notifyRadioPowerStateChanged: RADIO_POWER_UNAVAILABLE
09-19 15:21:04.135  1042  1042 W PhoneGlobals: Baseband version query returned NULL or UNKNOWN.
09-19 15:21:04.140  1042  1042 E ImeiProvider: read_nv_item(NV_UE_IMEI_I) failed: NV_NOT_ALLOCATED (EFS corrupted)`
};

export const AiDiagnosticEngine: React.FC<AiDiagnosticEngineProps> = ({
  device,
  onApplyFix,
  onNavigateToHardwareRepair,
  onNavigateToFirmwareMatch,
  isBusy,
  lang
}) => {
  const isAr = lang === 'ar';
  const [activeSubTab, setActiveSubTab] = useState<'COPILOT' | 'DECISION_TREE' | 'LOG_ANALYZER'>('COPILOT');
  const [logText, setLogText] = useState(SAMPLE_LOGS.kernel_panic);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // MasterFix Copilot Query State
  const [copilotQuery, setCopilotQuery] = useState(
    isAr 
      ? `[Samsung Galaxy S24 Ultra SM-S928B] + [العرض: الهاتف لا يشحن نهائياً وميت] + [سحب التيار على الباور سبلاي 0.00A ثابت]`
      : `[Samsung Galaxy S24 Ultra SM-S928B] + [Symptom: Dead phone, no charge] + [Current draw: 0.00A on DC Power Supply]`
  );
  const [copilotDomain, setCopilotDomain] = useState<'HARDWARE' | 'SOFTWARE' | 'NETWORK' | 'ANTI_BRICK'>('HARDWARE');
  const [isCopilotConsulting, setIsCopilotConsulting] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState<any>(null);

  const handleCopilotConsult = async () => {
    if (!copilotQuery.trim()) return;
    setIsCopilotConsulting(true);
    setCopilotResponse(null);

    try {
      const response = await fetch('/api/ai/copilot-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: copilotQuery,
          deviceContext: device,
          domainType: copilotDomain,
          lang
        })
      });

      const data = await response.json();
      if (data.success && data.result) {
        setCopilotResponse(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCopilotConsulting(false);
    }
  };

  const handleDiagnose = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logContent: logText,
          deviceContext: device,
          logType: 'Kernel Panic / Logcat',
          lang
        })
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Subtab navigation */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2 rounded-xl flex-wrap gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setActiveSubTab('COPILOT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'COPILOT'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isAr ? 'المساعد الذكي للصيانة الشاملة (MasterFix Copilot)' : 'MasterFix AI Field Copilot'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('DECISION_TREE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'DECISION_TREE'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'شجرة اتخاذ القرار (Decision Tree)' : 'Fault Decision Tree'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('LOG_ANALYZER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'LOG_ANALYZER'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isAr ? 'تحليل سجلات Logcat و Kernel Panic' : 'Logcat / Kernel Panic Parser'}</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold">
          MASTERFIX PRO v4.8
        </span>
      </div>

      {activeSubTab === 'COPILOT' ? (
        <div className="space-y-4">
          {/* Prompt Templates and Guidelines Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? 'استشارة خبير الصيانة الشامل MasterFix AI' : 'MasterFix AI Field Diagnostic Copilot'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'أدخل تفاصيل العطل بصيغة الاستعلام الموصى بها للحصول على تشخيص فوري ودقيق في الميدان' : 'Query format: [Brand & Model] + [Symptom] + [DC Power draw or Error Code]'}
                  </p>
                </div>
              </div>

              {/* Domain Switcher */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
                {[
                  { id: 'HARDWARE', labelAr: 'هاردوير', labelEn: 'Hardware' },
                  { id: 'SOFTWARE', labelAr: 'سوفتوير', labelEn: 'Software' },
                  { id: 'NETWORK', labelAr: 'شبكة', labelEn: 'Network' },
                  { id: 'ANTI_BRICK', labelAr: 'حماية', labelEn: 'Safety' },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setCopilotDomain(d.id as any)}
                    className={`px-2 py-1 rounded transition-colors ${
                      copilotDomain === d.id ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isAr ? d.labelAr : d.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Template Fillers */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-500 text-[11px]">{isAr ? 'قوالب سريعة:' : 'Quick Presets:'}</span>
              <button
                onClick={() => {
                  setCopilotDomain('HARDWARE');
                  setCopilotQuery(isAr 
                    ? `[Samsung Galaxy S24 Ultra SM-S928B] + [العرض: الهاتف لا يشحن ويسخن منفذ الشحن] + [سحب التيار على الباور سبلاي 0.05A ثابت]`
                    : `[Samsung Galaxy S24 Ultra SM-S928B] + [Symptom: No charging, port heating] + [DC power supply draw 0.05A stuck]`);
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-[11px] text-cyan-300 font-mono"
              >
                🔌 {isAr ? 'عطل شحن وسحب 0.05A' : 'Charging fault 0.05A draw'}
              </button>
              <button
                onClick={() => {
                  setCopilotDomain('SOFTWARE');
                  setCopilotQuery(isAr 
                    ? `[Samsung Galaxy A54 5G SM-A546B] + [العرض: معلق على الشعار بعد محاولة تحديث الفيرموير] + [رسالة خطأ: dm-verity corruption / Red State]`
                    : `[Samsung Galaxy A54 5G SM-A546B] + [Symptom: Bootloop on logo after OTA] + [Error: dm-verity corruption / Red State]`);
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-[11px] text-amber-300 font-mono"
              >
                ⚠️ {isAr ? 'بوتلوب وحماية dm-verity' : 'Bootloop dm-verity error'}
              </button>
              <button
                onClick={() => {
                  setCopilotDomain('NETWORK');
                  setCopilotQuery(isAr 
                    ? `[Xiaomi Redmi Note 13 Pro+ 2312DRA50G] + [العرض: السيريال سليم لكن تظهر طوارئ فقط No Service] + [فحص خطوط تغذية WTR/SDR 1.0V]`
                    : `[Xiaomi Redmi Note 13 Pro+ 2312DRA50G] + [Symptom: Valid IMEI but Emergency Calls Only] + [RF Transceiver 1.0V rail inquiry]`);
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-md text-[11px] text-purple-300 font-mono"
              >
                📶 {isAr ? 'فقدان شبكة وطوارئ فقط' : 'Emergency Calls Only / RF'}
              </button>
            </div>

            {/* Technician Field Query Input */}
            <div className="space-y-2">
              <textarea
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 text-slate-100 text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 font-mono resize-none leading-relaxed"
                placeholder={isAr 
                  ? '[اسم الجهاز والنوع] + [العرض: مثلاً لا يشحن أو معلق] + [سحب التيار على الباور سبلاي أو كود الخطأ]'
                  : '[Device Model] + [Symptom] + [DC Current Draw or Error Code]'}
              />

              <button
                onClick={handleCopilotConsult}
                disabled={isCopilotConsulting || !copilotQuery.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isCopilotConsulting
                    ? (isAr ? 'جاري تحليل العطل واستخراج خطة القياس...' : 'MASTERFIX AI ANALYZING FAULT CONTEXT...')
                    : (isAr ? 'طلب التشخيص وتقرير القياسات من MasterFix AI' : 'CONSULT MASTERFIX AI EXPERT')}
                </span>
              </button>
            </div>
          </div>

          {/* MasterFix AI Structured Response Card */}
          {copilotResponse && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {isAr ? 'تقرير التشخيص الهندسي المعتمد (MasterFix Diagnostic Report)' : 'MasterFix Verified Engineering Diagnostic Output'}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                    DOMAIN: {copilotResponse.category || copilotDomain}
                  </span>
                </div>
              </div>

              {/* 4 Required Response Blocks */}
              <div className="space-y-3">
                {/* 1. Problem Diagnosis & Root Cause */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <h5 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <span>{copilotResponse.problemDiagnosis?.split('\n')[0] || '1. 🔍 Problem Diagnosis & Root Cause'}</span>
                  </h5>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {copilotResponse.problemDiagnosis?.includes(':') 
                      ? copilotResponse.problemDiagnosis.split(':').slice(1).join(':').trim() 
                      : copilotResponse.problemDiagnosis}
                  </p>
                </div>

                {/* 2. Required Tools & Measurements */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>{copilotResponse.requiredTools?.split('\n')[0] || '2. 🛠️ Required Tools & Measurements'}</span>
                  </h5>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono">
                    {copilotResponse.requiredTools?.includes(':') 
                      ? copilotResponse.requiredTools.split(':').slice(1).join(':').trim() 
                      : copilotResponse.requiredTools}
                  </p>
                </div>

                {/* 3. Step-by-Step Action Plan */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>3. 📋 {isAr ? 'خطة العمل والإصلاح المتسلسلة (Step-by-Step Action Plan)' : 'Step-by-Step Action Plan'}</span>
                  </h5>
                  <div className="space-y-1.5">
                    {Array.isArray(copilotResponse.actionPlan) ? (
                      copilotResponse.actionPlan.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-200 leading-relaxed">{copilotResponse.actionPlan}</p>
                    )}
                  </div>
                </div>

                {/* 4. Safety & Prevention Warnings */}
                <div className="p-3.5 bg-rose-950/20 rounded-xl border border-rose-900/40 space-y-1.5">
                  <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <span>{copilotResponse.safetyWarnings?.split('\n')[0] || '4. ⚠️ Safety & Prevention Warnings'}</span>
                  </h5>
                  <p className="text-xs text-rose-200 leading-relaxed">
                    {copilotResponse.safetyWarnings?.includes(':') 
                      ? copilotResponse.safetyWarnings.split(':').slice(1).join(':').trim() 
                      : copilotResponse.safetyWarnings}
                  </p>
                </div>

                {/* Hardware PCB Map Auto-Linked Card */}
                {copilotDomain === 'HARDWARE' && (
                  <HardwarePcbLinkCard
                    guideId={detectHardwareGuideId(`${copilotResponse.problemDiagnosis} ${copilotResponse.category}`)}
                    onNavigateToHardwareRepair={onNavigateToHardwareRepair}
                    lang={lang}
                  />
                )}
              </div>

              {/* Dynamic Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                {copilotDomain === 'HARDWARE' && (
                  <button
                    onClick={() => onNavigateToHardwareRepair?.()}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>{isAr ? 'فتح مخططات البوردة والملتيميتر والمايكروسولدرينغ' : 'OPEN HARDWARE SCHEMATICS & DMM WORKBENCH'}</span>
                  </button>
                )}

                {copilotDomain === 'SOFTWARE' && (
                  <button
                    onClick={() => onNavigateToFirmwareMatch?.()}
                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isAr ? 'فحص ومطابقة الفلاشة الرسمية وحماية ARB' : 'MATCH VERIFIED STOCK FIRMWARE'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : activeSubTab === 'DECISION_TREE' ? (
        <FaultDecisionTree
          onNavigateToSoftwareRepair={(cmd) => {
            if (cmd) onApplyFix(cmd);
          }}
          onNavigateToHardwareRepair={onNavigateToHardwareRepair}
          onNavigateToFirmwareMatch={onNavigateToFirmwareMatch}
          lang={lang}
        />
      ) : (
        <>
      {/* Top Storage & Memory Health Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Storage Wear */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">STORAGE LIFETIME HEALTH</span>
              <span className="text-xs font-bold text-white">{device.storageType} (98% Life Remaining)</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            HEALTHY
          </span>
        </div>

        {/* dm-verity State */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">AVB 2.0 / DM-VERITY</span>
              <span className="text-xs font-bold text-white">vbmeta Hash Integrity</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
            ENFORCING
          </span>
        </div>

        {/* Baseband Modem Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-mono">RIL MODEM SUBSYSTEM</span>
              <span className="text-xs font-bold text-white">{device.basebandVersion || 'Online (Dual SIM)'}</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Col: Raw Log Input & Sample Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'مدخل سجلات Logcat / Kernel Panic' : 'Raw Logcat / Kernel Backtrace Input'}</span>
            </h4>

            {/* Sample Log Loaders */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500 hidden sm:inline">Samples:</span>
              <button
                onClick={() => setLogText(SAMPLE_LOGS.kernel_panic)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
              >
                Kernel Panic
              </button>
              <button
                onClick={() => setLogText(SAMPLE_LOGS.dm_verity)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
              >
                dm-verity
              </button>
              <button
                onClick={() => setLogText(SAMPLE_LOGS.baseband_null)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
              >
                Null Baseband
              </button>
            </div>
          </div>

          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            rows={12}
            className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-cyan-500 resize-none"
            placeholder="Paste ADB logcat, recovery.log, or Linux kernel panic backtrace here..."
          />

          <button
            onClick={handleDiagnose}
            disabled={isAnalyzing || !logText.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isAnalyzing
                ? (isAr ? 'جاري التحليل بالذكاء الاصطناعي...' : 'AI REVERSE-ENGINEERING IN PROGRESS...')
                : (isAr ? 'بدء فحص وتشخيص العطل بالذكاء الاصطناعي' : 'START AI ROOT-CAUSE DIAGNOSIS')}
            </span>
          </button>
        </div>

        {/* Right Col: AI Diagnostics Result & Interactive Fix Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>{isAr ? 'تقرير التشخيص الهندسي وخطة الإصلاح' : 'AI Diagnostic Report & Fix Plan'}</span>
              </h4>

              {analysisResult?.severity && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  analysisResult.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  analysisResult.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                }`}>
                  {analysisResult.severity} SEVERITY
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="space-y-3 text-xs">
                {/* Summary */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">Executive Summary:</span>
                  <p className="text-slate-200 leading-relaxed">{analysisResult.summary}</p>
                </div>

                {/* Root Cause & Culprit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-mono">CULPRIT SUBSYSTEM</span>
                    <span className="text-cyan-400 font-bold font-mono text-xs">{analysisResult.culpritModule}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-mono">RISK ASSESSMENT</span>
                    <span className="text-amber-300 font-medium text-xs">{analysisResult.riskAssessment}</span>
                  </div>
                </div>

                {/* Recommended Steps */}
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold block">Recommended Engineering Fix Steps:</span>
                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {analysisResult.recommendedSteps?.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300">
                        <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fastboot / ADB commands */}
                {analysisResult.exactFastbootOrAdbCommands?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block">Executable CLI Fix Script:</span>
                    <div className="p-2 bg-black font-mono text-[11px] text-emerald-400 rounded-lg border border-slate-800 space-y-1">
                      {analysisResult.exactFastbootOrAdbCommands.map((cmd: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span>$ {cmd}</span>
                          <button
                            onClick={() => onApplyFix(cmd)}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-900/60 text-slate-300 text-[10px] transition-colors"
                          >
                            Execute
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-Linked PCB Map & Hardware Repair Guide Card */}
                {(analysisResult.issueType === 'Hardware Failure' || 
                  analysisResult.summary?.toLowerCase().includes('hardware') ||
                  analysisResult.culpritModule?.toLowerCase().includes('hardware') ||
                  analysisResult.culpritModule?.toLowerCase().includes('pmic') ||
                  analysisResult.culpritModule?.toLowerCase().includes('power') ||
                  analysisResult.culpritModule?.toLowerCase().includes('baseband') ||
                  analysisResult.culpritModule?.toLowerCase().includes('display') ||
                  analysisResult.culpritModule?.toLowerCase().includes('charging') ||
                  analysisResult.summary?.toLowerCase().includes('panic')) && (
                  <HardwarePcbLinkCard
                    guideId={detectHardwareGuideId(`${analysisResult.summary} ${analysisResult.culpritModule}`)}
                    onNavigateToHardwareRepair={onNavigateToHardwareRepair}
                    lang={lang}
                  />
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-xs">
                  {isAr 
                    ? 'اضغط على زر الفحص لتشغيل النموذج وتحليل سبب العطل بدقة'
                    : 'Paste a log or pick a sample above and click diagnose to extract root-cause.'}
                </p>
              </div>
            )}
          </div>

          {analysisResult && (
            <button
              onClick={() => onApplyFix(analysisResult.exactFastbootOrAdbCommands?.[0] || 'fastboot reboot')}
              disabled={isBusy}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Wrench className="w-4 h-4" />
              <span>{isAr ? 'تطبيق خطة الإصلاح المقترحة بنقرة واحدة' : 'ONE-CLICK EXECUTE REPAIR PIPELINE'}</span>
            </button>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
};
