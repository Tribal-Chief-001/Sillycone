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
import { FoundryNode, Microarchitecture, Chip } from '../types/silicon';
import { Cpu, Layers, Factory, Zap, ShieldAlert, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface FoundryNodeData extends Record<string, unknown> {
  label: string;
  sub: string;
  density: number;
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

// Custom Node: Foundry Fabrication Node
const FoundryNodeView = ({ data }: NodeProps<Node<FoundryNodeData>>) => {
  return (
    <div className="px-4 py-3 rounded-xl border border-indigo-500/40 bg-gradient-to-br from-slate-900 to-indigo-950/70 text-slate-100 shadow-xl shadow-indigo-950/50 min-w-[210px] hover:border-indigo-400 transition-all cursor-pointer">
      <div className="flex items-center gap-2 mb-1.5">
        <Factory className="h-4 w-4 text-indigo-400" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">Foundry Node</span>
      </div>
      <div className="font-bold text-sm text-white">{data.label}</div>
      <div className="text-xs text-slate-400 font-mono mt-0.5">{data.sub}</div>
      <div className="mt-2 pt-2 border-t border-indigo-500/20 flex justify-between text-[11px] font-mono">
        <span className="text-slate-400">Density:</span>
        <span className="text-indigo-300 font-semibold">{data.density} MTr/mm²</span>
      </div>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-indigo-400 border border-slate-900" />
    </div>
  );
};

// Custom Node: Microarchitecture
const MicroarchNodeView = ({ data }: NodeProps<Node<MicroarchNodeData>>) => {
  return (
    <div className="px-4 py-3 rounded-xl border border-purple-500/40 bg-gradient-to-br from-slate-900 to-purple-950/70 text-slate-100 shadow-xl shadow-purple-950/50 min-w-[220px] hover:border-purple-400 transition-all cursor-pointer">
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-purple-400 border border-slate-900" />
      <div className="flex items-center gap-2 mb-1.5">
        <Layers className="h-4 w-4 text-purple-400" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">{data.designer} Arch</span>
      </div>
      <div className="font-bold text-sm text-white">{data.label}</div>
      <div className="text-xs text-purple-200/80 font-mono mt-0.5">{data.isa}</div>
      <div className="mt-2 pt-2 border-t border-purple-500/20 text-[11px] font-mono text-purple-300 truncate">
        {data.claim}
      </div>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-purple-400 border border-slate-900" />
    </div>
  );
};

// Custom Node: Silicon Chip / SoC Product
const ChipNodeView = ({ data }: NodeProps<Node<ChipNodeData>>) => {
  const isRumor = data.stage === 'early_rumor';
  const isES = data.stage === 'es_sample_hit';
  
  return (
    <div className={`px-4 py-3 rounded-xl border bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 shadow-xl min-w-[240px] transition-all cursor-pointer ${
      isRumor
        ? 'border-amber-500/50 hover:border-amber-400 shadow-amber-950/30'
        : isES
        ? 'border-sky-500/50 hover:border-sky-400 shadow-sky-950/30'
        : 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-950/30'
    }`}>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-sky-400 border border-slate-900" />
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <Cpu className="h-4 w-4 text-sky-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">{data.vendor}</span>
        </div>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${
          isRumor
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
            : isES
            ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
        }`}>
          {data.confidence}% conf
        </span>
      </div>

      <div className="font-bold text-sm text-white">{data.label}</div>
      <div className="text-xs text-slate-400 font-mono mt-0.5">{data.codename}</div>

      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">TDP: {data.tdp}W</span>
        {data.gb6 ? (
          <span className="text-sky-300 font-semibold">GB6: {data.gb6}</span>
        ) : null}
      </div>
    </div>
  );
};

const nodeTypes = {
  foundry: FoundryNodeView,
  microarch: MicroarchNodeView,
  chip: ChipNodeView,
};

interface HardwareGraphCanvasProps {
  nodes: FoundryNode[];
  architectures: Microarchitecture[];
  chips: Chip[];
}

export const HardwareGraphCanvas: React.FC<HardwareGraphCanvasProps> = ({
  nodes,
  architectures,
  chips,
}) => {
  const [selectedChip, setSelectedChip] = useState<Chip | null>(chips[0]);

  // Construct React Flow Nodes and Edges
  const { flowNodes, flowEdges } = useMemo(() => {
    const fNodes: Node[] = [];
    const fEdges: Edge[] = [];

    // 1. Column 1: Foundry Nodes (X = 50)
    nodes.forEach((node, index) => {
      fNodes.push({
        id: node.id,
        type: 'foundry',
        position: { x: 50, y: index * 140 + 50 },
        data: {
          label: `${node.foundryName} ${node.nodeName}`,
          sub: node.transistorArch,
          density: node.densityMtrMm2,
        },
      });
    });

    // 2. Column 2: Microarchitectures (X = 400)
    architectures.forEach((arch, index) => {
      fNodes.push({
        id: arch.id,
        type: 'microarch',
        position: { x: 420, y: index * 125 + 30 },
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

    // 3. Column 3: Chips (X = 820)
    chips.forEach((chip, index) => {
      const gb6Score = chip.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6')?.singleScore;
      fNodes.push({
        id: chip.id,
        type: 'chip',
        position: { x: 820, y: index * 135 + 20 },
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
          style: { stroke: '#38bdf8', strokeWidth: 2 },
        });
      } else if (chip.foundryNodeId) {
        // Direct Foundry -> Chip
        fEdges.push({
          id: `edge-direct-${chip.foundryNodeId}-${chip.id}`,
          source: chip.foundryNodeId,
          target: chip.id,
          style: { stroke: '#94a3b8', strokeDasharray: '4 4' },
        });
      }
    });

    return { flowNodes: fNodes, flowEdges: fEdges };
  }, [nodes, architectures, chips]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node.type === 'chip' && node.data?.chipObject) {
      setSelectedChip(node.data.chipObject as Chip);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] bg-[#080c14] overflow-hidden rounded-2xl border border-slate-800">
      {/* Top Banner Guide */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-4 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-indigo-400">
          <Factory className="h-3.5 w-3.5" /> 1. Foundry Nodes
        </span>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="flex items-center gap-1.5 text-purple-400">
          <Layers className="h-3.5 w-3.5" /> 2. Microarchitectures
        </span>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="flex items-center gap-1.5 text-sky-400">
          <Cpu className="h-3.5 w-3.5" /> 3. Silicon Entities
        </span>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-[#080c14]"
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800" />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(n) => {
            if (n.type === 'foundry') return '#6366f1';
            if (n.type === 'microarch') return '#a855f7';
            return '#38bdf8';
          }}
          className="!bg-slate-900 !border-slate-800"
        />
      </ReactFlow>

      {/* Side Detail Drawer */}
      {selectedChip && (
        <aside className="absolute right-4 top-4 bottom-4 w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-5 overflow-y-auto shadow-2xl z-20 flex flex-col">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 font-semibold">
                {selectedChip.vendor} • {selectedChip.segment.replace('_', ' ')}
              </span>
              <h3 className="text-lg font-bold text-white mt-1.5">{selectedChip.marketingName}</h3>
              <p className="text-xs text-slate-400 font-mono">Codename: {selectedChip.codename}</p>
            </div>
            <button
              onClick={() => setSelectedChip(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs font-mono">
            {/* Confidence & Stage */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Verification Stage:</span>
                <span className="font-semibold text-sky-400 capitalize">
                  {selectedChip.verificationStage.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Confidence Score:</span>
                <span className="text-emerald-400 font-bold">{selectedChip.specConfidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div
                  className="bg-emerald-400 h-1.5 rounded-full"
                  style={{ width: `${selectedChip.specConfidenceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Physical Specs */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-slate-200 font-semibold mb-1 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" /> Physical & Packaging
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Packaging Tech:</span>
                <span className="text-slate-200">{selectedChip.packagingTech}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thermal Target (cTDP):</span>
                <span className="text-slate-200">{selectedChip.tdpMinW}W – {selectedChip.tdpMaxW}W</span>
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
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-purple-400" /> Core Topology
              </div>
              {selectedChip.topologies.map((top, idx) => (
                <div key={idx} className="pb-2 border-b border-slate-900 last:border-0 last:pb-0">
                  <div className="flex justify-between font-semibold text-slate-300">
                    <span>{top.coreCount}× {top.clusterType}</span>
                    <span className="text-purple-400">{top.boostClockGhz} GHz</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Arch: {top.microarchName} • L2: {top.l2CacheMb}MB {top.l3CacheMb > 0 ? `• L3: ${top.l3CacheMb}MB` : ''}
                  </div>
                </div>
              ))}
            </div>

            {/* Memory Subsystem */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-slate-200 font-semibold mb-1">Memory Subsystem</div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="text-slate-200">{selectedChip.memory.memoryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bus Width:</span>
                <span className="text-slate-200">{selectedChip.memory.busWidthBits}-bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="text-sky-300 font-semibold">{selectedChip.memory.bandwidthGbS} GB/s</span>
              </div>
            </div>

            {/* Benchmark Scores */}
            {selectedChip.benchmarks.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-slate-200 font-semibold">Normalized Benchmarks</div>
                {selectedChip.benchmarks.map((bench, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-200">{bench.name}</div>
                      <div className="text-[10px] text-slate-500">{bench.testDevice}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sky-400 font-bold text-sm">
                        {bench.singleScore.toLocaleString()}
                        {bench.multiScore ? ` / ${bench.multiScore.toLocaleString()}` : ''}
                      </div>
                      {bench.powerWattage && (
                        <div className="text-[10px] text-amber-400">@{bench.powerWattage}W</div>
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
