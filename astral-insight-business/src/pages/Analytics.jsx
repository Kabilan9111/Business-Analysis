import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Activity, Eye, Zap, AlertTriangle, Lightbulb, Info, AlertOctagon, TrendingUp, TrendingDown, RefreshCw, Filter, PlayCircle, ShieldAlert, ArrowRight, MousePointer2 } from "lucide-react";

// Mock Data
const liveTrafficData = Array.from({ length: 20 }).map((_, i) => ({ time: `-${20-i}m`, users: Math.floor(Math.random() * 500) + 200 }));
const funnelData = [
  { step: "Landing Page", users: 14500, dropoff: 0 },
  { step: "Product View", users: 8900, dropoff: 38 },
  { step: "Add to Cart", users: 3400, dropoff: 61 },
  { step: "Checkout", users: 2100, dropoff: 38 },
  { step: "Purchase", users: 1250, dropoff: 40 }
];
const cohortData = [
  { month: "Jan", "M1": 100, "M2": 45, "M3": 35, "M4": 28, "M5": 25, "M6": 22 },
  { month: "Feb", "M1": 100, "M2": 48, "M3": 38, "M4": 30, "M5": 26, "M6": 0 },
  { month: "Mar", "M1": 100, "M2": 52, "M3": 42, "M4": 35, "M5": 0, "M6": 0 },
];

