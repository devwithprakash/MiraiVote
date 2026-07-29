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
  HelpCircle,
} from "lucide-react";
import { pollService } from "../services/poll.service.js";
import { useAuth } from "@clerk/clerk-react";

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
<div className="flex items-start justify-between gap-3">
  <div className="min-w-0 flex-1">
    <p
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/35 break-words"
    >
      {label}
    </p>

    <p className="text-lg sm:text-xl font-semibold text-white break-words">
      {value ?? "—"}
    </p>
  </div>

  <div
    className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl"
    style={{
      background: `${accent}22`,
      border: `1px solid ${accent}33`,
    }}
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
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
            style={{
              background: isExpired
                ? "rgba(255,255,255,0.03)"
                : "rgba(168,85,247,0.1)",
              border: `1px solid ${isExpired ? "rgba(255,255,255,0.05)" : "rgba(168,85,247,0.2)"}`,
            }}
          >
            <ListChecks
              size={18}
              style={{ color: isExpired ? "rgba(255,255,255,0.4)" : "#c084fc" }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <p className="text-sm font-semibold text-white truncate">
                {poll.title}
              </p>
              {!isExpired ? (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.25)",
                    color: "#c084fc",
                  }}
                >
                  <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Ended
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <Users size={12} /> {poll.totalParticipants ?? 0}
              </span>
              <span className="flex items-center gap-1.5">
                <HelpCircle size={12} /> {poll.totalQuestions ?? 0}
              </span>
            </div>
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
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [responsesToday, setResponsesToday] = useState(0);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      try {
        setLoading(true);
        const [pollsRes] = await Promise.all([
          pollService.fetchAllPolls(token),
        ]);
        setPolls(pollsRes.data.pollResult || []);
        setTotalParticipants(pollsRes.data.totalParticipants);
        setResponsesToday(pollsRes.data.totalResponsesToday);
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

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Overview
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            {activePolls > 0
              ? `${activePolls} active poll${activePolls !== 1 ? "s" : ""} running`
              : "No active polls — create one to start collecting responses"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/polls"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <ListChecks size={14} />
            All Polls
          </Link>
          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
            }}
          >
            <Plus size={14} />
            New Poll
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            index={0}
            icon={ListChecks}
            label="Polls"
            value={loading ? "…" : polls.length}
            accent="#a855f7"
          />
          <StatCard
            index={2}
            icon={Users}
            label="Participants"
            value={loading ? "…" : totalParticipants}
            accent="#ec4899"
          />
          <StatCard
            index={1}
            icon={Vote}
            label="Today"
            value={loading ? "…" : responsesToday}
            accent="#6366f1"
          />
          <StatCard
            index={3}
            icon={Zap}
            label="Active"
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
              style={{
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <ListChecks size={24} style={{ color: "#c084fc" }} />
            </div>
            <p className="text-base font-semibold text-white mb-1">
              No polls yet
            </p>
            <p
              className="text-sm mb-5"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
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
