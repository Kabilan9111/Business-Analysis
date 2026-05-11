import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles, Activity } from 'lucide-react';

const KPIcard = ({ title, value, change, isPositive, extra }) => (
  <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
    <div className="text-sm font-medium text-gray-400 mb-1">{title}</div>
    <div className="text-2xl font-bold text-white mb-2">{value}</div>
    <div className="flex items-center gap-1.5 text-xs">
      <span className={`flex items-center px-1.5 py-0.5 rounded font-medium ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </span>
      <span className="text-gray-500">from last month</span>
    </div>
    {extra && extra}
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPIcard title="Total Revenue" value="$124,500.00" change="12.5%" isPositive={true} />
        <KPIcard title="Active Customers" value="1,240" change="4.2%" isPositive={true} />
        <KPIcard title="Churn Rate" value="2.4%" change="1.1%" isPositive={false} />
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-business-brand/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium text-business-brand">AI Predicted Growth</div>
              <Sparkles className="w-4 h-4 text-business-brand" />
            </div>
            <div className="text-2xl font-bold text-white mb-2">+18.5%</div>
            <div className="text-xs text-purple-200/50">Next quarter forecast optimal</div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-white tracking-tight">Revenue Overview</h3>
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/5">
              <button className="px-3 py-1 text-xs font-medium rounded bg-white/10 text-white shadow-sm">12M</button>
              <button className="px-3 py-1 text-xs font-medium rounded text-gray-400 hover:text-white">30D</button>
              <button className="px-3 py-1 text-xs font-medium rounded text-gray-400 hover:text-white">7D</button>
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-white/5 bg-black/20 flex flex-col items-center justify-center text-gray-500">
            <Activity className="w-8 h-8 opacity-20 mb-2" />
            <span className="text-sm">Revenue Chart Visualization</span>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-business-brand" />
            <h3 className="text-base font-semibold text-white tracking-tight">AI Insights</h3>
          </div>
          <div className="space-y-4 flex-1">
            <div className="p-3 rounded-lg bg-business-brand/10 border border-business-brand/20">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-purple-400 mb-1">Opportunity Detected</div>
              <p className="text-xs text-white/90 leading-relaxed">Consider launching a targeted campaign for returning users. We predict a 24% conversion rate increase.</p>
            </div>
            <div className="p-3 rounded-lg border border-white/5 bg-white/5 flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
              <div>
                <div className="text-[12px] font-medium text-white mb-0.5">Churn Risk Decreased</div>
                <p className="text-[11px] text-gray-400 leading-relaxed">Enterprise tier churn risk is down 1.2% this week.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table Placeholder */}
      <div className="bg-[#0A0A12] border border-white/5 rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-tight">Recent Transactions</h3>
          <button className="text-xs text-business-brand hover:text-purple-300 transition">View All</button>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          Transaction list grid placeholder...
        </div>
      </div>

    </div>
  );
};

export default Dashboard;