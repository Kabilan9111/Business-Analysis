import React from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Calendar, Download, TrendingUp, Sparkles, Server } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const sentimentTrendData = [
  { name: 'Mon', positive: 65, neutral: 25, negative: 10 },
  { name: 'Tue', positive: 70, neutral: 20, negative: 10 },
  { name: 'Wed', positive: 60, neutral: 25, negative: 15 },
  { name: 'Thu', positive: 75, neutral: 15, negative: 10 },
  { name: 'Fri', positive: 85, neutral: 10, negative: 5 },
  { name: 'Sat', positive: 80, neutral: 15, negative: 5 },
  { name: 'Sun', positive: 90, neutral: 8, negative: 2 },
];

const sentimentDistData = [
  { name: 'Positive', value: 75, color: '#10b981' },
  { name: 'Neutral', value: 15, color: '#64748b' },
  { name: 'Negative', value: 10, color: '#ef4444' },
];

const SentimentAnalysis = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Sentiment Analysis</h1>
          <p className="text-gray-400 text-sm">Analyze customer feedback and social mentions to understand sentiment trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all shadow-lg">
            <Calendar className="w-4 h-4 text-gray-400" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6432E6] hover:bg-[#7f52f0] rounded-lg text-sm font-medium text-white transition-all shadow-[0_0_20px_-5px_rgba(100,50,230,0.5)]">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><MessageSquare className="w-16 h-16 text-[#6432E6]" /></div>
          <p className="text-sm text-gray-400 font-medium mb-1 relative z-10">Total Mentions</p>
          <p className="text-3xl font-bold text-white mb-2 relative z-10">14,285</p>
          <p className="text-xs flex items-center text-emerald-400 relative z-10"><TrendingUp className="w-3 h-3 mr-1" /> +12.5%</p>
        </div>
        
        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl transition-all hover:bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><ThumbsUp className="w-4 h-4 text-emerald-500" /></div>
            <p className="text-sm text-gray-400 font-medium">Positive</p>
          </div>
          <p className="text-2xl font-bold text-white">75%</p>
          <p className="text-[10px] text-gray-500 mt-1">10,713 mentions</p>
        </div>

        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl transition-all hover:bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-500/10 rounded-lg"><Minus className="w-4 h-4 text-gray-400" /></div>
            <p className="text-sm text-gray-400 font-medium">Neutral</p>
          </div>
          <p className="text-2xl font-bold text-white">15%</p>
          <p className="text-[10px] text-gray-500 mt-1">2,142 mentions</p>
        </div>

        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl transition-all hover:bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg"><ThumbsDown className="w-4 h-4 text-red-500" /></div>
            <p className="text-sm text-gray-400 font-medium">Negative</p>
          </div>
          <p className="text-2xl font-bold text-white">10%</p>
          <p className="text-[10px] text-gray-500 mt-1">1,430 mentions</p>
        </div>

        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6432E6]/5 to-transparent"></div>
          <p className="text-sm text-[#6432E6] font-medium mb-1 relative z-10">AI Sentiment Score</p>
          <p className="text-3xl font-bold text-white mb-2 relative z-10">8.4<span className="text-sm font-medium text-gray-500">/10</span></p>
          <p className="text-xs text-gray-400 relative z-10">Status: <span className="text-emerald-400 font-medium">Excellent</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-6">Sentiment Distribution</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">75%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Positive</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {sentimentDistData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Sentiment Over Time</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `\${value}%`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0A0A12', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="smooth" dataKey="positive" name="Positive" stroke="#10b981" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#10b981', stroke: '#050508', strokeWidth: 2 }} />
                <Line type="smooth" dataKey="neutral" name="Neutral" stroke="#64748b" strokeWidth={2} dot={{ r: 0 }} />
                <Line type="smooth" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={2} dot={{ r: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" /> Top Positive
          </h3>
          <div className="flex flex-wrap gap-3">
             {['excellent', 'quality', 'good', 'fast', 'recommended', 'premium', 'love it', 'amazing support'].map((word, i) => (
               <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${(i===0||i===1||i===5) ? 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] scale-110' : ''}`}>
                 {word}
               </span>
             ))}
          </div>
        </div>

        <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full"></div>
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <ThumbsDown className="w-4 h-4" /> Top Negative
          </h3>
          <div className="flex flex-wrap gap-3">
             {['delay', 'refund', 'slow', 'service', 'broken', 'late', 'expensive', 'buggy'].map((word, i) => (
               <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 ${(i===0||i===2) ? 'shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] scale-110' : ''}`}>
                 {word}
               </span>
             ))}
          </div>
        </div>

        <div className="bg-[#0A0A12] border border-[#6432E6]/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-[#6432E6]/40 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6432E6]/10 to-transparent opacity-50"></div>
          <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2 relative z-10">
            <Sparkles className="w-4 h-4 text-[#6432E6]" /> AI Insights Summary
          </h3>
          <div className="space-y-4 relative z-10">
             <div className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
               <p className="text-sm text-gray-300">Positive sentiment increased by <span className="text-white font-medium">12.5%</span> following the v2.4 product release.</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
               <p className="text-sm text-gray-300">"Delivery delays" spiked on Thursday, correlating with the East Coast weather event.</p>
             </div>
             <div className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
               <p className="text-sm text-gray-300">Product quality & premium feel are the most highly praised aspects across all segments.</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
         <p className="text-xs text-gray-500 flex items-center gap-2">
           <Server className="w-3.5 h-3.5" /> 
           Data securely aggregated from: Reviews, Social Media, Support Tickets, Surveys
         </p>
      </div>
    </div>
  );
};

export default SentimentAnalysis;