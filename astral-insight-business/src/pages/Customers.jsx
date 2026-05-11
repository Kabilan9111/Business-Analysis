import React from 'react';
import PageHeader from '../components/PageHeader';
import { Users, UserPlus, Target } from 'lucide-react';

const Customers = () => {
  return (
    <>
      <PageHeader 
        title="Customers" 
        description="Analyze customer segments, retention, and demographics." 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-gray-500">
          <Target className="w-10 h-10 mb-4 opacity-20" />
          <p>Customer Segmentation</p>
        </div>
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[300px] flex flex-col items-center justify-center text-gray-500">
          <UserPlus className="w-10 h-10 mb-4 opacity-20" />
          <p>Retention & Churn Analysis</p>
        </div>
      </div>
      <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[250px] flex flex-col items-center justify-center text-gray-500">
          <Users className="w-10 h-10 mb-4 opacity-20" />
          <p>Global Demographics Map</p>
      </div>
    </>
  );
};

export default Customers;