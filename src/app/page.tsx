'use client';

import React, { useState } from 'react';
import { Navbar, ActiveTab } from '../components/Navbar';
import { HardwareGraphCanvas } from '../components/HardwareGraphCanvas';
import { SpecObservatoryTable } from '../components/SpecObservatoryTable';
import { RumorDeltaTracker } from '../components/RumorDeltaTracker';
import { CrossClassComparison } from '../components/CrossClassComparison';
import { FOUNDRY_NODES, MICROARCHITECTURES, CHIPS } from '../data/mockSiliconData';
import { Cpu, GitBranch, Factory, Zap, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        chipCount={CHIPS.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Dynamic Metric Bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">{CHIPS.length} Entities</div>
              <div className="text-[11px] text-slate-400 font-mono">Mobile, Desktop & GPUs</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Factory className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">{FOUNDRY_NODES.length} Nodes</div>
              <div className="text-[11px] text-slate-400 font-mono">TSMC, Intel & Samsung</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">{MICROARCHITECTURES.length} Archs</div>
              <div className="text-[11px] text-slate-400 font-mono">x86, ARMv9 & Blackwell</div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white font-mono">24/7 Radar</div>
              <div className="text-[11px] text-slate-400 font-mono">GitHub Cron Scraper ($0)</div>
            </div>
          </div>
        </section>

        {/* Tab Views */}
        {activeTab === 'canvas' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Interactive Silicon Dependency Graph (DAG)
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Drag, zoom, and select nodes to inspect physical topology, caches, and benchmark scores.
                </p>
              </div>
            </div>
            <HardwareGraphCanvas
              nodes={FOUNDRY_NODES}
              architectures={MICROARCHITECTURES}
              chips={CHIPS}
            />
          </section>
        )}

        {activeTab === 'observatory' && (
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Unified Spec Observatory & Database
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Cross-platform multi-attribute sorting across mobile SoCs, desktop CPUs, and discrete GPUs.
              </p>
            </div>
            <SpecObservatoryTable chips={CHIPS} />
          </section>
        )}

        {activeTab === 'deltas' && (
          <section className="space-y-3">
            <RumorDeltaTracker chips={CHIPS} />
          </section>
        )}

        {activeTab === 'compare' && (
          <section className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Cross-Platform Head-to-Head Architectural Comparison
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Compare mobile SoCs with under-volted laptop dies and desktop flagships on normalized IPC per watt.
              </p>
            </div>
            <CrossClassComparison chips={CHIPS} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060910] py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <p>
          Sillycone — The Living Semiconductor Knowledge Graph. Designed for $0/mo operation on Next.js, Supabase & GitHub Actions.
        </p>
      </footer>
    </div>
  );
}
