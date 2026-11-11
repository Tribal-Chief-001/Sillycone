'use client';

import React, { useState, useMemo } from 'react';
import { Chip, PlatformSegment, VerificationStage } from '../types/silicon';
import { Search, Filter, Cpu, Zap, ArrowUpDown, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SpecObservatoryTableProps {
  chips: Chip[];
}

export const SpecObservatoryTable: React.FC<SpecObservatoryTableProps> = ({ chips }) => {
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
    <div className="space-y-4">
      {/* Control Bar: Search & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Chip, Codename, or Architecture (e.g. Oryon, Dimensity, Arrow Lake)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Segment Selector */}
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Form Factors</option>
            <option value="mobile_soc">Mobile SoCs</option>
            <option value="desktop_cpu">Desktop CPUs</option>
            <option value="discrete_gpu">Discrete GPUs</option>
            <option value="laptop_client">Laptop / Client</option>
          </select>

          {/* Vendor Selector */}
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Vendors</option>
            {vendors.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1.5">
                  <span>Chip & Codename</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4">Segment</th>
              <th className="py-3 px-4">Core Topology</th>
              <th className="py-3 px-4">Memory Subsystem</th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('tdp')}>
                <div className="flex items-center gap-1.5">
                  <span>TDP Envelope</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('gb6_single')}>
                <div className="flex items-center gap-1.5 text-sky-400">
                  <span>GB6 Single / Multi</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer" onClick={() => toggleSort('confidence')}>
                <div className="flex items-center gap-1.5">
                  <span>Confidence / Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredChips.map((chip) => {
              const gb6 = chip.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6');
              const timeSpy = chip.benchmarks.find(b => b.category === 'gpu_raster_timespy');
              const isRumor = chip.verificationStage === 'early_rumor';

              return (
                <tr
                  key={chip.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Name & Codename */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-slate-100 flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-sky-400" />
                      <span>{chip.marketingName}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {chip.vendor} • {chip.codename}
                    </div>
                  </td>

                  {/* Segment */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                      {chip.segment.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Core Topology */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="text-slate-200 truncate">
                      {chip.topologies.map(t => `${t.coreCount}× ${t.microarchName}`).join(' + ')}
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      Max Clock: {Math.max(...chip.topologies.map(t => t.boostClockGhz))} GHz
                    </div>
                  </td>

                  {/* Memory Subsystem */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200">{chip.memory.memoryType}</div>
                    <div className="text-slate-400 text-[11px]">
                      {chip.memory.bandwidthGbS} GB/s ({chip.memory.busWidthBits}-bit)
                    </div>
                  </td>

                  {/* TDP */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span>{chip.tdpMinW}W – {chip.tdpMaxW}W</span>
                    </div>
                  </td>

                  {/* Geekbench / Benchmarks */}
                  <td className="py-3.5 px-4">
                    {gb6 ? (
                      <div>
                        <span className="text-sky-400 font-bold">{gb6.singleScore.toLocaleString()}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-slate-300">{gb6.multiScore?.toLocaleString() || '-'}</span>
                      </div>
                    ) : timeSpy ? (
                      <div>
                        <span className="text-emerald-400 font-bold">{timeSpy.singleScore.toLocaleString()} pts</span>
                        <span className="text-slate-500 text-[10px] block">Time Spy Graphics</span>
                      </div>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>

                  {/* Confidence / Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-[70px]">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className={isRumor ? 'text-amber-400' : 'text-emerald-400'}>
                            {chip.verificationStage.replace('_', ' ')}
                          </span>
                          <span className="font-bold text-slate-300">{chip.specConfidenceScore}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${
                              isRumor ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${chip.specConfidenceScore}%` }}
                          ></div>
                        </div>
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
