import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, Clock, Plus, Filter, Sparkles, PieChart, FileSpreadsheet, LayoutGrid, Eye, Trash2, Send, Calendar, Check, MoreVertical, FileJson } from "lucide-react";

const reportsList = [
  { id: "REP-104", name: "Q3 Financial Summary", date: "Oct 12, 2023", type: "Financial", format: "PDF", size: "2.4 MB", status: "Ready", views: 142 },
  { id: "REP-103", name: "Monthly Churn Analysis", date: "Oct 01, 2023", type: "Customer", format: "Excel", size: "1.1 MB", status: "Ready", views: 89 },
  { id: "REP-102", name: "Sales Pipeline Review", date: "Sep 28, 2023", type: "Sales", format: "PDF", size: "3.8 MB", status: "Draft", views: 12 },
  { id: "REP-101", name: "Executive Snapshot", date: "Sep 15, 2023", type: "Executive", format: "JSON", size: "840 KB", status: "Ready", views: 405 },
  { id: "REP-100", name: "Marketing ROI Breakdown", date: "Sep 10, 2023", type: "Marketing", format: "PPTX", size: "4.2 MB", status: "Archived", views: 22 },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showAIGen, setShowAIGen] = useState(false);

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Reporting Studio" 
          description="AI-generated executive summaries, automated scheduling, and drag-and-drop report builder." 
        />
        <button 
           onClick={() => setShowAIGen(true)}
           className="bg-gradient-to-r from-[#6432E6] to-fuchsia-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-[0_0_20px_rgba(100,50,230,0.5)] flex items-center gap-2"
        >
           <Sparkles className="w-4 h-4" /> AI Report Generator
        </button>
      </div>

      {/* Quick Action Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg hover:border-white/10 transition-colors group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#6432E6]/5 to-transparent pointer-events-none"></div>
             <div className="flex items-start gap-4">
               <div className="p-3 bg-[#6432E6]/10 text-[#6432E6] rounded-xl group-hover:bg-[#6432E6]/20 transition-colors">
                  <LayoutGrid className="w-6 h-6" />
               </div>
               <div>
                   <h3 className="text-sm font-semibold text-white mb-1">Drag-and-Drop Builder</h3>
                   <p className="text-xs text-gray-400 leading-relaxed mb-4">Create custom dashboards with modular widgets.</p>
                   <span className="text-[11px] font-semibold text-[#6432E6] flex items-center gap-1">Open Builder <Plus className="w-3 h-3" /></span>
               </div>
             </div>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg hover:border-white/10 transition-colors group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
             <div className="flex items-start gap-4">
               <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                  <Clock className="w-6 h-6" />
               </div>
               <div>
                   <h3 className="text-sm font-semibold text-white mb-1">Automated Delivery</h3>
                   <p className="text-xs text-gray-400 leading-relaxed mb-4">Schedule reports via Email, Slack, or Webhook.</p>
                   <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">Manage Schedules <Calendar className="w-3 h-3" /></span>
               </div>
             </div>
         </motion.div>

         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg hover:border-white/10 transition-colors group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
             <div className="flex items-start gap-4">
               <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <PieChart className="w-6 h-6" />
               </div>
               <div>
                   <h3 className="text-sm font-semibold text-white mb-1">Compliance & Audit</h3>
                   <p className="text-xs text-gray-400 leading-relaxed mb-4">Pre-built templates for tax and board reporting.</p>
                   <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">View Templates <FileText className="w-3 h-3" /></span>
               </div>
             </div>
         </motion.div>
      </div>

      {/* Main Report Library Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0A0A12] border border-white/5 rounded-xl shadow-lg flex flex-col min-h-[500px]">
        <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/20">
           <div className="flex gap-4 border-b border-white/5 sm:border-0 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
             {["all", "financial", "sales", "marketing", "executive"].map(tab => (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab)}
                 className={`text-xs font-medium capitalize whitespace-nowrap pb-1 border-b-2 transition-colors ${activeTab === tab ? 'text-white border-[#6432E6]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
               >
                 {tab}
               </button>
             ))}
           </div>
           <div className="flex items-center gap-2 w-full sm:w-auto">
             <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition bg-[#0A0A12]">
                <Filter className="w-3.5 h-3.5" /> Filter
             </button>
             <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/5 transition bg-[#0A0A12]">
                <Send className="w-3.5 h-3.5" /> Export Selection
             </button>
           </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-black/40 text-gray-500 text-[10px] uppercase tracking-wider border-b border-white/5">
                  <th className="py-4 px-6 font-semibold w-12 text-center"><input type="checkbox" className="rounded border-white/20 bg-transparent accent-[#6432E6]" /></th>
                  <th className="py-4 px-6 font-semibold">Report Name & ID</th>
                  <th className="py-4 px-6 font-semibold">Generated</th>
                  <th className="py-4 px-6 font-semibold">Type</th>
                  <th className="py-4 px-6 font-semibold">Format</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Analytics</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                 {reportsList.map((r,i) => (
                    <tr key={i} className="border-b last:border-0 border-white/5 hover:bg-white/[0.02] group transition-colors">
                      <td className="py-4 px-6 text-center"><input type="checkbox" className="rounded border-white/20 bg-transparent accent-[#6432E6]" /></td>
                      <td className="py-4 px-6">
                          <div className="text-white font-medium mb-1">{r.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{r.id} • {r.size}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-400">{r.date}</td>
                      <td className="py-4 px-6">
                          <span className="bg-white/5 border border-white/5 text-gray-300 px-2 py-1 rounded text-[11px] font-medium">{r.type}</span>
                      </td>
                      <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-gray-300">
                             {r.format === 'PDF' && <FileText className="w-3.5 h-3.5 text-rose-400" />}
                             {r.format === 'Excel' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
                             {r.format === 'JSON' && <FileJson className="w-3.5 h-3.5 text-yellow-400" />}
                             {r.format === 'PPTX' && <LayoutGrid className="w-3.5 h-3.5 text-orange-400" />}
                             {r.format}
                          </div>
                      </td>
                      <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                             r.status === 'Ready' ? 'text-emerald-400 bg-emerald-500/10' :
                             r.status === 'Draft' ? 'text-amber-400 bg-amber-500/10' :
                             'text-gray-400 bg-gray-500/10'
                          }`}>
                             {r.status === 'Ready' && <Check className="w-3 h-3" />} {r.status}
                          </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {r.views} views</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-1.5 text-gray-400 hover:text-white hover:bg-[#6432E6]/20 rounded transition" title="Preview">
                                 <Eye className="w-4 h-4" />
                             </button>
                             <button className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/20 rounded transition" title="Download">
                                 <Download className="w-4 h-4" />
                             </button>
                             <button className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/20 rounded transition" title="Delete">
                                 <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                      </td>
                    </tr>
                 ))}
              </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Generator Modal Overlay (Simulated) */}
      <AnimatePresence>
         {showAIGen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#0A0A12] border border-[#6432E6]/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-white/5 bg-gradient-to-r from-[#6432E6]/10 to-transparent flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#6432E6]/20 flex items-center justify-center text-[#c084fc] shadow-[0_0_15px_rgba(100,50,230,0.3)]">
                           <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                           <h2 className="text-lg font-bold text-white">AI Report Copilot</h2>
                           <p className="text-xs text-gray-400">Describe the report you need in plain English.</p>
                        </div>
                     </div>
                     <button onClick={() => setShowAIGen(false)} className="text-gray-500 hover:text-white transition">
                        <Plus className="w-6 h-6 rotate-45" />
                     </button>
                  </div>
                  
                  <div className="p-6 flex-1">
                     <textarea 
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#6432E6] resize-none transition shadow-inner"
                        placeholder="E.g., 'Generate an executive summary of Q3 revenue growth, highlighting our highest churning segments and forecasting Q4 retention based on recent product adoption rates.'"
                     ></textarea>
                     
                     <div className="mt-4 flex gap-2">
                        <button className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition">Add Charts</button>
                        <button className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition">Include YoY Comparison</button>
                        <button className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition">White-label PDF</button>
                     </div>
                  </div>

                  <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end gap-3">
                     <button onClick={() => setShowAIGen(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition">Cancel</button>
                     <button className="bg-[#6432E6] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#5228c2] transition shadow-[0_0_15px_rgba(100,50,230,0.4)] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Generate Report
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default Reports;