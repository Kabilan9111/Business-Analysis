import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target,
  Download, ChevronDown, Search, Activity, Zap, RefreshCw, Calendar,
  ArrowUpRight, ArrowDownRight, Database, Globe, AlertOctagon,
  BarChart3, CheckCircle2, Loader2
} from 'lucide-react';

const API = 'http://localhost:3001/api';

async function apiFetch(path) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`API ${r.status}`);
  const j = await r.json();
  return j.data ?? j;
}

function useAPI(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await fn()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, deps);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, refetch: load };
}

const fmt = (n) => n >= 1e7 ? `₹${(n / 1e7).toFixed(2)}Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)}L` : `₹${Number(n).toLocaleString('en-IN')}`;
const fmtPct = (n) => `${n > 0 ? '+' : ''}${Number(n).toFixed(1)}%`;

const COLORS = ['#6432E6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

const PremiumCard = ({ children, className = '' }) => (
  <div className={`bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300 ${className}`}>
    <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-[#6432E6]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const s = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    refunded: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${s[status?.toLowerCase()] || s.pending}`}>
      {status}
    </span>
  );
};

const SkeletonCard = () => (
  <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 animate-pulse">
    <div className="h-3 bg-white/5 rounded w-1/2 mb-4" />
    <div className="h-8 bg-white/5 rounded w-3/4 mb-2" />
    <div className="h-2 bg-white/5 rounded w-1/3" />
  </div>
);

export default function SalesAnalytics() {
  const [dateRange, setDateRange] = useState(30);
  const [txPage, setTxPage] = useState(1);
  const [txSearch, setTxSearch] = useState('');
  const [metric, setMetric] = useState('revenue');

  const { data: dash, loading: dashLoading, refetch } = useAPI(
    () => apiFetch(`/sales/dashboard?days=${dateRange}`), [dateRange]
  );
  const { data: txData, loading: txLoading } = useAPI(
    () => apiFetch(`/sales/transactions?page=${txPage}&limit=20`), [txPage]
  );

  const kpis = dash?.kpis;
  const trends = dash?.trends || [];
  const categories = dash?.categories || [];
  const regional = dash?.regional || [];
  const topProducts = dash?.topProducts || [];
  const insights = dash?.insights || [];

  const kpiCards = kpis ? [
    { label: 'Total Revenue', value: fmt(kpis.totalRevenue), trend: fmtPct(kpis.revenueGrowth ?? 0), isUp: (kpis.revenueGrowth ?? 0) >= 0, icon: DollarSign },
    { label: 'Total Orders', value: kpis.totalOrders?.toLocaleString('en-IN'), trend: '', isUp: true, icon: ShoppingCart },
    { label: 'Avg Order Value', value: fmt(kpis.avgOrderValue), trend: '', isUp: true, icon: Target },
    { label: 'Repeat Customers', value: kpis.repeatCustomers?.toLocaleString('en-IN'), trend: `${kpis.repeatCustomerPct?.toFixed(1)}%`, isUp: true, icon: Users },
    { label: 'Retention Rate', value: `${kpis.retentionRate?.toFixed(1)}%`, trend: '', isUp: kpis.retentionRate > 50, icon: Activity },
    { label: 'MRR', value: fmt(kpis.monthlyRecurringRevenue), trend: '', isUp: true, icon: BarChart3 },
    { label: 'Refund Rate', value: `${kpis.refundRate?.toFixed(2)}%`, trend: '', isUp: kpis.refundRate < 5, icon: RefreshCw },
    { label: 'Churn Risk Accts', value: kpis.churnRiskCount?.toString(), trend: 'High Priority', isUp: false, icon: Zap },
  ] : [];

  return (
    <div className="min-h-screen bg-[#050508] p-4 md:p-8 text-gray-100 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* HEADER */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-[#0A0A12] border border-white/5 rounded-3xl p-4 px-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6432E6] to-[#3b82f6] flex items-center justify-center shadow-[0_0_20px_rgba(100,50,230,0.4)]">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sales Analytics</h1>
              <p className="text-sm text-gray-400">Live PostgreSQL · {kpis?.totalCustomers?.toLocaleString('en-IN') || '—'} customers</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={txSearch} onChange={e => setTxSearch(e.target.value)} type="text" placeholder="Search transactions..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#6432E6]/50 text-white placeholder-gray-500" />
            </div>
            {[30, 60, 90].map(d => (
              <button key={d} onClick={() => setDateRange(d)} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${dateRange === d ? 'bg-[#6432E6] border-[#6432E6] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                {d}d
              </button>
            ))}
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live DB</span>
            </div>
            <button onClick={refetch} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
              <RefreshCw className={`w-4 h-4 text-gray-300 ${dashLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashLoading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : kpiCards.map((kpi, i) => (
              <PremiumCard key={i}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5"><kpi.icon className="w-5 h-5 text-[#6432E6]" /></div>
                  {kpi.trend && (
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md border ${kpi.isUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{kpi.trend}
                    </div>
                  )}
                </div>
                <h3 className="text-gray-400 font-medium text-sm mb-1">{kpi.label}</h3>
                <span className="text-3xl font-bold text-white tracking-tight">{kpi.value ?? '—'}</span>
              </PremiumCard>
            ))}
        </div>

        {/* TREND CHART + CATEGORIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PremiumCard className="lg:col-span-2 flex flex-col h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-[#6432E6]" />Revenue Trend</h2>
                <p className="text-xs text-gray-400 mt-1">Daily revenue from PostgreSQL · {trends.length} data points</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                {['Revenue', 'Orders'].map(m => (
                  <button key={m} onClick={() => setMetric(m.toLowerCase())} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${metric === m.toLowerCase() ? 'bg-[#6432E6] text-white' : 'text-gray-400 hover:text-white'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 h-[320px] w-full">
              {dashLoading ? <div className="h-full w-full bg-white/[0.02] rounded-xl animate-pulse" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6432E6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6432E6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => metric === 'revenue' ? `₹${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff', fontSize: '12px' }} labelStyle={{ color: '#9ca3af', fontSize: '11px' }} />
                    <Area type="monotone" dataKey={metric === 'revenue' ? 'revenue' : 'orders'} name={metric === 'revenue' ? 'Revenue (₹)' : 'Orders'} stroke="#6432E6" strokeWidth={2.5} fill="url(#colorRev)" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </PremiumCard>

          <PremiumCard className="flex flex-col h-[420px]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">Category Revenue</h2>
            {dashLoading ? <div className="flex-1 w-full bg-white/[0.02] rounded-xl animate-pulse" /> : (
              <>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff', fontSize: '12px' }} />
                      <Pie data={categories} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                        {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categories.slice(0, 5).map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-gray-300">{cat.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{fmt(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </PremiumCard>
        </div>

        {/* INSIGHTS + ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PremiumCard>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" />AI Revenue Insights</h2>
              <span className="text-xs bg-[#6432E6]/20 text-[#6432E6] px-2 py-1 rounded border border-[#6432E6]/30 font-bold">DB-Driven</span>
            </div>
            {dashLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white/[0.02] rounded-xl animate-pulse" />)}</div>
              : insights.length === 0
                ? <p className="text-gray-500 text-sm text-center py-8">No insights generated yet</p>
                : <div className="space-y-3">{insights.map((ins, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${ins.severity === 'success' ? 'text-emerald-400' : ins.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-200 leading-relaxed">{ins.text || ins.description}</p>
                      <div className="flex gap-3 mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <span className="text-[#6432E6]">{ins.category}</span>
                        {ins.confidence && <><span>•</span><span>{ins.confidence}% Confidence</span></>}
                      </div>
                    </div>
                  </div>
                ))}</div>}
          </PremiumCard>

          <AlertsPanel dateRange={dateRange} />
        </div>

        {/* REGIONS + TOP PRODUCTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PremiumCard>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5"><Globe className="w-5 h-5 text-[#6432E6]" />Regional Performance</h2>
            {dashLoading ? <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-10 bg-white/[0.02] rounded-lg animate-pulse" />)}</div>
              : <div className="space-y-4">{regional.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-300">{r.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{fmt(r.revenue)}</span>
                      <span className="text-[10px] text-gray-500">{r.marketShare}% share</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${r.marketShare}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="bg-gradient-to-r from-[#6432E6] to-[#a855f7] h-full rounded-full" />
                  </div>
                </div>
              ))}</div>}
          </PremiumCard>

          <PremiumCard>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5"><Database className="w-5 h-5 text-[#6432E6]" />Top Products</h2>
            {dashLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-white/[0.02] rounded-xl animate-pulse" />)}</div>
              : <div className="space-y-3">{topProducts.slice(0, 5).map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-2xl font-black text-white/20 hover:text-[#6432E6] transition-colors">0{i+1}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span className="text-gray-400">{fmt(p.revenue)}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">{p.orders} orders</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#6432E6] bg-[#6432E6]/10 px-2 py-1 rounded-md">{p.category}</span>
                </div>
              ))}</div>}
          </PremiumCard>
        </div>

        {/* TRANSACTIONS TABLE */}
        <PremiumCard className="!p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Database className="w-5 h-5 text-[#6432E6]" />Enterprise Ledger</h2>
              <p className="text-xs text-gray-400 mt-0.5">Live from PostgreSQL · {txData?.pagination?.total?.toLocaleString('en-IN') || '—'} records</p>
            </div>
            <button onClick={() => window.open(`${API}/sales/export?format=csv`)} className="flex items-center gap-2 bg-[#6432E6] hover:bg-[#7f52f0] px-4 py-2 rounded-xl text-sm font-medium transition-all">
              <Download className="w-4 h-4" />Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black border-b border-white/5">
                <tr>{['Order ID','Customer','Product','Region','Amount','Status','Date'].map(h => <th key={h} className="px-5 py-4 font-bold tracking-widest">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {txLoading
                  ? Array(8).fill(0).map((_, i) => <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>)
                  : (txData?.orders || []).filter(tx => !txSearch || tx.customer?.toLowerCase().includes(txSearch.toLowerCase()) || tx.id?.toLowerCase().includes(txSearch.toLowerCase())).map((tx, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-gray-300">{tx.id}</td>
                      <td className="px-5 py-3.5 font-medium text-white">{tx.customer}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-white text-sm">{tx.product}</div>
                        <div className="text-xs text-[#6432E6] font-bold">{tx.category}</div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">{tx.region}</td>
                      <td className="px-5 py-3.5 font-bold text-white">{fmt(tx.amount)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={tx.paymentStatus} /></td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">{tx.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {txData?.pagination && (
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-500">Page {txData.pagination.page} of {txData.pagination.pages}</span>
              <div className="flex gap-2">
                <button disabled={txPage <= 1} onClick={() => setTxPage(p => p-1)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 disabled:opacity-40 transition-colors">← Prev</button>
                <button disabled={txPage >= txData.pagination.pages} onClick={() => setTxPage(p => p+1)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 disabled:opacity-40 transition-colors">Next →</button>
              </div>
            </div>
          )}
        </PremiumCard>

      </div>
    </div>
  );
}

function AlertsPanel({ dateRange }) {
  const { data: alerts, loading } = useAPI(() => apiFetch('/sales/alerts'), []);
  return (
    <PremiumCard>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertOctagon className="w-5 h-5 text-rose-400" />Risk & Detection</h2>
        {!loading && <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20 font-bold">{alerts?.length || 0} Active</span>}
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-white/[0.02] rounded-xl animate-pulse" />)}</div>
        : !alerts?.length ? <p className="text-gray-500 text-sm text-center py-8">No active alerts — all systems normal</p>
        : <div className="space-y-3">{alerts.slice(0, 5).map((a, i) => {
          const col = a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f59e0b' : '#3b82f6';
          return (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-gradient-to-r from-transparent to-white/[0.01]" style={{ borderLeftWidth: 2, borderLeftColor: col }}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-white">{a.title}</h4>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded" style={{ color: col, backgroundColor: `${col}20` }}>{a.severity}</span>
              </div>
              <p className="text-xs text-gray-400">{a.text || a.alertMessage}</p>
              {a.customer && <p className="text-xs text-[#6432E6] mt-1 font-medium">{a.customer} · {a.tier}</p>}
            </div>
          );
        })}</div>}
    </PremiumCard>
  );
}