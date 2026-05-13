import React from "react";
import PageHeader from "../components/PageHeader";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const retentionData = [
  { month: "M1", retain: 100 },
  { month: "M2", retain: 92 },
  { month: "M3", retain: 85 },
  { month: "M4", retain: 79 },
  { month: "M5", retain: 75 },
  { month: "M6", retain: 72 },
];

const segmentData = [
  { name: "Enterprise", value: 35, color: "#6432E6" },
  { name: "Mid-Market", value: 45, color: "#3B82F6" },
  { name: "SMB", value: 20, color: "#10B981" },
];

const Customers = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customers" 
        description="Analyze retention, segmentation, and lifetime value." 
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg group">
           <div className="text-gray-400 text-sm mb-2">Total Customers</div>
           <div className="text-3xl font-bold text-white mb-2">12,450</div>
           <div className="inline-flex text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-medium">+8% vs last month</div>
        </motion.div>
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg group">
           <div className="text-gray-400 text-sm mb-2">Active Users</div>
           <div className="text-3xl font-bold text-white mb-2">8,920</div>
           <div className="inline-flex text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-medium">+12% vs last month</div>
        </motion.div>
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg group">
           <div className="text-gray-400 text-sm mb-2">Customer LTV</div>
           <div className="text-3xl font-bold text-white mb-2">$4,850</div>
           <div className="inline-flex text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-medium">+3% vs last month</div>
        </motion.div>
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg group">
           <div className="text-gray-400 text-sm mb-2">Churn Rate</div>
           <div className="text-3xl font-bold text-white mb-2">2.4%</div>
           <div className="inline-flex text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-medium">-0.5% vs last month</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.5}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 h-[400px] shadow-lg flex flex-col">
            <h3 className="text-base font-semibold text-white tracking-tight mb-6">User Retention Cohort (Last 6 Months)</h3>
            <div className="flex-1 w-full min-h-0 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff55" tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip contentStyle={{ backgroundColor: "#0A0A12", borderColor: "#333", borderRadius: "8px", color: "#fff" }} />
                  <Line type="monotone" dataKey="retain" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: "#3B82F6", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#fff" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.6}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 h-[400px] shadow-lg flex flex-col">
            <h3 className="text-base font-semibold text-white tracking-tight mb-4">Customer Segmentation (ACV)</h3>
            <div className="flex-1 w-full min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0A0A12", borderColor: "#333", borderRadius: "8px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                  <span className="text-3xl font-bold text-white">3</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Segments</span>
              </div>
            </div>
             <div className="flex justify-center gap-6 mt-4">
              {segmentData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default Customers;