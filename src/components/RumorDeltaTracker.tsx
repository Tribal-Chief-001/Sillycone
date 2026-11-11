'use client';

import React, { useMemo } from 'react';
import { Chip, LeakDeltaRecord } from '../types/silicon';
import { Award, AlertCircle, CheckCircle2, Clock, ExternalLink, ShieldCheck, TrendingUp } from 'lucide-react';

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

  // Compute leaker leaderboard statistics
  const leakerLeaderboard = useMemo(() => {
    const map: Record<string, { total: number; accurate: number; inMargin: number; pending: number; scores: number[] }> = {};

    allDeltas.forEach(d => {
      if (!map[d.sourceName]) {
        map[d.sourceName] = { total: 0, accurate: 0, inMargin: 0, pending: 0, scores: [] };
      }
      map[d.sourceName].total += 1;
      if (d.accuracyVerdict === 'accurate') map[d.sourceName].accurate += 1;
      if (d.accuracyVerdict === 'in_margin') map[d.sourceName].inMargin += 1;
      if (d.accuracyVerdict === 'pending') map[d.sourceName].pending += 1;
      map[d.sourceName].scores.push(d.confidenceScore);
    });

    return Object.entries(map).map(([name, stat]) => {
      const verifiedCount = stat.accurate + stat.inMargin;
      const verifiedTotal = stat.total - stat.pending;
      const hitRate = verifiedTotal > 0 ? ((verifiedCount / verifiedTotal) * 100).toFixed(0) : 'N/A';
      return {
        name,
        total: stat.total,
        verifiedCount,
        pending: stat.pending,
        hitRate: hitRate === 'N/A' ? 'Pending' : `${hitRate}%`,
        avgConfidence: (stat.scores.reduce((a, b) => a + b, 0) / stat.scores.length).toFixed(0),
      };
    }).sort((a, b) => b.verifiedCount - a.verifiedCount);
  }, [allDeltas]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Explanation */}
      <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent border border-amber-500/30 p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-bold text-white tracking-wide">
            The "Rumor-to-Silicon" Delta Tracker & Accountability Leaderboard
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Tech media forgets false leaks. Sillycone doesn't. We log hardware predictions months before launch,
          pair them against final production die-shots & independent lab reviews, and calculate the exact mathematical delta.
        </p>
      </div>

      {/* Leaker Leaderboard Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-sky-400" />
          Verified Leaker Accuracy Leaderboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leakerLeaderboard.map((leaker, idx) => (
            <div
              key={leaker.name}
              className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">#{idx + 1}</span>
                  <span className="font-bold text-sm text-white">{leaker.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {leaker.total} Tracked Claims • {leaker.pending} Pending
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-emerald-400 font-mono">{leaker.hitRate}</div>
                <div className="text-[10px] text-slate-500 font-mono">Hit Accuracy</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delta Log Records Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
            Historical Claim & Verification Log
          </span>
          <span className="text-xs font-mono text-slate-500">{allDeltas.length} Total Registered Deltas</span>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {allDeltas.map((delta) => {
            const isAccurate = delta.accuracyVerdict === 'accurate';
            const isPending = delta.accuracyVerdict === 'pending';
            const isInMargin = delta.accuracyVerdict === 'in_margin';

            return (
              <div key={delta.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Chip & Leaker info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-100 text-sm">{delta.chipName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {delta.sourceChannel}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs">
                    Source: <span className="text-amber-400 font-semibold">{delta.sourceName}</span> on {delta.recordedAt}
                  </div>
                </div>

                {/* Claim vs Actual */}
                <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">{delta.predictedMetric}</div>
                    <div className="text-slate-300 font-semibold">Predicted: {delta.predictedValue}</div>
                  </div>

                  <span className="text-slate-600">→</span>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Production Result</div>
                    <div className={isPending ? 'text-amber-400 italic' : 'text-emerald-400 font-semibold'}>
                      {delta.actualConfirmedValue || 'Awaiting Retail Launch'}
                    </div>
                  </div>
                </div>

                {/* Verdict Badge */}
                <div className="flex items-center gap-2">
                  {delta.deltaPercentage !== undefined && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      Math.abs(delta.deltaPercentage) <= 2
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {delta.deltaPercentage > 0 ? `+${delta.deltaPercentage}%` : `${delta.deltaPercentage}%`}
                    </span>
                  )}

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase flex items-center gap-1 ${
                    isAccurate
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isInMargin
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
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
