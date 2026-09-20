import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Trash2, 
  Copy, 
  Download, 
  Pause, 
  Play, 
  Send, 
  Layers, 
  Cpu, 
  Check, 
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ProtocolLogItem } from '../types';

interface LiveConsoleTerminalProps {
  logs: ProtocolLogItem[];
  onClearLogs: () => void;
  onSendCommand: (cmd: string) => void;
  isExecuting: boolean;
  lang: 'en' | 'ar';
}

export const LiveConsoleTerminal: React.FC<LiveConsoleTerminalProps> = ({
  logs,
  onClearLogs,
  onSendCommand,
  isExecuting,
  lang
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showHexOnly, setShowHexOnly] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapsed by default for a neat, smooth and clean look
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current && !isCollapsed) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, isCollapsed]);

  // Auto-expand terminal when active operations are running
  useEffect(() => {
    if (isExecuting) {
      setIsCollapsed(false);
    }
  }, [isExecuting]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || isExecuting) return;
    onSendCommand(commandInput.trim());
    setCommandInput('');
  };

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.tag}] ${l.message}${l.hexDump ? '\nHEX: ' + l.hexDump : ''}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.tag}] [${l.level.toUpperCase()}] ${l.message}${l.hexDump ? '\nHEX: ' + l.hexDump : ''}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnifix_protocol_log_${new Date().toISOString().slice(0,19).replace(/[:T]/g, '_')}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = showHexOnly ? logs.filter(l => l.hexDump || l.level === 'hex' || l.level === 'raw_usb') : logs;

  const getLogColor = (level: ProtocolLogItem['level']) => {
    switch (level) {
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-rose-400 font-semibold';
      case 'warn': return 'text-amber-400';
      case 'hex':
      case 'raw_usb': return 'text-cyan-300 font-mono';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
      isCollapsed ? 'h-[44px]' : 'h-[320px] lg:h-[380px]'
    }`}>
      {/* Terminal Header */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between gap-2 text-xs select-none cursor-pointer hover:bg-slate-900/100 transition-colors"
      >
        <div className="flex items-center gap-2 font-mono text-slate-300">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">LIVE PROTOCOL CONSOLE</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">| WinUSB / Direct COM / Sahara Buffer</span>
          {isExecuting && (
            <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono animate-pulse bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
              ● TX/RX ACTIVE
            </span>
          )}
          {isCollapsed && (
            <span className="text-[10px] text-slate-400 font-sans px-2 py-0.5 bg-slate-800/80 rounded animate-pulse">
              {lang === 'ar' ? '▼ انقر لتوسيع نافذة الأوامر واللوج' : '▼ Click to expand logs & terminal'}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {!isCollapsed && (
            <>
              <button
                onClick={() => setShowHexOnly(!showHexOnly)}
                className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors flex items-center gap-1 ${
                  showHexOnly 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' 
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Toggle Hex Packet View"
              >
                <Layers className="w-3 h-3" />
                <span>RAW HEX</span>
              </button>

              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`p-1 rounded text-slate-400 hover:text-white transition-colors ${!autoScroll ? 'bg-amber-900/40 text-amber-300' : 'hover:bg-slate-800'}`}
                title={autoScroll ? 'Pause autoscroll' : 'Resume autoscroll'}
              >
                {autoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleCopyLogs}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy Logs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleExportLogs}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Export .LOG file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClearLogs}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear Console"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
            title={isCollapsed ? 'Expand Terminal' : 'Collapse Terminal'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      {!isCollapsed && (
        <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 bg-black/90 selection:bg-cyan-900 selection:text-white">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-600 italic py-6 text-center">
              {lang === 'ar' ? 'بانتظار تلقي أوامر البروتوكول وحزم الـ USB...' : 'Awaiting USB low-level protocol packets and serial frames...'}
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="leading-relaxed hover:bg-slate-900/50 px-1 rounded transition-colors">
                <span className="text-slate-600 select-none mr-2">[{log.timestamp}]</span>
                <span className="text-cyan-600 font-bold mr-2 select-none">[{log.tag}]</span>
                <span className={getLogColor(log.level)}>{log.message}</span>
                {log.hexDump && (
                  <div className="text-[11px] text-cyan-300/80 bg-slate-950/80 p-1.5 rounded mt-0.5 border border-slate-800/80 overflow-x-auto whitespace-pre">
                    {log.hexDump}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>
      )}

      {/* Direct Interactive Command Input */}
      {!isCollapsed && (
        <form onSubmit={handleSend} className="bg-slate-900 border-t border-slate-800 p-2 flex items-center gap-2">
          <div className="text-cyan-400 font-mono text-xs pl-2 flex items-center">
            <ChevronRight className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'أدخل أمر مباشر (مثال: fastboot getvar all, adb reboot edl, AT+DEVINFO)...'
                : 'Execute direct protocol/CLI command (e.g., fastboot getvar all, adb shell, AT+DEVINFO)...'
            }
            className="flex-1 bg-transparent text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commandInput.trim() || isExecuting}
            className="px-3 py-1 bg-slate-800 hover:bg-cyan-600 disabled:opacity-40 text-slate-300 hover:text-white rounded text-xs font-mono transition-colors flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>SEND</span>
          </button>
        </form>
      )}
    </div>
  );
};
