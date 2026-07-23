'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { PosProduct } from '../types/poc';
import { kpiService, kpiPostgrestSqlDdl } from '../services/kpiService';
import { mockPosDailyTrend, mockPosHourlyTrend, mockPosRevenueShare } from '../data/pocData';
import { dateFormatter } from '../utils/dateFormatter';
import { 
  ShoppingBag, 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  TrendingUp, 
  Store,
  Grid,
  Code2,
  Database,
  Terminal,
  ShieldCheck,
  Zap,
  Check,
  BarChart2,
  PieChart as PieChartIcon,
  Calendar,
  Sliders,
  Palette
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart,
  Area,
  Line, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const COLOR_PALETTES = [
  { name: 'Royal Blue', main: '#2563eb', secondary: '#059669' },
  { name: 'Emerald Teal', main: '#0d9488', secondary: '#d97706' },
  { name: 'Vibrant Purple', main: '#7c3aed', secondary: '#0284c7' },
  { name: 'Sunset Amber', main: '#ea580c', secondary: '#2563eb' },
  { name: 'Modern Rose', main: '#e11d48', secondary: '#0d9488' },
];

export const PosPerformancePage: React.FC = () => {
  const { m, locale } = useI18n();
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'spec'>('dashboard');
  const [trendTimeframe, setTrendTimeframe] = useState<'daily' | 'hourly'>('daily');
  const [copiedSample, setCopiedSample] = useState<string | null>(null);

  // Flexible Chart Styling Controls
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [topOpacity, setTopOpacity] = useState<number>(0.65);
  const [bottomOpacity, setBottomOpacity] = useState<number>(0.05);
  const [chartMode, setChartMode] = useState<'area' | 'line' | 'bar'>('area');
  const [showStyleControls, setShowStyleControls] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    kpiService.getPosProducts().then((data) => {
      if (isMounted) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalRevenue = '$702,470';
  const totalTx = '16,790';
  const avgUptime = '99.94%';

  const activeTrendData = trendTimeframe === 'daily' ? mockPosDailyTrend : mockPosHourlyTrend;
  const formattedTrendData = activeTrendData.map((item) => ({
    ...item,
    label: trendTimeframe === 'daily' ? dateFormatter.formatChartDay(item.date, locale) : item.date,
  }));

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSample(label);
    setTimeout(() => setCopiedSample(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-8 enterprise-panel flex items-center justify-center text-sm text-[var(--text-secondary)] font-medium">
        Loading POS Fleet Metrics & Business Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-5 w-full">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-main)] pb-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Store className="w-5 h-5 text-[var(--brand-primary)]" />
            {m.kpi.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {m.kpi.subtitle}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[var(--border-main)] rounded-md p-1 bg-[var(--bg-subtle)]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{m.kpi.dashboardTab || 'POS Dashboard & Charts'}</span>
            </button>

            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'spec'
                  ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{m.kpi.specTab || 'PostgREST & PostgreSQL DDL Spec'}</span>
            </button>
          </div>

          <span className="badge-status badge-status-success text-xs hidden sm:inline-flex">
            {m.kpi.activeFleets}
          </span>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 w-full">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="enterprise-panel p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                  {m.kpi.totalRevenue}
                </span>
                <span className="text-2xl font-bold text-[var(--text-primary)]">{totalRevenue}</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +10.6%
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="enterprise-panel p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                  {m.kpi.totalTx}
                </span>
                <span className="text-2xl font-bold text-[var(--text-primary)]">{totalTx}</span>
                <span className="text-xs text-[var(--text-secondary)] block mt-1">
                  {m.kpi.activeFleets}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] text-[var(--brand-primary)] border border-[var(--border-main)]">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="enterprise-panel p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                  {m.kpi.uptimeSla}
                </span>
                <span className="text-2xl font-bold text-[var(--text-primary)]">{avgUptime}</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                  {m.kpi.targetMet}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-subtle)] text-emerald-600 border border-[var(--border-main)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* VISUAL CHARTS SECTION (Recharts Area/Line/Bar & PieChart) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
            {/* Main Trend Chart */}
            <div className="lg:col-span-2 enterprise-panel p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-main)] pb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[var(--brand-primary)]" />
                  {trendTimeframe === 'daily' ? 'Daily Revenue & Transaction Trend' : 'Hourly Telemetry Stream'}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Style Customizer Toggle Button */}
                  <button
                    onClick={() => setShowStyleControls(!showStyleControls)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 border transition-colors ${
                      showStyleControls
                        ? 'bg-[var(--brand-primary)] text-white border-transparent'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-main)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Styling & Opacity</span>
                  </button>

                  {/* Timeframe Switcher Toggle */}
                  <div className="flex items-center gap-1 bg-[var(--bg-subtle)] p-0.5 rounded border border-[var(--border-main)] text-xs">
                    <button
                      onClick={() => setTrendTimeframe('daily')}
                      className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-colors ${
                        trendTimeframe === 'daily'
                          ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Daily (7D)</span>
                    </button>

                    <button
                      onClick={() => setTrendTimeframe('hourly')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                        trendTimeframe === 'hourly'
                          ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-2xs'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>Hourly</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Flexible Color & Opacity Customizer Toolbar */}
              {showStyleControls && (
                <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Color Palette Selection */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--text-secondary)] flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5" /> Palette:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {COLOR_PALETTES.map((pal) => (
                          <button
                            key={pal.name}
                            onClick={() => setSelectedPalette(pal)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-semibold transition-all ${
                              selectedPalette.name === pal.name
                                ? 'border-[var(--brand-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs ring-1 ring-[var(--brand-primary)]'
                                : 'border-[var(--border-main)] text-[var(--text-secondary)] hover:border-[var(--border-muted)]'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pal.main }} />
                            <span>{pal.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Mode Selector */}
                    <div className="flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                      <span>Type:</span>
                      <div className="flex items-center gap-1 border border-[var(--border-main)] rounded p-0.5 bg-[var(--bg-surface)]">
                        <button
                          onClick={() => setChartMode('area')}
                          className={`px-2 py-0.5 rounded text-[11px] ${chartMode === 'area' ? 'bg-[var(--brand-primary)] text-white' : 'hover:text-[var(--text-primary)]'}`}
                        >
                          Gradient Area
                        </button>
                        <button
                          onClick={() => setChartMode('line')}
                          className={`px-2 py-0.5 rounded text-[11px] ${chartMode === 'line' ? 'bg-[var(--brand-primary)] text-white' : 'hover:text-[var(--text-primary)]'}`}
                        >
                          Smooth Line
                        </button>
                        <button
                          onClick={() => setChartMode('bar')}
                          className={`px-2 py-0.5 rounded text-[11px] ${chartMode === 'bar' ? 'bg-[var(--brand-primary)] text-white' : 'hover:text-[var(--text-primary)]'}`}
                        >
                          Bar + Line
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Opacity Sliders & Presets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[var(--border-muted)]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-[var(--text-secondary)] shrink-0">
                        Top <code className="text-[var(--brand-primary)] font-bold">stopOpacity</code> ({Math.round(topOpacity * 100)}%):
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={topOpacity}
                        onChange={(e) => setTopOpacity(parseFloat(e.target.value))}
                        className="w-28 accent-[var(--brand-primary)] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-[var(--text-secondary)] shrink-0">
                        Bottom <code className="text-[var(--brand-primary)] font-bold">stopOpacity</code> ({Math.round(bottomOpacity * 100)}%):
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.01"
                        value={bottomOpacity}
                        onChange={(e) => setBottomOpacity(parseFloat(e.target.value))}
                        className="w-28 accent-[var(--brand-primary)] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Chart Canvas with SVG LinearGradients & stopOpacity */}
              <div className="w-full h-72 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={formattedTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="primaryRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedPalette.main} stopOpacity={topOpacity} />
                        <stop offset="95%" stopColor={selectedPalette.main} stopOpacity={bottomOpacity} />
                      </linearGradient>

                      <linearGradient id="secondaryTxGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedPalette.secondary} stopOpacity={topOpacity * 0.8} />
                        <stop offset="95%" stopColor={selectedPalette.secondary} stopOpacity={bottomOpacity} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" />
                    <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                    <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-main)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: any, name: any) => [
                        name === 'revenue' ? `$${Number(value).toLocaleString()}` : Number(value).toLocaleString(),
                        name === 'revenue' ? 'Revenue ($)' : 'Transactions (Tx)',
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

                    {/* Primary Series (Revenue) */}
                    {chartMode === 'area' && (
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        name="revenue"
                        stroke={selectedPalette.main}
                        strokeWidth={2.5}
                        fill="url(#primaryRevenueGradient)"
                        dot={{ r: 4, fill: selectedPalette.main }}
                        activeDot={{ r: 6 }}
                      />
                    )}

                    {chartMode === 'line' && (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        name="revenue"
                        stroke={selectedPalette.main}
                        strokeWidth={3}
                        dot={{ r: 4, fill: selectedPalette.main }}
                        activeDot={{ r: 6 }}
                      />
                    )}

                    {chartMode === 'bar' && (
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        name="revenue"
                        fill="url(#primaryRevenueGradient)"
                        stroke={selectedPalette.main}
                        radius={[4, 4, 0, 0]}
                      />
                    )}

                    {/* Secondary Series (Transactions) */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="transactions"
                      name="transactions"
                      stroke={selectedPalette.secondary}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: selectedPalette.secondary }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PieChart / Donut: Fleet Revenue Contribution */}
            <div className="enterprise-panel p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-[var(--brand-primary)]" />
                  Product Revenue Share
                </h3>
                <span className="text-xs text-[var(--text-secondary)] font-medium">5 Fleets</span>
              </div>

              <div className="w-full h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockPosRevenueShare}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {mockPosRevenueShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-main)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                      }}
                      formatter={(val: any) => `$${Number(val).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Listing */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-[var(--border-muted)]">
                {mockPosRevenueShare.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[var(--text-secondary)] truncate max-w-[130px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[var(--text-primary)]">{item.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* POS Product Table View */}
          <div className="enterprise-panel p-5 space-y-4 w-full">
            <h3 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wider">
              {m.kpi.productBreakdown}
            </h3>

            <div className="overflow-x-auto rounded-md border border-[var(--border-main)] w-full">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-b border-[var(--border-main)] uppercase text-xs tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="py-3 px-4">{m.kpi.table.productName}</th>
                    <th className="py-3 px-4">{m.kpi.table.productCode}</th>
                    <th className="py-3 px-4">{m.kpi.table.dailyRevenue}</th>
                    <th className="py-3 px-4">{m.kpi.table.txCount}</th>
                    <th className="py-3 px-4">{m.kpi.table.avgTicket}</th>
                    <th className="py-3 px-4">{m.kpi.table.uptime}</th>
                    <th className="py-3 px-4">{m.kpi.table.status}</th>
                    <th className="py-3 px-4 text-right">{m.kpi.table.growth}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-muted)] text-[var(--text-primary)] whitespace-nowrap">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[var(--brand-primary)] shrink-0" />
                        {prod.name}
                      </td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{prod.code}</td>
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">{prod.dailyRevenue}</td>
                      <td className="py-3 px-4">{prod.transactions.toLocaleString()}</td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{prod.avgTicket}</td>
                      <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{prod.uptime}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge-status ${
                            prod.status === 'Online'
                              ? 'badge-status-success'
                              : 'badge-status-warning'
                          }`}
                        >
                          {prod.status === 'Online' ? m.kpi.statusOnline : m.kpi.statusWarning}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[var(--brand-primary)]">{prod.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SPEC TAB VIEW: PostgREST & PostgreSQL Architecture */}
      {activeTab === 'spec' && (
        <div className="space-y-5 w-full">
          {/* PostgREST Architecture Overview */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                PostgREST Instant API Architecture
              </h3>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              PostgREST turns PostgreSQL database schemas directly into fully compliant RESTful APIs. HTTP request roles are validated via JWT claims and mapped to PostgreSQL database roles with Row Level Security (RLS) policies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-1">
                <span className="font-bold text-[var(--brand-primary)] block">PostgreSQL RLS Security</span>
                <span className="text-[var(--text-secondary)]">Database tables enforce row-level access using JWT claims.</span>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Automatic OpenAPI Spec</span>
                <span className="text-[var(--text-secondary)]">Generates Swagger / OpenAPI v3 docs dynamically from DB comments.</span>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-main)] space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">PostgreSQL Stored Procedures (RPC)</span>
                <span className="text-[var(--text-secondary)]">Exposes DB PL/pgSQL functions via <code className="font-mono">/rpc/*</code> endpoints.</span>
              </div>
            </div>
          </div>

          {/* PostgREST Endpoint & cURL Samples */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <div className="enterprise-panel p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
                <Terminal className="w-5 h-5 text-[var(--brand-primary)]" />
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {m.kpi.postgrestTitle || 'PostgREST Automatic RESTful Routing & Filtering Syntax'}
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">GET</span> /api/get_order_today
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-sans">
                    <strong>Next.js API Wrapper Proxy</strong>: Hides raw PostgREST RPC <code className="font-mono">/rpc/get_order_today</code> URL from public client exposure.
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">GET</span> /api/kpi/pos-products
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-sans">
                    <strong>BFF Endpoint</strong>: Fetches online POS products by internal server-side proxy to PostgREST <code className="font-mono">/pos_products?status=eq.Online</code>.
                  </div>
                </div>

                <div className="p-2.5 bg-[var(--bg-subtle)] rounded border border-[var(--border-main)] font-mono">
                  <span className="font-bold text-amber-600 dark:text-amber-400">POST</span> /api/rpc/rpc_calculate_pos_kpi_summary
                  <div className="text-[11px] text-[var(--text-tertiary)] mt-1 font-sans">
                    Calls stored procedure to return total revenue, transaction counts, and average uptime.
                  </div>
                </div>
              </div>
            </div>

            <div className="enterprise-panel p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--brand-primary)]" />
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    {m.kpi.curlTitle || 'PostgREST HTTP & JWT Authentication Requests'}
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard('curl -H "Authorization: Bearer <JWT_TOKEN>" "http://localhost:3000/api/pos_products?status=eq.Online"', 'curl')}
                  className="btn-enterprise-secondary text-xs py-1 px-2 flex items-center gap-1"
                >
                  {copiedSample === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  <span>{copiedSample === 'curl' ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded border border-[var(--border-main)] text-xs font-mono overflow-x-auto leading-relaxed">
{`curl -X GET "http://localhost:3000/api/pos_products?status=eq.Online" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -H "Accept: application/json"`}
              </pre>
            </div>
          </div>

          {/* Database Schema & RLS DDL Section */}
          <div className="enterprise-panel p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-[var(--border-main)] pb-3">
              <Database className="w-5 h-5 text-[var(--brand-primary)]" />
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                {m.kpi.dbSchemaTitle || 'PostgreSQL Schema, RLS Security Policies & RPC Functions (DDL)'}
              </h3>
            </div>

            <pre className="p-3 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-md border border-[var(--border-main)] text-xs overflow-x-auto">
              {kpiPostgrestSqlDdl}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
