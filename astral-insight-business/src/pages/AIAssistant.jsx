import React from 'react';
import PageHeader from '../components/PageHeader';
import { Bot, Send, User, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <PageHeader 
        title="AI Assistant" 
        description="Query your business data using natural language." 
      />
      
      <div className="flex-1 bg-[#0A0A12] border border-white/5 rounded-t-xl overflow-hidden flex flex-col">
        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-business-brand/20 border border-business-brand/30 flex items-center justify-center flex-shrink-0">
               <Bot className="w-5 h-5 text-business-brand" />
             </div>
             <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
               <p className="text-sm text-gray-200">Hello! I'm your AstralInsight AI Assistant. How can I help you analyze your business data today?</p>
             </div>
          </div>

          <div className="flex items-start gap-4 flex-row-reverse">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 ring-2 ring-white/10">
               <User className="w-5 h-5 text-white" />
             </div>
             <div className="bg-business-brand text-white rounded-2xl rounded-tr-none p-4 max-w-[80%]">
               <p className="text-sm">What was the primary driver of customer churn in Q3?</p>
             </div>
          </div>

          <div className="flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-business-brand/20 border border-business-brand/30 flex items-center justify-center flex-shrink-0">
               <Bot className="w-5 h-5 text-business-brand" />
             </div>
             <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
               <p className="text-sm text-gray-200 mb-3">Based on support tickets and usage logs from Q3, the primarily driver for churn was <strong>API Rate Limiting Issues</strong> affecting mid-tier customers.</p>
               <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                 <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                   <span>Key Churn Factors</span>
                 </div>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 text-sm"><div className="w-full bg-white/10 h-2 rounded"><div className="bg-red-400 h-2 rounded w-[45%]"></div></div> 45% API Limits</div>
                   <div className="flex items-center gap-2 text-sm"><div className="w-full bg-white/10 h-2 rounded"><div className="bg-yellow-400 h-2 rounded w-[25%]"></div></div> 25% Pricing</div>
                 </div>
               </div>
             </div>
          </div>

        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex gap-2 mb-3">
             <button className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 hover:bg-white/10 text-gray-300 transition flex items-center gap-1"><Sparkles className="w-3 h-3 text-business-brand"/> Compare Q2 vs Q3 Revenue</button>
             <button className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 hover:bg-white/10 text-gray-300 transition flex items-center gap-1"><Sparkles className="w-3 h-3 text-business-brand"/> Predict next week sales</button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask anything about your data..." 
              className="w-full bg-[#050508] border border-white/10 rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-business-brand transition"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-business-brand rounded-md text-white hover:bg-purple-600 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;