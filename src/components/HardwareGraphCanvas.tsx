'use client';

import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Handle,
  Position,
  NodeProps,
} from '@xyflow/react';
import { FoundryNode, PackagingSubstrate, Microarchitecture, Chip } from '../types/silicon';
import { Cpu, Layers, Factory, Zap, CheckCircle2, Clock, ChevronRight, X, Box } from 'lucide-react';

interface FoundryNodeData extends Record<string, unknown> {
  label: string;
  sub: string;
  density: number;
}

interface PackagingNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  pitch: number;
  bw: number;
}

interface MicroarchNodeData extends Record<string, unknown> {
  label: string;
  designer: string;
  isa: string;
  claim: string;
}

interface ChipNodeData extends Record<string, unknown> {
  label: string;
  codename: string;
  vendor: string;
  stage: string;
  confidence: number;
  tdp: string;
  gb6?: number;
  chipObject: Chip;
}

// Custom Node: Foundry Lithographic Node
const FoundryNodeView = ({ data }: NodeProps<Node<FoundryNodeData>>) => {
  return (
    <div className="px-3.5 py-2.5 rounded-xl border border-indigo-500/30 bg-[#070c14] text-slate-100 shadow-xl shadow-indigo-950/40 min-w-[200px] hover:border-indigo-400 transition-all font-telemetry cursor-pointer group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-indigo-400">
          <Factory className="h-3.5 w-3.5" />
          <span className="text-[9px] uppercase tracking-wider font-bold">Tier 0 • Litho Node</span>
        </div>
      </div>
      <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{data.label}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{data.sub}</div>
      <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex justify-between text-[10px]">
        <span className="text-slate-500">Density:</span>
        <span className="text-indigo-300 font-bold">{data.density} MTr/mm²</span>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-indigo-400 !border-none" />
    </div>
  );
};

// Custom Node: Packaging Substrate
const PackagingNodeView = ({ data }: NodeProps<Node<PackagingNodeData>>) => {
  return (
    <div className="px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#070c14] text-slate-100 shadow-xl shadow-amber-950/40 min-w-[200px] hover:border-amber-400 transition-all font-telemetry cursor-pointer group">
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-amber-400 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-amber-400">
          <Box className="h-3.5 w-3.5" />
          <span className="text-[9px] uppercase tracking-wider font-bold">Tier 1 • Substrate</span>
        </div>
      </div>
      <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">{data.label}</div>
      <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex justify-between text-[10px]">
        <span className="text-slate-500">Pitch / Bandwidth:</span>
        <span className="text-amber-300 font-bold">{data.pitch}μm / {data.bw} TB/s</span>
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-amber-400 !border-none" />
    </div>
  );
};

// Custom Node: Microarchitecture
const MicroarchNodeView = ({ data }: NodeProps<Node<MicroarchNodeData>>) => {
  return (
    <div className="px-3.5 py-2.5 rounded-xl border border-purple-500/30 bg-[#070c14] text-slate-100 shadow-xl shadow-purple-950/40 min-w-[210px] hover:border-purple-400 transition-all font-telemetry cursor-pointer group">
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-purple-400 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-purple-400">
          <Layers className="h-3.5 w-3.5" />
          <span className="text-[9px] uppercase tracking-wider font-bold">Tier 2 • {data.designer} Arch</span>
        </div>
      </div>
      <div className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">{data.label}</div>
      <div className="text-[10px] text-purple-300/80 mt-0.5">{data.isa}</div>
      <div className="mt-2 pt-1.5 border-t border-white/[0.06] text-[10px] text-purple-200 truncate">
        {data.claim}
      </div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-purple-400 !border-none" />
    </div>
  );
};

