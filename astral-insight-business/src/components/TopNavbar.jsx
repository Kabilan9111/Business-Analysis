import React, { useState, useEffect } from 'react';
import { Search, Bell, X, Command, Activity, Zap, Shield, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const notifications = [
  { id: 1, title: 'Revenue Spike Detected', desc: 'MRR increased by 14% this week.', time: '2 mins ago', icon: Activity, type: 'alert' },
  { id: 2, title: 'AI Forecast Ready', desc: 'Q4 revenue predictions have been generated.', time: '1 hour ago', icon: Zap, type: 'ai' },
  { id: 3, title: 'Data Upload Complete', desc: 'Q3_Financial_Data.csv mapped successfully.', time: '4 hours ago', icon: FileText, type: 'success' },
];

const searchResults = [
  { group: 'Pages', items: [{ name: 'Anomaly Detection', path: '/business/anomaly-detection', icon: Shield }, { name: 'AI Insights', path: '/business/ai-insights', icon: Zap }] },
  { group: 'Reports', items: [{ name: 'Q3 Financial Summary', path: '/business/reports', icon: FileText }] },
];

const TopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || 'Dashboard';
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Format the title (e.g., 'ai-assistant' -> 'AI Assistant')
  const formatTitle = (str) => {
    if (str.toLowerCase() === 'ai-assistant') return 'AI Assistant';
    if (str.toLowerCase() === 'ai-insights') return 'AI Insights';
    if (str.toLowerCase() === 'upload-data') return 'Upload Data';
    if (str.toLowerCase() === 'anomaly-detection') return 'Anomaly Detection';
    if (str.toLowerCase() === 'sentiment-analysis') return 'Sentiment Analysis';
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8 flex-shrink-0">
        <h1 className="text-lg font-bold text-white tracking-tight">{formatTitle(currentPage)}</h1>
        
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center h-9 w-64 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-gray-400 text-sm px-3 cursor-text transition-all group relative hover:border-white/20 shadow-inner"
          >
            <Search className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-300 transition-colors" />
            <span>Search intelligence...</span>
            <div className="absolute right-2 flex items-center gap-1">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[10px] font-medium text-gray-500 bg-white/5 rounded border border-white/10">
                <Command className="w-3 h-3" /> K
              </kbd>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-full transition-all focus:outline-none ${isNotifOpen ? 'bg-[#6432E6]/20 text-[#6432E6]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#6432E6] ring-2 ring-[#050508] animate-pulse"></div>
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[340px] bg-[#0A0A12] border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden z-50 origin-top-right backdrop-blur-3xl"
                >
                  <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h3 className="font-semibold text-white text-sm">Notifications <span className="ml-2 bg-[#6432E6] text-white text-[10px] px-2 py-0.5 rounded-full">3 New</span></h3>
                    <button className="text-[11px] text-[#6432E6] font-medium hover:text-[#7f52f0] transition-colors">Mark all as read</button>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b last:border-b-0 border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors flex gap-4 group">
                        <div className={`mt-0.5 p-2 rounded-full h-fit flex-shrink-0 transition-transform group-hover:scale-110 ${n.type === 'alert' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : n.type === 'ai' ? 'bg-[#6432E6]/10 text-[#6432E6] border border-[#6432E6]/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                          <n.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-1 group-hover:text-[#6432E6] transition-colors">{n.title}</p>
                          <p className="text-xs text-gray-400 mb-2 leading-relaxed">{n.desc}</p>
                          <p className="text-[10px] text-gray-500 font-medium font-mono">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full p-3 bg-black/40 hover:bg-black/60 text-xs font-semibold text-gray-400 hover:text-white transition-colors border-t border-white/5">
                    View All Notifications
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-[#050508]/80 backdrop-blur-sm"
              onClick={() => setIsSearchOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-[#0A0A12] border border-[#6432E6]/30 rounded-2xl shadow-[0_0_50px_-12px_rgba(100,50,230,0.25)] overflow-hidden mx-4"
            >
              <div className="flex items-center px-4 py-4 border-b border-white/5 bg-black/20">
                <Search className="w-5 h-5 text-[#6432E6] mr-3" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search reports, data, anomalies..." 
                  className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-base font-medium"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 px-2 text-xs font-semibold text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
                >
                  ESC
                </button>
              </div>

              <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {searchResults.map((group, idx) => (
                  <div key={idx} className="mb-4 last:mb-0">
                    <div className="px-4 py-2 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                      {group.group}
                    </div>
                    {group.items.map((item, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          navigate(item.path);
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group/item border border-transparent hover:border-white/5"
                      >
                        <div className="p-2 bg-black/50 rounded-lg group-hover/item:bg-[#6432E6]/20 group-hover/item:text-[#6432E6] text-gray-400 transition-colors border border-white/5 group-hover/item:border-[#6432E6]/30">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm text-gray-300 group-hover/item:text-white transition-colors">{item.name}</span>
                        <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <span className="text-xs text-gray-500">Jump to</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center gap-6">
                <span className="flex items-center gap-2 text-[11px] text-gray-500"><kbd className="bg-white/10 px-1.5 py-0.5 rounded shadow-sm border border-white/10 font-sans">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-2 text-[11px] text-gray-500"><kbd className="bg-white/10 px-1.5 py-0.5 rounded shadow-sm border border-white/10 font-sans">↵</kbd> Select</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNavbar;