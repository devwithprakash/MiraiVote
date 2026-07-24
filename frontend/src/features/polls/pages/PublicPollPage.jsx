import React, { useEffect, useState } from "react";
import { Send, Users, CheckCircle2, Zap, BarChart2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { pollService } from "../services/poll.service";
import { socket } from "../../../shared/socket/socket.js";
import toast from "react-hot-toast";

const BAR_COLORS = ["#a855f7", "#6366f1", "#ec4899", "#8b5cf6", "#06b6d4"];

const PublicPollPage = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { pollId } = useParams();

  const isExpired = poll?.isExpired;
  const answeredCount = Object.keys(selectedOptions).length;
  const totalQuestions = poll?.questions?.length || 0;
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const canSubmit = answeredCount === totalQuestions && !submitted && !submitting && !isExpired;

  const handleVote = (questionId, optionId) => {
    if (submitted || isExpired) return;
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
  };

  useEffect(() => {
    const fetchPublicPoll = async () => {
      try {
        setLoading(true);
        const response = await pollService.fetchPublicPoll(pollId);
        setPoll(response.data);
      } catch {
        toast.error("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicPoll();
  }, [pollId]);

  // Socket: join poll room for live updates
  useEffect(() => {
    if (!pollId) return;
    const onConnect = () => socket.emit("join_poll", pollId);
    socket.on("connect", onConnect);
    if (socket.connected) socket.emit("join_poll", pollId);
    return () => socket.off("connect", onConnect);
  }, [pollId]);

  // Socket: live result updates
  useEffect(() => {
    const handlePollUpdate = (data) => {
      setPoll((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          votes: data.votes,
          people: data.people,
          questions: prev.questions.map((question) => {
            const updatedQ = data.questionVotes.find((q) => q.questionId === question._id);
            if (!updatedQ) return question;
            return {
              ...question,
              totalVotes: updatedQ.totalVotes,
              options: question.options.map((option) => {
                const updatedOpt = updatedQ.options.find((o) => o.optionId === option._id);
                return updatedOpt
                  ? { ...option, votes: updatedOpt.votes, percentage: updatedOpt.percentage }
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

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      setSubmitting(true);
      const pollInfo = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));
      const response = await pollService.submitPoll(pollId, pollInfo);
      setSubmitted(true);
      toast.success(response.data.message || "Vote submitted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#09090f", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
          >
            <Zap size={22} className="text-white" />
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Loading poll…</p>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#09090f", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="text-center">
          <p className="text-lg font-bold text-white mb-2">Poll not found</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>This poll may have been removed or the link is invalid.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
          >
            Go to PulseBoard
          </Link>
        </div>
      </div>
    );
  }

  // ── Success State ──────────────────────────────────────────────────────────
  const showResults = submitted || isExpired;

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: "#09090f", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 w-full z-50"
        style={{ height: "3px", background: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, #a855f7, #6366f1, #ec4899)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 h-14"
        style={{
          background: "rgba(9,9,15,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">PulseBoard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Users size={12} />
            <span>{poll.people ?? 0} joined</span>
          </div>
          {!isExpired && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#c084fc" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Live
            </div>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 pt-8 space-y-6">
        {/* Poll Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {answeredCount}/{totalQuestions} Answered
            </span>
            {isExpired && (
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                }}
              >
                Ended
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white">{poll.title}</h1>
          {poll.description && (
            <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {poll.description}
            </p>
          )}

          {isExpired && (
            <div
              className="mt-3 px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              This poll has ended. Results are now visible.
            </div>
          )}
        </motion.div>

        {/* Questions */}
        <div className="space-y-4">
          {poll.questions?.map((question, qIdx) => {
            const hasVotedThis = Boolean(selectedOptions[question._id]);
            return (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIdx * 0.06 + 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${hasVotedThis && !showResults ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.07)"}`,
                  transition: "border-color 0.3s",
                }}
              >
                {/* Question header */}
                <div
                  className="px-5 pt-5 pb-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                        Q{qIdx + 1}.{" "}
                      </span>
                      {question.text}
                    </h3>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {!isExpired ? (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(168,85,247,0.12)",
                            border: "1px solid rgba(168,85,247,0.2)",
                            color: "#c084fc",
                          }}
                        >
                          Live
                        </span>
                      ) : (
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.3)",
                          }}
                        >
                          Closed
                        </span>
                      )}
                      {showResults && (
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {question.totalVotes ?? 0} votes
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="p-3 space-y-2">
                  {question.options?.map((option, oIdx) => {
                    const isSelected = selectedOptions[question._id] === option._id;
                    const pct = showResults ? (option.percentage || 0) : 0;
                    const color = BAR_COLORS[oIdx % BAR_COLORS.length];

                    return (
                      <button
                        key={option._id}
                        onClick={() => handleVote(question._id, option._id)}
                        disabled={submitted || isExpired}
                        className="group relative w-full overflow-hidden rounded-xl text-left transition-all duration-200"
                        style={{
                          background: isSelected
                            ? "rgba(168,85,247,0.1)"
                            : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isSelected ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.06)"}`,
                          boxShadow: isSelected ? "0 0 16px rgba(168,85,247,0.12)" : "none",
                          cursor: submitted || isExpired ? "default" : "pointer",
                        }}
                      >
                        {/* Background bar for results */}
                        {showResults && (
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-xl"
                            style={{ background: `${color}15` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: oIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          />
                        )}

                        <div className="relative flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* Custom radio */}
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
                              style={{
                                background: isSelected
                                  ? "linear-gradient(135deg, #a855f7, #6366f1)"
                                  : "rgba(255,255,255,0.06)",
                                border: `2px solid ${isSelected ? "transparent" : "rgba(255,255,255,0.15)"}`,
                                boxShadow: isSelected ? "0 0 10px rgba(168,85,247,0.4)" : "none",
                              }}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span
                              className="text-sm font-medium"
                              style={{ color: isSelected ? "#fff" : "rgba(255,255,255,0.65)" }}
                            >
                              {option.text}
                            </span>
                          </div>

                          {showResults ? (
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs font-bold tabular-nums"
                                style={{ color }}
                              >
                                {pct}%
                              </span>
                            </div>
                          ) : isSelected ? (
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: "#c084fc" }}
                            >
                              Selected
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit / Success */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl p-7 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(99,102,241,0.08))",
                border: "1px solid rgba(168,85,247,0.25)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                  boxShadow: "0 0 30px rgba(168,85,247,0.4)",
                }}
              >
                <CheckCircle2 size={26} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Thank you!</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                Your vote has been recorded. Results are live above.
              </p>
            </motion.div>
          ) : !isExpired ? (
            <motion.button
              key="submit"
              onClick={handleSubmit}
              disabled={!canSubmit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: canSubmit
                  ? "linear-gradient(135deg, #a855f7, #6366f1)"
                  : "rgba(255,255,255,0.06)",
                border: canSubmit ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: canSubmit ? "#fff" : "rgba(255,255,255,0.35)",
                boxShadow: canSubmit ? "0 0 30px rgba(168,85,247,0.35)" : "none",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transform: canSubmit ? undefined : "none",
              }}
            >
              <Send size={15} />
              {submitting
                ? "Submitting…"
                : answeredCount === totalQuestions
                ? "Submit Vote"
                : `Answer all questions (${answeredCount}/${totalQuestions})`}
            </motion.button>
          ) : null}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center text-[11px] pt-2 pb-10" style={{ color: "rgba(255,255,255,0.2)" }}>
          Powered by{" "}
          <Link to="/" className="font-semibold" style={{ color: "rgba(168,85,247,0.6)" }}>
            PulseBoard
          </Link>
          {" "} · Secure real-time polling
        </div>
      </main>
    </div>
  );
};

export default PublicPollPage;
