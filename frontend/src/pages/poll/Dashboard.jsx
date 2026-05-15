import React, { useEffect } from "react";
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
  Trash2,
} from "lucide-react";
import { pollService } from "../../services/poll.service.js";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PollCard = ({ title, description, votes, people, type, id }) => {
  const navigate = useNavigate();

  const { accessToken } = useAuth();

  const handleNavigate = () => {
    navigate(`/poll/${id}`);
  };

  const handleDelete = async () => {
    try {
      const data = await pollService.deletePoll(id, accessToken);

      toast.success("Poll deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-[#0B1120] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 hover:bg-[#0d1426] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
          Live
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="p-2 rounded-xl bg-slate-800/40 text-slate-400 border border-slate-700 cursor-pointer hover:bg-slate-500/10 hover:text-slate-400 hover:border-slate-500/30 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Top Content */}
      <div className="pr-16">
        <h3 className="text-xl font-semibold text-white truncate">{title}</h3>

        {description && (
          <p className="text-slate-400 text-sm mt-2 line-clamp-2">
            {description}
          </p>
        )}
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

const PollCardSkeleton = () => {
  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-3xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-6 w-3/4 bg-slate-800 rounded-lg"></div>
        <div className="h-5 w-12 bg-slate-800 rounded-md"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-800/50 rounded"></div>
        <div className="h-4 w-2/3 bg-slate-800/50 rounded"></div>
      </div>
      <div className="flex gap-4 pt-2">
        <div className="h-4 w-16 bg-slate-800 rounded"></div>
        <div className="h-4 w-16 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const response = await pollService.fetchAllPolls(accessToken);

        setPolls(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

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

        <Link
          to="/create"
          className="h-12 px-5 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>New poll</span>
        </Link>
      </div>

      {/* Polls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? // Skeleton State
            Array.from({ length: 6 }).map((_, i) => (
              <PollCardSkeleton key={i} />
            ))
          : // Actual Content
            polls?.map((poll) => (
              <PollCard
                key={poll._id}
                title={poll.title}
                description={poll.description}
                votes={poll.votes}
                people={poll.people}
                type={poll.mode}
                id={poll._id}
              />
            ))}
      </div>
    </div>
  );
};

export default Dashboard;
