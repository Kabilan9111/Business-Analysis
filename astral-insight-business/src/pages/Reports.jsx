import React from "react";
import PageHeader from "../components/PageHeader";
import { motion } from "framer-motion";
import { DocumentTextIcon, ArrowDownTrayIcon, ClockIcon } from "@heroicons/react/24/outline";

const reportsList = [
  { name: "Q3 Financial Summary", date: "Oct 12, 2023", type: "Financial", size: "2.4 MB" },
  { name: "Monthly Churn Analysis", date: "Oct 01, 2023", type: "Customer", size: "1.1 MB" },
  { name: "Sales Pipeline Review", date: "Sep 28, 2023", type: "Sales", size: "3.8 MB" },
  { name: "Executive Snapshot", date: "Sep 15, 2023", type: "General", size: "840 KB" },
  { name: "Marketing ROI Breakdown", date: "Sep 10, 2023", type: "Marketing", size: "4.2 MB" },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports" 
        description="Generate, schedule, and export business reports." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg flex items-center gap-4 hover:border-[#6432E6]/50 transition-colors cursor-pointer">
             <div className="p-3 bg-[#6432E6]/10 text-[#6432E6] rounded-lg">
                <DocumentTextIcon className="w-6 h-6" />
             </div>
             <div>
                 <div className="text-white font-medium">Generate New Report</div>
                 <div className="text-xs text-gray-500">Custom parameters</div>
             </div>
         </motion.div>
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-[#0A0A12] border border-white/5 rounded-xl p-6 shadow-lg flex items-center gap-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
             <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <ClockIcon className="w-6 h-6" />
             </div>
             <div>
                 <div className="text-white font-medium">Schedule Automations</div>
                 <div className="text-xs text-gray-500">Weekly/Monthly exports</div>
             </div>
         </motion.div>
      </div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-[#0A0A12] border border-white/5 rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-base font-semibold text-white tracking-tight">Recent Exports</h3>
          <button className="text-xs text-[#6432E6] hover:text-white transition-colors bg-[#6432E6]/10 px-3 py-1.5 rounded-md font-medium">View All</button>
        </div>
        <table className="w-full text-left">
            <thead>
              <tr className="bg-black/20 text-gray-500 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold">Report Name</th>
                <th className="py-3 px-6 font-semibold">Date Generated</th>
                <th className="py-3 px-6 font-semibold">Category</th>
                <th className="py-3 px-6 font-semibold">Size</th>
                <th className="py-3 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
               {reportsList.map((r,i) => (
                  <tr key={i} className="border-b last:border-0 border-white/5 hover:bg-white/[0.02] group">
                    <td className="py-4 px-6 text-white font-medium flex items-center gap-3">
                        <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                        {r.name}
                    </td>
                    <td className="py-4 px-6 text-gray-400">{r.date}</td>
                    <td className="py-4 px-6">
                        <span className="bg-white/5 text-gray-300 px-2.5 py-1 rounded text-xs">{r.type}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{r.size}</td>
                    <td className="py-4 px-6 text-right">
                        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
               ))}
            </tbody>
        </table>
      </motion.div>

    </div>
  );
};

export default Reports;