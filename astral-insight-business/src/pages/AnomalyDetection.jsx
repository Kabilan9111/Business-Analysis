import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, Info, BellRing, Settings, ShieldAlert, ArrowRight, CheckCircle2, TrendingDown, TrendingUp, Activity, Search } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const chartData = [
  { time: '00:00', value: 120, expected: 125 },
  { time: '04:00', value: 110, expected: 115 },
  { time: '08:00', value: 140, expected: 135 },
  { time: '12:00', value: 380, expected: 150 }, // Anomaly spike
  { time: '16:00', value: 160, expected: 155 },
  { time: '20:00', value: 130, expected: 140 },
  { time: '23:59', value: 115, expected: 120 },
];

const AnomalyDetection = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState(1);

  const anomalies = [
    { id: 1, title: 'Revenue Spike', metric: 'Daily MRR', detected: '2 hours ago', severity: 'Critical', impact: '+$42k', status: 'Investigating', color: 'red' },
    { id: 2, title: 'High Refund Rate', metric: 'Refunds', detected: '5 hours ago', severity: 'High', impact: '-$8k', status: 'Open', color: 'orange' },
    { id: 3, title: 'Order Volume Drop', metric: 'Orders', detected: 'Yesterday', severity: 'Medium', impact: '-15%', status: 'Monitoring', color: 'yellow' },
    { id: 4, title: 'Churn Rate Increase', metric: 'Users', detected: '2 days ago', severity: 'High', impact: '2.4%', status: 'Resolved', color: 'emerald' },
    { id: 5, title: 'Traffic Drop (EU)', metric: 'Sessions', detected: 'Last week', severity: 'Low', impact: '-8%', status: 'Resolved', color: 'emerald' },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Anomaly Detection</h1>
          <p className="text-gray-400 text-sm">AI detects unusual patterns and anomalies in your business data.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#0A0A12] border border-white/10 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[#6432E6]/50">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all shadow-lg hover:shadow-white/5">
            <Settings className="w-4 h-4 text-gray-400" />
            Configure Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert className="w-16 h-16 text-[#6432E6]" /></div>
          <p className="text-sm text-gray-400 font-medium mb-1 relative z-10">Total Anomalies</p>
          <p className="text-3xl font-bold text-white relative z-10">24</p>
        </div>
        
        <div className="bg-[#0A0A12] border border-red-500/20 rounded-2xl p-5 shadow-[0_0_20px_-10px_rgba(239,68,68,0.2)]">
          <p className="text-sm text-red-500 font-medium mb-1">Critical</p>
          <div className="flex items-end justify-between">
             <p className="text-3xl font-bold text-white">3</p>
             <AlertOctagon className="w-6 h-6 text-red-500 opacity-50" />
          </div>
        </div>

        <div className="bg-[#0A0A12] border border-orange-500/20 rounded-2xl p-5 shadow-[0_0_20px_-10px_rgba(249,115,22,0.2)]">
          <p className="text-sm text-orange-500 font-medium mb-1">High</p>
          <div className="flex items-end justify-between">
             <p className="text-3xl font-bold text-white">8</p>
             <AlertTriangle className="w-6 h-6 text-orange-500 opacity-50" />
          </div>
        </div>

        <div className="bg-[#0A0A12] border border-yellow-500/20 rounded-2xl p-5 shadow-[0_0_20px_-10px_rgba(234,179,8,0.2)]">
          <p className="text-sm text-yellow-500 font-medium mb-1">Medium</p>
          <div className="flex items-end justify-between">
             <p className="text-3xl font-bold text-white">11</p>
             <Info className="w-6 h-6 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-[#0A0A12] border border-blue-500/20 rounded-2xl p-5 shadow-[0_0_20px_-10px_rgba(59,130,246,0.2)]">
          <p className="text-sm text-blue-400 font-medium mb-1">Low</p>
          <div className="flex items-end justify-between">
             <p className="text-3xl font-bold text-white">2</p>
             <BellRing className="w-6 h-6 text-blue-400 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="xl:col-span-2 bg-[#0A0A12] border border-white/5 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 bg-black/20 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
               <Activity className="w-5 h-5 text-[#6432E6]" /> Detected Anomalies
            </h3>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-[#6432E6]/50 transition-colors">
              <Search className="w-3.5 h-3.5 text-gray-500 mr-2" />
              <input type="text" placeholder="Search logs..." className="bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none w-32 md:w-48" />
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#050508]/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Anomaly</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Metric</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Detected On</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Severity</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Impact</th>
                  <th className="px-6 py-4 font-medium border-b border-white/5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {anomalies.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedAnomaly(item.id)}
                    className={`cursor-pointer transition-colors ${selectedAnomaly === item.id ? 'bg-[#6432E6]/5 border-l-2 border-l-[#6432E6]' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'}`}
                  >
                    <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                    <td className="px-6 py-4 text-gray-400">{item.metric}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{item.detected}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                         item.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                         item.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                         item.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                         'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">{item.impact}</td>
                    <td className="px-6 py-4">
                       <span className={`flex items-center gap-1.5 text-xs font-medium ${
                          item.status === 'Resolved' ? 'text-emerald-400' :
                          item.status === 'Investigating' ? 'text-[#6432E6]' :
                          item.status === 'Open' ? 'text-red-400' : 'text-gray-400'
                       }`}>
                         {item.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {item.status !== 'Resolved' && <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                         {item.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#0A0A12] border border-[#6432E6]/30 rounded-2xl shadow-[0_0_30px_-10px_rgba(100,50,230,0.2)] flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#6432E6]/5 to-transparent pointer-events-none"></div>
          
          <div className="p-6 border-b border-white/5 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Critical Anomaly</span>
                <h3 className="text-xl font-bold text-white">Revenue Spike</h3>
                <p className="text-xs text-gray-500 mt-1">Detected 2 hours ago • Daily MRR</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                 <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
            </div>

            <div className="h-40 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="normalColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6432E6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6432E6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050508', borderColor: 'rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="step" dataKey="expected" stroke="#6432E6" strokeDasharray="5 5" fill="url(#normalColor)" fillOpacity={1} strokeWidth={2} name="Expected Baseline" />
                  <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#splitColor)" fillOpacity={1} strokeWidth={2} name="Actual Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 flex-1 space-y-6 relative z-10">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">AI Analysis</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Daily MRR spiked by 304% compared to the 30-day baseline moving average. This deviation exceeds the 99th percentile threshold.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Possible Causes</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  Enterprise segment bulk renewals triggered simultaneously.
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                  Pricing tier migration executed for grandfathered accounts.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Recommended Actions</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#6432E6] flex-shrink-0 mt-0.5" />
                  Verify Stripe webhook idempotency logs for duplicate events.
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#6432E6] flex-shrink-0 mt-0.5" />
                  Cross-reference with Salesforce contract updates.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 border-t border-white/5 bg-black/40 relative z-10 flex gap-3">
             <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">Dismiss</button>
             <button className="flex-1 py-2.5 bg-[#6432E6] hover:bg-[#7f52f0] text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_-3px_rgba(100,50,230,0.5)] flex items-center justify-center gap-2">View Full Analysis <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnomalyDetection;