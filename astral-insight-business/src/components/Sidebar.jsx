import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  TrendingUp, 
  Users, 
  LineChart, 
  FileText, 
  Bot, 
  Lightbulb, 
  Settings,
  UploadCloud,
  AlertTriangle,
  MessageSquare,
  Wand2,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const NavItem = ({ to, icon: Icon, children, isPurple }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors border ${
          isActive
            ? isPurple 
              ? 'bg-business-brand/10 text-business-brand border-business-brand/20' 
              : 'bg-white/10 text-white border-white/5'
            : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <Icon className={`w-4 h-4 ${isPurple ? 'text-purple-400' : ''}`} />
      {children}
    </NavLink>
  );

  return (
    <aside className="w-[280px] h-screen bg-nav-bg border-r border-white/5 flex flex-col z-20 sticky top-0 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-business-brand" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 5L5 35H12L20 18L28 35H35L20 5Z" fill="currentColor"/>
            <path d="M20 5L15 15H25L20 5Z" fill="#C084FC" opacity="0.8"/>
          </svg>
          <span className="font-semibold tracking-tight text-white">AstralInsight BA</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider px-3 mb-2">Main Menu</div>
        <NavItem to="/business/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
        <NavItem to="/business/analytics" icon={BarChart2}>Analytics</NavItem>
        <NavItem to="/business/sales" icon={TrendingUp}>Sales</NavItem>
        <NavItem to="/business/customers" icon={Users}>Customers</NavItem>
        <NavItem to="/business/forecasting" icon={LineChart}>Forecasting</NavItem>
        <NavItem to="/business/reports" icon={FileText}>Reports</NavItem>

        <div className="mt-8 mb-2 px-3 text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Data & Intelligence</div>
        <NavItem to="/business/upload-data" icon={UploadCloud}>Upload Data</NavItem>
        <NavItem to="/business/ai-assistant" icon={Bot} isPurple>AI Assistant</NavItem>
        <NavItem to="/business/ai-insights" icon={Lightbulb} isPurple>AI Insights</NavItem>
        <NavItem to="/business/recommendations" icon={Wand2} isPurple>Recommendations</NavItem>
        <NavItem to="/business/sentiment-analysis" icon={MessageSquare}>Sentiment Analysis</NavItem>
        <NavItem to="/business/anomaly-detection" icon={AlertTriangle} isPurple>Anomaly Detection</NavItem>
      </div>
      
      <div className="p-4 border-t border-white/5 space-y-1">
        <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider px-3 mb-2">Administration</div>
        <NavItem to="/business/admin" icon={ShieldAlert}>Admin Panel</NavItem>
        <NavItem to="/business/settings" icon={Settings}>Settings</NavItem>
        <div className="mt-6 flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10 flex-shrink-0">AD</div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-semibold text-white truncate">Admin User</span>
            <span className="text-[10px] text-gray-500 truncate">admin@astralinsight.ai</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;