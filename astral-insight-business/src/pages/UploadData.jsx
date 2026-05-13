import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, RefreshCw, FileText, Database, Layers, Search, MoreHorizontal, ArrowRight, BrainCircuit } from 'lucide-react';

const UploadData = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const uploadedFiles = [
    { name: 'sales_may_2024.csv', type: 'CSV', time: '10 mins ago', rows: '45,210', progress: 100, status: 'AI Ready', statusColor: 'emerald' },
    { name: 'customers_data.xlsx', type: 'XLSX', time: '1 hour ago', rows: '12,050', progress: 100, status: 'Processed', statusColor: 'blue' },
    { name: 'marketing_campaign.json', type: 'JSON', time: '2 hours ago', rows: '8,400', progress: 65, status: 'Processing', statusColor: 'purple' },
    { name: 'support_tickets.csv', type: 'CSV', time: '5 hours ago', rows: '3,200', progress: 0, status: 'Failed', statusColor: 'red' },
  ];

  const columns = [
    { name: 'order_id', type: 'String' },
    { name: 'order_date', type: 'Date' },
    { name: 'customer_id', type: 'String' },
    { name: 'category', type: 'Categorical' },
    { name: 'region', type: 'Categorical' },
    { name: 'amount', type: 'Numeric' },
    { name: 'quantity', type: 'Numeric' },
    { name: 'payment_mode', type: 'Categorical' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto xl:ml-0 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Upload Data</h1>
          <p className="text-gray-400 text-sm">Upload and prepare your business data for AI-powered analytics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all shadow-lg hover:shadow-white/5">
          <FileText className="w-4 h-4" />
          View Documentation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] bg-[#0A0A12] overflow-hidden ${
              isDragging ? 'border-[#6432E6] bg-[#6432E6]/10' : 'border-white/10 hover:border-[#6432E6]/50 hover:bg-white/[0.02]'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragging && <div className="absolute inset-0 bg-[#6432E6]/5 animate-pulse rounded-2xl pointer-events-none"></div>}
            
            <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[#6432E6]/20 to-transparent flex items-center justify-center border border-[#6432E6]/30 shadow-[0_0_30px_-5px_rgba(100,50,230,0.3)]">
              <UploadCloud className="w-10 h-10 text-[#6432E6]" />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 z-10">Drag & Drop files here</h3>
            <p className="text-gray-400 text-sm max-w-md mb-8 z-10">
              Supported formats: <span className="text-gray-300 font-medium">CSV, XLSX, JSON</span>. Maximum file size: <span className="text-gray-300 font-medium">500MB</span>.
            </p>
            
            <button className="px-6 py-3 bg-[#6432E6] hover:bg-[#7f52f0] text-white rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(100,50,230,0.5)] flex items-center gap-2 z-10">
              <Database className="w-4 h-4" />
              Browse Files
            </button>
          </div>

          <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#6432E6]" /> Uploaded Datasets
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="group relative bg-[#050508] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <File className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[150px]">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{file.type}</span>
                          <span className="text-[10px] text-gray-500">{file.time}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-400">{file.rows} rows</span>
                    <span className={`font-medium ${
                      file.statusColor === 'emerald' ? 'text-emerald-400' :
                      file.statusColor === 'blue' ? 'text-blue-400' :
                      file.statusColor === 'purple' ? 'text-[#6432E6]' : 'text-red-400'
                    }`}>
                      {file.status}
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        file.statusColor === 'emerald' ? 'bg-emerald-500' :
                        file.statusColor === 'blue' ? 'bg-blue-500' :
                        file.statusColor === 'purple' ? 'bg-[#6432E6] animate-pulse' : 'bg-red-500'
                      }`}
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6432E6]/10 blur-3xl rounded-full"></div>
            
            <h3 className="text-lg font-semibold text-white mb-6">Data Health Score</h3>
            
            <div className="flex flex-col items-center justify-center mb-8 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.85" strokeDashoffset="28.14" className="text-[#6432E6] drop-shadow-[0_0_10px_rgba(100,50,230,0.5)]" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">92</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mt-1">Score</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> completeness</span>
                <span className="text-white font-medium">99.8%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cleanliness</span>
                <span className="text-white font-medium">High</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-yellow-500" /> Missing Values</span>
                <span className="text-white font-medium">0.2%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-[#6432E6]" /> AI Confidence</span>
                <span className="text-white font-medium">95%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A12] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Schema Auto-Detection</h3>
              <RefreshCw className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>
            
            <div className="space-y-2">
              {['Date Column', 'Revenue Column', 'Customer Column', 'Category Column', 'Region Column'].map((col, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 border-l-2 border-l-[#6432E6]">
                  <span className="text-xs font-medium text-gray-300">{col}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A12] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-[#6432E6]" /> Data Preview
          </h3>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 focus-within:border-[#6432E6]/50 transition-colors">
            <Search className="w-3.5 h-3.5 text-gray-500 mr-2" />
            <input type="text" placeholder="Search columns..." className="bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none w-32 md:w-48" />
          </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar border-t border-white/5">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#050508]/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-4 font-medium border-b border-white/5">
                    <div className="flex items-center justify-between">
                      {col.name}
                      <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded font-mono text-gray-500 ml-2">{col.type}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">ORD-{1000 + row}</td>
                  <td className="px-6 py-4 font-mono text-xs">2024-05-{10 + row}</td>
                  <td className="px-6 py-4 font-mono text-xs text-blue-400">CUST-{900 + row}</td>
                  <td className="px-6 py-4"><span className="bg-white/5 px-2 py-1 rounded-md text-xs border border-white/5">Electronics</span></td>
                  <td className="px-6 py-4">North America</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">${(Math.random() * 1000).toFixed(2)}</td>
                  <td className="px-6 py-4">{Math.floor(Math.random() * 10) + 1}</td>
                  <td className="px-6 py-4"><span className="bg-[#6432E6]/10 text-[#6432E6] px-2 py-1 rounded-md text-xs border border-[#6432E6]/20">Credit Card</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-black/20 p-3 border-t border-white/5 flex justify-end">
             <button className="text-xs text-[#6432E6] hover:text-white font-medium flex items-center gap-1 transition-colors">View Full Table <ArrowRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
};

export default UploadData;