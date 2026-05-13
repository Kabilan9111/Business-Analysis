import React from "react";
import PageHeader from "../components/PageHeader";
import { motion } from "framer-motion";
import { UserCircleIcon, BellAlertIcon, ShieldCheckIcon, CreditCardIcon } from "@heroicons/react/24/outline";

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader 
        title="Settings" 
        description="Manage your account, billing, and system preferences." 
      />

      <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex shrink-0 md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
             <button className="flex items-center gap-3 px-4 py-3 bg-[#6432E6]/10 text-[#6432E6] rounded-lg font-medium text-sm text-left transition-colors whitespace-nowrap">
                 <UserCircleIcon className="w-5 h-5" /> Profile & workspace
             </button>
             <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg font-medium text-sm text-left transition-colors whitespace-nowrap">
                 <BellAlertIcon className="w-5 h-5" /> Notifications
             </button>
             <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg font-medium text-sm text-left transition-colors whitespace-nowrap">
                 <ShieldCheckIcon className="w-5 h-5" /> Security & API
             </button>
             <button className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg font-medium text-sm text-left transition-colors whitespace-nowrap">
                 <CreditCardIcon className="w-5 h-5" /> Billing & Plans
             </button>
          </div>

          <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="flex-1 bg-[#0A0A12] border border-white/5 rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white tracking-tight mb-6">Profile Settings</h3>
              
              <div className="space-y-6">
                  <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-tr from-[#6432E6] to-[#3B82F6] rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden shrink-0">
                          AK
                      </div>
                      <div>
                          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-medium transition-colors mb-2">Upload Photo</button>
                          <div className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">First Name</label>
                          <input type="text" defaultValue="Alex" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6432E6] transition-colors" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Last Name</label>
                          <input type="text" defaultValue="Knight" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6432E6] transition-colors" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email Address</label>
                          <input type="email" defaultValue="alex@astralinsight.com" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6432E6] transition-colors" />
                      </div>
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Role</label>
                          <input type="text" defaultValue="Chief Strategy Officer" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6432E6] transition-colors" />
                      </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                      <button className="px-5 py-2.5 text-gray-400 hover:text-white font-medium text-sm transition-colors">Cancel</button>
                      <button className="px-5 py-2.5 bg-[#6432E6] hover:bg-[#5229c2] text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-[#6432E6]/20">Save Changes</button>
                  </div>
              </div>
          </motion.div>
      </div>

    </div>
  );
};

export default Settings;