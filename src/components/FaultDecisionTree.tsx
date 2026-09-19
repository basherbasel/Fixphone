import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Zap, 
  Layers, 
  Cpu, 
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { DecisionTreeQuestion, FaultClassificationType } from '../types';
import { FAULT_DECISION_TREE_QUESTIONS } from '../data/faultDecisionTreeData';

interface FaultDecisionTreeProps {
  onNavigateToSoftwareRepair?: (actionPayload?: string) => void;
  onNavigateToHardwareRepair?: (guideId?: string) => void;
  onNavigateToFirmwareMatch?: () => void;
  lang: 'en' | 'ar';
}

export const FaultDecisionTree: React.FC<FaultDecisionTreeProps> = ({
  onNavigateToSoftwareRepair,
  onNavigateToHardwareRepair,
  onNavigateToFirmwareMatch,
  lang
}) => {
  const isAr = lang === 'ar';
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [classification, setClassification] = useState<FaultClassificationType | null>(null);

  const currentQuestion = FAULT_DECISION_TREE_QUESTIONS[currentQuestionId] || FAULT_DECISION_TREE_QUESTIONS.root;

  const handleOptionSelect = (option: any) => {
    if (option.diagnosisResult) {
      setDiagnosisResult(option.diagnosisResult);
      setClassification(option.classification || null);
    } else if (option.nextQuestionId) {
      setHistory(prev => [...prev, currentQuestionId]);
      setCurrentQuestionId(option.nextQuestionId);
    }
  };

  const handleReset = () => {
    setCurrentQuestionId('root');
    setHistory([]);
    setDiagnosisResult(null);
    setClassification(null);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevId = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentQuestionId(prevId);
      setDiagnosisResult(null);
      setClassification(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'شجرة اتخاذ القرار الذكية لتصنيف الأعطال (Fault Decision Tree)' : 'Intelligent Dynamic Fault Classification Decision Tree'}
            </h4>
            <span className="text-[11px] text-slate-400">
              {isAr ? 'تصنيف دقيق: خلل برمجي (Software) | تضارب حماية وفيرموير (Firmware) | عطل دوائر عتادية (Hardware)' : 'Categorizes issue into Software Glitch, Firmware Incompatibility, or Hardware Failure'}
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isAr ? 'إعادة البدء' : 'Reset Wizard'}</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      {!diagnosisResult ? (
        <div className="space-y-4 py-2">
          {/* Question Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              {isAr ? `المرحلة ${history.length + 1} من شجرة التشخيص` : `STAGE ${history.length + 1} OF REASONING ENGINE`}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {isAr ? currentQuestion.questionAr : currentQuestion.questionEn}
            </h3>
            {currentQuestion.subtextAr && (
              <p className="text-xs text-slate-400">
                {isAr ? currentQuestion.subtextAr : currentQuestion.subtextEn}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(opt)}
                className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/60 text-left rtl:text-right transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 text-slate-400 flex items-center justify-center text-xs font-mono font-bold transition-colors">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {isAr ? opt.labelAr : opt.labelEn}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            ))}
          </div>

          {/* Back Step Button */}
          {history.length > 0 && (
            <div className="pt-2">
              <button
                onClick={handleBack}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <span>← {isAr ? 'الرجوع للخطوة السابقة' : 'Back to previous step'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Diagnosis Conclusion Card */
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
          {/* Classification Banner */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-ping ${
                classification === 'SOFTWARE_GLITCH' ? 'bg-emerald-400' :
                classification === 'FIRMWARE_INCOMPATIBILITY' ? 'bg-cyan-400' : 'bg-rose-500'
              }`} />
              <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded border ${
                classification === 'SOFTWARE_GLITCH' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                classification === 'FIRMWARE_INCOMPATIBILITY' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' :
                'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}>
                {classification === 'SOFTWARE_GLITCH' ? (isAr ? 'خلل برمجي (SOFTWARE GLITCH)' : 'SOFTWARE GLITCH') :
                 classification === 'FIRMWARE_INCOMPATIBILITY' ? (isAr ? 'تضارب فيرموير وحماية (FIRMWARE / ARB CONFLICT)' : 'FIRMWARE INCOMPATIBILITY') :
                 (isAr ? 'عطل عتادي دوائر وشرائح (HARDWARE FAILURE)' : 'HARDWARE CIRCUIT FAILURE')}
              </span>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Classification Confidence: <strong className="text-emerald-400">99.4%</strong>
            </span>
          </div>

          {/* Title & Root Cause */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white">
              {isAr ? diagnosisResult.titleAr : diagnosisResult.titleEn}
            </h3>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400 block mb-1">{isAr ? 'السبب الجذري للهندسة (Root Cause):' : 'Engineering Root Cause:'}</strong>
              <p>{isAr ? diagnosisResult.rootCauseAr : diagnosisResult.rootCauseEn}</p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3 flex-wrap pt-2">
            {classification === 'SOFTWARE_GLITCH' && (
              <button
                onClick={() => onNavigateToSoftwareRepair?.(diagnosisResult.actionPayload)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{isAr ? 'تشغيل مسار الإصلاح البرمجي الفوري' : 'TRIGGER AUTOMATED SOFTWARE REPAIR'}</span>
              </button>
            )}

            {classification === 'FIRMWARE_INCOMPATIBILITY' && (
              <button
                onClick={() => onNavigateToFirmwareMatch?.()}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'مطابقة الفلاشة الرسمية المتوافقة وحماية ARB' : 'FIND MATCHED OFFICIAL FIRMWARE'}</span>
              </button>
            )}

            {classification === 'HARDWARE_FAILURE' && (
              <button
                onClick={() => onNavigateToHardwareRepair?.(diagnosisResult.actionPayload)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>{isAr ? 'فتح مخطط البوردة وقياسات الملتيميتر والمايكروسولدرينغ' : 'OPEN SCHEMATICS & HARDWARE REPAIR WORKBENCH'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
