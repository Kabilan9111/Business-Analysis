import React from 'react';
import PageHeader from '../components/PageHeader';
import { Download, FileText, Calendar } from 'lucide-react';

const Reports = () => {
  return (
    <>
      <PageHeader 
        title="Reports" 
        description="Generate, schedule, and export comprehensive business reports." 
        action={<button className="px-4 py-2 bg-white/10 rounded-lg text-sm text-white font-medium hover:bg-white/20 transition flex items-center gap-2"><Calendar className="w-4 h-4"/> Schedule Report</button>}
      />
      
      <div className="bg-[#0A0A12] border border-white/5 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-black/20 text-gray-500 text-[11px] uppercase tracking-wider border-b border-white/5">
                    <th className="py-4 px-6 font-semibold">Report Name</th>
                    <th className="py-4 px-6 font-semibold">Type</th>
                    <th className="py-4 px-6 font-semibold">Generated Date</th>
                    <th className="py-4 px-6 font-semibold text-right">Action</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                {[
                  { name: 'Monthly Executive Summary', type: 'PDF', date: 'Nov 01, 2026' },
                  { name: 'Q3 Financials Full', type: 'CSV', date: 'Oct 15, 2026' },
                  { name: 'Customer Churn Analysis', type: 'PDF', date: 'Oct 10, 2026' },
                  { name: 'Marketing ROI Drilldown', type: 'XLSX', date: 'Sep 28, 2026' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                      <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {row.name}
                      </td>
                      <td className="py-4 px-6 text-gray-400">{row.type}</td>
                      <td className="py-4 px-6 text-gray-500">{row.date}</td>
                      <td className="py-4 px-6 text-right">
                          <button className="text-gray-400 hover:text-white transition p-2">
                             <Download className="w-4 h-4" />
                          </button>
                      </td>
                  </tr>
                ))}
            </tbody>
        </table>
      </div>
    </>
  );
};

export default Reports;