const insights = [
  { id: 1, type: "critical", title: "Checkout Drop-off Spike", desc: "40% increase in abandonment at payment step detected in the last 2 hours. AI suspects a payment gateway timeout issue.", icon: AlertOctagon, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: 2, type: "warning", title: "Organic Traffic Dip", desc: "Search traffic from EU regions is down by 12% compared to the 7-day moving average.", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: 3, type: "opportunity", title: "High Conversions via Email", desc: "The 'Winter Promo' email campaign is converting at 18.5%. AI recommends increasing ad spend for this cohort.", icon: Lightbulb, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: 4, type: "info", title: "New User Cohort Active", desc: "Users acquired via TikTok ads are spending 3x more time on Product pages.", icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" }
];

const Analytics = () => {
  const [viewMode, setViewMode] = useState("analyst"); // executive, analyst, operational
  const [liveUsers, setLiveUsers] = useState(1243);

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Intelligence Center" 
          description="AI-powered real-time analytics, predictive forecasting, and advanced behavioral insights." 
        />
        <div className="flex items-center gap-2 bg-[#0A0A12] border border-white/5 p-1 rounded-lg">
          {["executive", "analyst", "operational"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${viewMode === mode ? 'bg-[#6432E6] text-white shadow-[0_0_15px_rgba(100,50,230,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Bounce Rate", value: "32.4%", change: "-2.1%", positive: true },
          { label: "Avg Session", value: "4m 12s", change: "+14s", positive: true },
          { label: "Conv. Rate", value: "4.8%", change: "+0.5%", positive: true },
          { label: "CAC", value: "$42.50", change: "-$4.20", positive: true },
          { label: "ROAS", value: "3.2x", change: "+0.4x", positive: true },
          { label: "CTR", value: "6.2%", change: "-0.8%", positive: false },
          { label: "Rev / Visitor", value: "$12.40", change: "+$1.10", positive: true },
          { label: "Returning %", value: "48%", change: "+5%", positive: true },
        ].map((kpi, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={i} className="bg-[#0A0A12] border border-white/5 rounded-xl p-4 shadow-lg hover:border-white/10 transition-colors">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="text-lg font-bold text-white mb-1">{kpi.value}</div>
            <div className={`text-[10px] font-medium flex items-center gap-1 ${kpi.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top Row: Real-time & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-time Visitor Intelligence */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#0A0A12] to-[#0D0D1A] border border-[#6432E6]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(100,50,230,0.1)] relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6432E6] to-fuchsia-500"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6432E6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
              </span>
              Live Visitor Pulse
            </h3>
            <span className="text-xs text-gray-400 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Syncing</span>
          </div>
          <div className="flex items-end gap-4 mb-6">
            <div>
              <div className="text-[10px] text-[#6432E6] font-bold uppercase tracking-widest mb-1">Active Users</div>
              <div className="text-5xl font-black text-white tracking-tighter">{liveUsers.toLocaleString()}</div>
            </div>
            <div className="flex-1 pb-1">
              <div className="text-xs text-emerald-400 font-medium">+142 in last 5 mins</div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[120px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveTrafficData}>
                <defs>
                  <linearGradient id="liveColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6432E6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6432E6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="users" stroke="#C084FC" strokeWidth={2} fillOpacity={1} fill="url(#liveColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Analytics Insights Engine */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1 lg:col-span-2 bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-semibold text-white tracking-tight">AI Insights Engine</h3>
            </div>
            <button className="text-xs bg-[#6432E6]/10 text-[#6432E6] hover:bg-[#6432E6]/20 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1">
              Ask Copilot <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {insights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-xl border ${insight.border} ${insight.bg} flex gap-4 items-start`}>
                <div className={`p-2 rounded-lg bg-[#0A0A12] shadow-sm ${insight.color}`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">{insight.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{insight.desc}</p>
                  {insight.type === 'critical' && (
                    <button className="mt-3 text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 hover:bg-rose-500/20 transition">Investigate Pipeline</button>
                  )}
                  {insight.type === 'opportunity' && (
                    <button className="mt-3 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition">Apply Recommendation</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Middle Row: Funnel & Heatmap Replays */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Advanced Conversion Funnel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="xl:col-span-2 bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-semibold text-white tracking-tight">AI-Optimized Conversion Funnel</h3>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/5">
                <button className="px-3 py-1 text-xs font-medium rounded bg-white/10 text-white">All Users</button>
                <button className="px-3 py-1 text-xs font-medium rounded text-gray-400 hover:text-white">Mobile</button>
                <button className="px-3 py-1 text-xs font-medium rounded text-gray-400 hover:text-white">Paid</button>
              </div>
           </div>
           
           <div className="flex flex-col gap-2 relative">
              {funnelData.map((step, index) => {
                 const maxUsers = funnelData[0].users;
                 const widthPct = (step.users / maxUsers) * 100;
                 return (
                   <div key={index} className="relative w-full h-16 flex items-center group">
                      <div className="w-[120px] text-xs font-medium text-gray-300 z-10">{step.step}</div>
                      <div className="flex-1 h-full flex items-center relative pr-20">
                          <motion.div 
                             initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                             className={`h-10 rounded-r-lg relative flex items-center px-4 ${index === 0 ? 'bg-[#6432E6]/80' : index === 1 ? 'bg-[#6432E6]/60' : index === 2 ? 'bg-[#6432E6]/40' : index === 3 ? 'bg-[#6432E6]/30' : 'bg-[#10B981]/60'}`}
                          >
                             <span className="text-xs font-bold text-white shadow-sm">{step.users.toLocaleString()}</span>
                          </motion.div>
                          {step.dropoff > 0 && (
                            <div className="absolute right-0 text-[10px] text-rose-400 flex items-center gap-1 font-semibold">
                               <TrendingDown className="w-3 h-3" /> -{step.dropoff}% drop
                               {step.dropoff > 50 && <AlertTriangle className="w-3 h-3 text-amber-500 ml-1" title="High Bottleneck" />}
                            </div>
                          )}
                      </div>
                   </div>
                 )
              })}
           </div>
        </motion.div>

        {/* Session Replay & UX Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col">
            <h3 className="text-base font-semibold text-white tracking-tight mb-4">UX Friction & Replays</h3>
            <p className="text-xs text-gray-400 mb-6">AI detected 3 major frustration points today.</p>
            
            <div className="space-y-4 flex-1">
               {[
                 { id: "R-893", issue: "Rage Clicks on 'Submit' button", page: "/checkout", users: 142, severity: "high" },
                 { id: "R-102", issue: "Dead Scroll (No engagement)", page: "/pricing", users: 89, severity: "medium" },
                 { id: "R-441", issue: "Form Abandonment (Field 3)", page: "/register", users: 312, severity: "high" }
               ].map((replay, i) => (
                 <div key={i} className="bg-black/40 border border-white/5 rounded-lg p-3 hover:border-white/10 transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] font-mono text-[#6432E6] bg-[#6432E6]/10 px-1.5 py-0.5 rounded">{replay.id}</span>
                         <span className="text-xs font-medium text-white">{replay.issue}</span>
                       </div>
                       {replay.severity === 'high' ? <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> : <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                       <span>Path: <span className="text-gray-300">{replay.page}</span></span>
                       <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {replay.users} affected</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[10px] font-medium text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded">
                         <PlayCircle className="w-3 h-3" /> Watch AI Summary
                       </button>
                       <button className="text-[10px] font-medium text-blue-400 flex items-center gap-1 hover:text-blue-300">
                         <MousePointer2 className="w-3 h-3" /> View Heatmap
                       </button>
                    </div>
                 </div>
               ))}
            </div>
        </motion.div>
      </div>

      {/* Predictive Analytics & Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Traffic Prediction */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg">
            <h3 className="text-base font-semibold text-white tracking-tight mb-2">Predictive Traffic Forecasting</h3>
            <p className="text-xs text-gray-400 mb-6">AI models project a 15% increase next week based on current marketing spend.</p>
            <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[
                    { name: 'Mon', actual: 4000, predicted: 4100 },
                    { name: 'Tue', actual: 3000, predicted: 3200 },
                    { name: 'Wed', actual: 5000, predicted: 4800 },
                    { name: 'Thu', actual: 2780, predicted: 3000 },
                    { name: 'Fri', actual: 1890, predicted: 2200 },
                    { name: 'Sat', actual: null, predicted: 4500, isFuture: true },
                    { name: 'Sun', actual: null, predicted: 5100, isFuture: true },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff55" tickLine={false} axisLine={false} dy={10} fontSize={10} />
                    <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={10} />
                    <Tooltip cursor={{ fill: "#ffffff05" }} contentStyle={{ backgroundColor: "#0A0A12", borderColor: "#333", borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="actual" fill="#6432E6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Line type="monotone" dataKey="predicted" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
               <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 bg-[#6432E6] rounded-sm"></div> Actual Traffic</div>
               <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-[2px] bg-[#10B981] border-dashed border-b border-[#10B981]"></div> AI Prediction</div>
            </div>
         </motion.div>

         {/* Cohort Retention Matrix */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg overflow-x-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white tracking-tight">Retention Cohorts</h3>
              <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg bg-black/20">
                 <Filter className="w-3 h-3" /> Segment: All
              </button>
            </div>
            <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className="text-[10px] text-gray-500 uppercase tracking-wider border-b border-white/5">
                   <th className="pb-3 font-semibold">Cohort</th>
                   <th className="pb-3 font-semibold text-center">Month 1</th>
                   <th className="pb-3 font-semibold text-center">Month 2</th>
                   <th className="pb-3 font-semibold text-center">Month 3</th>
                   <th className="pb-3 font-semibold text-center">Month 4</th>
                   <th className="pb-3 font-semibold text-center">Month 5</th>
                 </tr>
               </thead>
               <tbody className="text-xs">
                 {cohortData.map((row, i) => (
                   <tr key={i} className="border-b border-white/5">
                     <td className="py-3 font-medium text-white">{row.month} <span className="text-gray-500 text-[10px] ml-1">(2.1k)</span></td>
                     {['M1', 'M2', 'M3', 'M4', 'M5'].map((m, j) => {
                        const val = row[m];
                        if (val === 0) return <td key={j} className="py-2 px-1 text-center"><div className="w-full h-8 flex items-center justify-center text-gray-600 bg-white/[0.02] rounded">-</div></td>;
                        const opacity = val / 100;
                        return (
                          <td key={j} className="py-2 px-1 text-center">
                             <div className="w-full h-8 flex items-center justify-center font-bold rounded" style={{ backgroundColor: `rgba(100,50,230,${opacity})`, color: opacity > 0.4 ? '#fff' : '#aaa' }}>
                               {val}%
                             </div>
                          </td>
                        )
                     })}
                   </tr>
                 ))}
               </tbody>
            </table>
         </motion.div>
      </div>
      
    </div>
  );
};

export default Analytics;
