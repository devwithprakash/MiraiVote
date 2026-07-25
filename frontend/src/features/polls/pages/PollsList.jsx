import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  BarChart3,
  Pencil,
  Trash2,
  Users,
  Vote,
  Clock,
  ListChecks,
  Zap,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { pollService } from "../services/poll.service.js";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const DeleteModal = ({ poll, onConfirm, onCancel }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="absolute inset-0"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      onClick={onCancel}
    />
    <motion.div
      className="relative w-full max-w-sm rounded-2xl p-6 space-y-4"
      style={{
        background: "#0e0e1a",
        border: "1px solid rgba(239,68,68,0.25)",
        boxShadow: "0 0 60px rgba(239,68,68,0.1)",
      }}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <AlertTriangle size={22} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">Delete poll?</h3>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          <span className="text-white font-medium">"{poll.title}"</span> and all
          its responses will be permanently deleted.
        </p>
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const PollCard = ({ poll, index, onDelete }) => {
  const navigate = useNavigate();
  const isExpired = poll.isExpired;

  const handleCardClick = () => navigate(`/poll/${poll._id}`);

  const formatExpiry = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const diff = d - now;
    if (diff < 0) return "Expired";
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return "Expires soon";
  };

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={FADE_UP}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "all 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
        e.currentTarget.style.background = "rgba(168,85,247,0.05)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(168,85,247,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isExpired
            ? "rgba(255,255,255,0.06)"
            : "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(99,102,241,0.5), transparent)",
        }}
      />

      <div className="p-5" onClick={handleCardClick}>
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {!isExpired ? (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.25)",
                    color: "#c084fc",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#a855f7" }}
                  />
                  Live
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Ended
                </span>
              )}
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "#818cf8",
                }}
              >
                {poll.mode}
              </span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
              {poll.title}
            </h3>
            {poll.description && (
              <p
                className="text-sm mt-1 line-clamp-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {poll.description}
              </p>
            )}
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-4 text-xs"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <div className="flex items-center gap-1.5">
            <Vote size={13} />
            <span>{poll.votes ?? 0} votes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={13} />
            <span>{poll.people ?? 0} participants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ListChecks size={13} />
            <span>{poll.questions?.length ?? 0} questions</span>
          </div>
          {poll.expireAt && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              <span>{formatExpiry(poll.expireAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

      <div className="flex items-center px-5 py-3 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/poll/${poll._id}`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            color: "rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#c084fc";
            e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)";
            e.currentTarget.style.background = "rgba(168,85,247,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >
          <ExternalLink size={12} />
          Live
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/polls/${poll._id}/analytics`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            color: "rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#818cf8";
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
            e.currentTarget.style.background = "rgba(99,102,241,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >
          <BarChart3 size={12} />
          Analytics
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/polls/${poll._id}/edit`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            color: "rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#34d399";
            e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)";
            e.currentTarget.style.background = "rgba(52,211,153,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >
          <Pencil size={12} />
          Edit
        </button>

        <div className="flex-1" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(poll);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            color: "rgba(248,113,113,0.6)",
            background: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f87171";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(248,113,113,0.6)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.1)";
            e.currentTarget.style.background = "rgba(239,68,68,0.05)";
          }}
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

const SkeletonCard = ({ i }) => (
  <div
    className="rounded-2xl p-5 space-y-4 animate-pulse"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <div className="flex gap-2">
      <div
        className="h-5 w-14 rounded-full"
        style={{ background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="h-5 w-16 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
    </div>
    <div
      className="h-5 w-3/4 rounded-lg"
      style={{ background: "rgba(255,255,255,0.07)" }}
    />
    <div
      className="h-4 w-full rounded"
      style={{ background: "rgba(255,255,255,0.04)" }}
    />
    <div className="flex gap-4 pt-1">
      <div
        className="h-3 w-14 rounded"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
      <div
        className="h-3 w-14 rounded"
        style={{ background: "rgba(255,255,255,0.05)" }}
      />
    </div>
  </div>
);

const PollsList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPoll, setDeletingPoll] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | ended

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await pollService.fetchAllPolls(token);
        setPolls(response.data || []);
      } catch (error) {
        toast.error("Failed to load polls");
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deletingPoll) return;
    try {
      await pollService.deletePoll(deletingPoll._id);
      setPolls((prev) => prev.filter((p) => p._id !== deletingPoll._id));
      toast.success("Poll deleted");
    } catch {
      toast.error("Failed to delete poll");
    } finally {
      setDeletingPoll(null);
    }
  };

  const filtered = polls.filter((p) => {
    if (filter === "active") return !p.isExpired;
    if (filter === "ended") return p.isExpired;
    return true;
  });

  const FILTERS = [
    { key: "all", label: `All (${polls.length})` },
    {
      key: "active",
      label: `Active (${polls.filter((p) => !p.isExpired).length})`,
    },
    {
      key: "ended",
      label: `Ended (${polls.filter((p) => p.isExpired).length})`,
    },
  ];

  return (
    <div className="space-y-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            My Polls
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Manage, analyze, and share your polls.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
              boxShadow: "0 0 24px rgba(168,85,247,0.35)",
            }}
          >
            <Plus size={16} />
            New Poll
          </Link>
        </motion.div>
      </div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2"
      >
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              filter === key
                ? {
                    background: "rgba(168,85,247,0.15)",
                    border: "1px solid rgba(168,85,247,0.35)",
                    color: "#c084fc",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.4)",
                  }
            }
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} i={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center rounded-2xl"
          style={{
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.18)",
            }}
          >
            <ListChecks size={28} style={{ color: "#c084fc" }} />
          </div>
          <p className="text-lg font-bold text-white mb-2">
            {filter === "all" ? "No polls yet" : `No ${filter} polls`}
          </p>
          <p
            className="text-sm mb-6 max-w-xs"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {filter === "all"
              ? "Create your first poll and start collecting real-time responses."
              : `You don't have any ${filter} polls right now.`}
          </p>
          {filter === "all" && (
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
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((poll, i) => (
              <PollCard
                key={poll._id}
                poll={poll}
                index={i}
                onDelete={setDeletingPoll}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Modal */}
      <AnimatePresence>
        {deletingPoll && (
          <DeleteModal
            poll={deletingPoll}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingPoll(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PollsList;
