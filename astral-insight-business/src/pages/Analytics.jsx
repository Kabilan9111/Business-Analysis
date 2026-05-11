import React from 'react';
import PageHeader from '../components/PageHeader';
import { BarChart, PieChart, Activity } from 'lucide-react';

const Analytics = () => {
  return (
    <>
      <PageHeader 
        title="Analytics" 
        description="Deep dive into traffic, engagement, and conversion metrics." 
        action={<button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">Download Report</button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-gray-500">
          <BarChart className="w-10 h-10 mb-4 opacity-20" />
          <p>Traffic Insights Chart</p>
        </div>
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-gray-500">
          <PieChart className="w-10 h-10 mb-4 opacity-20" />
          <p>Category Performance</p>
        </div>
        <div className="col-span-1 md:col-span-2 bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-gray-500">
          <Activity className="w-10 h-10 mb-4 opacity-20" />
          <p>User Behavior Heatmap</p>
        </div>
      </div>
    </>
  );
};

export default Analytics;