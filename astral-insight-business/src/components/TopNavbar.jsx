import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TopNavbar = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || 'Dashboard';
  
  // Format the title (e.g., 'ai-assistant' -> 'AI Assistant')
  const formatTitle = (str) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="h-16 border-b border-white/5 bg-nav-bg/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8 flex-shrink-0">
      <h1 className="text-lg font-semibold text-white tracking-tight">{formatTitle(currentPage)}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="w-full h-8 pl-9 pr-4 rounded-md bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-business-brand transition"
          />
        </div>
        
        <button className="relative text-gray-400 hover:text-white transition">
          <Bell className="w-5 h-5" />
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-business-brand border border-nav-bg"></div>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;