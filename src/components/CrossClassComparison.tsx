'use client';

import React, { useState } from 'react';
import { Chip } from '../types/silicon';
import { Zap, Cpu, Award } from 'lucide-react';

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

  // Compute total cache for Chip A & B
  const getTotalCache = (chip: Chip) => {
    return chip.topologies.reduce((sum, t) => sum + (t.l2CacheMb * t.coreCount) + t.l3CacheMb + (t.slcCacheMb || 0), 0);
  };

  const cacheA = getTotalCache(chipA);
  const cacheB = getTotalCache(chipB);

  return (
    <div className="space-y-6 font-telemetry">
      {/* Selector Header */}
      <div className="bg-[#070c14] border border-white/[0.08] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Chip A Selector */}
        <div className="w-full md:w-5/12">
          <label className="text-[11px] text-slate-400 block mb-1">Primary Silicon (Entity A):</label>
          <select
            value={chipAId}
            onChange={(e) => setChipAId(e.target.value)}
            className="w-full bg-[#03060c] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-bold text-cyan-400 focus:outline-none focus:border-cyan-500/50"
          >
            {chips.map(c => (
              <option key={c.id} value={c.id}>
                {c.marketingName} ({c.vendor} • {c.segment.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Versus Badge */}
        <div className="h-9 w-9 rounded-full bg-[#03060c] border border-white/[0.1] flex items-center justify-center font-bold text-xs text-amber-400 shadow-lg">
          VS
        </div>

        {/* Chip B Selector */}
        <div className="w-full md:w-5/12">
          <label className="text-[11px] text-slate-400 block mb-1">Target Silicon (Entity B):</label>
          <select
            value={chipBId}
            onChange={(e) => setChipBId(e.target.value)}
            className="w-full bg-[#03060c] border border-white/[0.08] rounded-xl px-3 py-2 text-xs font-bold text-purple-400 focus:outline-none focus:border-purple-500/50"
          >
            {chips.map(c => (
              <option key={c.id} value={c.id}>
                {c.marketingName} ({c.vendor} • {c.segment.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head-to-Head Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card A */}
        <div className="bg-[#070c14] border border-cyan-500/30 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                {chipA.vendor} • {chipA.segment.replace('_', ' ')}
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">{chipA.marketingName}</h3>
              <p className="text-[10px] text-slate-500">Codename: {chipA.codename}</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              {chipA.specConfidenceScore}% Conf
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Packaging Technology:</span>
              <span className="text-white font-semibold">{chipA.packagingTech}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Total Cache Pool:</span>
              <span className="text-purple-300 font-bold">~{cacheA} MB</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Memory Bandwidth:</span>
              <span className="text-cyan-300 font-bold">{chipA.memory.bandwidthGbS} GB/s ({chipA.memory.memoryType})</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">cTDP Envelope:</span>
              <span className="text-amber-400 font-bold">{chipA.tdpMinW}W – {chipA.tdpMaxW}W</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Geekbench 6 Single-Core:</span>
              <span className="text-cyan-300 font-bold">{gbA.single.toLocaleString()} pts</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Geekbench 6 Multi-Core:</span>
              <span className="text-white font-bold">{gbA.multi.toLocaleString()} pts</span>
            </div>
            <div className="flex justify-between pt-1 text-sm bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/20">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-400" /> Single-Core Efficiency:
              </span>
              <span className="text-emerald-400 font-bold">{gbA.singlePerWatt} pts/Watt</span>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div className="bg-[#070c14] border border-purple-500/30 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-white/[0.06]">
            <div>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                {chipB.vendor} • {chipB.segment.replace('_', ' ')}
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">{chipB.marketingName}</h3>
              <p className="text-[10px] text-slate-500">Codename: {chipB.codename}</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              {chipB.specConfidenceScore}% Conf
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Packaging Technology:</span>
              <span className="text-white font-semibold">{chipB.packagingTech}</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Total Cache Pool:</span>
              <span className="text-purple-300 font-bold">~{cacheB} MB</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Memory Bandwidth:</span>
              <span className="text-purple-300 font-bold">{chipB.memory.bandwidthGbS} GB/s ({chipB.memory.memoryType})</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">cTDP Envelope:</span>
              <span className="text-amber-400 font-bold">{chipB.tdpMinW}W – {chipB.tdpMaxW}W</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Geekbench 6 Single-Core:</span>
              <span className="text-purple-300 font-bold">{gbB.single.toLocaleString()} pts</span>
            </div>
            <div className="flex justify-between pb-1.5 border-b border-white/[0.04]">
              <span className="text-slate-400">Geekbench 6 Multi-Core:</span>
              <span className="text-white font-bold">{gbB.multi.toLocaleString()} pts</span>
            </div>
            <div className="flex justify-between pt-1 text-sm bg-purple-950/20 p-2.5 rounded-xl border border-purple-500/20">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-400" /> Single-Core Efficiency:
              </span>
              <span className="text-emerald-400 font-bold">{gbB.singlePerWatt} pts/Watt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
