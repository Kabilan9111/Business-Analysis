import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { motion } from "framer-motion";
import { Users, HeartPulse, Target, UserCheck, UserX, UserMinus, ShieldAlert, BadgeDollarSign, MapPin, Search, Filter, MoreHorizontal, Activity, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

// Mock Data
const healthData = [
  { subject: 'Engagement', A: 120, fullMark: 150 },
  { subject: 'Adoption', A: 98, fullMark: 150 },
  { subject: 'Support', A: 86, fullMark: 150 },
  { subject: 'Revenue', A: 99, fullMark: 150 },
  { subject: 'Advocacy', A: 85, fullMark: 150 },
  { subject: 'Usage', A: 65, fullMark: 150 },
];

const ltvData = [
  { month: 'Jan', ltv: 1200 },
  { month: 'Feb', ltv: 1350 },
  { month: 'Mar', ltv: 1400 },
  { month: 'Apr', ltv: 1800 },
  { month: 'May', ltv: 2100 },
  { month: 'Jun', ltv: 2450 },
];

const customersList = [
  { id: "CUS-901", name: "Stark Industries", tier: "Enterprise", status: "Healthy", health: 92, ltv: "$145,000", risk: "Low", lastActive: "10 mins ago", avatar: "SI" },
  { id: "CUS-842", name: "Wayne Enterprises", tier: "Enterprise", status: "At Risk", health: 45, ltv: "$98,000", risk: "High", lastActive: "2 days ago", avatar: "WE" },
  { id: "CUS-773", name: "Oscorp Inc", tier: "Pro", status: "Healthy", health: 88, ltv: "$42,000", risk: "Low", lastActive: "1 hour ago", avatar: "OI" },
  { id: "CUS-612", name: "Acme Corp", tier: "Basic", status: "Churning", health: 12, ltv: "$4,500", risk: "Critical", lastActive: "14 days ago", avatar: "AC" },
  { id: "CUS-509", name: "Cyberdyne", tier: "Enterprise", status: "Warning", health: 65, ltv: "$112,000", risk: "Medium", lastActive: "5 hours ago", avatar: "CD" },
];

const Customers = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Customer Intelligence" 
          description="AI-driven CRM, churn prediction, behavioral segmentation, and health scoring." 
        />
        <div className="flex gap-2">
          <button className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition flex items-center gap-2">
             <Filter className="w-4 h-4" /> Smart Segments
          </button>
          <button className="bg-[#6432E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#5228c2] transition shadow-[0_0_15px_rgba(100,50,230,0.4)] flex items-center gap-2">
             <UserCheck className="w-4 h-4" /> Add Enterprise Account
          </button>
        </div>
      </div>

      {/* AI Persona & Prediction Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[#0A0A12] to-[#0D0D1A] border border-emerald-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><UserCheck className="w-16 h-16 text-emerald-400" /></div>
            <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Power Users</div>
            <div className="text-3xl font-black text-white mb-1">3,492</div>
            <div className="text-xs text-gray-400">High engagement, low churn risk</div>
         </motion.div>
         
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#0A0A12] to-[#0D0D1A] border border-amber-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><UserMinus className="w-16 h-16 text-amber-400" /></div>
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> High Churn Risk</div>
            <div className="text-3xl font-black text-white mb-1">428</div>
            <div className="text-xs text-gray-400">AI predicts churn within 30 days</div>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-[#0A0A12] to-[#0D0D1A] border border-[#6432E6]/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Target className="w-16 h-16 text-[#6432E6]" /></div>
            <div className="text-[#c084fc] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> Upsell Potential</div>
            <div className="text-3xl font-black text-white mb-1">$2.4M</div>
            <div className="text-xs text-gray-400">Expansion ARR identified by AI</div>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">AI Recommendations</div>
            <div className="space-y-3">
               <div className="flex items-start gap-2 text-xs">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                 <span className="text-gray-300">Schedule check-in with <span className="text-white font-medium">Wayne Enterprises</span>. Risk score increased by 15%.</span>
               </div>
               <div className="flex items-start gap-2 text-xs">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                 <span className="text-gray-300">Offer Pro upgrade to <span className="text-white font-medium">Oscorp Inc</span>. Usage limits reached 3 times.</span>
               </div>
            </div>
         </motion.div>
      </div>

      {/* Middle Row: Health & LTV */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Customer Health Radar */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
               <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2"><HeartPulse className="w-4 h-4 text-rose-400" /> Global Health Score</h3>
               <span className="text-2xl font-black text-emerald-400">84/100</span>
            </div>
            <p className="w-full text-xs text-gray-400 mb-4">Aggregate scoring across all active accounts.</p>
            <div className="flex-1 w-full h-[280px]">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthData}>
                     <PolarGrid stroke="#ffffff22" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa', fontSize: 11 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                     <Radar name="Health" dataKey="A" stroke="#6432E6" strokeWidth={2} fill="#6432E6" fillOpacity={0.4} />
                     <Tooltip contentStyle={{ backgroundColor: "#0A0A12", borderColor: "#333", borderRadius: "8px", fontSize: "12px" }} />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         {/* LTV Forecasting */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <div>
                 <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2"><BadgeDollarSign className="w-4 h-4 text-emerald-400" /> LTV Forecasting</h3>
                 <p className="text-xs text-gray-400 mt-1">Predicted Customer Lifetime Value growth trajectory.</p>
               </div>
               <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Est. Average LTV</div>
                  <div className="text-2xl font-bold text-white">$2,450</div>
               </div>
            </div>
            <div className="flex-1 w-full min-h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ltvData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="ltvColor" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                           <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                     <XAxis dataKey="month" stroke="#ffffff55" tickLine={false} axisLine={false} dy={10} fontSize={11} />
                     <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(val) => `$${val}`} />
                     <Tooltip contentStyle={{ backgroundColor: "#0A0A12", borderColor: "#333", borderRadius: "8px", fontSize: "12px" }} />
                     <Area type="monotone" dataKey="ltv" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#ltvColor)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </motion.div>
      </div>

      {/* Enterprise CRM Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#0A0A12] border border-white/5 rounded-xl shadow-lg overflow-hidden flex flex-col">
         <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/20">
            <h3 className="text-base font-semibold text-white tracking-tight">Customer Intelligence Database</h3>
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
               <input 
                  type="text" 
                  placeholder="Semantic search (e.g. 'high risk enterprise')" 
                  className="w-full sm:w-80 h-9 pl-9 pr-4 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6432E6] transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="bg-black/40 text-[10px] text-gray-400 uppercase tracking-wider">
                     <th className="py-4 px-6 font-semibold">Customer</th>
                     <th className="py-4 px-6 font-semibold">Tier</th>
                     <th className="py-4 px-6 font-semibold">Health Score</th>
                     <th className="py-4 px-6 font-semibold">Est. LTV</th>
                     <th className="py-4 px-6 font-semibold">Churn Risk</th>
                     <th className="py-4 px-6 font-semibold">Last Active</th>
                     <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {customersList.map((customer, i) => (
                     <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="py-4 px-6 flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${customer.health > 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : customer.health < 40 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                              {customer.avatar}
                           </div>
                           <div>
                              <div className="text-white font-medium">{customer.name}</div>
                              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{customer.id}</div>
                           </div>
                        </td>
                        <td className="py-4 px-6">
                           <span className="bg-white/5 text-gray-300 px-2.5 py-1 rounded-md text-[11px] font-medium border border-white/5">{customer.tier}</span>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                 <div className={`h-full ${customer.health > 80 ? 'bg-emerald-500' : customer.health < 40 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${customer.health}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-white">{customer.health}</span>
                           </div>
                        </td>
                        <td className="py-4 px-6 text-white font-medium font-mono text-xs">{customer.ltv}</td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-bold uppercase tracking-wider ${
                              customer.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              customer.risk === 'Critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                              customer.risk === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                           }`}>
                              {customer.risk === 'Critical' && <ShieldAlert className="w-3 h-3" />} {customer.risk}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-400 flex items-center gap-1.5 mt-1.5">
                           <Activity className={`w-3 h-3 ${customer.lastActive.includes('days') ? 'text-gray-600' : 'text-emerald-400'}`} /> {customer.lastActive}
                        </td>
                        <td className="py-4 px-6 text-right">
                           <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center text-xs text-gray-500">
            <span>Showing 1-5 of 12,450 records</span>
            <div className="flex gap-1">
               <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50" disabled>Prev</button>
               <button className="px-3 py-1 border border-white/10 rounded bg-white/5 text-white">1</button>
               <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5">2</button>
               <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5">Next</button>
            </div>
         </div>
      </motion.div>

    </div>
  );
};

export default Customers;