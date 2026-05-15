import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom"; //
import { BarChart3, LayoutDashboard, Plus, LogOut, Icon } from "lucide-react";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Updated Item to use Link and detect active route
// Inside SidebarItem component
const SidebarItem = ({ icon: Icon, label, to, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick} // This triggers the setIsSidebarOpen(false) in Layout
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900"}
      `}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
};

const Sidebar = ({ onItemClick }) => {
  const location = useLocation();

  const { accessToken, setAccessToken } = useAuth();

  const handleLogout = async () => {
    try {
      const data = await authService.logout(accessToken);

      setAccessToken(null);

      toast.success("User logged out successfully");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-slate-800 flex flex-col p-4 shrink-0 bg-[#020617]">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="bg-white p-1 rounded-lg">
          <BarChart3 className="text-black" size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          MiraiVote
        </span>
      </div>

      {/* Navigation Links - This section can scroll internally if list is too long */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
        <p className="text-[10px] uppercase font-bold text-slate-500 px-3 mb-2 tracking-widest">
          Workspace
        </p>

        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          to="/dashboard"
          onClick={onItemClick}
          active={location.pathname === "/dashboard"}
        />

        <SidebarItem
          icon={BarChart3}
          label="Analytics"
          to="/analytics"
          onClick={onItemClick}
          active={location.pathname === "/analytics"}
        />

        <SidebarItem
          icon={Plus}
          label="New poll"
          to="/create"
          onClick={onItemClick}
          active={location.pathname === "/create"}
        />
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800 shrink-0">
        <button
          onClick={handleLogout}
          className={`flex text-slate-400 cursor-pointer hover:text-slate-300 items-center gap-3 px-3 py-2 rounded-lg transition-colors`}
        >
          <LogOut />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
