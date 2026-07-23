import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

import { Menu, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {user} = useUser()

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative z-50 w-[280px] h-full">
            <Sidebar onItemClick={() => setIsSidebarOpen(false)} />

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <Menu size={20} className="text-slate-300" />
            </button>

            <p>{user?.fullnane}</p>

            <span className="text-sm font-medium text-slate-400">
              MiraiVote
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
