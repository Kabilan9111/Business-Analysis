import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target, 
  Download, Filter, ChevronDown, Search, Activity, Zap, AlertTriangle, 
  CheckCircle2, Box, RefreshCw, Calendar, ArrowUpRight, ArrowDownRight,
  Database, Laptop, Smartphone, Globe, AlertOctagon, BarChart3
} from 'lucide-react';

/* ==============================================================================
   MOCK ENTERPRISE DATA 
============================================================================== */

const KPIS = [
  { id: 1, label: "Total Revenue", value: "$1,245,650", trend: "+19.2%", isUp: true, compare: "vs last month", icon: DollarSign },
  { id: 2, label: "Total Orders", value: "14,840", trend: "+12.4%", isUp: true, compare: "vs last month", icon: ShoppingCart },
  { id: 3, label: "Avg Order Value", value: "$423.17", trend: "+8.1%", isUp: true, compare: "vs last month", icon: Target },
  { id: 4, label: "Repeat Customers", value: "8,342", trend: "+15.6%", isUp: true, compare: "vs last month", icon: Users },
  { id: 5, label: "Retention Rate", value: "68.4%", trend: "+2.3%", isUp: true, compare: "vs last month", icon: Activity },
  { id: 6, label: "Revenue Goal", value: "88.5%", trend: "On Track", isUp: true, compare: "Monthly Target", icon: BarChart3 },
  { id: 7, label: "Refund Rate", value: "2.4%", trend: "-0.5%", isUp: true, compare: "vs last month", icon: RefreshCw }, // Down is good for refunds, but we'll show success color
  { id: 8, label: "Predicted Nxt Mo", value: "$1.45M", trend: "+16.4%", isUp: true, compare: "AI Forecast", icon: Zap },
];

const TREND_DATA = Array.from({ length: 15 }, (_, i) => ({
  date: `May ${i + 1}`,
  revenue: Math.floor(Math.random() * 20000) + 40000,
  orders: Math.floor(Math.random() * 50) + 100,
  forecast: i > 12 ? Math.floor(Math.random() * 20000) + 45000 : null,
  lower: i > 12 ? 35000 : null,
  upper: i > 12 ? 75000 : null
}));
TREND_DATA[12].forecast = TREND_DATA[12].revenue; // Connect line
TREND_DATA[12].lower = TREND_DATA[12].revenue;
TREND_DATA[12].upper = TREND_DATA[12].revenue;

const CATEGORIES = [
  { name: 'SaaS Subs', value: 485000, color: '#6432E6', growth: '+24%' },
  { name: 'Enterprise Lic', value: 345000, color: '#10b981', growth: '+15%' },
  { name: 'Custom Dev', value: 215000, color: '#3b82f6', growth: '+8%' },
  { name: 'Support SLA', value: 120650, color: '#f59e0b', growth: '-2%' },
  { name: 'API Usage', value: 80000, color: '#ec4899', growth: '+42%' },
];

const TRANSACTIONS = [
  { id: 'ORD-8821', customer: 'Acme Corp', product: 'Enterprise Suite', category: 'Software', rev: '$24,500', qty: 1, region: 'North America', payment: 'Wire Transfer', status: 'Completed', date: '2026-05-13' },
  { id: 'ORD-8822', customer: 'Globex Inc', product: 'API Volume Pack', category: 'API Usage', rev: '$3,200', qty: 4, region: 'Europe', payment: 'Credit Card', status: 'Completed', date: '2026-05-13' },
  { id: 'ORD-8823', customer: 'Soylent Ltd', product: 'Custom Integration', category: 'Custom Dev', rev: '$18,000', qty: 1, region: 'Asia Pacific', payment: 'Wire Transfer', status: 'Pending', date: '2026-05-12' },
  { id: 'ORD-8824', customer: 'Initech', product: 'Pro Subscription', category: 'SaaS Subs', rev: '$4,800', qty: 12, region: 'North America', payment: 'ACH', status: 'Completed', date: '2026-05-12' },
  { id: 'ORD-8825', customer: 'Umbrella Corp', product: 'Support SLA Tier 1', category: 'Support', rev: '$1,200', qty: 1, region: 'Europe', payment: 'Credit Card', status: 'Refunded', date: '2026-05-11' },
];

const INSIGHTS = [
  { id: 1, text: "Revenue increased 19.2% driven by a spike in Enterprise License renewals.", severity: "success", cat: "Revenue", conf: 96, time: "2h ago" },
  { id: 2, text: "Weekend conversions for SaaS Subscriptions outperform weekdays by 24%.", severity: "info", cat: "Conversion", conf: 92, time: "5h ago" },
  { id: 3, text: "API Usage tier upgrades are accelerating in the Asia Pacific region.", severity: "success", cat: "Growth", conf: 88, time: "1d ago" },
];

