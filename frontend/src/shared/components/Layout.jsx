import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X, Bell, Zap } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#09090f", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-50 w-[280px] h-full">
            <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-[-48px] p-2 rounded-xl transition-colors"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0"
          style={{
            background: "rgba(9,9,15,0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile: show logo always visible */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <Menu size={18} className="text-white" />
              </button>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                }}
              >
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">
                MiraiVote
              </span>
            </div>
          </div>

          {/* Right: User Info */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ border: "2px solid rgba(168,85,247,0.4)" }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #6366f1)",
                    }}
                  >
                    {(user.fullName || user.firstName || "U")[0].toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
