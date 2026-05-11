import React from 'react';
import PageHeader from '../components/PageHeader';
import { Eye, TrendingUp, Sparkles } from 'lucide-react';

const Forecasting = () => {
  return (
    <>
      <PageHeader 
        title="Forecasting" 
        description="Predict future trends using AstralInsight AI models." 
        action={<button className="px-4 py-2 bg-business-brand rounded-lg text-sm text-white font-medium hover:bg-purple-600 transition flex items-center gap-2"><Sparkles className="w-4 h-4"/> Run New Prediction</button>}
      />
      <div className="bg-[#0A0A12] border border-business-brand/20 rounded-xl p-6 min-h-[400px] relative overflow-hidden flex flex-col items-center justify-center text-gray-500 mb-6">
        <div className="absolute inset-0 bg-business-brand/5 pointer-events-none"></div>
        <TrendingUp className="w-12 h-12 mb-4 text-business-brand opacity-50" />
        <h3 className="text-xl font-bold text-white mb-2 relative z-10">Q4 Revenue Projection</h3>
        <p className="max-w-md text-center text-sm relative z-10">Based on historical data and current market trends, our AI predicts a 22% growth in Q4, primarily driven by enterprise upgrades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[250px] flex flex-col items-center justify-center text-gray-500">
           <p>Demand Forecast</p>
        </div>
        <div className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 min-h-[250px] flex flex-col items-center justify-center text-gray-500">
           <p>Churn Probability Matrix</p>
        </div>
      </div>
    </>
  );
};

export default Forecasting;