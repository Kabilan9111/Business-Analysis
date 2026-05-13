import React from "react";
import PageHeader from "../components/PageHeader";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const trafficData = [
  { name: "Organic Search", value: 42, color: "#6432E6" },
  { name: "Social Media", value: 21, color: "#C084FC" },
  { name: "Direct Traffic", value: 18, color: "#3B82F6" },
  { name: "Paid Ads", value: 19, color: "#10B981" }
];

const engagementData = [
  { name: "Week 1", session: 120, bounce: 45, conversion: 2.1 },
  { name: "Week 2", session: 145, bounce: 42, conversion: 2.4 },
  { name: "Week 3", session: 160, bounce: 38, conversion: 2.8 },
  { name: "Week 4", session: 210, bounce: 35, conversion: 3.5 }
];

const countryData = [
  { country: "United States", users: "45,210", change: "+12%" },
  { country: "India", users: "28,540", change: "+24%" },
  { country: "United Kingdom", users: "18,900", change: "+5%" },
  { country: "Germany", users: "14,320", change: "-2%" },
  { country: "Canada", users: "11,850", change: "+8%" }
];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Analytics" 
        description="Deep dive into traffic, engagement, and conversion metrics." 
        action={<button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">Download Report</button>}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Traffic Sources Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 h-[400px] flex flex-col">
          <h3 className="text-base font-semibold text-white tracking-tight mb-4">Traffic Sources</h3>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0A0A12", borderColor: "#333", borderRadius: "8px" }} itemStyle={{ color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">42%</span>
              <span className="text-xs text-gray-500">Organic Top</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
             {trafficData.map((dt) => (
                <div key={dt.name} className="flex items-center gap-2 text-xs text-gray-400">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dt.color }}></div> {dt.name}
                </div>
             ))}
          </div>
        </motion.div>

        {/* User Engagement Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 h-[400px] flex flex-col">
          <h3 className="text-base font-semibold text-white tracking-tight mb-4">User Engagement</h3>
          <div className="flex-1 w-full min-h-0 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff55" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#ffffff55" tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#ffffff05" }} contentStyle={{ backgroundColor: "#0A0A12", borderColor: "#333", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="session" name="Avg Session (s)" fill="#6432E6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bounce" name="Bounce Rate (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Device & Tables */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg">
              <h3 className="text-base font-semibold text-white tracking-tight mb-6">Device Analytics</h3>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Desktop</span><span className="text-white font-medium">58%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-business-brand h-2 rounded-full" style={{width: "58%"}}></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Mobile</span><span className="text-white font-medium">34%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: "34%"}}></div></div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Tablet</span><span className="text-white font-medium">8%</span></div>
                    <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-purple-400 h-2 rounded-full" style={{width: "8%"}}></div></div>
                 </div>
              </div>
           </div>

           <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg overflow-hidden">
              <h3 className="text-base font-semibold text-white tracking-tight mb-4">Country Analytics</h3>
              <table className="w-full text-left">
                 <tbody className="text-sm">
                    {countryData.map((cd, i) => (
                       <tr key={i} className="border-b last:border-0 border-white/5">
                          <td className="py-3 text-gray-300">{cd.country}</td>
                          <td className="py-3 text-white font-medium">{cd.users}</td>
                          <td className={`py-3 text-right ${cd.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{cd.change}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
export default Analytics;
