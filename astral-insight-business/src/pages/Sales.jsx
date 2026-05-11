import React from 'react';
import PageHeader from '../components/PageHeader';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const Sales = () => {
  return (
    <>
      <PageHeader 
        title="Sales" 
        description="Monitor revenue streams, subscriptions, and top products." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-5">
           <div className="text-gray-400 text-sm mb-2">Monthly Recurring Revenue</div>
           <div className="text-3xl font-bold text-white mb-2">$84,300</div>
           <div className="text-emerald-400 text-xs">+14% vs last month</div>
        </div>
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-5">
           <div className="text-gray-400 text-sm mb-2">Average Order Value</div>
           <div className="text-3xl font-bold text-white mb-2">$425</div>
           <div className="text-emerald-400 text-xs">+5% vs last month</div>
        </div>
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-5">
           <div className="text-gray-400 text-sm mb-2">Refund Rate</div>
           <div className="text-3xl font-bold text-white mb-2">1.2%</div>
           <div className="text-red-400 text-xs">+0.2% vs last month</div>
        </div>
      </div>

      <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center text-gray-500">
        <TrendingUp className="w-10 h-10 mb-4 opacity-20" />
        <p>Sales Trends Overview</p>
      </div>
    </>
  );
};

export default Sales;