// Custom Node: Silicon Chip
const ChipNodeView = ({ data }: NodeProps<Node<ChipNodeData>>) => {
  const isRumor = data.stage === 'early_rumor';
  const isES = data.stage === 'es_sample_hit';

  return (
    <div className={`px-3.5 py-2.5 rounded-xl border bg-[#070c14] text-slate-100 shadow-xl min-w-[230px] transition-all font-telemetry cursor-pointer group ${
      isRumor
        ? 'border-amber-500/40 hover:border-amber-400 shadow-amber-950/20'
        : isES
        ? 'border-cyan-500/40 hover:border-cyan-400 shadow-cyan-950/20'
        : 'border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/20'
    }`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-cyan-400 !border-none" />
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[9px] uppercase tracking-wider text-slate-400">{data.vendor}</span>
        </div>
        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${
          isRumor
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
            : isES
            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
        }`}>
          {data.confidence}% conf
        </span>
      </div>

      <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">{data.label}</div>
      <div className="text-[10px] text-slate-500">{data.codename}</div>

      <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
        <span className="text-slate-400">cTDP: {data.tdp}W</span>
        {data.gb6 ? (
          <span className="text-cyan-300 font-bold">GB6: {data.gb6}</span>
        ) : null}
      </div>
    </div>
  );
};

const nodeTypes = {
  foundry: FoundryNodeView,
  packaging: PackagingNodeView,
  microarch: MicroarchNodeView,
  chip: ChipNodeView,
};

interface HardwareGraphCanvasProps {
  nodes: FoundryNode[];
  packaging: PackagingSubstrate[];
  architectures: Microarchitecture[];
  chips: Chip[];
  selectedChip: Chip | null;
  onSelectChip: (chip: Chip | null) => void;
}

export const HardwareGraphCanvas: React.FC<HardwareGraphCanvasProps> = ({
  nodes,
  packaging,
  architectures,
  chips,
  selectedChip,
  onSelectChip,
}) => {
  // Construct React Flow Nodes and Edges
  const { flowNodes, flowEdges } = useMemo(() => {
    const fNodes: Node[] = [];
    const fEdges: Edge[] = [];

    // 1. Column 1: Foundry Nodes (X = 30)
    nodes.forEach((node, index) => {
      fNodes.push({
        id: node.id,
        type: 'foundry',
        position: { x: 30, y: index * 130 + 40 },
        data: {
          label: `${node.foundryName} ${node.nodeName}`,
          sub: node.transistorArch,
          density: node.densityMtrMm2,
        },
      });
    });

    // 2. Column 2: Packaging Substrates (X = 320)
    packaging.forEach((pkg, index) => {
      fNodes.push({
        id: pkg.id,
        type: 'packaging',
        position: { x: 320, y: index * 130 + 40 },
        data: {
          label: pkg.name,
          type: pkg.type,
          pitch: pkg.interconnectPitchUm,
          bw: pkg.maxBandwidthTbS,
        },
      });
    });

    // 3. Column 3: Microarchitectures (X = 620)
    architectures.forEach((arch, index) => {
      fNodes.push({
        id: arch.id,
        type: 'microarch',
        position: { x: 620, y: index * 120 + 20 },
        data: {
          label: arch.name,
          designer: arch.designer,
          isa: arch.isa,
          claim: arch.ipcGainClaim,
        },
      });

      // Connect Node -> Arch if specified
      if (arch.foundryNodeId) {
        fEdges.push({
          id: `edge-${arch.foundryNodeId}-${arch.id}`,
          source: arch.foundryNodeId,
          target: arch.id,
          animated: true,
          style: { stroke: '#818cf8', strokeWidth: 1.5 },
        });
      }
    });

    // 4. Column 4: Chips (X = 960)
    chips.forEach((chip, index) => {
      const gb6Score = chip.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6')?.singleScore;
      fNodes.push({
        id: chip.id,
        type: 'chip',
        position: { x: 960, y: index * 125 + 10 },
        data: {
          label: chip.marketingName,
          codename: chip.codename,
          vendor: chip.vendor,
          stage: chip.verificationStage,
          confidence: chip.specConfidenceScore,
          tdp: `${chip.tdpMinW}-${chip.tdpMaxW}`,
          gb6: gb6Score,
          chipObject: chip,
        },
      });

      // Connect Arch -> Chip
      if (chip.primaryMicroarchId) {
        fEdges.push({
          id: `edge-${chip.primaryMicroarchId}-${chip.id}`,
          source: chip.primaryMicroarchId,
          target: chip.id,
          animated: chip.verificationStage === 'early_rumor',
          style: { stroke: '#00e5ff', strokeWidth: 1.8 },
        });
      } else if (chip.foundryNodeId) {
        // Direct Foundry -> Chip
        fEdges.push({
          id: `edge-direct-${chip.foundryNodeId}-${chip.id}`,
          source: chip.foundryNodeId,
          target: chip.id,
          style: { stroke: '#94a3b8', strokeDasharray: '3 3' },
        });
      }
    });

    return { flowNodes: fNodes, flowEdges: fEdges };
  }, [nodes, packaging, architectures, chips]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node.type === 'chip' && node.data?.chipObject) {
      onSelectChip(node.data.chipObject as Chip);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-[#020408] overflow-hidden rounded-2xl border border-white/[0.08] font-telemetry">
      {/* Top Breadcrumb HUD */}
      <div className="absolute top-3 left-3 z-10 bg-[#070c14]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/[0.08] flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <Factory className="h-3 w-3" /> Litho Node
        </span>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <Box className="h-3 w-3" /> Substrate
        </span>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
          <Layers className="h-3 w-3" /> Microarch
        </span>
        <ChevronRight className="h-3 w-3 text-slate-700" />
        <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Cpu className="h-3 w-3" /> Product SKU
        </span>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        className="bg-[#020408]"
      >
        <Background color="#111827" gap={20} size={1} />
        <Controls className="!bg-[#070c14] !border-white/[0.08]" />
        <MiniMap
          nodeStrokeWidth={2}
          nodeColor={(n) => {
            if (n.type === 'foundry') return '#6366f1';
            if (n.type === 'packaging') return '#f59e0b';
            if (n.type === 'microarch') return '#a855f7';
            return '#00e5ff';
          }}
          className="!bg-[#070c14] !border-white/[0.08]"
        />
      </ReactFlow>

      {/* Deep Inspection Drawer */}
      {selectedChip && (
        <aside className="absolute right-3 top-3 bottom-3 w-96 bg-[#070c14]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-5 overflow-y-auto shadow-2xl z-20 flex flex-col text-xs font-telemetry animate-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                {selectedChip.vendor} • {selectedChip.segment.replace('_', ' ')}
              </span>
              <h3 className="text-base font-bold text-white mt-1.5">{selectedChip.marketingName}</h3>
              <p className="text-[11px] text-slate-400">Codename: {selectedChip.codename}</p>
            </div>
            <button
              onClick={() => onSelectChip(null)}
              className="p-1 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {/* Confidence & Lifecycle Meter */}
            <div className="p-3 rounded-xl bg-[#03060c] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5 text-[11px]">
                <span className="text-slate-400">Stage:</span>
                <span className="font-bold text-cyan-300 capitalize">
                  {selectedChip.verificationStage.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Bayesian Confidence:</span>
                <span className="text-emerald-400 font-bold">{selectedChip.specConfidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full"
                  style={{ width: `${selectedChip.specConfidenceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Packaging & Die Area */}
            <div className="p-3 rounded-xl bg-[#03060c] border border-white/[0.06] space-y-1.5 text-[11px]">
              <div className="text-white font-bold mb-1 flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-amber-400" /> Physical Floorplan
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Packaging Tech:</span>
                <span className="text-slate-200">{selectedChip.packagingTech}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">cTDP Envelope:</span>
                <span className="text-amber-300 font-bold">{selectedChip.tdpMinW}W – {selectedChip.tdpMaxW}W</span>
              </div>
              {selectedChip.dieSizeMm2 && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Die Area:</span>
                  <span className="text-slate-200">{selectedChip.dieSizeMm2} mm²</span>
                </div>
              )}
              {selectedChip.transistorCountBillion && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Transistors:</span>
                  <span className="text-slate-200">{selectedChip.transistorCountBillion} Billion</span>
                </div>
              )}
            </div>

            {/* Core Topology */}
            <div className="p-3 rounded-xl bg-[#03060c] border border-white/[0.06] space-y-2">
              <div className="text-white font-bold text-[11px] flex items-center gap-1.5">
                <Layers className="h-3 w-3 text-purple-400" /> Core Topology
              </div>
              {selectedChip.topologies.map((top, idx) => (
                <div key={idx} className="pb-1.5 border-b border-white/[0.04] last:border-0 last:pb-0 text-[11px]">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>{top.coreCount}× {top.clusterType}</span>
                    <span className="text-purple-300">{top.boostClockGhz} GHz</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Arch: {top.microarchName} • L2: {top.l2CacheMb}MB {top.l3CacheMb > 0 ? `• L3: ${top.l3CacheMb}MB` : ''}
                  </div>
                </div>
              ))}
            </div>

            {/* Memory Spec */}
            <div className="p-3 rounded-xl bg-[#03060c] border border-white/[0.06] space-y-1.5 text-[11px]">
              <div className="text-white font-bold mb-1">Memory Subsystem</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="text-slate-200">{selectedChip.memory.memoryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bus:</span>
                <span className="text-slate-200">{selectedChip.memory.busWidthBits}-bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="text-cyan-300 font-bold">{selectedChip.memory.bandwidthGbS} GB/s</span>
              </div>
            </div>

            {/* Benchmarks */}
            {selectedChip.benchmarks.length > 0 && (
              <div className="p-3 rounded-xl bg-[#03060c] border border-white/[0.06] space-y-2">
                <div className="text-white font-bold text-[11px]">Verified Benchmarks</div>
                {selectedChip.benchmarks.map((bench, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/[0.02] p-2 rounded-lg text-[11px]">
                    <div>
                      <div className="font-semibold text-slate-200">{bench.name}</div>
                      <div className="text-[9px] text-slate-500">{bench.testDevice}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">
                        {bench.singleScore.toLocaleString()}
                        {bench.multiScore ? ` / ${bench.multiScore.toLocaleString()}` : ''}
                      </div>
                      {bench.powerWattage && (
                        <div className="text-[9px] text-amber-400">@{bench.powerWattage}W</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
