'use client';

import React from 'react';
import { Cpu, GitBranch, Table, Activity, Scale, ShieldCheck, Zap } from 'lucide-react';

export type ActiveTab = 'canvas' | 'observatory' | 'curves' | 'deltas' | 'compare';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  chipCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, chipCount }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#020408]/95 backdrop-blur-md px-4 py-2.5 font-telemetry select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Terminal Identifier */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
            <Cpu className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wider text-white">SILLYCONE</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">
                v0.1-alpha
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Living Silicon Knowledge Graph & Spec Observatory
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#070c14] p-1 rounded-xl border border-white/[0.08]">
          <button
            onClick={() => onTabChange('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'canvas'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>DAG Tree</span>
          </button>

          <button
            onClick={() => onTabChange('observatory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'observatory'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            <span>Spec Observatory</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-[10px] text-cyan-300 border border-cyan-500/30">
              {chipCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('curves')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'curves'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>V/F Curves</span>
          </button>

          <button
            onClick={() => onTabChange('deltas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'deltas'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Rumor Radar</span>
          </button>

          <button
            onClick={() => onTabChange('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'compare'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Head-to-Head</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
