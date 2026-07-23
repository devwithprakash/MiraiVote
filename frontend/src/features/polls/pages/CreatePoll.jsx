import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Plus, Trash2 } from "lucide-react";
import { pollService } from "../services/poll.service";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const InputWrapper = ({ label, children, optional = false }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-200">
      {label}{" "}
      {optional && (
        <span className="text-slate-500 font-normal">(optional)</span>
      )}
    </label>
    {children}
  </div>
);

const CreatePoll = () => {
  const navigate = useNavigate();

  const [generalInfo, setGeneralInfo] = useState({
    title: "",
    mode: "anonymous",
    expireAt: "",
  });

  const [questions, setQuestions] = useState(() => [
    { id: Date.now(), text: "", options: [{ text: "" }, { text: "" }] },
  ]);

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

  const updateQuestionText = (qId, text) => {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, text } : q)));
  };

  const addOption = (qId) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, { text: "" }] } : q,
      ),
    );
  };

  const removeOption = (qId, optIdx) => {
    setQuestions(
      questions.map((q) =>
        q.id === qId && q.options.length > 2
          ? { ...q, options: q.options.filter((_, i) => i !== optIdx) }
          : q,
      ),
    );
  };

  const updateOptionText = (qId, optIdx, text) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const newOpts = [...q.options];
          newOpts[optIdx] = { text };
          return { ...q, options: newOpts };
        }
        return q;
      }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      if (payload.title.length < 2)
        toast.error("Title must be at least 2 characters");
      if (!payload.expireAt) throw new Error("Expiry date is required");
      if (new Date(payload.expireAt) <= new Date())
        throw new Error("Expiry must be in the future");

      const data = await pollService.createPoll(payload);

      toast.success("Poll created successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-200 pb-20">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 pt-8">
        <div className="mb-10">
          <Link
            to="/dashboard"
            type="button"
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </Link>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Create a poll
          </h1>
        </div>

        <div className="space-y-8">
          {/* General Info */}
          <section className="rounded-3xl border border-slate-800 bg-[#0B1120] p-6 sm:p-8 shadow-xl">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-xl font-semibold text-white">
                General Information
              </h2>

              <InputWrapper label="Poll title">
                <input
                  required
                  type="text"
                  name="title"
                  value={generalInfo.title}
                  onChange={handleGeneralChange}
                  className="w-full h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 focus:border-blue-500 outline-none transition-all"
                />
              </InputWrapper>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Voting mode">
                  <div className="relative">
                    <select
                      name="mode"
                      value={generalInfo.mode}
                      onChange={handleGeneralChange}
                      className="w-full h-12 appearance-none rounded-2xl border border-slate-800 bg-[#020617] px-4 outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="anonymous">Anonymous — Link only</option>
                      <option value="auth">
                        Authenticated — Login required
                      </option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                </InputWrapper>

                <InputWrapper label="Expire At">
                  <input
                    required
                    type="datetime-local"
                    name="expireAt"
                    value={generalInfo.expireAt}
                    onChange={handleGeneralChange}
                    className="w-full h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                  />
                </InputWrapper>
              </div>
            </div>
          </section>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, qIdx) => (
              <section
                key={question.id}
                className="relative rounded-3xl border border-slate-800 bg-[#0B1120] p-6 sm:p-8"
              >
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="absolute top-8 right-8 p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="max-w-3xl space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center text-sm">
                      {qIdx + 1}
                    </span>
                    Question
                  </h2>

                  <input
                    required
                    type="text"
                    value={question.text}
                    onChange={(e) =>
                      updateQuestionText(question.id, e.target.value)
                    }
                    placeholder="Enter question"
                    className="w-full h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 focus:border-blue-500 outline-none transition-all"
                  />

                  <div className="space-y-4">
                    <label className="text-sm font-bold">Options</label>
                    <div className="space-y-3">
                      {question.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-3">
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
                            className="flex-1 h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 focus:border-blue-500 outline-none transition-all"
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(question.id, oIdx)}
                              className="p-3 text-slate-500 hover:text-red-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addOption(question.id)}
                      className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                    >
                      <Plus size={16} /> Add option
                    </button>
                  </div>
                </div>
              </section>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-6 border-2 border-dashed border-slate-800 rounded-3xl text-slate-400 hover:bg-[#0B1120] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Another Question
            </button>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-800">
            <button
              type="button"
              className="px-8 h-12 rounded-2xl text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              Publish Poll
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
