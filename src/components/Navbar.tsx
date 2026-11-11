'use client';

import React from 'react';
import { Cpu, GitBranch, Table, Activity, Scale, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'canvas' | 'observatory' | 'deltas' | 'compare';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  chipCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, chipCount }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0b0f19]/90 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white">SILLYCONE</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400">
                v0.1.0-alpha
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Living Silicon Knowledge Graph & Spec Observatory
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('canvas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'canvas'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>DAG Canvas</span>
          </button>

          <button
            onClick={() => onTabChange('observatory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'observatory'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            <span>Spec Observatory</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {chipCount}
            </span>
          </button>

          <button
            onClick={() => onTabChange('deltas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'deltas'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Rumor Radar & Deltas</span>
          </button>

          <button
            onClick={() => onTabChange('compare')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'compare'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Head-to-Head</span>
          </button>
        </nav>

        {/* 24/7 Autonomous Radar Cloud Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Cloud Cron Active ($0/mo)</span>
        </div>
      </div>
    </header>
  );
};
