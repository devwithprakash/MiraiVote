import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Plus,
  LogOut,
  Users,
  BarChart2,
  Share2,
  PanelLeftClose,
  Vote,
} from "lucide-react";


const PollCard = ({ title, description, votes, people, type }) => {
  return (
    <div className="group bg-[#0B1120] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 hover:bg-[#0d1426] transition-all duration-300 hover:-translate-y-1">
      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold text-white truncate">{title}</h3>

          {description && (
            <p className="text-slate-400 text-sm mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <span className="shrink-0 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20">
          Live
        </span>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-5 mt-8 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Vote size={16} />
          <span>{votes} votes</span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>{people} people</span>
        </div>

        <div className="flex items-center gap-2">
          <Share2 size={16} />
          <span>{type}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
    console.log("Hello")
  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Your polls
          </h1>

          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Create, share, and analyze live polls.
          </p>
        </div>

        <button className="h-12 px-5 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]">
          <Plus size={18} />
          <span>New poll</span>
        </button>
      </div>

      {/* Polls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <PollCard title="hello" votes={0} people={0} type="Anonymous" />

        <PollCard
          title="fdfg"
          description="dfgdgfdg"
          votes={0}
          people={0}
          type="Authenticated"
        />
      </div>
    </div>
  );
};

export default Dashboard;
