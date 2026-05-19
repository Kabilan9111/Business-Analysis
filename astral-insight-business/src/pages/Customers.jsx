import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { motion } from "framer-motion";
import { Users, HeartPulse, Target, UserCheck, UserX, UserMinus, ShieldAlert, BadgeDollarSign, MapPin, Search, Filter, MoreHorizontal, Activity, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

const API_BASE = 'http://localhost:3001/api';

const Customers = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Data state
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [powerUsers, setPowerUsers] = useState(0);
  const [highChurnRisk, setHighChurnRisk] = useState(0);
  const [upsellPotential, setUpsellPotential] = useState("$0");
  const [globalHealth, setGlobalHealth] = useState(84);
  const [healthData, setHealthData] = useState([]);
  const [ltvData, setLtvData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch all customer data on component mount and when page/search changes
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const [
          customersRes,
          metricsRes,
          healthRes,
          ltvRes,
          recsRes
        ] = await Promise.all([
          fetch(`${API_BASE}/customers?page=${page}&limit=10${search ? `&search=${search}` : ''}`),
          fetch(`${API_BASE}/customers/metrics`),
          fetch(`${API_BASE}/customers/global-health`),
          fetch(`${API_BASE}/customers/ltv-trend?months=6`),
          fetch(`${API_BASE}/customers/recommendations`)
        ]);

        const [customersData, metricsData, healthData, ltvData, recsData] = await Promise.all([
          customersRes.json(),
          metricsRes.json(),
          healthRes.json(),
          ltvRes.json(),
          recsRes.json()
        ]);

        // Update customers table
        setCustomers(customersData.data?.customers || []);
        setTotalCustomers(customersData.data?.total || 0);

        // Update metrics
        const metrics = metricsData.data || {};
        setPowerUsers(metrics.powerUsers || 0);
        setHighChurnRisk(metrics.highChurnRisk || 0);
        setUpsellPotential(metrics.upsellPotentialRevenue || "$0");

        // Update health score and radar data
        const health = healthData.data || {};
        setGlobalHealth(health.globalHealthScore || 84);
        setHealthData([
          { subject: 'Engagement', A: Math.round(health.engagement * 1.5), fullMark: 150 },
          { subject: 'Adoption', A: Math.round(health.adoption * 1.5), fullMark: 150 },
          { subject: 'Support', A: Math.round(health.support * 1.5), fullMark: 150 },
          { subject: 'Revenue', A: Math.round(health.revenue * 1.5), fullMark: 150 },
          { subject: 'Advocacy', A: Math.round(health.advocacy * 1.5), fullMark: 150 },
          { subject: 'Usage', A: Math.round(health.usage * 1.5), fullMark: 150 }
        ]);

        // Update LTV data
        setLtvData(ltvData.data || []);

        // Update recommendations
        setRecommendations(recsData.data || []);
      } catch (error) {
        console.error('Failed to fetch customer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [page, search]);

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
            <div className="text-3xl font-black text-white mb-1">{powerUsers.toLocaleString()}</div>
            <div className="text-xs text-gray-400">High engagement, low churn risk</div>
         </motion.div>
         
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#0A0A12] to-[#0D0D1A] border border-amber-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><UserMinus className="w-16 h-16 text-amber-400" /></div>
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> High Churn Risk</div>
            <div className="text-3xl font-black text-white mb-1">{highChurnRisk.toLocaleString()}</div>
            <div className="text-xs text-gray-400">AI predicts churn within 30 days</div>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-[#0A0A12] to-[#0D0D1A] border border-[#6432E6]/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Target className="w-16 h-16 text-[#6432E6]" /></div>
            <div className="text-[#c084fc] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> Upsell Potential</div>
            <div className="text-3xl font-black text-white mb-1">₹{upsellPotential.replace('$', '').replace(/,/g, '')}</div>
            <div className="text-xs text-gray-400">Expansion ARR identified by AI</div>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg">
            <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">AI Recommendations</div>
            <div className="space-y-3">
               {recommendations.slice(0, 2).map((rec, i) => (
                 <div key={i} className="flex items-start gap-2 text-xs">
                   <div className={`w-1.5 h-1.5 rounded-full ${rec.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'} mt-1.5 shrink-0`}></div>
                   <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: rec.text }}></span>
                 </div>
               ))}
            </div>
         </motion.div>
      </div>

      {/* Middle Row: Health & LTV */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Customer Health Radar */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
               <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2"><HeartPulse className="w-4 h-4 text-rose-400" /> Global Health Score</h3>
               <span className="text-2xl font-black text-emerald-400">{globalHealth}/100</span>
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
                  <div className="text-2xl font-bold text-white">₹{ltvData.length > 0 ? ltvData[ltvData.length - 1].ltv.toLocaleString() : '0'}</div>
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
                     <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(val) => `₹${val}`} />
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
                  {customers.map((customer, i) => (
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
                        <td className="py-4 px-6 text-white font-medium font-mono text-xs">₹{customer.ltv.replace('$', '')}</td>
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
                           <Activity className={`w-3 h-3 ${customer.lastActive.includes('day') ? 'text-gray-600' : 'text-emerald-400'}`} /> {customer.lastActive}
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
            <span>Showing {((page - 1) * 10) + 1}-{Math.min(page * 10, totalCustomers)} of {totalCustomers.toLocaleString()} records</span>
            <div className="flex gap-1">
               <button 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50" 
                  disabled={page === 1}
               >
                  Prev
               </button>
               <button 
                  onClick={() => setPage(page)}
                  className="px-3 py-1 border border-white/10 rounded bg-white/5 text-white"
               >
                  {page}
               </button>
               <button 
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border border-white/10 rounded hover:bg-white/5"
               >
                  {page + 1}
               </button>
               <button 
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border border-white/10 rounded hover:bg-white/5"
               >
                  Next
               </button>
            </div>
         </div>
      </motion.div>

    </div>
  );
};

export default Customers;