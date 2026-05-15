import React, { useEffect, useState } from "react";
import { BarChart3, Users, Vote, Activity } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { pollService } from "../../services/poll.service.js";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

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

const COLORS = ["#3b82f6", "#10b981"];

const Analytics = () => {
  const { accessToken } = useAuth();

  const [selectedPoll, setSelectedPoll] = useState("all");

  // dropdown polls
  const [polls, setPolls] = useState([]);

  // analytics response
  const [analytics, setAnalytics] = useState(null);



  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await pollService.fetchAllPolls(accessToken);

        setPolls(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (accessToken) {
      fetchPolls();
    }
  }, [accessToken]);


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await pollService.fetchAnalytics(
          accessToken,
          selectedPoll,
        );

        setAnalytics(response.data);
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong";

        toast.error(message);
      }
    };

    if (accessToken) {
      fetchAnalytics();
    }
  }, [selectedPoll, accessToken]);


  const pieData = [
    {
      name: "Votes",
      value: analytics?.stats?.totalVotes || 0,
    },
    {
      name: "Participants",
      value: analytics?.stats?.totalParticipants || 0,
    },
  ];

  const engagementData = analytics?.engagementData || [];

  const timelineData = analytics?.timelineData || [];

  const topPoll = analytics?.topPoll;

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

        {/* Filter */}
        <select
          value={selectedPoll}
          onChange={(e) => setSelectedPoll(e.target.value)}
          className="h-12 min-w-50 px-4 rounded-2xl border border-slate-800 bg-[#0B1120] text-slate-300 outline-none"
        >
          <option value="all">All Polls</option>

          {polls.map((poll) => (
            <option key={poll._id} value={poll._id}>
              {poll.title}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={BarChart3}
          label="Total Polls"
          value={analytics?.stats?.totalPolls || 0}
        />

        <StatCard
          icon={Vote}
          label="Total Votes"
          value={analytics?.stats?.totalVotes || 0}
        />

        <StatCard
          icon={Users}
          label="Participants"
          value={analytics?.stats?.totalParticipants || 0}
        />

        <StatCard
          icon={Activity}
          label="Questions"
          value={analytics?.stats?.totalQuestions || 0}
        />
      </div>

      {/* Top Poll */}
      {topPoll && (
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-500/10 to-slate-900 p-6">
          <p className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-3">
            Top Performing Poll
          </p>

          <h2 className="text-2xl font-bold text-white">{topPoll.title}</h2>

          <div className="flex gap-6 mt-4 text-sm text-slate-300">
            <span>{topPoll.votes || 0} votes</span>

            <span>{topPoll.participants || 0} participants</span>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white">Vote Activity</h2>

            <p className="text-sm text-slate-400 mt-1">Votes across polls</p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="votes"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white">
              Participation Ratio
            </h2>

            <p className="text-sm text-slate-400 mt-1">Votes vs participants</p>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={110} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-800 bg-[#0B1120] p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white">
              Poll Engagement
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Votes vs participants per poll
            </p>
          </div>

          <div className="h-[350px]">
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
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Legend />

                <Bar dataKey="votes" fill="#3b82f6" radius={[8, 8, 0, 0]} />

                <Bar
                  dataKey="participants"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
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