const ALERTS = [
  { id: 1, title: "Churn Risk Detected", text: "3 high-value accounts show dropping login activity.", severity: "critical" },
  { id: 2, title: "Refund Spike", text: "Support SLA refunds up 2% in the last 48 hours.", severity: "high" },
  { id: 3, title: "Anomaly", text: "Unusual traffic originating from non-target region (SA).", severity: "medium" },
];

const REGIONS = [
  { name: 'North America', rev: '$585k', share: 47, trend: '+12%' },
  { name: 'Europe', rev: '$340k', share: 27, trend: '+8%' },
  { name: 'Asia Pacific', rev: '$195k', share: 16, trend: '+22%' },
  { name: 'Latin America', rev: '$85k', share: 7, trend: '-4%' },
  { name: 'Middle East & Africa', rev: '$40k', share: 3, trend: '+15%' },
];

const PRODUCTS = [
  { name: 'Enterprise Suite', rev: '$345k', growth: '+15%', conv: '4.2%' },
  { name: 'Pro Subscription', rev: '$280k', growth: '+22%', conv: '6.8%' },
  { name: 'Custom Implementation', rev: '$215k', growth: '+8%', conv: '1.2%' },
];

/* ==============================================================================
   COMPONENTS 
============================================================================== */

const PremiumCard = ({ children, className = "" }) => (
  <div className={`bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300 ${className}`}>
    <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-[#6432E6]/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Refunded': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Cancelled': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function SalesAnalytics() {
  const [metric, setMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <div className="min-h-screen bg-[#050508] p-4 md:p-8 text-gray-100 font-sans selection:bg-[#6432E6]/30">
      <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-700">
        
        {/* 1. TOP HEADER */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-[#0A0A12] border border-white/5 rounded-3xl p-4 px-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6432E6] to-[#3b82f6] flex items-center justify-center shadow-[0_0_20px_rgba(100,50,230,0.4)]">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Sales Analytics</h1>
                <p className="text-sm text-gray-400">Real-time enterprise performance & revenue intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search orders, customers..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#6432E6]/50 focus:ring-1 focus:ring-[#6432E6]/50 transition-all text-white placeholder-gray-500"
              />
            </div>
            
            {/* Date Range */}
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors">
                <Calendar className="w-4 h-4 text-[#6432E6]" />
                <span className="text-sm font-medium">{dateRange}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Live Indicator & Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Sync</span>
              </div>
              <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-300" />
              </button>
              <button className="flex items-center gap-2 bg-[#6432E6] hover:bg-[#7f52f0] border border-[#6432E6] rounded-xl px-4 py-2 text-sm font-medium transition-all shadow-[0_0_20px_-5px_rgba(100,50,230,0.5)]">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>
        </header>

        {/* 2. KPI CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((kpi) => (
            <PremiumCard key={kpi.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:border-[#6432E6]/30 transition-colors">
                  <kpi.icon className="w-5 h-5 text-[#6432E6] group-hover:text-white transition-colors" />
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md border ${kpi.isUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <h3 className="text-gray-400 font-medium text-sm mb-1">{kpi.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{kpi.value}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">{kpi.compare}</p>
            </PremiumCard>
          ))}
        </div>

        {/* 3. MAIN TREND CHART & CATEGORIES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <PremiumCard className="lg:col-span-2 flex flex-col min-h-[420px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#6432E6]" /> Revenue & Forecast Trend
                </h2>
                <p className="text-xs text-gray-400 mt-1">Historical actuals vs 95% AI confidence prediction bounds.</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                {['Revenue', 'Orders', 'Profit'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMetric(m.toLowerCase())}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${metric === m.toLowerCase() ? 'bg-[#6432E6] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 h-full w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6432E6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6432E6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '13px' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '4px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}/>
                  
                  {/* Historical Area */}
                  <Area type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#6432E6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  
                  {/* Forecast Lines & Area */}
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#colorForecast)" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#0A0A12" />
                  <Line type="monotone" dataKey="forecast" name="AI Predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>

          {/* Categories */}
          <PremiumCard className="flex flex-col">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-[#6432E6]" /> Category Performance
            </h2>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }} 
                  />
                  <Pie data={CATEGORIES} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {CATEGORIES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Total</span>
                <span className="text-xl font-bold text-white">$1.24M</span>
              </div>
            </div>
            
            {/* Category Legend */}
            <div className="mt-4 space-y-3 flex-1 overflow-auto pr-2 custom-scrollbar">
              {CATEGORIES.map((cat, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">${(cat.value/1000).toFixed(1)}k</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{cat.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>

        {/* 4. AI INSIGHTS & RISK DETECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights */}
          <PremiumCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> AI Revenue Insights
              </h2>
              <span className="text-xs bg-[#6432E6]/20 text-[#6432E6] px-2 py-1 rounded border border-[#6432E6]/30 font-bold">Auto-Generated</span>
            </div>
            <div className="space-y-4">
              {INSIGHTS.map((insight) => (
                <div key={insight.id} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="mt-1">
                    {insight.severity === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Activity className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 leading-relaxed mb-2">{insight.text}</p>
                    <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      <span className="text-[#6432E6]">{insight.cat} Focus</span>
                      <span>•</span>
                      <span>{insight.conf}% Confidence</span>
                      <span>•</span>
                      <span>{insight.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          {/* Alert System */}
          <PremiumCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" /> Risk & Detection
              </h2>
              <span className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20 font-bold">3 Active</span>
            </div>
            <div className="space-y-4">
              {ALERTS.map((alert) => (
                <div key={alert.id} className="p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all border-l-2 bg-gradient-to-r from-transparent to-white/[0.01]" 
                     style={{ borderLeftColor: alert.severity === 'critical' ? '#ef4444' : alert.severity === 'high' ? '#f59e0b' : '#3b82f6' }}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                    <StatusBadge status={alert.severity === 'critical' ? 'Cancelled' : 'Pending'} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{alert.text}</p>
                  <button className="mt-3 text-[11px] font-bold text-[#6432E6] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                    Investigate <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>

        {/* 5. REGIONS & TOP PRODUCTS & GOALS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PremiumCard>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-[#6432E6]" /> Regional Penetration
            </h2>
            <div className="space-y-5">
              {REGIONS.map((region, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-300">{region.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{region.rev}</span>
                      <span className={`text-[10px] font-bold ${region.trend.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{region.trend}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${region.share}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-gradient-to-r from-[#6432E6] to-[#a855f7] h-full rounded-full" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Box className="w-5 h-5 text-[#6432E6]" /> Top Products
            </h2>
            <div className="space-y-4">
              {PRODUCTS.map((prod, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="text-2xl font-black text-white/20 group-hover:text-[#6432E6] transition-colors">
                    0{i+1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-0.5">{prod.name}</h4>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">Rev: <strong className="text-gray-200">{prod.rev}</strong></span>
                      <span className="text-gray-600">•</span>
                      <span className="text-emerald-400 font-bold">{prod.growth}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#6432E6] bg-[#6432E6]/10 px-2 py-1 rounded-md">{prod.conv} CVR</span>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard className="flex flex-col items-center justify-center text-center p-8">
            <Target className="w-10 h-10 text-[#6432E6] mb-4 opacity-80" />
            <h2 className="text-xl font-bold text-white mb-2">Q2 Revenue Target</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-[200px]">Aggregated goal vs actual performance across all channels.</p>
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                <motion.circle 
                  cx="80" cy="80" r="70" 
                  stroke="url(#purpleGradient)" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="440" 
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * 74) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6432E6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">74%</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Achieved</span>
              </div>
            </div>
            
            <div className="flex justify-between w-full mt-6 text-sm font-bold">
              <span className="text-gray-400">0</span>
              <span className="text-[#10b981]">$1.5M</span>
            </div>
          </PremiumCard>
        </div>

        {/* 6. TRANSACTION TABLE */}
        <PremiumCard className="!p-0 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-white/[0.01]">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#6432E6]" /> Enterprise Ledger
              </h2>
              <p className="text-xs text-gray-400 mt-1">Real-time view of master transaction database.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors">
                Filter Status
              </button>
              <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors">
                Date Range
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#000000] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-widest pl-6">Order ID</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Customer</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Product / Category</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Region</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Value</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Status</th>
                  <th className="px-6 py-4 font-bold tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {TRANSACTIONS.map((tx, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-300 pl-6 group-hover:text-white transition-colors">{tx.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{tx.customer}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{tx.product}</div>
                      <div className="text-xs text-[#6432E6] font-bold mt-0.5">{tx.category}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{tx.region}</td>
                    <td className="px-6 py-4 font-bold text-white">{tx.rev} <span className="text-xs text-gray-500 font-normal ml-1">x{tx.qty}</span></td>
                    <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 text-center bg-white/[0.01]">
            <button className="text-xs font-bold text-[#6432E6] hover:text-white uppercase tracking-wider transition-colors">
              View All Transactions →
            </button>
          </div>
        </PremiumCard>

      </div>
    </div>
  );
}