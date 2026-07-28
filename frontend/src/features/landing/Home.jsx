import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Link2,
  Lock,
  Users,
  BarChart3,
  ListChecks,
} from "lucide-react";
import { Nav } from "./components/Navbar";
import { LivePollCard } from "./components/live-poll-card";
import { FeatureCard } from "./components/features";
import { VisualQuestionChips } from "./components/questions-chip";
import { StepperSection } from "./components/stepper";
import { VisualAuthToggle } from "./components/visual-auth-toggle";
import { VisualAvatars } from "./components/visual-avatars";
import { VisualDonut } from "./components/visual-donut";
import { VisualLiveBars } from "./components/visual-live-bar";
import { VisualShareLink } from "./components/visual-share-link";
import "./landing.css";

const EASE = [0.16, 1, 0.3, 1];

export default function MiraiVote() {
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#09090f", fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .hero-glow { background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,92,246,0.18) 0%, transparent 70%); }
        .gradient-text { background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #6366f1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .float { animation: float 5s cubic-bezier(0.45,0,0.55,1) infinite; }
        .fade-up-1 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-2 { animation: fadeUp 0.8s 0.12s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.28s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-4 { animation: fadeUp 0.8s 0.42s cubic-bezier(0.16,1,0.3,1) both; }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); }
        .feature-card { position: relative; isolation: isolate; }
        .feature-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(135deg, var(--accent-from), var(--accent-to));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
          z-index: 1;
        }
        .feature-card:hover::before { opacity: 0.9; }
        @media (prefers-reduced-motion: reduce) {
          .float, .fade-up-1, .fade-up-2, .fade-up-3, .fade-up-4 { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <Nav />

      <section className="relative pt-28 pb-20 px-6 text-center overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
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
          MiraiVote lets you create a poll, share a link, and watch your
          audience respond live — with clean analytics for every question.
        </p>

        <div className="fade-up-4 flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg"
            style={{
              background: "linear-gradient(135deg,#a855f7,#6366f1)",
              boxShadow: "0 0 30px rgba(139,92,246,0.35)",
            }}
          >
            Create your first poll →
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-gray-300 transition-all duration-300 hover:text-white hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}
          >
            I already have an account
          </Link>
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

      {/* Features */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-16 relative">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#c084fc",
            }}
          >
            Why teams choose MiraiVote
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
            className="text-4xl font-bold text-white mb-3"
          >
            Everything you need to read the room
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="text-gray-400 text-base"
          >
            Crafted for live audiences, classrooms, standups, and product teams.
          </motion.p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 relative">
          <FeatureCard
            index={0}
            span="2"
            eyebrow="Most loved"
            Icon={Zap}
            title="Real-time results"
            desc="Votes stream in instantly. Watch the bars move as your audience responds — no refresh, no lag."
            accent={{ from: "#a855f7", to: "#6366f1" }}
            visual={VisualLiveBars}
          />
          <FeatureCard
            index={1}
            Icon={Link2}
            title="Share with one link"
            desc="Every poll gets a clean shareable URL. No installs, no friction."
            accent={{ from: "#ec4899", to: "#f43f5e" }}
            visual={VisualShareLink}
          />
          <FeatureCard
            index={2}
            Icon={Lock}
            title="Anonymous or authenticated"
            desc="Pick the trust model per poll — open responses or signed-in only."
            accent={{ from: "#6366f1", to: "#8b5cf6" }}
            visual={VisualAuthToggle}
          />
          <FeatureCard
            index={3}
            Icon={Users}
            title="Live participants"
            desc="See who's in the room and how engagement evolves over time."
            accent={{ from: "#d946ef", to: "#ec4899" }}
            visual={VisualAvatars}
          />
          <FeatureCard
            index={4}
            Icon={BarChart3}
            title="Beautiful analytics"
            desc="Per-question breakdowns, totals, and response distribution at a glance."
            accent={{ from: "#8b5cf6", to: "#6366f1" }}
            visual={VisualDonut}
          />
          <FeatureCard
            index={5}
            span="3"
            Icon={ListChecks}
            title="Multi-question polls"
            desc="Group several questions into one session, present them in order, and review every response together at the end."
            accent={{ from: "#8b5cf6", to: "#d946ef" }}
            visual={VisualQuestionChips}
          />
        </div>
      </section>

      <div className="divider mx-8" />

      {/* Steps */}
      <section id="steps" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#c084fc",
            }}
          >
            Simple by design
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
            className="text-4xl font-bold text-white mb-3"
          >
            From zero to live in 3 steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="text-gray-400 text-base"
          >
            No setup. No installs. Just real conversations.
          </motion.p>
        </div>
        <StepperSection />
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
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
          style={{
            background: "linear-gradient(135deg,#a855f7,#6366f1)",
            boxShadow: "0 0 40px rgba(139,92,246,0.4)",
          }}
        >
          Get started — it's free →
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
                >
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-semibold text-white text-sm tracking-tight">MiraiVote</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                Real-time polling for teams, classrooms, and live audiences.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Product</p>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>Features</a></li>
                  <li><a href="#steps" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>How it works</a></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Account</p>
                <ul className="space-y-2">
                  <li><a href="/login" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>Sign in</a></li>
                  <li><a href="/register" className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>Get started</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              © {new Date().getFullYear()} MiraiVote. All rights reserved.
            </p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              Built for real conversations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
