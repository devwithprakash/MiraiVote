import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Users,
  Vote,
  Activity,
  TrendingUp,
  ListChecks,
  Clock3,
  ActivityIcon,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
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
import { pollService } from "../services/poll.service.js";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const CHART_COLORS = ["#a855f7", "#6366f1", "#ec4899", "#8b5cf6", "#06b6d4"];

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#0e0e1a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
  },
  labelStyle: { color: "rgba(255,255,255,0.6)" },
};

const StatCard = ({ icon: Icon, label, value, accent, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="show"
    variants={FADE_UP}
    className="relative overflow-hidden rounded-2xl p-5"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div
      className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between">
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {label}
        </p>
        <p className="text-3xl font-bold text-white">{value ?? "—"}</p>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}22`, border: `1px solid ${accent}33` }}
      >
        <Icon size={17} style={{ color: accent }} />
      </div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, subtitle, children, span, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="show"
    variants={FADE_UP}
    className={`rounded-2xl p-6 ${span === 2 ? "xl:col-span-2" : ""}`}
    style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div className="mb-6">
      <h3 className="text-base font-bold text-white">{title}</h3>
      {subtitle && (
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </motion.div>
);

const PerQuestionBar = ({ question, index }) => {
  const maxVotes = Math.max(...question.options.map((o) => o.votes || 0), 1);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={FADE_UP}
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc" }}
          >
            {index + 1}
          </span>
          <h4 className="text-sm font-semibold text-white">{question.text}</h4>
        </div>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {question.totalVotes ?? 0} responses
        </span>
      </div>
      <div className="space-y-3">
        {question.options?.map((option, oIdx) => {
          const pct =
            question.totalVotes > 0
              ? Math.round(((option.votes || 0) / question.totalVotes) * 100)
              : 0;
          const color = CHART_COLORS[oIdx % CHART_COLORS.length];
          return (
            <div key={option._id || oIdx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "rgba(255,255,255,0.65)" }}>
                  {option.text}
                </span>
                <span className="font-semibold" style={{ color }}>
                  {option.votes ?? 0} · {pct}%
                </span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.8,
                    delay: oIdx * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${color}, ${color}99)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const PollAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(7);
  const { getToken } = useAuth();

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      try {
        setLoading(true);
        const [analyticsRes, pollRes] = await Promise.all([
          pollService.fetchAnalytics(id, selectedDays, token),
          pollService.fetchPoll(id, token),
        ]);

        console.log("Analytics Data", analyticsRes.data);
        console.log("Poll Data", pollRes.data);
        setAnalytics(analyticsRes.data);
        setPoll(pollRes.data);
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const pieData = [
    { name: "Votes", value: analytics?.stats?.totalVotes || 0 },
    { name: "Participants", value: analytics?.stats?.totalParticipants || 0 },
  ];

  const engagementData = analytics?.engagementData || [];
  const timelineData = analytics?.timelineData || [];
  const questions = poll?.questions || [];

  console.log(analytics?.stats?.totalParticipants);

  return (
    <div className="space-y-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div>
        <button
          onClick={() => navigate("/polls")}
          className="flex items-center gap-2 text-sm font-medium mb-5 transition-colors group"
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
          Back to My Polls
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.25)",
                color: "#c084fc",
              }}
            >
              Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {loading ? "Loading…" : poll?.title || "Poll Analytics"}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Detailed insights for this poll.
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              index={0}
              icon={Users}
              label="Participants"
              value={analytics?.totalParticipants ?? 0}
              accent="#a855f7"
            />
            <StatCard
              index={1}
              icon={ListChecks}
              label="Questions"
              value={analytics?.totalQuestions ?? 0}
              accent="#6366f1"
            />
            <StatCard
              index={2}
              icon={CalendarDays}
              label="Today"
              value={analytics?.responsesToday ?? 0}
              accent="#ec4899"
            />
            <StatCard
              index={3}
              icon={TrendingUp}
              label="Avg / Day"
              value={analytics?.avgPerDay ?? "-"}
              accent="#8b5cf6"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Area Chart */}
            <ChartCard
              index={4}
              title="Vote Activity"
              subtitle="Cumulative votes over time"
            >
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="voteGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#a855f7"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#a855f7"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.2)"
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "11px" }}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.2)"
                      tickLine={false}
                      axisLine={false}
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Area
                      type="monotone"
                      dataKey="votes"
                      stroke="#a855f7"
                      fill="url(#voteGrad)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Pie Chart */}
            <ChartCard
              index={5}
              title="Participation Ratio"
              subtitle="Votes vs unique participants"
            >
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={90}
                      innerRadius={48}
                      paddingAngle={3}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Bar Chart */}
            {engagementData.length > 0 && (
              <ChartCard
                index={6}
                title="Poll Engagement"
                subtitle="Votes vs participants comparison"
                span={2}
              >
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} barGap={4}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="rgba(255,255,255,0.2)"
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: "11px" }}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.2)"
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: "11px" }}
                      />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      />
                      <Bar
                        dataKey="votes"
                        fill="#a855f7"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="participants"
                        fill="#6366f1"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            )}
          </div>

          {/* Per-Question Breakdown */}
          {questions.length > 0 && (
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Question Breakdown
              </motion.p>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {questions.map((q, i) => (
                  <PerQuestionBar key={q._id} question={q} index={i} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PollAnalytics;
