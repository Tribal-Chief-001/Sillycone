'use client';

import React, { useState } from 'react';
import { Chip } from '../types/silicon';
import { Scale, Zap, Cpu, Gauge, Layers, Check } from 'lucide-react';

interface CrossClassComparisonProps {
  chips: Chip[];
}

export const CrossClassComparison: React.FC<CrossClassComparisonProps> = ({ chips }) => {
  const [chipAId, setChipAId] = useState<string>(chips[0]?.id || '');
  const [chipBId, setChipBId] = useState<string>(chips[1]?.id || '');

  const chipA = chips.find(c => c.id === chipAId) || chips[0];
  const chipB = chips.find(c => c.id === chipBId) || chips[1];

  // Helper to extract GB6 metrics
  const getGB6 = (chip: Chip) => {
    const gb = chip.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6');
    const single = gb?.singleScore || 0;
    const multi = gb?.multiScore || 0;
    const power = gb?.powerWattage || (chip.tdpMinW + chip.tdpMaxW) / 2;
    const singlePerWatt = power > 0 ? (single / power).toFixed(1) : '0';
    return { single, multi, power, singlePerWatt };
  };

  const gbA = getGB6(chipA);
  const gbB = getGB6(chipB);

  return (
    <div className="space-y-6">
      {/* Selector Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Chip A Selector */}
        <div className="w-full md:w-5/12">
          <label className="text-xs font-mono text-slate-400 block mb-1.5">Select Primary Silicon (Chip A):</label>
          <select
            value={chipAId}
            onChange={(e) => setChipAId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-sky-400 focus:outline-none focus:border-sky-500"
          >
            {chips.map(c => (
              <option key={c.id} value={c.id}>
                {c.marketingName} ({c.vendor} • {c.segment.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Versus Badge */}
        <div className="h-10 w-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shadow-md">
          VS
        </div>

        {/* Chip B Selector */}
        <div className="w-full md:w-5/12">
          <label className="text-xs font-mono text-slate-400 block mb-1.5">Select Benchmark Target (Chip B):</label>
          <select
            value={chipBId}
            onChange={(e) => setChipBId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-purple-400 focus:outline-none focus:border-purple-500"
          >
            {chips.map(c => (
              <option key={c.id} value={c.id}>
                {c.marketingName} ({c.vendor} • {c.segment.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head-to-Head Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A */}
        <div className="bg-gradient-to-b from-sky-950/20 to-slate-900 border border-sky-500/30 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {chipA.vendor} • {chipA.segment.replace('_', ' ')}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{chipA.marketingName}</h3>
              <p className="text-xs text-slate-400 font-mono">Codename: {chipA.codename}</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
              {chipA.specConfidenceScore}% Conf
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs mt-6">
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Packaging / Node:</span>
              <span className="text-slate-200 font-semibold">{chipA.packagingTech}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Memory Bandwidth:</span>
              <span className="text-sky-300 font-semibold">{chipA.memory.bandwidthGbS} GB/s ({chipA.memory.memoryType})</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Thermal Target (cTDP):</span>
              <span className="text-amber-400 font-semibold">{chipA.tdpMinW}W – {chipA.tdpMaxW}W</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Geekbench 6 Single-Core:</span>
              <span className="text-sky-400 font-bold text-sm">{gbA.single.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Geekbench 6 Multi-Core:</span>
              <span className="text-slate-200 font-bold text-sm">{gbA.multi.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Single-Core Efficiency:</span>
              <span className="text-emerald-400 font-bold text-sm">{gbA.singlePerWatt} pts/Watt</span>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div className="bg-gradient-to-b from-purple-950/20 to-slate-900 border border-purple-500/30 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                {chipB.vendor} • {chipB.segment.replace('_', ' ')}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{chipB.marketingName}</h3>
              <p className="text-xs text-slate-400 font-mono">Codename: {chipB.codename}</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
              {chipB.specConfidenceScore}% Conf
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs mt-6">
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Packaging / Node:</span>
              <span className="text-slate-200 font-semibold">{chipB.packagingTech}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Memory Bandwidth:</span>
              <span className="text-purple-300 font-semibold">{chipB.memory.bandwidthGbS} GB/s ({chipB.memory.memoryType})</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Thermal Target (cTDP):</span>
              <span className="text-amber-400 font-semibold">{chipB.tdpMinW}W – {chipB.tdpMaxW}W</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Geekbench 6 Single-Core:</span>
              <span className="text-purple-400 font-bold text-sm">{gbB.single.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Geekbench 6 Multi-Core:</span>
              <span className="text-slate-200 font-bold text-sm">{gbB.multi.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Single-Core Efficiency:</span>
              <span className="text-emerald-400 font-bold text-sm">{gbB.singlePerWatt} pts/Watt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
