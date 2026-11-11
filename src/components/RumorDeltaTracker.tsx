'use client';

import React, { useMemo } from 'react';
import { Chip, LeakDeltaRecord } from '../types/silicon';
import { LEAKER_LEADERBOARD } from '../data/mockSiliconData';
import { Award, CheckCircle2, Clock, ShieldAlert, TrendingUp } from 'lucide-react';

interface RumorDeltaTrackerProps {
  chips: Chip[];
}

export const RumorDeltaTracker: React.FC<RumorDeltaTrackerProps> = ({ chips }) => {
  // Aggregate all leak delta records across chips
  const allDeltas = useMemo(() => {
    const list: (LeakDeltaRecord & { chipName: string; chipVendor: string })[] = [];
    chips.forEach(chip => {
      if (chip.leakDeltas) {
        chip.leakDeltas.forEach(delta => {
          list.push({
            ...delta,
            chipName: chip.marketingName,
            chipVendor: chip.vendor,
          });
        });
      }
    });
    return list;
  }, [chips]);

  return (
    <div className="space-y-6 font-telemetry">
      {/* Top Banner: Mathematical Accountability Formula */}
      <div className="bg-[#050912] border border-amber-500/30 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              The "Rumor-to-Silicon" Delta Tracker & Mathematical Leaker Accountability
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            LAS = 100 · (1 - WMAPE) · (1 - Brier) · [N / (N + 5)]
          </span>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          The semiconductor media runs on engagement cycles where false claims are quietly buried.
          Sillycone logs insider predictions months before launch, computes the exact mathematical error margin ($\Delta\%$)
          against retail silicon, and penalizes fake specs via the Leaker Accountability Score ($LAS$).
        </p>
      </div>

      {/* Leaker Leaderboard Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          Empirical Leaker Accountability Scoreboard (LAS)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {LEAKER_LEADERBOARD.map((leaker, idx) => (
            <div
              key={leaker.name}
              className="bg-[#070c14] border border-white/[0.08] hover:border-amber-500/40 p-4 rounded-xl shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400">#{idx + 1}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-white/[0.06]">
                  {leaker.channel}
                </span>
              </div>
              <div className="font-bold text-sm text-white">{leaker.name}</div>
              <div className="text-[10px] text-slate-500 mt-1">
                {leaker.totalTracked} Claims ({leaker.accurateCount} Verified / {leaker.pendingCount} Pending)
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400">{leaker.hitRatePercent}%</div>
                  <div className="text-[9px] text-slate-500">Hit Accuracy</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-cyan-300">{leaker.lasScore}</div>
                  <div className="text-[9px] text-slate-500">LAS Metric</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delta Log Records Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#070c14] overflow-hidden shadow-2xl">
        <div className="px-5 py-3 bg-[#03060c] border-b border-white/[0.08] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Active Speculation vs Production Verification Ledger</span>
          <span>{allDeltas.length} Registered Historical Deltas</span>
        </div>

        <div className="divide-y divide-white/[0.04] text-xs">
          {allDeltas.map((delta) => {
            const isAccurate = delta.accuracyVerdict === 'accurate';
            const isPending = delta.accuracyVerdict === 'pending';
            const isInMargin = delta.accuracyVerdict === 'in_margin';

            return (
              <div
                key={delta.id}
                className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Entity & Source */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{delta.chipName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-white/[0.06]">
                      {delta.sourceChannel}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs">
                    Predicted by <strong className="text-amber-400">{delta.sourceName}</strong> on {delta.recordedAt}
                  </div>
                </div>

                {/* Prediction vs Confirmation */}
                <div className="flex items-center gap-3 bg-[#03060c] px-3.5 py-2 rounded-xl border border-white/[0.06]">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">{delta.predictedMetric}</div>
                    <div className="text-slate-300 font-bold">Predicted: {delta.predictedValue}</div>
                  </div>

                  <span className="text-slate-600">→</span>

                  <div>
                    <div className="text-[9px] text-slate-500 uppercase">Production Result</div>
                    <div className={isPending ? 'text-amber-400 italic font-semibold' : 'text-emerald-400 font-bold'}>
                      {delta.actualConfirmedValue || 'Awaiting Retail Launch'}
                    </div>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="flex items-center gap-2">
                  {delta.deltaPercentage !== undefined && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      Math.abs(delta.deltaPercentage) <= 2
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {delta.deltaPercentage > 0 ? `+${delta.deltaPercentage}%` : `${delta.deltaPercentage}%`}
                    </span>
                  )}

                  <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold uppercase flex items-center gap-1 ${
                    isAccurate
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isInMargin
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {isAccurate && <CheckCircle2 className="h-3 w-3" />}
                    {isInMargin && <CheckCircle2 className="h-3 w-3" />}
                    {isPending && <Clock className="h-3 w-3" />}
                    {delta.accuracyVerdict.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
