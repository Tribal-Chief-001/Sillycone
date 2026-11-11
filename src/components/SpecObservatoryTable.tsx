'use client';

import React, { useState, useMemo } from 'react';
import { Chip, PlatformSegment } from '../types/silicon';
import { Search, Cpu, Zap, ArrowUpDown } from 'lucide-react';

interface SpecObservatoryTableProps {
  chips: Chip[];
  onSelectChip?: (chip: Chip) => void;
}

export const SpecObservatoryTable: React.FC<SpecObservatoryTableProps> = ({ chips, onSelectChip }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<PlatformSegment | 'all'>('all');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'gb6_single' | 'gb6_multi' | 'tdp' | 'confidence'>('gb6_single');
  const [sortDesc, setSortDesc] = useState(true);

  // Filter chips
  const filteredChips = useMemo(() => {
    return chips.filter(chip => {
      const matchesSearch =
        chip.marketingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chip.codename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chip.vendor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSegment = selectedSegment === 'all' || chip.segment === selectedSegment;
      const matchesVendor = selectedVendor === 'all' || chip.vendor === selectedVendor;

      return matchesSearch && matchesSegment && matchesVendor;
    }).sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortBy === 'name') {
        valA = a.marketingName;
        valB = b.marketingName;
        return sortDesc ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
      } else if (sortBy === 'confidence') {
        valA = a.specConfidenceScore;
        valB = b.specConfidenceScore;
      } else if (sortBy === 'tdp') {
        valA = a.tdpMaxW;
        valB = b.tdpMaxW;
      } else if (sortBy === 'gb6_single') {
        valA = a.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6')?.singleScore || 0;
        valB = b.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6')?.singleScore || 0;
      } else if (sortBy === 'gb6_multi') {
        valA = a.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6')?.multiScore || 0;
        valB = b.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6')?.multiScore || 0;
      }

      return sortDesc ? (Number(valB) - Number(valA)) : (Number(valA) - Number(valB));
    });
  }, [chips, searchQuery, selectedSegment, selectedVendor, sortBy, sortDesc]);

  const vendors = useMemo(() => {
    return Array.from(new Set(chips.map(c => c.vendor)));
  }, [chips]);

  const toggleSort = (field: 'name' | 'gb6_single' | 'gb6_multi' | 'tdp' | 'confidence') => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="space-y-4 font-telemetry">
      {/* Control Bar: Search & Micro Filters */}
      <div className="bg-[#070c14] border border-white/[0.08] p-3.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search Entity, Codename, or Microarch (e.g. Oryon, Dimensity, Arrow Lake)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#03060c] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value as any)}
            className="bg-[#03060c] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Form Factors</option>
            <option value="mobile_soc">Mobile SoCs</option>
            <option value="laptop_client">Laptop / Client</option>
            <option value="desktop_cpu">Desktop CPUs</option>
            <option value="discrete_gpu">Discrete GPUs</option>
          </select>

          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="bg-[#03060c] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Vendors</option>
            {vendors.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#070c14] shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#03060c] border-b border-white/[0.08] text-slate-500 uppercase text-[9px] tracking-wider select-none">
            <tr>
              <th className="py-2.5 px-3.5 cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Entity & Codename</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="py-2.5 px-3.5">Segment</th>
              <th className="py-2.5 px-3.5">Core Clusters</th>
              <th className="py-2.5 px-3.5">Memory Subsystem</th>
              <th className="py-2.5 px-3.5 cursor-pointer" onClick={() => toggleSort('tdp')}>
                <div className="flex items-center gap-1">
                  <span>cTDP Envelope</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="py-2.5 px-3.5 cursor-pointer" onClick={() => toggleSort('gb6_single')}>
                <div className="flex items-center gap-1 text-cyan-400">
                  <span>GB6 Single / Multi</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="py-2.5 px-3.5 cursor-pointer" onClick={() => toggleSort('confidence')}>
                <div className="flex items-center gap-1">
                  <span>Status / Conf</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredChips.map((chip) => {
              const gb6 = chip.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6');
              const timeSpy = chip.benchmarks.find(b => b.category === 'gpu_raster_timespy');
              const isRumor = chip.verificationStage === 'early_rumor';

              return (
                <tr
                  key={chip.id}
                  onClick={() => onSelectChip?.(chip)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Entity Name */}
                  <td className="py-2.5 px-3.5 font-sans">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5 group-hover:text-cyan-300 transition-colors">
                      <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{chip.marketingName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-telemetry mt-0.5">
                      {chip.vendor} • {chip.codename}
                    </div>
                  </td>

                  {/* Segment */}
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-white/[0.06] text-[10px] capitalize">
                      {chip.segment.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Core Topology */}
                  <td className="py-2.5 px-3.5 max-w-[210px]">
                    <div className="text-slate-200 truncate text-[11px]">
                      {chip.topologies.map(t => `${t.coreCount}× ${t.microarchName}`).join(' + ')}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      Max Boost: {Math.max(...chip.topologies.map(t => t.boostClockGhz))} GHz
                    </div>
                  </td>

                  {/* Memory Subsystem */}
                  <td className="py-2.5 px-3.5">
                    <div className="text-slate-200 text-[11px]">{chip.memory.memoryType}</div>
                    <div className="text-cyan-300 text-[10px]">
                      {chip.memory.bandwidthGbS} GB/s ({chip.memory.busWidthBits}-bit)
                    </div>
                  </td>

                  {/* TDP */}
                  <td className="py-2.5 px-3.5 text-slate-300 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" />
                      <span>{chip.tdpMinW}W – {chip.tdpMaxW}W</span>
                    </div>
                  </td>

                  {/* Benchmarks */}
                  <td className="py-2.5 px-3.5 text-[11px]">
                    {gb6 ? (
                      <div>
                        <span className="text-cyan-400 font-bold">{gb6.singleScore.toLocaleString()}</span>
                        <span className="text-slate-600 mx-1">/</span>
                        <span className="text-slate-300">{gb6.multiScore?.toLocaleString() || '-'}</span>
                      </div>
                    ) : timeSpy ? (
                      <div>
                        <span className="text-emerald-400 font-bold">{timeSpy.singleScore.toLocaleString()} pts</span>
                        <span className="text-slate-600 text-[9px] block">Time Spy Graphics</span>
                      </div>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>

                  {/* Status / Confidence */}
                  <td className="py-2.5 px-3.5">
                    <div className="flex-1 min-w-[70px]">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className={isRumor ? 'text-amber-400' : 'text-emerald-400'}>
                          {chip.verificationStage.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-slate-300">{chip.specConfidenceScore}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${
                            isRumor ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${chip.specConfidenceScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
