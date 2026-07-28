import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  BarChart2,
  Users,
  ListTodo,
  ExternalLink,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pollService } from "../services/poll.service.js";
import { socket } from "../../../shared/socket/socket.js";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const BAR_COLORS = ["#a855f7", "#6366f1", "#ec4899", "#8b5cf6", "#06b6d4"];

const MiniStat = ({ icon: Icon, label, value, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="show"
    variants={FADE_UP}
    className="flex-1 rounded-2xl p-5"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div
      className="flex items-center gap-1.5 mb-2.5"
      style={{ color: "rgba(255,255,255,0.35)" }}
    >
      <Icon size={13} />
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span className="text-3xl font-bold text-white">{value ?? 0}</span>
  </motion.div>
);

const PollDetail = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { getToken } = useAuth();

  const pollUrl = `${window.location.origin}/public/${poll?.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await pollService.fetchPoll(id, token);
        setPoll(response.data);
      } catch {
        toast.error("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPoll();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const onConnect = () => {
      socket.emit("join_poll", id);
    };

    // Whenever the socket connects (or reconnects) run this function
    // It registers a listener for a future event
    // if web-socket connection is not established yet then this will run but
    socket.on("connect", onConnect);
    // if web-socket connection is already established then then this will execute
    if (socket.connected) socket.emit("join_poll", id);

    // if we didn't cleanup the "onConnect" then client might connected to multiple polls
    return () => socket.off("connect", onConnect);
  }, [id]);

  // Socket: live updates
  useEffect(() => {
    const handlePollUpdate = (data) => {
      console.log(data);
      setPoll((prev) => {
        console.log("Previous", prev);
        if (!prev) return prev;
        if (data.pollId !== prev._id) return prev;

        return {
          ...prev,
          votes: data.votes,
          people: data.people,

          questions: prev.questions.map((question) => {
            const updatedQuestion = data.questionVotes.find(
              (q) => q.questionId === question._id,
            );

            if (!updatedQuestion) return question;

            return {
              ...question,
              totalVotes: updatedQuestion.totalVotes,
              options: question.options.map((option) => {
                const updatedOption = updatedQuestion.options.find(
                  (o) => o.optionId === option._id,
                );

                return updatedOption
                  ? {
                      ...option,
                      votes: updatedOption.votes,
                      percentage: updatedOption.percentage,
                    }
                  : option;
              }),
            };
          }),
        };
      });
    };
    socket.on("poll_updated", handlePollUpdate);
    return () => socket.off("poll_updated", handlePollUpdate);
  }, []);

  return (
    <div className="space-y-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Back */}
      <button
        onClick={() => navigate("/polls")}
        className="flex items-center gap-2 text-sm font-medium transition-colors group"
        style={{ color: "rgba(255,255,255,0.4)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#c084fc")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
        }
      >
        <ArrowLeft
          size={15}
          className="transition-transform group-hover:-translate-x-1"
        />
        My Polls
      </button>

      {loading ? (
        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Poll Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {!poll?.isExpired ? (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    color: "#c084fc",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Ended
                </span>
              )}
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "#818cf8",
                }}
              >
                {poll?.mode}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {poll?.title}
            </h1>
            {poll?.description && (
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {poll.description}
              </p>
            )}
          </motion.div>

          {/* Share Link */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(168,85,247,0.05)",
              border: "1px solid rgba(168,85,247,0.18)",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "rgba(168,85,247,0.7)" }}
            >
              Share Link
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div
                className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm font-mono overflow-hidden"
                style={{
                  background: "rgba(9,9,15,0.6)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <p className="truncate">{pollUrl}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: copied
                      ? "rgba(52,211,153,0.15)"
                      : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
                    color: copied ? "#34d399" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <a
                  href={pollUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(168,85,247,0.12)",
                    border: "1px solid rgba(168,85,247,0.25)",
                    color: "#c084fc",
                  }}
                >
                  <ExternalLink size={15} />
                  Open
                </a>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-3">
            <MiniStat
              index={2}
              icon={BarChart2}
              label="Total Votes"
              value={poll?.votes}
            />
            <MiniStat
              index={3}
              icon={Users}
              label="Participants"
              value={poll?.people}
            />
            <MiniStat
              index={4}
              icon={ListTodo}
              label="Questions"
              value={poll?.questions?.length}
            />
          </div>

          {/* Live Results */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mb-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <h2 className="text-lg font-bold text-white">Live Results</h2>
              </div>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Updates in real time as votes arrive.
              </p>
            </motion.div>

            <div className="space-y-4">
              {poll?.questions?.map((q, qIdx) => (
                <motion.div
                  key={q._id}
                  custom={qIdx + 5}
                  initial="hidden"
                  animate="show"
                  variants={FADE_UP}
                  className="rounded-2xl p-5 sm:p-6 space-y-5"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>
                        Q{qIdx + 1}.{" "}
                      </span>
                      {q.text}
                    </h3>
                    <span
                      className="shrink-0 text-xs"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {q.totalVotes ?? 0} responses
                    </span>
                  </div>

                  <div className="space-y-4">
                    {q.options?.map((option, oIdx) => {
                      const pct = option.percentage || 0;
                      const color = BAR_COLORS[oIdx % BAR_COLORS.length];
                      return (
                        <div key={option._id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span style={{ color: "rgba(255,255,255,0.65)" }}>
                              {option.text}
                            </span>
                            <span
                              className="font-semibold tabular-nums"
                              style={{ color }}
                            >
                              {option.votes ?? 0} · {pct}%
                            </span>
                          </div>
                          <div
                            className="w-full h-2 rounded-full overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PollDetail;
