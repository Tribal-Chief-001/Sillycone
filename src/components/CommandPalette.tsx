'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Chip, FoundryNode, Microarchitecture } from '../types/silicon';
import { Search, Cpu, Factory, Layers, ArrowRight, X, Sparkles } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  chips: Chip[];
  nodes: FoundryNode[];
  architectures: Microarchitecture[];
  onSelectChip: (chip: Chip) => void;
  onSelectTab: (tab: ActiveTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  chips,
  nodes,
  architectures,
  onSelectChip,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global Hotkey listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredChips = chips.filter(c =>
    c.marketingName.toLowerCase().includes(query.toLowerCase()) ||
    c.vendor.toLowerCase().includes(query.toLowerCase()) ||
    c.codename.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredNodes = nodes.filter(n =>
    n.foundryName.toLowerCase().includes(query.toLowerCase()) ||
    n.nodeName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredArchs = architectures.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.designer.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#070c14] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden font-telemetry">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] bg-[#03060c]">
          <Search className="h-4 w-4 text-cyan-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Silicon Entities, Nodes, Architectures, or Tab (e.g. 'Oryon', 'N3P', 'Arrow Lake')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/[0.06] text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Tab Switch Actions */}
          {query === '' && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-cyan-400" /> Quick Workspaces
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { tab: 'canvas' as ActiveTab, label: '1. DAG Canvas' },
                  { tab: 'observatory' as ActiveTab, label: '2. Spec Table' },
                  { tab: 'curves' as ActiveTab, label: '3. V/F Curves' },
                  { tab: 'deltas' as ActiveTab, label: '4. Rumor Radar' },
                ].map(({ tab, label }) => (
                  <button
                    key={tab}
                    onClick={() => {
                      onSelectTab(tab);
                      onClose();
                    }}
                    className="p-2 text-left rounded-lg bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.06] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chips Section */}
          {filteredChips.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-1.5">
                Silicon Entities ({filteredChips.length})
              </div>
              <div className="space-y-1">
                {filteredChips.map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      onSelectChip(chip);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="h-4 w-4 text-cyan-400" />
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-cyan-300">
                          {chip.marketingName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {chip.vendor} • {chip.codename} • {chip.segment.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-cyan-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nodes Section */}
          {filteredNodes.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 px-2 mb-1.5">
                Foundry Nodes
              </div>
              <div className="space-y-1">
                {filteredNodes.map(node => (
                  <div
                    key={node.id}
                    className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Factory className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-slate-200 font-semibold">{node.foundryName} {node.nodeName}</span>
                    </div>
                    <span className="text-[10px] text-indigo-300">{node.densityMtrMm2} MTr/mm²</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-white/[0.08] bg-[#03060c] flex justify-between text-[10px] text-slate-500">
          <span>Navigate with mouse or hotkeys</span>
          <span>[ESC] to dismiss</span>
        </div>
      </div>
    </div>
  );
};
