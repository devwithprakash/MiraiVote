import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const NAV = () => (
  <nav
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
    style={{
      background: "rgba(10,10,20,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z"
            stroke="white"
            strokeWidth="1.5"
          />
          <path
            d="M8 5v3l2 2"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="font-bold text-white text-lg tracking-tight">
        MiraiVote
      </span>
    </div>
    <div className="flex items-center gap-4">
      <Link
        to="/login"
        className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5"
      >
        Sign in
      </Link>
      <Link
        to="/register"
        className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all hover:opacity-90 hover:scale-105"
        style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
      >
        Get started
      </Link>
    </div>
  </nav>
);

const AnimatedBar = ({ label, emoji, pct, color, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 600 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-200">
          {label} {emoji}
        </span>
        <span className="text-gray-300 font-medium">{pct}%</span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
};

const LivePollCard = () => (
  <div
    className="relative mx-auto max-w-lg rounded-2xl overflow-hidden shadow-2xl"
    style={{
      background: "rgba(18,18,35,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      backdropFilter: "blur(20px)",
    }}
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)",
      }}
    />
    <div className="px-6 pt-5 pb-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#a855f7" }}
          >
            Live Poll
          </p>
          <h3 className="text-white font-bold text-lg mt-0.5">
            Should we ship the new feature?
          </h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: "rgba(34,197,94,0.12)",
            color: "#4ade80",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          247 live
        </div>
      </div>
      <AnimatedBar
        label="Ship it today"
        emoji="🚀"
        pct={62}
        color="linear-gradient(90deg,#a855f7,#6366f1)"
        delay={0}
      />
      <AnimatedBar
        label="One more review"
        emoji="🔍"
        pct={27}
        color="linear-gradient(90deg,#ec4899,#f43f5e)"
        delay={150}
      />
      <AnimatedBar
        label="Roll back"
        emoji="🔙"
        pct={11}
        color="linear-gradient(90deg,#3b82f6,#06b6d4)"
        delay={300}
      />
    </div>
    <div
      className="flex items-center justify-between px-6 py-3 mt-2"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="text-xs text-gray-500">1,284 votes</span>
      <span className="text-xs text-gray-500">pulseboard.app/p/ship-it</span>
    </div>
  </div>
);

const Stat = ({ value, label }) => (
  <div className="text-center px-6">
    <div
      className="text-3xl font-bold text-white mb-1"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {value}
    </div>
    <div className="text-xs text-gray-500 tracking-wide">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div
    className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110"
      style={{
        background: "rgba(139,92,246,0.15)",
        border: "1px solid rgba(139,92,246,0.25)",
      }}
    >
      <span className="text-lg">{icon}</span>
    </div>
    <h4 className="text-white font-semibold text-sm mb-1">{title}</h4>
    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ num, title, desc }) => (
  <div
    className="rounded-2xl p-6 relative overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
    }}
  >
    <div className="text-xs font-bold mb-3" style={{ color: "#a855f7" }}>
      0{num}
    </div>
    <h4 className="text-white font-bold text-base mb-2">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    <div
      className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10"
      style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
    />
  </div>
);

export default function PulseBoard() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "#09090f", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .hero-glow { background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.25) 0%, transparent 70%); }
        .gradient-text { background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .float { animation: float 4s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.25s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.45s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.6s ease both; }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); }
      `}</style>

      <NAV />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 text-center overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        {/* Floating orbs */}
        <div
          className="absolute top-24 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-32 right-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        <div className="fade-up-1">
          <span
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#c084fc",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Live polling, simplified
          </span>
        </div>

        <h1 className="fade-up-2 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-4 max-w-3xl mx-auto">
          Real-time polls that
          <br />
          <span className="gradient-text">feel like the room</span>
        </h1>

        <p className="fade-up-3 text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          PulseBoard lets you create a poll, share a link, and watch your
          audience respond live — with clean analytics for every question.
        </p>

        <div className="fade-up-4 flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-105 shadow-lg"
            style={{
              background: "linear-gradient(135deg,#a855f7,#6366f1)",
              boxShadow: "0 0 30px rgba(139,92,246,0.35)",
            }}
          >
            Create your first poll →
          </button>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-gray-300 transition-all hover:text-white hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            I already have an account
          </button>
        </div>

        <div className="fade-up-4 flex items-center justify-center gap-5 text-xs text-gray-500 mb-14">
          <span className="flex items-center gap-1">
            <span className="text-purple-400">✓</span> Free to start
          </span>
          <span className="flex items-center gap-1">
            <span className="text-purple-400">✓</span> No credit card
          </span>
          <span className="flex items-center gap-1">
            <span className="text-purple-400">✓</span> Anonymous voting
          </span>
        </div>

        <div className="float max-w-lg mx-auto">
          <LivePollCard />
        </div>
      </section>

      <div className="divider mx-8" />

      {/* Stats */}
      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat value="<60s" label="From idea to live poll" />
          <Stat value="Realtime" label="Sub-second updates" />
          <Stat value="0" label="Setup or installs" />
          <Stat value="∞" label="Participants per poll" />
        </div>
      </section>

      <div className="divider mx-8" />

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">
            Everything you need to read the room
          </h2>
          <p className="text-gray-500 text-base">
            Crafted for live audiences, classrooms, standups, and product teams.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FeatureCard
            icon="⚡"
            title="Real-time results"
            desc="Votes stream in instantly. Watch the bars move as your audience responds."
          />
          <FeatureCard
            icon="🔗"
            title="Share with one link"
            desc="Every poll gets a clean shareable URL. No installs, no friction."
          />
          <FeatureCard
            icon="🔒"
            title="Anonymous or authenticated"
            desc="Pick the trust model per poll — open responses or signed-in only."
          />
          <FeatureCard
            icon="👥"
            title="Live participants"
            desc="See who's in the room and how engagement evolves over time."
          />
          <FeatureCard
            icon="📊"
            title="Beautiful analytics"
            desc="Per-question breakdowns, totals, and response distribution at a glance."
          />
          <FeatureCard
            icon="📋"
            title="Multi-question polls"
            desc="Group several questions into one session and review them together."
          />
        </div>
      </section>

      <div className="divider mx-8" />

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">
            From zero to live in 3 steps
          </h2>
          <p className="text-gray-500 text-base">
            No setup. No installs. Just real conversations.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <StepCard
            num={1}
            title="Create a poll"
            desc="Add questions and options. Pick anonymous or authenticated mode."
          />
          <StepCard
            num={2}
            title="Share the link"
            desc="Drop the URL in chat, slides, or email. Anyone can join instantly."
          />
          <StepCard
            num={3}
            title="Watch it live"
            desc="Results stream in real time with rich analytics for every question."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)",
          }}
        />
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Ready to hear from your audience?
        </h2>
        <p className="text-gray-400 text-base mb-8">
          Spin up a poll in under a minute. Share the link. Watch results stream
          in.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base text-white transition-all hover:opacity-90 hover:scale-105"
          style={{
            background: "linear-gradient(135deg,#a855f7,#6366f1)",
            boxShadow: "0 0 40px rgba(139,92,246,0.4)",
          }}
        >
          Get started — it's free →
        </Link>
      </section>

      <div className="divider mx-8" />

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-600">
        © 2026 PulseBoard — Real-time polling for everyone
      </footer>
    </div>
  );
}
