import React from 'react';
import PageHeader from '../components/PageHeader';
import { User, Bell, Shield, Paintbrush } from 'lucide-react';

const Settings = () => {
  return (
    <>
      <PageHeader 
        title="Settings" 
        description="Manage your account, team permissions, and workspace preferences." 
      />
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-1">
           <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium border border-white/5">
             <User className="w-4 h-4" /> Profile
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg text-sm font-medium transition">
             <Shield className="w-4 h-4" /> Security
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg text-sm font-medium transition">
             <Bell className="w-4 h-4" /> Notifications
           </button>
           <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg text-sm font-medium transition">
             <Paintbrush className="w-4 h-4" /> Appearance
           </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-[#0A0A12] border border-white/5 rounded-xl p-8">
           <h3 className="text-lg font-semibold text-white mb-6">Profile Settings</h3>
           
           <div className="space-y-6">
             <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white/5">AD</div>
               <div>
                 <button className="px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/20 transition mb-2">Upload Avatar</button>
                 <p className="text-xs text-gray-500">Recommended 256x256 px. Max 2MB.</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-business-brand transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-business-brand transition" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <input type="email" defaultValue="admin@astralinsight.ai" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-business-brand transition" />
                </div>
             </div>
             
             <div className="pt-6 border-t border-white/5 flex justify-end">
                <button className="px-6 py-2.5 bg-business-brand rounded-lg text-sm text-white font-medium hover:bg-purple-600 transition">Save Changes</button>
             </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Settings;