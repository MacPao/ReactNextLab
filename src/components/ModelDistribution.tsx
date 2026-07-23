'use client';

import React from 'react';
import { ModelUsage } from '../types/analytics';
import { Cpu, DollarSign, Zap } from 'lucide-react';

interface ModelDistributionProps {
  models: ModelUsage[];
}

export const ModelDistribution: React.FC<ModelDistributionProps> = ({ models }) => {
  return (
    <div className="glass-panel p-6 mb-6 border-sky-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600" /> Model Share & Resource Allocation
          </h3>
          <p className="text-xs text-slate-500">
            Usage distribution across active Gemini foundation models
          </p>
        </div>
        <div className="text-xs text-slate-600 font-mono bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 font-semibold">
          3 Active Models
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {models.map((model) => (
          <div
            key={model.name}
            id={`model-card-${model.name.replace(/\s+/g, '-').toLowerCase()}`}
            className="bg-white/80 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all group"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  {model.name}
                </span>
                <span className="text-xs font-mono font-bold text-sky-700">
                  {model.share}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${model.share}%`,
                    backgroundColor: model.color,
                  }}
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-2">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Requests</span>
                  <span className="text-slate-900 font-bold">{model.requestCount.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Tokens</span>
                  <span className="text-slate-900 font-bold">{model.totalTokens}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-100 text-slate-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-600" /> {model.avgLatency} ms
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <DollarSign className="w-3 h-3" /> {model.cost}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
