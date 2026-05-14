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
} from "lucide-react";


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
  const pollUrl =
    "https://id-preview--ad17dac4-0446-4f60-95b5-d115b244d93f.lovable.app/p/f581942f87864a...";

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="p-8 max-w-5xl w-full mx-auto space-y-8">
          {/* Back Navigation */}
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Dashboard
          </button>

          {/* Poll Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-white">fdfg</h1>
                <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Live
                </span>
                <span className="bg-slate-800 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                  Authenticated
                </span>
              </div>
              <p className="text-slate-400 text-lg">dfgdgfdg</p>
            </div>
            <button className="flex items-center gap-2 bg-[#020617] border border-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl transition-colors">
              <Power size={16} />
              <span className="font-medium">Close</span>
            </button>
          </div>

          {/* Share Link Box */}
          <div className="bg-[#0f172a]/30 border border-slate-800 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              Share Link
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 font-mono truncate">
                {pollUrl}
              </div>
              <button className="bg-slate-100 hover:bg-white text-black px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-colors">
                <Copy size={16} />
                Copy
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex gap-4">
            <MiniStat icon={BarChart2} label="Total Votes" value="0" />
            <MiniStat icon={Users} label="Participants" value="0" />
            <MiniStat icon={ListTodo} label="Questions" value="1" />
          </div>

          {/* Live Results Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Live results</h2>
              <p className="text-slate-500 text-sm">
                Updates in real time as votes arrive.
              </p>
            </div>

            <div className="bg-[#0f172a]/30 border border-slate-800 rounded-2xl p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-bold">
                  <span className="text-slate-500">Q1.</span> dfgdgfdg
                </h3>
                <span className="text-slate-500 text-sm">0 responses</span>
              </div>

              <div className="space-y-6">
                {["dfgdg", "dfgdfg", "dfgdfgdg"].map((option) => (
                  <div key={option} className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-300">
                      <span>{option}</span>
                      <span>0 • 0%</span>
                    </div>
                    <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-0 transition-all duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Participants Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Participants</h2>
              <p className="text-slate-500 text-sm">
                Everyone who joined this poll.
              </p>
            </div>
            <div className="bg-[#0f172a]/30 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-500">No participants yet.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PollDetail;
