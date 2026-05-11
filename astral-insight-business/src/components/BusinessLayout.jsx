import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const BusinessLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-app-bg text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto w-full p-8 dashboard-glow relative">
            <div className="max-w-[1400px] w-full mx-auto space-y-6">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessLayout;