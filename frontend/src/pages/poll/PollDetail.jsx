import React from "react";
import {
  ArrowLeft,
  Power,
  Copy,
  BarChart2,
  Users,
  ListTodo,
  LayoutDashboard,
  BarChart3,
  Plus,
  LogOut,
  PanelLeftClose,
  Check,
} from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { pollService } from "../../services/poll.service.js";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { socket } from "../../socket/socket.js";

const MiniStat = ({ icon: Icon, label, value }) => (
  <div className="bg-[#0f172a]/40 border border-slate-800 rounded-2xl p-5 flex-1">
    <div className="flex items-center gap-2 text-slate-500 mb-2">
      <Icon size={14} />
      <span className="text-[10px] uppercase font-bold tracking-widest">
        {label}
      </span>
    </div>
    <span className="text-3xl font-bold text-white">{value}</span>
  </div>
);

const PollDetail = () => {
  const [poll, setPOll] = useState(null);
  const { id } = useParams();
  const { accessToken } = useAuth();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log("Copy failed", error);
    }
  };

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await pollService.fetchPoll(id, accessToken);

        console.log(response);
        setPOll(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPoll();
  }, []);

  useEffect(() => {
    if (!id) return;

    socket.emit("join_poll", id);

    console.log("Creator joined poll room:", id);
  }, [id]);

  useEffect(() => {
    const handlePollUpdate = (data) => {
      console.log("Creator live update:", data);

      setPOll((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          // total poll votes
          votes: data.votes,

          // total participants
          people: data.people,

          // update questions
          questions: prev.questions.map((question) => {
            const updatedQuestion = data.questionVotes.find(
              (q) => q.questionId === question._id,
            );

            if (!updatedQuestion) return question;

            return {
              ...question,

              totalVotes: updatedQuestion.totalVotes,

              // update option votes
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

    return () => {
      socket.off("poll_updated", handlePollUpdate);
    };
  }, []);

  const pollUrl = `${import.meta.env.VITE_API_URL}/public/${poll?._id}`;

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* Back Navigation */}
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Dashboard
          </button>

          {/* Poll Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  {poll?.title}
                </h1>

                <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Live
                </span>

                <span className="bg-slate-800 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                  {poll?.mode}
                </span>
              </div>

              <p className="text-slate-400 text-base sm:text-lg">Description</p>
            </div>

            <button className="flex items-center gap-2 bg-[#020617] border border-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl transition-colors w-fit sm:w-auto">
              <Power size={16} />
              <span className="font-medium">Close</span>
            </button>
          </div>

          {/* Share Link Box */}
          <div className="bg-[#0f172a]/30 border border-slate-800 rounded-2xl p-4 sm:p-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Share Link
            </p>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {/* URL BOX */}
              <div className="w-full sm:flex-1 min-w-0 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 font-mono overflow-hidden">
                <p className="break-all sm:truncate">{pollUrl}</p>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto flex-shrink-0 bg-slate-100 cursor-pointer hover:bg-white text-black px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <MiniStat
              icon={BarChart2}
              label="Total Votes"
              value={poll?.votes}
            />
            <MiniStat icon={Users} label="Participants" value={poll?.people} />
            <MiniStat
              icon={ListTodo}
              label="Questions"
              value={poll?.questions?.length}
            />
          </div>

          {/* Live Results Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Live results
              </h2>
              <p className="text-slate-500 text-sm">
                Updates in real time as votes arrive.
              </p>
            </div>

            {poll &&
              poll.questions.map((p) => (
                <div
                  key={p._id}
                  className="bg-[#0f172a]/30 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h3 className="text-white font-bold">
                      <span className="text-slate-500">Q1.</span> {p.text}
                    </h3>
                    <span className="text-slate-500 text-sm">
                      {p.totalVotes} responses
                    </span>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    {p.options.map((option) => (
                      <div key={option._id} className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-300 gap-2">
                          <span className="truncate">{option.text}</span>
                          <span className="whitespace-nowrap">
                            {option.votes || 0} • {option.percentage || 0}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all duration-500"
                            style={{
                              width: `${option.percentage || 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </section>

          {/* Participants Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Participants
              </h2>
              <p className="text-slate-500 text-sm">
                Everyone who joined this poll.
              </p>
            </div>

            <div className="bg-[#0f172a]/30 border border-slate-800 rounded-2xl p-6 sm:p-10 lg:p-12 text-center">
              <p className="text-slate-500">No participants yet.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PollDetail;
