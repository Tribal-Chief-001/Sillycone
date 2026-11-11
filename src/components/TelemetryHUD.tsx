'use client';

import React from 'react';
import { ShieldCheck, Terminal, Command, Zap, Layers, Activity } from 'lucide-react';

interface TelemetryHUDProps {
  onOpenCommand: () => void;
  activeChipCount: number;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ onOpenCommand, activeChipCount }) => {
  return (
    <div className="w-full bg-[#03060c] border-b border-white/[0.08] text-[11px] font-telemetry select-none">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: System Status & Frequency Indicators */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>SYS.STAT: 24/7 RADAR ONLINE</span>
          </div>

          <div className="hidden md:flex items-center gap-3 border-l border-white/[0.08] pl-3">
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>PEAK IPC: <strong className="text-white">4.32 GHz</strong> (Oryon v2)</span>
            </span>

            <span className="flex items-center gap-1 text-slate-300">
              <Layers className="h-3 w-3 text-cyan-400" />
              <span>MAX BUS: <strong className="text-white">1,792 GB/s</strong> (512-bit GDDR7)</span>
            </span>

            <span className="flex items-center gap-1 text-slate-300">
              <Activity className="h-3 w-3 text-emerald-400" />
              <span>EFF. SUMMIT: <strong className="text-white">750 pts/W</strong> (A18 Pro)</span>
            </span>
          </div>
        </div>

        {/* Right: Command Bar & Hotkey Hints */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all"
          >
            <Command className="h-3 w-3 text-cyan-400" />
            <span>CMD PALETTE</span>
            <kbd className="px-1 py-0.2 rounded bg-black border border-white/20 text-[9px] text-slate-400 font-bold">
              /
            </kbd>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-slate-500 border-l border-white/[0.08] pl-3">
            <span>[J/K] Nav</span>
            <span>[Space] Inspect</span>
            <span>[C] Compare</span>
          </div>
        </div>
      </div>
    </div>
  );
};
