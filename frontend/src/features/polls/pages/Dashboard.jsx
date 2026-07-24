import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  ListChecks,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  TrendingUp,
  Vote,
} from "lucide-react";
import { pollService } from "../services/poll.service.js";
import { useUser } from "@clerk/clerk-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const StatCard = ({ icon: Icon, label, value, accent, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="show"
    variants={FADE_UP}
    className="relative overflow-hidden rounded-2xl p-5"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div
      className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          {label}
        </p>
        <p className="text-3xl font-bold text-white">{value ?? "—"}</p>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}22`, border: `1px solid ${accent}33` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
    </div>
  </motion.div>
);

const RecentPollCard = ({ poll, index }) => {
  const isExpired = poll.isExpired;
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={FADE_UP}
    >
      <Link
        to={`/poll/${poll._id}`}
        className="group flex items-center justify-between p-4 rounded-xl transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(168,85,247,0.06)";
          e.currentTarget.style.borderColor = "rgba(168,85,247,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: isExpired ? "rgba(255,255,255,0.2)" : "#a855f7",
              boxShadow: isExpired ? "none" : "0 0 8px rgba(168,85,247,0.6)",
            }}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{poll.title}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {poll.votes ?? 0} votes · {poll.people ?? 0} participants
            </p>
          </div>
        </div>
        <ArrowRight
          size={16}
          className="shrink-0 transition-transform group-hover:translate-x-1"
          style={{ color: "rgba(255,255,255,0.25)" }}
        />
      </Link>
    </motion.div>
  );
};

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [pollsRes, analyticsRes] = await Promise.all([
          pollService.fetchAllPolls(),
          pollService.fetchAnalytics("all"),
        ]);
        setPolls(pollsRes.data || []);
        setAnalytics(analyticsRes.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activePolls = polls.filter((p) => !p.isExpired).length;
  const recentPolls = [...polls].slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl px-7 py-8"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(99,102,241,0.08) 50%, rgba(236,72,153,0.06) 100%)",
          border: "1px solid rgba(168,85,247,0.2)",
        }}
      >
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
        <div className="relative">
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(192,132,252,0.8)" }}>
            {greeting()},
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {user?.fullName || user?.firstName || "there"} 👋
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            {activePolls > 0
              ? `You have ${activePolls} active poll${activePolls !== 1 ? "s" : ""} running right now.`
              : "No active polls. Create one to start collecting responses."}
          </p>
        </div>
        <div className="relative flex flex-wrap gap-3 mt-6">
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
              boxShadow: "0 0 20px rgba(168,85,247,0.35)",
            }}
          >
            <Plus size={16} />
            Create Poll
          </Link>
          <Link
            to="/polls"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/10"
            style={{
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <ListChecks size={16} />
            View All Polls
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Overview
        </motion.p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            index={0}
            icon={ListChecks}
            label="Total Polls"
            value={loading ? "…" : analytics?.stats?.totalPolls ?? polls.length}
            accent="#a855f7"
          />
          <StatCard
            index={1}
            icon={Vote}
            label="Total Votes"
            value={loading ? "…" : analytics?.stats?.totalVotes ?? 0}
            accent="#6366f1"
          />
          <StatCard
            index={2}
            icon={Users}
            label="Participants"
            value={loading ? "…" : analytics?.stats?.totalParticipants ?? 0}
            accent="#ec4899"
          />
          <StatCard
            index={3}
            icon={Zap}
            label="Active Polls"
            value={loading ? "…" : activePolls}
            accent="#8b5cf6"
          />
        </div>
      </div>

      {/* Recent Polls */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Recent Polls
          </motion.p>
          <Link
            to="/polls"
            className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
            style={{ color: "#c084fc" }}
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            ))}
          </div>
        ) : recentPolls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              <ListChecks size={24} style={{ color: "#c084fc" }} />
            </div>
            <p className="text-base font-semibold text-white mb-1">No polls yet</p>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Create your first poll and start collecting responses.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #a855f7, #6366f1)",
                boxShadow: "0 0 20px rgba(168,85,247,0.3)",
              }}
            >
              <Plus size={15} />
              Create your first poll
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {recentPolls.map((poll, i) => (
              <RecentPollCard key={poll._id} poll={poll} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
