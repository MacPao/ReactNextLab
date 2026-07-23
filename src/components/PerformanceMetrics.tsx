'use client';

import React from 'react';
import { Globe, HardDrive, CheckCircle } from 'lucide-react';

export const PerformanceMetrics: React.FC = () => {
  const regions = [
    { name: 'us-central1 (Iowa)', latency: 84, availability: '99.99%', load: '48%' },
    { name: 'us-east4 (N. Virginia)', latency: 92, availability: '99.98%', load: '28%' },
    { name: 'europe-west1 (Belgium)', latency: 132, availability: '99.95%', load: '16%' },
    { name: 'asia-east1 (Taiwan)', latency: 168, availability: '99.92%', load: '8%' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Regional Latency Breakdown */}
      <div className="glass-panel p-6 lg:col-span-2 border-sky-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-600" /> Regional Edge Endpoints
            </h3>
            <p className="text-xs text-slate-500">
              Inference latency & availability across global deployment regions
            </p>
          </div>
          <span className="status-pill status-pill-success">
            <span className="pulse-dot bg-emerald-500" /> Global Anycast Active
          </span>
        </div>

        <div className="space-y-3">
          {regions.map((reg) => (
            <div
              key={reg.name}
              className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between hover:border-sky-300 transition-all text-xs font-mono shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-900 font-bold block">{reg.name}</span>
                  <span className="text-slate-400 text-[10px]">Load: {reg.load} capacity</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-cyan-700 font-bold block">{reg.latency} ms</span>
                  <span className="text-slate-400 text-[10px]">p95 latency</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold block">{reg.availability}</span>
                  <span className="text-slate-400 text-[10px]">SLA Uptime</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Hit Ratio & System Health */}
      <div className="glass-panel p-6 flex flex-col justify-between border-sky-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-1">
            <HardDrive className="w-5 h-5 text-indigo-600" /> Prompt Caching & Efficiency
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Context reuse efficiency and token savings
          </p>

          {/* Cache Circle Progress */}
          <div className="bg-sky-50/80 p-4 rounded-xl border border-sky-200 text-center mb-4 relative overflow-hidden">
            <div className="text-3xl font-bold font-mono text-indigo-700 mb-1">74.2%</div>
            <span className="text-xs text-slate-600 font-mono font-semibold">Prompt Cache Hit Ratio</span>
            <p className="text-[11px] text-emerald-700 font-mono font-bold mt-2">
              Saved ~34.8M tokens ($142.10) this period
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-700">
            <div className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
              <span>Dynamic Routing:</span>
              <strong className="text-emerald-700">Enabled</strong>
            </div>
            <div className="flex justify-between p-2 bg-white rounded-lg border border-slate-100">
              <span>Throttling Protection:</span>
              <strong className="text-sky-700">0.06% rate</strong>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <CheckCircle className="w-3.5 h-3.5" /> Telemetry Healthy
          </span>
          <span>Last sync: 2s ago</span>
        </div>
      </div>
    </div>
  );
};
