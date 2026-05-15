import React, { useEffect, useState } from "react";
import { Send, Info, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { pollService } from "../../services/poll.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const PublicPollPage = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { pollId } = useParams();
  const { accessToken } = useAuth();


  const isExpired = poll?.isExpired;

  const answeredCount = Object.keys(selectedOptions).length;
  const totalQuestions = poll?.questions?.length || 0;

  const progressPercentage =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;


  const handleVote = (questionId, optionId) => {
    if (submitted || isExpired) return;

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  useEffect(() => {
    const fetchPublicPoll = async () => {
      try {
        setLoading(true);

        const response = await pollService.fetchPublicPoll(pollId);
        setPoll(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPoll();
  }, [pollId]);


  const handleSubmit = async () => {
    if (submitting || isExpired) return;

    try {
      setSubmitting(true);

      const pollInfo = Object.entries(selectedOptions).map(
        ([questionId, optionId]) => ({
          questionId,
          optionId,
        }),
      );

      const response = await pollService.submitPoll(
        pollId,
        pollInfo,
        accessToken,
      );

      setSubmitted(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading poll...
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Poll not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 pb-20">
      {/* PROGRESS BAR */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-900 z-50">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <main className="flex-1 pt-8">
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          {/* HEADER */}
          <header className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="bg-slate-800 text-[10px] px-2 py-1 rounded">
                  {answeredCount}/{totalQuestions} Answered
                </span>

                <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-1 rounded flex items-center gap-1">
                  <Users size={10} />
                  {poll.people || 0} Joined
                </span>
              </div>

              <div className="text-emerald-400 text-[10px] flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white">{poll.title}</h1>

            {poll.description && (
              <p className="text-sm text-slate-400">{poll.description}</p>
            )}

            {/* EXPIRY NOTICE */}
            {isExpired && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2 rounded text-xs">
                This poll has ended. Results are now visible.
              </div>
            )}
          </header>

          {/* QUESTIONS */}
          <div className="space-y-4">
            {poll.questions?.map((question, qIdx) => (
              <div
                key={question._id}
                className="bg-[#0f172a]/40 border border-slate-800 rounded-xl p-5 space-y-4 transition-all"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-semibold text-base leading-tight max-w-[80%]">
                    <span className="text-slate-500 font-mono text-sm mr-2">
                      Q{qIdx + 1}.
                    </span>
                    {question.text}
                  </h3>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isExpired ? "bg-slate-800 text-slate-400" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}
                    >
                      {isExpired ? "Closed" : "Live"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isExpired || poll.showLiveResults
                        ? `${question.totalVotes || 0} votes`
                        : "Votes hidden"}
                    </span>
                  </div>
                </div>

                {/* OPTIONS */}
                <div className="grid gap-2">
                  {question.options?.map((option) => {
                    const isSelected =
                      selectedOptions[question._id] === option._id;
                    const percentage = isExpired ? option.percentage || 0 : 0;

                    return (
                      <button
                        key={option._id}
                        onClick={() => handleVote(question._id, option._id)}
                        disabled={submitted || isExpired}
                        className={`group relative w-full overflow-hidden rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                            : "border-slate-800 bg-[#020617]/40 hover:border-slate-700"
                        } ${(submitted || isExpired) && "cursor-default"}`}
                      >
                        {/* RESULT BAR ONLY AFTER EXPIRY */}
                        {isExpired && (
                          <div
                            className="absolute left-0 top-0 h-full bg-blue-500/10 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        )}

                        <div className="relative p-3 flex items-center justify-between z-10">
                          <div className="flex items-center gap-3">
                            {/* CUSTOM CHECKBOX / RADIO UI */}
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                isSelected
                                  ? "bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                  : "border-slate-700 bg-slate-900 group-hover:border-slate-500"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-white"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>

                            <span
                              className={`text-sm font-medium transition-colors ${isSelected ? "text-white" : "text-slate-300"}`}
                            >
                              {option.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isExpired ? (
                              <span className="text-xs font-mono font-bold text-blue-400">
                                {percentage}%
                              </span>
                            ) : (
                              isSelected && (
                                <span className="text-[9px] uppercase font-bold text-blue-400 tracking-tighter">
                                  Selected
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={
              submitted ||
              submitting ||
              isExpired ||
              answeredCount < totalQuestions
            }
            className="w-full mt-6 bg-white text-black py-3 rounded-lg font-bold disabled:opacity-50"
          >
            <Send size={16} className="inline mr-2" />

            {isExpired
              ? "Poll Ended"
              : submitted
                ? "Submitted"
                : answeredCount === totalQuestions
                  ? "Submit Vote"
                  : `Answer all questions (${answeredCount}/${totalQuestions})`}
          </button>

          {/* FOOTER */}
          <div className="text-center text-[10px] text-slate-600 mt-4 flex justify-center items-center gap-2">
            <Info size={12} />
            Secure blind voting system
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicPollPage;
