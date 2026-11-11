'use client';

import React, { useState, useEffect } from 'react';
import { TelemetryHUD } from '../components/TelemetryHUD';
import { Navbar, ActiveTab } from '../components/Navbar';
import { HardwareGraphCanvas } from '../components/HardwareGraphCanvas';
import { SpecObservatoryTable } from '../components/SpecObservatoryTable';
import { EfficiencyCurveExplorer } from '../components/EfficiencyCurveExplorer';
import { RumorDeltaTracker } from '../components/RumorDeltaTracker';
import { CrossClassComparison } from '../components/CrossClassComparison';
import { CommandPalette } from '../components/CommandPalette';
import { FOUNDRY_NODES, PACKAGING_SUBSTRATES, MICROARCHITECTURES, CHIPS } from '../data/mockSiliconData';
import { Chip } from '../types/silicon';
import { Cpu, GitBranch, Factory, Zap, Box } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [selectedChip, setSelectedChip] = useState<Chip | null>(CHIPS[0]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Global Keyboard Shortcuts (Bloomberg / Vim mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when typing in an input
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      } else if (e.key === '1') {
        setActiveTab('canvas');
      } else if (e.key === '2') {
        setActiveTab('observatory');
      } else if (e.key === '3') {
        setActiveTab('curves');
      } else if (e.key === '4') {
        setActiveTab('deltas');
      } else if (e.key === '5' || e.key.toLowerCase() === 'c') {
        setActiveTab('compare');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#020408] text-slate-100 telemetry-grid">
      {/* Topmost Precision Telemetry HUD */}
      <TelemetryHUD
        onOpenCommand={() => setIsCommandOpen(true)}
        activeChipCount={CHIPS.length}
      />

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        chipCount={CHIPS.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4 font-telemetry">
        {/* Dynamic Metric Ticker */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <div className="bg-[#070c14] border border-white/[0.08] p-3 rounded-xl flex items-center gap-2.5 shadow-md">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{CHIPS.length} SKUs Mapped</div>
              <div className="text-[10px] text-slate-500">Mobile, Desktop, dGPU</div>
            </div>
          </div>

          <div className="bg-[#070c14] border border-white/[0.08] p-3 rounded-xl flex items-center gap-2.5 shadow-md">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Factory className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{FOUNDRY_NODES.length} Litho Nodes</div>
              <div className="text-[10px] text-slate-500">TSMC, Intel, Samsung</div>
            </div>
          </div>

          <div className="bg-[#070c14] border border-white/[0.08] p-3 rounded-xl flex items-center gap-2.5 shadow-md">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Box className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{PACKAGING_SUBSTRATES.length} Substrates</div>
              <div className="text-[10px] text-slate-500">InFO, CoWoS, Foveros</div>
            </div>
          </div>

          <div className="bg-[#070c14] border border-white/[0.08] p-3 rounded-xl flex items-center gap-2.5 shadow-md">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{MICROARCHITECTURES.length} Microarchs</div>
              <div className="text-[10px] text-slate-500">Oryon, Zen, Lion Cove</div>
            </div>
          </div>

          <div className="bg-[#070c14] border border-white/[0.08] p-3 rounded-xl col-span-2 md:col-span-1 flex items-center gap-2.5 shadow-md">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">24/7 Radar</div>
              <div className="text-[10px] text-slate-500">GitHub Cron Active ($0)</div>
            </div>
          </div>
        </section>

        {/* Tab Views */}
        {activeTab === 'canvas' && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Interactive 6-Tier Silicon Dependency Canvas (DAG)
                </h2>
                <p className="text-[11px] text-slate-400">
                  Trace architectural lineage from Litho Nodes through Substrates & Microarchitectures to Physical SKUs.
                </p>
              </div>
            </div>
            <HardwareGraphCanvas
              nodes={FOUNDRY_NODES}
              packaging={PACKAGING_SUBSTRATES}
              architectures={MICROARCHITECTURES}
              chips={CHIPS}
              selectedChip={selectedChip}
              onSelectChip={setSelectedChip}
            />
          </section>
        )}

        {activeTab === 'observatory' && (
          <section className="space-y-2">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                High-Density Spec Observatory & Telemetry Matrix
              </h2>
              <p className="text-[11px] text-slate-400">
                Cross-platform multi-attribute sorting across mobile SoCs, desktop CPUs, and discrete GPUs.
              </p>
            </div>
            <SpecObservatoryTable
              chips={CHIPS}
              onSelectChip={(chip) => {
                setSelectedChip(chip);
                setActiveTab('canvas');
              }}
            />
          </section>
        )}

        {activeTab === 'curves' && (
          <section className="space-y-2">
            <EfficiencyCurveExplorer chips={CHIPS} />
          </section>
        )}

        {activeTab === 'deltas' && (
          <section className="space-y-2">
            <RumorDeltaTracker chips={CHIPS} />
          </section>
        )}

        {activeTab === 'compare' && (
          <section className="space-y-2">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Head-to-Head Architectural Telemetry Comparison
              </h2>
              <p className="text-[11px] text-slate-400">
                Direct showdown: Compare mobile SoCs with under-volted laptop dies and desktop flagships on normalized single-core per watt.
              </p>
            </div>
            <CrossClassComparison chips={CHIPS} />
          </section>
        )}
      </main>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        chips={CHIPS}
        nodes={FOUNDRY_NODES}
        architectures={MICROARCHITECTURES}
        onSelectChip={(chip) => {
          setSelectedChip(chip);
          setActiveTab('canvas');
        }}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#020408] py-3 px-6 text-center text-[10px] text-slate-600 font-telemetry">
        <p>
          SILLYCONE v0.1-alpha — The Living Semiconductor Knowledge Graph. Built with Next.js 14, React Flow, Supabase, and GitHub Actions.
        </p>
      </footer>
    </div>
  );
}
