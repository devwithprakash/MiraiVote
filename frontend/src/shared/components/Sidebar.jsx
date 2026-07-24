import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  Plus,
  LogOut,
  Zap,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: ListChecks, label: "My Polls", to: "/polls" },
  { icon: Plus, label: "Create Poll", to: "/create" },
];

const SidebarItem = ({ icon: Icon, label, to, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        isActive ? "active-nav" : "inactive-nav"
      }`
    }
    style={({ isActive }) => ({
      background: isActive
        ? "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(99,102,241,0.12))"
        : "transparent",
      border: isActive
        ? "1px solid rgba(168,85,247,0.25)"
        : "1px solid transparent",
    })}
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
            style={{ background: "linear-gradient(to bottom, #a855f7, #6366f1)" }}
          />
        )}
        <Icon
          size={17}
          style={{
            color: isActive ? "#c084fc" : "rgba(255,255,255,0.4)",
            transition: "color 0.2s",
          }}
        />
        <span
          className="text-sm font-medium"
          style={{
            color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
            transition: "color 0.2s",
          }}
        >
          {label}
        </span>
      </>
    )}
  </NavLink>
);

const Sidebar = ({ onItemClick }) => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Sign out failed");
    }
  };

  return (
    <aside
      className="w-64 h-screen flex flex-col shrink-0"
      style={{
        background: "#09090f",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
              boxShadow: "0 0 16px rgba(168,85,247,0.4)",
            }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight text-white"
          >
            PulseBoard
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 20px" }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p
          className="text-[10px] uppercase font-bold px-3 mb-3 tracking-widest"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Workspace
        </p>
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            onClick={onItemClick}
          />
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 20px" }} />

      {/* User + Sign Out */}
      <div className="px-3 py-4 space-y-1">
        {user && (
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-7 h-7 rounded-full object-cover shrink-0"
                style={{ border: "1.5px solid rgba(168,85,247,0.4)" }}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
              >
                {(user.fullName || user.firstName || "U")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.fullName || user.firstName || "User"}
              </p>
              <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
          }}
        >
          <LogOut size={17} />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
