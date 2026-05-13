import React from "react";
import PageHeader from "../components/PageHeader";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const KPIcard = ({ title, value, change, isPositive, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors"
  >
    <div className="text-sm font-medium text-gray-400 mb-1">{title}</div>
    <div className="text-2xl font-bold text-white mb-2">{value}</div>
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`flex items-center px-1.5 py-0.5 rounded font-medium ${isPositive ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </span>
      <span className="text-gray-500">from last month</span>
    </div>
  </motion.div>
);

const revenueData = [
  { name: "Jan", revenue: 24000 },
  { name: "Feb", revenue: 31000 },
  { name: "Mar", revenue: 22000 },
  { name: "Apr", revenue: 48000 },
  { name: "May", revenue: 57000 },
  { name: "Jun", revenue: 44000 },
  { name: "Jul", revenue: 69000 },
  { name: "Aug", revenue: 82000 },
  { name: "Sep", revenue: 94000 },
  { name: "Oct", revenue: 73000 },
  { name: "Nov", revenue: 118000 },
  { name: "Dec", revenue: 142000 }
];

const transactions = [
  { id: 1, company: "Acme Corp", plan: "Enterprise Yearly", amount: "$12,000", status: "Success", date: "Today, 10:24 AM", color: "blue" },
  { id: 2, company: "NovaEdge", plan: "Pro Monthly", amount: "$499", status: "Success", date: "Yesterday, 4:12 PM", color: "purple" },
  { id: 3, company: "PixelCraft", plan: "Pro Monthly", amount: "$499", status: "Pending", date: "Nov 02, 11:30 AM", color: "yellow" },
  { id: 4, company: "QuantumX", plan: "Enterprise Yearly", amount: "$24,000", status: "Success", date: "Nov 01, 09:15 AM", color: "emerald" },
  { id: 5, company: "ElevateAI", plan: "Starter Monthly", amount: "$99", status: "Failed", date: "Oct 30, 02:45 PM", color: "red" }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0A12] border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-lg">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIcard title="Total Revenue" value="$124,500.00" change="12.5%" isPositive={true} delay={0.1} />
        <KPIcard title="Active Customers" value="1,240" change="4.2%" isPositive={true} delay={0.2} />
        <KPIcard title="Churn Rate" value="2.4%" change="1.1%" isPositive={false} delay={0.3} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-business-brand/5 group-hover:bg-business-brand/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium text-business-brand">AI Predicted Growth</div>
              <Sparkles className="w-4 h-4 text-business-brand" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">+18.5%</div>
            <div className="text-xs text-purple-200/50">Next quarter forecast optimal</div>
          </div>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white tracking-tight">Revenue Overview</h3>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/5">
              <button className="px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow-sm">12M</button>
              <button className="px-3 py-1 text-xs font-medium rounded text-gray-400 hover:text-white">30D</button>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6432E6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6432E6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#6432E6" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: "#6432E6", stroke: "#000", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-business-brand" />
            <h3 className="text-base font-semibold text-white tracking-tight">AI Insights</h3>
          </div>
          <div className="space-y-4 flex-1">
            <div className="p-3 rounded-lg bg-business-brand/10 border border-business-brand/20">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-purple-400 mb-1">Opportunity Detected</div>
              <p className="text-xs text-white/90 leading-relaxed">Consider launching a targeted campaign for returning users. We predict a 24% conversion rate increase based on current cohort activity.</p>
            </div>
            <div className="p-3 rounded-lg border border-white/5 bg-white/5 flex gap-3 hover:bg-white/10 transition cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
              <div>
                <div className="text-[12px] font-medium text-white mb-0.5">Churn Risk Decreased</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">Enterprise tier churn risk is down 1.2% this week. Support times improved.</p>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-white/5 bg-white/5 flex gap-3 hover:bg-white/10 transition cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></div>
              <div>
                <div className="text-[12px] font-medium text-white mb-0.5">Anomaly in Traffic</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">Spike in European API traffic observed. Automatic scaling handled the load.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="bg-[#0A0A12] border border-white/5 rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-tight">Recent Transactions</h3>
          <button className="text-xs text-business-brand hover:text-purple-400 transition">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-black/20 text-gray-500 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">User</th>
                <th className="py-3 px-5 font-semibold">Plan</th>
                <th className="py-3 px-5 font-semibold">Amount</th>
                <th className="py-3 px-5 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                  <td className="py-3 px-5 flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full bg-${tx.color}-500/20 flex items-center justify-center text-[10px] text-${tx.color}-400 font-bold border border-${tx.color}-500/30`}>
                      {tx.company.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{tx.company}</span>
                  </td>
                  <td className="py-3 px-5 text-gray-400">{tx.plan}</td>
                  <td className="py-3 px-5 text-white font-medium">{tx.amount}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                      tx.status === "Success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                      tx.status === "Pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : 
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-gray-500 text-xs">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

