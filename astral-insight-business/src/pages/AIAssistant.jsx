import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { PaperAirplaneIcon, SparklesIcon, ChartBarSquareIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const predefinedQueries = [
  { text: "Why did revenue drop in Q3?", icon: ChartBarSquareIcon },
  { text: "Show me churn risk for Enterprise segment", icon: UserGroupIcon },
  { text: "Forecast next month's MRR", icon: SparklesIcon }
];

const initialMessages = [
  { role: "assistant", text: "Hello. I'm your Astral Insight AI. I have access to all your real-time analytics, CRM data, and forecasting models. What would you like to explore today?" }
];

const AIAssistant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
            role: "assistant", 
            text: "Based on the recent telemetry, the primary driver is a 12% decrease in Mid-Market renewals. I've automatically created a retention cohort view in your Analytics tab so you can isolate these accounts." 
        }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageHeader 
        title="AI Data Query" 
        description="Ask complex questions about your business in natural language." 
      />

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex-1 bg-[#0A0A12] border border-[#6432E6]/20 rounded-xl shadow-[0_0_30px_rgba(100,50,230,0.05)] overflow-hidden flex flex-col relative mt-2">
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1/2 bg-[#6432E6]/5 blur-[100px] rounded-full pointer-events-none"></div>

         <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${m.role === 'user' ? 'bg-[#6432E6] text-white rounded-br-none shadow-lg shadow-[#6432E6]/20' : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none shadow-lg'}`}>
                        {m.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2 text-[#6432E6] border-b border-white/5 pb-2">
                                <SparklesIcon className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Astral AI</span>
                            </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    </div>
                </div>
            ))}
            {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 shadow-lg flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-[#6432E6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                         <div className="w-1.5 h-1.5 bg-[#6432E6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                         <div className="w-1.5 h-1.5 bg-[#6432E6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            )}
         </div>

         {/* Query Suggestions */}
         {messages.length === 1 && (
             <div className="px-6 pb-4">
                 <div className="flex flex-wrap gap-2 justify-center">
                    {predefinedQueries.map((q, i) => (
                        <button key={i} onClick={() => handleSend(q.text)} className="flex items-center gap-2 bg-black/40 hover:bg-white/10 border border-white/5 hover:border-[#6432E6]/50 rounded-full px-4 py-2 text-xs text-gray-400 hover:text-white transition-all">
                            <q.icon className="w-4 h-4 text-[#6432E6]" />
                            {q.text}
                        </button>
                    ))}
                 </div>
             </div>
         )}

         {/* Input Box */}
         <div className="p-4 bg-black/40 border-t border-white/5">
             <div className="relative">
                 <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Ask anything about your data..."
                    className="w-full bg-[#0A0A12] border border-white/10 rounded-xl pl-5 pr-14 py-4 text-white text-sm focus:outline-none focus:border-[#6432E6] focus:ring-1 focus:ring-[#6432E6] resize-none h-14 overflow-hidden transition-all shadow-inner"
                 />
                 <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-2 p-2 bg-[#6432E6] text-white rounded-lg hover:bg-[#5229c2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#6432E6]/20"
                 >
                     <PaperAirplaneIcon className="w-5 h-5 -rotate-45 ml-0.5" />
                 </button>
             </div>
             <div className="text-center mt-2 text-[10px] text-gray-600 font-medium">
                 AI responses are generated based on available model data. Always verify critical metrics.
             </div>
         </div>

      </motion.div>
    </div>
  );
};

export default AIAssistant;