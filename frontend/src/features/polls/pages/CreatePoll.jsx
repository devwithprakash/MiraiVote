import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Plus, Trash2, Zap } from "lucide-react";
import { pollService } from "../services/poll.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";

const FIELD_STYLE = {
  width: "100%",
  height: "48px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  padding: "0 16px",
  color: "#fff",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "14px",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const InputWrapper = ({ label, children, optional = false }) => (
  <div className="space-y-2">
    <label
      className="text-sm font-semibold"
      style={{ color: "rgba(255,255,255,0.7)" }}
    >
      {label}{" "}
      {optional && (
        <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
          (optional)
        </span>
      )}
    </label>
    {children}
  </div>
);

const CreatePoll = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
    const { getToken } = useAuth();


  const [generalInfo, setGeneralInfo] = useState({
    title: "",
    mode: "anonymous",
    expireAt: "",
  });

  const [questions, setQuestions] = useState([
    { id: Date.now(), text: "", options: [{ text: "" }, { text: "" }] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Load existing poll data in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const load = async () => {
      try {
        const res = await pollService.fetchPoll(id);
        const p = res.data;
        setGeneralInfo({
          title: p.title || "",
          mode: p.mode || "anonymous",
          expireAt: p.expireAt
            ? new Date(p.expireAt).toISOString().slice(0, 16)
            : "",
        });
        if (p.questions?.length) {
          setQuestions(
            p.questions.map((q) => ({
              id: q._id || Date.now(),
              text: q.text || "",
              options: q.options?.map((o) => ({ text: o.text || "" })) || [
                { text: "" },
                { text: "" },
              ],
            })),
          );
        }
      } catch {
        toast.error("Failed to load poll data");
      }
    };
    load();
  }, [id, isEditMode]);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", options: [{ text: "" }, { text: "" }] },
    ]);
  };

  const removeQuestion = (qId) => {
    if (questions.length > 1)
      setQuestions(questions.filter((q) => q.id !== qId));
  };

  const updateQuestionText = (qId, text) =>
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, text } : q)));

  const addOption = (qId) =>
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, { text: "" }] } : q,
      ),
    );

  const removeOption = (qId, optIdx) =>
    setQuestions(
      questions.map((q) =>
        q.id === qId && q.options.length > 2
          ? { ...q, options: q.options.filter((_, i) => i !== optIdx) }
          : q,
      ),
    );

  const updateOptionText = (qId, optIdx, text) =>
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const newOpts = [...q.options];
        newOpts[optIdx] = { text };
        return { ...q, options: newOpts };
      }),
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const token = await getToken();

    const payload = {
      title: generalInfo.title.trim(),
      mode: generalInfo.mode,
      expireAt: generalInfo.expireAt
        ? new Date(generalInfo.expireAt).toISOString()
        : null,
      questions: questions.map((q, qIdx) => ({
        text: q.text.trim(),
        order: qIdx,
        options: q.options.map((opt, oIdx) => ({
          text: opt.text.trim(),
          order: oIdx,
        })),
      })),
    };

    if (payload.title.length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!payload.expireAt) {
      toast.error("Expiry date is required");
      return;
    }
    if (new Date(payload.expireAt) <= new Date()) {
      toast.error("Expiry must be in the future");
      return;
    }

    try {
      setSubmitting(true);

      await pollService.createPoll(payload, token);
      toast.success(isEditMode ? "Poll updated!" : "Poll created!");
      navigate("/polls");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const focusStyle = {
    borderColor: "rgba(168,85,247,0.6)",
    boxShadow: "0 0 0 3px rgba(168,85,247,0.12)",
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <Link
            to="/polls"
            className="group inline-flex items-center gap-2 text-sm mb-6 transition-colors"
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
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.15))",
                  border: "1px solid rgba(168,85,247,0.3)",
                }}
              >
                <Zap size={15} style={{ color: "#c084fc" }} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {isEditMode ? "Edit Poll" : "Create a Poll"}
              </h1>
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {isEditMode
                ? "Update your poll settings and questions."
                : "Set up your poll, add questions, and share with your audience."}
            </p>
          </motion.div>
        </div>

        <div className="space-y-5 max-w-3xl">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              General
            </h2>
            <div className="space-y-5">
              <InputWrapper label="Poll title">
                <input
                  required
                  type="text"
                  name="title"
                  value={generalInfo.title}
                  onChange={handleGeneralChange}
                  placeholder="e.g. Team Standup Feedback"
                  style={FIELD_STYLE}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </InputWrapper>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputWrapper label="Voting mode">
                  <div className="relative">
                    <select
                      name="mode"
                      value={generalInfo.mode}
                      onChange={handleGeneralChange}
                      style={{
                        ...FIELD_STYLE,
                        appearance: "none",
                        paddingRight: "40px",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.08)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <option
                        value="anonymous"
                        style={{ background: "#0e0e1a" }}
                      >
                        Anonymous — Link only
                      </option>
                      <option value="auth" style={{ background: "#0e0e1a" }}>
                        Authenticated — Login required
                      </option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    />
                  </div>
                </InputWrapper>

                <InputWrapper label="Expires at">
                  <input
                    required
                    type="datetime-local"
                    name="expireAt"
                    value={generalInfo.expireAt}
                    onChange={handleGeneralChange}
                    style={{ ...FIELD_STYLE, colorScheme: "dark" }}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.08)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </InputWrapper>
              </div>
            </div>
          </motion.section>

          <div className="space-y-4">
            <AnimatePresence>
              {questions.map((question, qIdx) => (
                <motion.section
                  key={question.id}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="absolute top-5 right-5 p-2 rounded-xl transition-all"
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#f87171";
                        e.currentTarget.style.background =
                          "rgba(239,68,68,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.3)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}

                  <div className="space-y-5 pr-10">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: "rgba(168,85,247,0.15)",
                          color: "#c084fc",
                          border: "1px solid rgba(168,85,247,0.25)",
                        }}
                      >
                        {qIdx + 1}
                      </span>
                      <span
                        className="text-sm font-bold uppercase tracking-widest"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        Question
                      </span>
                    </div>

                    <input
                      required
                      type="text"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestionText(question.id, e.target.value)
                      }
                      placeholder="Enter your question"
                      style={FIELD_STYLE}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255,255,255,0.08)";
                        e.target.style.boxShadow = "none";
                      }}
                    />

                    <div className="space-y-3">
                      <label
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        Options
                      </label>
                      <AnimatePresence>
                        {question.options.map((opt, oIdx) => (
                          <motion.div
                            key={oIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-2"
                          >
                            <div
                              className="w-6 h-12 flex items-center justify-center text-xs font-bold rounded-lg shrink-0"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                color: "rgba(255,255,255,0.25)",
                                border: "1px solid rgba(255,255,255,0.06)",
                              }}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </div>
                            <input
                              required
                              type="text"
                              value={opt.text}
                              onChange={(e) =>
                                updateOptionText(
                                  question.id,
                                  oIdx,
                                  e.target.value,
                                )
                              }
                              placeholder={`Option ${oIdx + 1}`}
                              style={{ ...FIELD_STYLE, flex: 1 }}
                              onFocus={(e) =>
                                Object.assign(e.target.style, focusStyle)
                              }
                              onBlur={(e) => {
                                e.target.style.borderColor =
                                  "rgba(255,255,255,0.08)";
                                e.target.style.boxShadow = "none";
                              }}
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, oIdx)}
                                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0"
                                style={{
                                  color: "rgba(255,255,255,0.25)",
                                  background: "rgba(255,255,255,0.03)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#f87171";
                                  e.currentTarget.style.background =
                                    "rgba(239,68,68,0.08)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    "rgba(255,255,255,0.25)";
                                  e.currentTarget.style.background =
                                    "rgba(255,255,255,0.03)";
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <button
                        type="button"
                        onClick={() => addOption(question.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold mt-1 transition-colors"
                        style={{ color: "rgba(168,85,247,0.7)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#c084fc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(168,85,247,0.7)")
                        }
                      >
                        <Plus size={13} />
                        Add option
                      </button>
                    </div>
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={addQuestion}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full py-5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200"
              style={{
                border: "1px dashed rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.35)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
                e.currentTarget.style.color = "#c084fc";
                e.currentTarget.style.background = "rgba(168,85,247,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Plus size={17} />
              Add another question
            </motion.button>
          </div>

          <div
            className="flex justify-between items-center pt-5 mt-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Link
              to="/polls"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
              }
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #a855f7, #6366f1)",
                boxShadow: "0 0 24px rgba(168,85,247,0.35)",
              }}
            >
              {submitting
                ? "Publishing…"
                : isEditMode
                  ? "Update Poll"
                  : "Publish Poll"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
