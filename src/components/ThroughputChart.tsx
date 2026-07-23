'use client';

import React, { useState } from 'react';
import { ChartPoint, Timeframe } from '../types/analytics';
import { Activity, Clock, Coins } from 'lucide-react';

interface ThroughputChartProps {
  data: ChartPoint[];
  timeframe: Timeframe;
}

export const ThroughputChart: React.FC<ThroughputChartProps> = ({ data, timeframe }) => {
  const [activeMetric, setActiveMetric] = useState<'requests' | 'latency' | 'tokens'>('requests');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 800;
  const height = 260;
  const padding = 35;

  const maxValue = Math.max(...data.map((d) => d[activeMetric])) * 1.15;
  const minValue = 0;

  const getX = (index: number) => {
    if (data.length <= 1) return padding;
    return padding + (index / (data.length - 1)) * (width - padding * 2);
  };

  const getY = (val: number) => {
    return height - padding - ((val - minValue) / (maxValue - minValue)) * (height - padding * 2);
  };

  const points = data.map((d, i) => `${getX(i)},${getY(d[activeMetric])}`).join(' ');
  const areaPoints = `${getX(0)},${height - padding} ${points} ${getX(data.length - 1)},${height - padding}`;

  const getMetricColor = () => {
    switch (activeMetric) {
      case 'requests':
        return { stroke: '#0284c7', fill: 'url(#gradientRequests)' };
      case 'latency':
        return { stroke: '#0891b2', fill: 'url(#gradientLatency)' };
      case 'tokens':
        return { stroke: '#4f46e5', fill: 'url(#gradientTokens)' };
    }
  };

  const colorConfig = getMetricColor();

  return (
    <div className="glass-panel p-6 mb-6 relative overflow-hidden border-sky-100">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">System Throughput & Performance</h3>
            <span className="text-xs font-mono text-sky-700 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-md font-semibold">
              {timeframe.toUpperCase()} Window
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time telemetry metrics for AI inference workloads
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-sky-50/80 p-1 rounded-xl border border-sky-200">
          <button
            id="chart-metric-req-btn"
            onClick={() => setActiveMetric('requests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'requests'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-sky-200" />
            Requests
          </button>
          <button
            id="chart-metric-latency-btn"
            onClick={() => setActiveMetric('latency')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'latency'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-cyan-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-200" />
            Latency (ms)
          </button>
          <button
            id="chart-metric-tokens-btn"
            onClick={() => setActiveMetric('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'tokens'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-indigo-700'
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-indigo-200" />
            Tokens
          </button>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[600px] overflow-visible"
        >
          <defs>
            <linearGradient id="gradientRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradientLatency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="gradientTokens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const yVal = padding + ratio * (height - padding * 2);
            return (
              <line
                key={i}
                x1={padding}
                y1={yVal}
                x2={width - padding}
                y2={yVal}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Filled Area under Curve */}
          <polygon points={areaPoints} fill={colorConfig.fill} />

          {/* Smooth Trend Line */}
          <polyline
            fill="none"
            stroke={colorConfig.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Hover Crosshair & Data Points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d[activeMetric]);
            const isHovered = hoverIndex === i;

            return (
              <g key={i}>
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padding}
                    x2={cx}
                    y2={height - padding}
                    stroke="#cbd5e1"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 4}
                  fill={isHovered ? '#ffffff' : colorConfig.stroke}
                  stroke={colorConfig.stroke}
                  strokeWidth="2"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredPoint(d);
                    setHoverIndex(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    setHoverIndex(null);
                  }}
                />

                <text
                  x={cx}
                  y={height - 10}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {d.timestamp}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Box */}
        {hoveredPoint && hoverIndex !== null && (
          <div
            className="absolute top-12 z-20 bg-white p-3 rounded-xl shadow-xl border border-sky-200 text-xs font-mono pointer-events-none animate-fade-in"
            style={{
              left: `${Math.min(Math.max((hoverIndex / (data.length - 1)) * 80 + 10, 10), 75)}%`,
            }}
          >
            <div className="font-bold text-slate-900 mb-1 border-b border-slate-100 pb-1">
              Time: {hoveredPoint.timestamp}
            </div>
            <div className="flex flex-col gap-1 text-slate-700">
              <span className="text-sky-700 font-semibold">
                Requests: <strong>{hoveredPoint.requests.toLocaleString()}</strong>
              </span>
              <span className="text-cyan-700 font-semibold">
                Latency: <strong>{hoveredPoint.latency} ms</strong>
              </span>
              <span className="text-indigo-700 font-semibold">
                Tokens: <strong>{(hoveredPoint.tokens / 1000).toFixed(1)}k</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
