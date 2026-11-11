'use client';

import React, { useState, useMemo } from 'react';
import { Chip } from '../types/silicon';
import { Activity, Sliders, Zap, Award, Flame, Info } from 'lucide-react';

interface EfficiencyCurveExplorerProps {
  chips: Chip[];
}

export const EfficiencyCurveExplorer: React.FC<EfficiencyCurveExplorerProps> = ({ chips }) => {
  const [sliderWattage, setSliderWattage] = useState<number>(15);

  // Filter chips with benchmark & power data
  const profiledChips = useMemo(() => {
    return chips.filter(c => c.benchmarks.some(b => b.category === 'cpu_ipc_geekbench6') && c.powerParams);
  }, [chips]);

  // Model dynamic single-core score scaling at arbitrary power limit (W)
  // Formulated from dynamic V/F power modeling: P = C * V^2 * f + Pleak
  const calculateSimulatedScore = (chip: Chip, targetWatt: number) => {
    const gb = chip.benchmarks.find(b => b.category === 'cpu_ipc_geekbench6');
    if (!gb) return 0;

    const baseScore = gb.singleScore;
    const measuredPower = gb.powerWattage || chip.tdpMinW;

    if (chip.segment === 'mobile_soc') {
      // Mobile cores saturate very early (~8W)
      if (targetWatt <= measuredPower) {
        const ratio = targetWatt / measuredPower;
        return Math.round(baseScore * Math.pow(ratio, 0.45));
      } else {
        // Severe voltage wall beyond 9W
        const excess = targetWatt - measuredPower;
        return Math.round(baseScore + Math.min(excess * 15, 120));
      }
    } else {
      // Desktop / Laptop cores (Arrow Lake / Zen 5)
      // High static leakage, needs 15W+ to wake up, scales heavily from 30W to 125W
      if (targetWatt < 8) {
        return Math.round(baseScore * 0.25); // Throttles severely below minimal operating voltage (Vmin)
      } else if (targetWatt <= 35) {
        const ratio = targetWatt / 35;
        return Math.round(baseScore * (0.65 + 0.35 * ratio));
      } else if (targetWatt <= measuredPower) {
        const ratio = targetWatt / measuredPower;
        return Math.round(baseScore * (0.85 + 0.15 * ratio));
      } else {
        return baseScore;
      }
    }
  };

  const rankedAtWattage = useMemo(() => {
    return profiledChips.map(chip => {
      const simScore = calculateSimulatedScore(chip, sliderWattage);
      const pointsPerWatt = sliderWattage > 0 ? (simScore / sliderWattage).toFixed(1) : '0';
      return {
        chip,
        simScore,
        pointsPerWatt,
      };
    }).sort((a, b) => b.simScore - a.simScore);
  }, [profiledChips, sliderWattage]);

  return (
    <div className="space-y-6 font-telemetry">
      {/* Header Banner */}
      <div className="bg-[#050912] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Cross-Platform Voltage/Frequency & Efficiency Curve Simulator
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            P(f) = C · V² · f + P_leak
          </span>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Comparing a 5W smartphone SoC to a 125W desktop processor with a single raw score is fundamentally broken.
          Slide the power envelope below to simulate who actually delivers the highest compute density at any given wattage constraint.
        </p>
      </div>

      {/* Interactive Power Slider HUD */}
      <div className="bg-[#070c14] border border-white/[0.08] p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase text-slate-200">
              Allocated System Thermal Budget (cTDP):
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-amber-400">{sliderWattage}W</span>
            <span className="text-[10px] text-slate-400">
              {sliderWattage <= 7 ? '(Smartphone Envelope)' : sliderWattage <= 28 ? '(Ultrabook Envelope)' : '(Desktop Eco Envelope)'}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="4"
          max="125"
          step="1"
          value={sliderWattage}
          onChange={(e) => setSliderWattage(Number(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
        />

        {/* Preset Wattage Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[
            { w: 5, label: '5W (Phone Fanless)' },
            { w: 12, label: '12W (Phone Peak)' },
            { w: 28, label: '28W (Thin & Light Laptop)' },
            { w: 65, label: '65W (Desktop Eco)' },
            { w: 125, label: '125W (Desktop Base)' },
          ].map(({ w, label }) => (
            <button
              key={w}
              onClick={() => setSliderWattage(w)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                sliderWattage === w
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Dynamic Scaling Leaderboard */}
      <div className="bg-[#070c14] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 bg-[#03060c] border-b border-white/[0.08] flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
          <span>Simulation Outcome @ {sliderWattage}W Allocated Budget</span>
          <span>Ranked by Single-Core IPC</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {rankedAtWattage.map(({ chip, simScore, pointsPerWatt }, index) => {
            const isWinner = index === 0;
            const maxScoreInList = rankedAtWattage[0].simScore || 1;
            const barWidth = Math.round((simScore / maxScoreInList) * 100);

            return (
              <div
                key={chip.id}
                className="p-4 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Entity Info */}
                <div className="flex items-center gap-3 min-w-[260px]">
                  <span className={`text-sm font-bold w-6 ${isWinner ? 'text-amber-400' : 'text-slate-600'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{chip.marketingName}</span>
                      {isWinner && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Award className="h-2.5 w-2.5" /> EFFICIENCY LEADER
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {chip.vendor} • {chip.packagingTech} • Native TDP: {chip.tdpMinW}-{chip.tdpMaxW}W
                    </div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="flex-1 w-full max-w-md">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Simulated GB6 Single:</span>
                    <span className="font-bold text-cyan-300">{simScore.toLocaleString()} pts</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/[0.06]">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isWinner ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'bg-cyan-500/60'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>

                {/* Efficiency Metric */}
                <div className="text-right min-w-[120px]">
                  <div className="text-sm font-bold text-emerald-400">{pointsPerWatt}</div>
                  <div className="text-[10px] text-slate-500">pts / Watt</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
