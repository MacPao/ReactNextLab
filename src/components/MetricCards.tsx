'use client';

import React from 'react';
import { MetricCardData } from '../types/analytics';
import { 
  Activity, 
  Zap, 
  Coins, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricCardData[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'requests':
        return <Activity className="w-5 h-5 text-sky-600" />;
      case 'latency':
        return <Zap className="w-5 h-5 text-cyan-600" />;
      case 'tokens':
        return <Coins className="w-5 h-5 text-indigo-600" />;
      case 'satisfaction':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Activity className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {metrics.map((card) => (
        <div
          key={card.id}
          id={`metric-card-${card.id}`}
          className="glass-panel glass-panel-hover p-5 relative overflow-hidden group cursor-pointer border-sky-100"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-sky-400/10 blur-xl group-hover:bg-sky-400/20 transition-all duration-300" />

          {/* Card Top Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-sky-50 border border-sky-100 group-hover:border-sky-300 transition-colors">
              {getIcon(card.id)}
            </div>
          </div>

          {/* Metric Value */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {card.value}
            </h2>
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                card.isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {card.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{card.change}</span>
            </div>
          </div>

          {/* Subtitle Details */}
          <p className="text-xs text-slate-500 font-mono flex items-center justify-between">
            <span>{card.subValue}</span>
          </p>
        </div>
      ))}
    </div>
  );
};
