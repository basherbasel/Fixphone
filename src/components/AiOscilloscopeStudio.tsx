import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Zap, 
  Cpu, 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart2, 
  Maximize2, 
  Settings,
  Volume2,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { ConnectedDevice } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface SignalPreset {
  id: string;
  nameAr: string;
  nameEn: string;
  frequency: string;
  voltagePeak: string;
  protocol: string;
  color: string;
  status: 'HEALTHY' | 'DEGRADED' | 'SHORT';
  aiReportAr: string;
  aiReportEn: string;
  generatorFunc: (t: number, noise: number) => number;
}

interface AiOscilloscopeStudioProps {
  device: ConnectedDevice;
  lang: 'en' | 'ar';
}

export const AiOscilloscopeStudio: React.FC<AiOscilloscopeStudioProps> = ({
  device,
  lang
}) => {
  const isAr = lang === 'ar';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeSignalId, setActiveSignalId] = useState<string>('i2c-bus');
  const [timebase, setTimebase] = useState<number>(1); // Scale multiplier
  const [voltsPerDiv, setVoltsPerDiv] = useState<number>(1);
  const [noiseLevel, setNoiseLevel] = useState<number>(0.05);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [triggerMode, setTriggerMode] = useState<'AUTO' | 'SINGLE' | 'NORM'>('AUTO');
  const [measuredFreq, setMeasuredFreq] = useState<number>(400); // kHz
  const [measuredVpp, setMeasuredVpp] = useState<number>(1.8); // V

  const presets: SignalPreset[] = [
    {
      id: 'i2c-bus',
      nameAr: 'مسار بيانات I2C (SDA/SCL - PMIC Communication Bus)',
      nameEn: 'I2C Data Bus (SDA/SCL - PMIC Bus)',
      frequency: '400 kHz (Fast Mode)',
      voltagePeak: '1.8V p-p',
      protocol: 'I2C / SPMI',
      color: '#38bdf8', // Cyan
      status: 'HEALTHY',
      aiReportAr: '✓ إشارة I2C سليمة بجهد 1.8V ثابت مع حواف صعود وهبوط حادة (Sharpe Rise/Fall times). اتصالات معالج التغذية PMIC خالية من الضوضاء.',
      aiReportEn: '✓ Healthy 1.8V I2C waveform with sharp rise/fall edges. PMIC serial communication bus is clear and responsive.',
      generatorFunc: (t, noise) => {
        // Square wave with I2C start/stop condition pulses
        const pulse = Math.sin(t * 12) > 0 ? 1.8 : 0;
        return pulse + (Math.random() - 0.5) * noise;
      }
    },
    {
      id: 'mipi-dsi',
      nameAr: 'مسار شاشة MIPI DSI High-Speed Differential Lane',
      nameEn: 'MIPI DSI High-Speed Display Lane',
      frequency: '1.2 GHz Data Rate',
      voltagePeak: '1.2V p-p',
      protocol: 'MIPI DSI-2',
      color: '#a855f7', // Purple
      status: 'HEALTHY',
      aiReportAr: '✓ نمط العين (Eye Diagram) والتذبذب التفاضلي لمسارات الشاشة AMOLED سليم. لا توجد انقطاعات في كابل الفلاتة أو المقاومات الحرارية.',
      aiReportEn: '✓ Open Eye Diagram and clean differential signaling on AMOLED screen interface. No trace fractures detected.',
      generatorFunc: (t, noise) => {
        // Differential high-speed packet burst
        const burst = Math.sin(t * 40) * Math.cos(t * 3) * 0.9 + 0.6;
        return burst + (Math.random() - 0.5) * noise;
      }
    },
    {
      id: 'buck-sw',
      nameAr: 'تذبذب ملف الباور VDD_CPU Buck Switching Pulse',
      nameEn: 'VDD_CPU Buck Regulator SW Waveform',
      frequency: '2.4 MHz PWM',
      voltagePeak: '3.8V Peak',
      protocol: 'PWM Buck',
      color: '#f59e0b', // Amber
      status: 'HEALTHY',
      aiReportAr: '✓ نبضات التقطيع ملف السويتشينغ للـ PMIC تعمل بنظام PWM بجهد 3.8V ومغناطيسية مستقرة مع الحد الأدنى من الريبل (Low Ripple).',
      aiReportEn: '✓ Switching regulator coil shows clean PWM pulses at 2.4MHz with negligible voltage ripple under load.',
      generatorFunc: (t, noise) => {
        // Sawtooth / PWM pulse with ringing
        const saw = (t % 1) * 3.5;
        const ring = Math.sin(t * 30) * Math.exp(-(t % 1) * 3) * 0.4;
        return saw + ring + (Math.random() - 0.5) * noise;
      }
    },
    {
      id: 'xtal-clock',
      nameAr: 'تذبذب الكريستالة الرئيسية 38.4MHz System Crystal Oscillator',
      nameEn: '38.4MHz Main System Crystal Oscillator',
      frequency: '38.4000 MHz',
      voltagePeak: '0.8V p-p',
      protocol: 'Sine Clock',
      color: '#10b981', // Emerald
      status: 'HEALTHY',
      aiReportAr: '✓ موجة جيبية نقية Sine Wave عند تردد 38.4MHz. ساعة النظام والمعالج متزامنة بدقة عالية.',
      aiReportEn: '✓ Pure 38.4MHz sinusoidal waveform. Master system clock and CPU phase locked loop (PLL) are synchronized.',
      generatorFunc: (t, noise) => {
        // Pure sine wave
        return Math.sin(t * 20) * 0.8 + 0.9 + (Math.random() - 0.5) * noise;
      }
    },
    {
      id: 'usb-dp-dm',
      nameAr: 'مسار USB D+/D- Eye Diagram (موجة مضطربة / شورت)',
      nameEn: 'USB D+/D- Noisy Eye Diagram (Degraded Line)',
      frequency: '480 Mbps High Speed',
      voltagePeak: '0.4V p-p',
      protocol: 'USB 2.0 PHY',
      color: '#ef4444', // Red
      status: 'DEGRADED',
      aiReportAr: '⚠️ تشوه وخروش في إشارة USB D+ بجهد منخفض 0.2V مع ضوضاء عالية. السبب المحتمل: حماية OVP متضررة أو تسريب في ديودات ESD على مدخل C-Type.',
      aiReportEn: '⚠️ Jitter and attenuation on USB D+ data line (0.2V peak). Root cause: Damaged ESD protection diodes or corroded Type-C connector.',
      generatorFunc: (t, noise) => {
        // Noisy distorted wave
        return Math.sin(t * 15) * 0.3 + (Math.random() - 0.5) * (noise + 0.35) + 0.5;
      }
    }
  ];

  const currentPreset = presets.find(p => p.id === activeSignalId) || presets[0];

  // Canvas Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      if (!isFrozen) {
        time += 0.08 * timebase;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Background grid
      ctx.fillStyle = '#020617'; // Slate 950
      ctx.fillRect(0, 0, width, height);

      // Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)'; // Slate 800

      const numGridX = 12;
      const numGridY = 8;

      for (let i = 0; i <= numGridX; i++) {
        const x = (width / numGridX) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let j = 0; j <= numGridY; j++) {
        const y = (height / numGridY) * j;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Reference Axes
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.9)'; // Slate 700
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Draw Signal Waveform
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = currentPreset.color;
      ctx.shadowColor = currentPreset.color;
      ctx.shadowBlur = 10;

      const centerY = height * 0.65;
      const scaleY = (height / 8) * voltsPerDiv;

      for (let x = 0; x < width; x++) {
        const tVal = time + (x / width) * 10 * timebase;
        const val = currentPreset.generatorFunc(tVal, noiseLevel);
        const y = centerY - val * scaleY;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Trigger line indicator
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)'; // Yellow
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY - 1.8 * scaleY);
      ctx.lineTo(width, centerY - 1.8 * scaleY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSignalId, timebase, voltsPerDiv, noiseLevel, isFrozen, currentPreset]);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-900/40 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isAr ? 'راسم الإشارات والأوسيلوسكوب الذكي (AI Oscilloscope & Signal Logic Analyzer)' : 'AI Oscilloscope & Logic Waveform Analyzer'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                2.5 GSa/s 60FPS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'فحص ترددات ساعات المعالج، بروتوكولات I2C/SPMI، نبضات الشاشة MIPI DSI، ونظافة خطوط الفولت بمرسمة حية عالية الدقة'
                : 'Inspect master CPU clock frequencies, I2C/SPMI buses, MIPI DSI display lanes & power rail ripple with live waveform analysis.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsFrozen(!isFrozen);
              audioSynth.playMultimeterBeep();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isFrozen
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            {isFrozen ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            <span>{isFrozen ? (isAr ? 'تشغيل التلويح' : 'Resume Live') : (isAr ? 'تجميد اللقطة (Freeze)' : 'Freeze Frame')}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Waveform Canvas + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Waveform Screen (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl relative overflow-hidden">
            {/* Screen Top Status Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  CH1: {currentPreset.protocol}
                </span>
                <span>Timebase: {timebase}ms/div</span>
                <span>Volts: {voltsPerDiv}V/div</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-amber-300 font-bold">TRIG: {triggerMode} 1.80V</span>
                <span className="text-cyan-300 font-bold">60.0 FPS</span>
              </div>
            </div>

            {/* Canvas Screen */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
              <canvas
                ref={canvasRef}
                width={700}
                height={360}
                className="w-full h-[320px] sm:h-[360px] block"
              />

              {/* On-screen Measure HUD Overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-2.5 font-mono text-[10px] space-y-1 shadow-xl">
                <div className="text-slate-400 font-bold border-b border-slate-800 pb-1">{isAr ? 'قراءات الإشارة المباشرة:' : 'Real-time Signal Measurements:'}</div>
                <div className="flex items-center gap-4 text-white">
                  <span>Freq: <strong className="text-cyan-400">{currentPreset.frequency}</strong></span>
                  <span>Vpp: <strong className="text-emerald-400">{currentPreset.voltagePeak}</strong></span>
                  <span>Noise: <strong className="text-amber-400">{(noiseLevel * 100).toFixed(0)}%</strong></span>
                </div>
              </div>
            </div>

            {/* Oscilloscope Hardware Control Knobs */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'مقياس الزمن Timebase:' : 'Timebase Scale:'}</span>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setTimebase(prev => Math.max(0.2, prev - 0.2))}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                  >-</button>
                  <span className="text-cyan-300 font-bold">{timebase.toFixed(1)}ms</span>
                  <button 
                    onClick={() => setTimebase(prev => Math.min(5, prev + 0.2))}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                  >+</button>
                </div>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'مقياس الفولت Volts/Div:' : 'Volts/Div Scale:'}</span>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setVoltsPerDiv(prev => Math.max(0.2, prev - 0.2))}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                  >-</button>
                  <span className="text-emerald-300 font-bold">{voltsPerDiv.toFixed(1)}V</span>
                  <button 
                    onClick={() => setVoltsPerDiv(prev => Math.min(3, prev + 0.2))}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                  >+</button>
                </div>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'حاقن الضوضاء Noise Inject:' : 'Injected Noise:'}</span>
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setNoiseLevel(prev => Math.max(0, prev - 0.05))}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                  >-</button>
                  <span className="text-amber-300 font-bold">{(noiseLevel * 100).toFixed(0)}%</span>
                  <button 
                    onClick={() => setNoiseLevel(prev => Math.min(0.5, prev + 0.05))}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded cursor-pointer"
                  >+</button>
                </div>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">{isAr ? 'نمط المحاذاة Trigger:' : 'Trigger Mode:'}</span>
                <button
                  onClick={() => {
                    const modes: ('AUTO' | 'SINGLE' | 'NORM')[] = ['AUTO', 'SINGLE', 'NORM'];
                    const next = modes[(modes.indexOf(triggerMode) + 1) % modes.length];
                    setTriggerMode(next);
                  }}
                  className="w-full py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded cursor-pointer text-center"
                >
                  {triggerMode}
                </button>
              </div>
            </div>
          </div>

          {/* AI Signal Diagnosis Box */}
          <div className="p-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/40 rounded-xl space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <span>{isAr ? 'تقرير الذكاء الاصطناعي لتحليل الإشارة (AI Waveform Diagnostic Report):' : 'AI Waveform Diagnostic Report'}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                currentPreset.status === 'HEALTHY'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {currentPreset.status}
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {isAr ? currentPreset.aiReportAr : currentPreset.aiReportEn}
            </p>
          </div>
        </div>

        {/* Right Column: Signal Directory & Test Probes (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>{isAr ? 'مسارات وخطوط الإشارة للفحص:' : 'Hardware Signal Probes:'}</span>
            </h4>

            <div className="space-y-2">
              {presets.map((preset) => {
                const isSelected = preset.id === activeSignalId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActiveSignalId(preset.id);
                      audioSynth.playMultimeterBeep();
                    }}
                    className={`w-full p-3 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 border-purple-500/60 shadow-lg shadow-purple-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                          style={{ backgroundColor: preset.color }} 
                        />
                        {isAr ? preset.nameAr : preset.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Freq: <strong className="text-cyan-300">{preset.frequency}</strong></span>
                      <span>Vpp: <strong className="text-emerald-300">{preset.voltagePeak}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
