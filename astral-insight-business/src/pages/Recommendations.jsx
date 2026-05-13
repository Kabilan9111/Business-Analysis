import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Users, DollarSign, Activity, Download, ChevronDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const data1 = [{ v: 20 }, { v: 40 }, { v: 30 }, { v: 70 }, { v: 60 }, { v: 90 }, { v: 100 }];
const data2 = [{ v: 100 }, { v: 80 }, { v: 60 }, { v: 40 }, { v: 30 }, { v: 20 }, { v: 10 }];
const data3 = [{ v: 50 }, { v: 40 }, { v: 60 }, { v: 80 }, { v: 70 }, { v: 90 }, { v: 85 }];

const Recommendations = () => {
  const recommendations = [
    {
      id: 1,
      priority: 'Critical',
      title: 'Reduce churn in high-risk enterprise segment',
      description: 'AI model detects a 24% probability of churn in your top enterprise accounts over the next 30 days due to declining platform engagement. Re-engage immediately.',
      impact: 'High',
      confidence: '94%',
      effort: 'Medium',
      category: 'Customer Retention',
      uplift: '+12% ARPU',
      chartData: data2,
      chartColor: '#ef4444' // red
    },
    {
      id: 2,
      priority: 'High',
      title: 'Optimize Q3 Marketing Spend',
      description: 'Reallocating 15% of your ad spend from LinkedIn to LinkedIn Video Ads could reduce CAC by $45 based on competitor benchmark data and historical trends.',
      impact: 'High',
      confidence: '88%',
      effort: 'Low',
      category: 'Cost Optimization',
      uplift: '-$45 CAC',
      chartData: data1,
      chartColor: '#6432E6' // purple
    },
    {
      id: 3,
      priority: 'Medium',
      title: 'Introduce Upsell Flow for Mid-Market',
      description: 'Mid-Market users are adopting feature X significantly faster than other segments. Triggering an automated upsell workflow could generate secondary revenue.',
      impact: 'Medium',
      confidence: '76%',
      effort: 'High',
      category: 'Revenue Growth',
      uplift: '+$14k MRR',
      chartData: data3,
      chartColor: '#10b981' // emerald
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Recommendations</h1>
          <p className="text-gray-400 text-sm">AI-powered actionable recommendations to grow your business.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all shadow-lg hover:shadow-white/5">
            Filter <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6432E6] hover:bg-[#7f52f0] rounded-lg text-sm font-medium text-white transition-all shadow-[0_0_20px_-5px_rgba(100,50,230,0.5)]">
            <Download className="w-4 h-4" />
            Export Insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Recommendations', value: '24', icon: Lightbulb, trend: '+3 this week', color: '#6432E6' },
          { label: 'Potential Revenue Impact', value: '+$142k', icon: DollarSign, trend: 'Annualized', color: '#10b981' },
          { label: 'Avg Confidence Score', value: '88%', icon: Activity, trend: 'High Accuracy', color: '#3b82f6' },
          { label: 'Implemented', value: '45%', icon: CheckCircle2, trend: '+12% vs last mo', color: '#f59e0b' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0A0A12] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16" style={{ color: stat.color }} />
            </div>
            <p className="text-sm text-gray-400 font-medium mb-1 relative z-10">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-2 relative z-10">{stat.value}</p>
            <p className="text-xs text-gray-500 flex items-center relative z-10">
               <TrendingUp className="w-3 h-3 mr-1" style={{ color: stat.color }} /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Revenue Growth', 'Marketing', 'Customer Retention', 'Cost Optimization', 'Risk Management'].map((pill, i) => (
          <button key={i} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${i === 0 ? 'bg-[#6432E6] text-white shadow-[0_0_15px_-3px_rgba(100,50,230,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}>
            {pill}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {recommendations.map((rec) => (
          <div key={rec.id} className="group bg-[#0A0A12] border border-white/5 hover:border-white/10 rounded-2xl p-6 shadow-xl transition-all hover:bg-white/[0.02]">
            <div className="flex flex-col xl:flex-row gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                    rec.priority === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    rec.priority === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-white/5 rounded border border-white/5">
                    {rec.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#6432E6] transition-colors">{rec.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl mb-6">
                  {rec.description}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/5 rounded-md"><Sparkles className="w-3.5 h-3.5 text-[#6432E6]" /></div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Confidence</p>
                      <p className="text-sm font-semibold text-white">{rec.confidence}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/5 rounded-md"><Activity className="w-3.5 h-3.5 text-emerald-500" /></div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Impact</p>
                      <p className="text-sm font-semibold text-white">{rec.impact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/5 rounded-md"><Users className="w-3.5 h-3.5 text-blue-400" /></div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">Effort</p>
                      <p className="text-sm font-semibold text-white">{rec.effort}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-72 flex flex-col justify-between border-t xl:border-t-0 xl:border-l border-white/5 pt-6 xl:pt-0 xl:pl-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Estimated Uplift</p>
                  <p className="text-2xl font-bold text-white mb-4">{rec.uplift}</p>
                  <div className="h-16 w-full mb-6 relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={rec.chartData}>
                          <defs>
                            <linearGradient id={`gradient-${rec.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={rec.chartColor} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={rec.chartColor} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke={rec.chartColor} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${rec.id})`} />
                        </AreaChart>
                      </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="flex-1 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10">
                    View Details
                  </button>
                  <button className="flex-1 py-2 text-sm font-medium text-white bg-[#6432E6] hover:bg-[#7f52f0] rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(100,50,230,0.4)] flex items-center justify-center gap-1">
                    Implement <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;