import React from "react";
import {
  BarChart3,
  Users,
  Vote,
  Activity,
  ChevronDown,
  LayoutDashboard,
  Plus,
  LogOut,
  PanelLeftClose,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "../../components/Sidebar.jsx";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-[#0f172a]/50 border border-slate-800 rounded-2xl p-5 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-slate-400">
      <Icon size={14} className="opacity-70" />
      <span className="text-[10px] uppercase font-bold tracking-wider">
        {label}
      </span>
    </div>
    <span className="text-3xl font-bold text-white">{value}</span>
  </div>
);

// Mock Data for Charts
const timelineData = [
  { name: "04-30", votes: 0 },
  { name: "05-01", votes: 0 },
  { name: "05-02", votes: 0 },
  { name: "05-03", votes: 0 },
  { name: "05-04", votes: 0 },
  { name: "05-05", votes: 0 },
  { name: "05-13", votes: 0 },
];

const engagementData = [
  { name: "hello", votes: 0, participants: 0 },
  { name: "fdfg", votes: 0, participants: 0 },
];

const Analytics = () => {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Analytics
          </h1>

          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Visual insights across all your polls.
          </p>
        </div>

        {/* Filter Button */}
        <button className="h-12 min-w-50 px-4 rounded-2xl border border-slate-800 bg-[#0B1120] hover:bg-slate-900/80 text-slate-300 flex items-center justify-between transition-all duration-200">
          <span className="text-sm font-medium">All polls</span>

          <ChevronDown size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={BarChart3} label="Total Polls" value="2" />
        <StatCard icon={Vote} label="Total Votes" value="0" />
        <StatCard icon={Users} label="Participants" value="0" />
        <StatCard icon={Activity} label="Active Polls" value="2" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Line Chart */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white">
              Votes over the last 14 days
            </h2>

            <p className="text-sm text-slate-400 mt-1">Daily vote activity</p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid
                  strokeDa  sharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="votes"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white">
              Engagement by poll
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Votes vs participants per poll
            </p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Legend />

                <Bar
                  dataKey="votes"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  barSize={38}
                />

                <Bar
                  dataKey="participants"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                  barSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
