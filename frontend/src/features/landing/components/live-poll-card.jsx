import {AnimatedBar} from  "./animate-bar"

export const LivePollCard = () => (
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
        delay={120}
      />
      <AnimatedBar
        label="Roll back"
        emoji="🔙"
        pct={11}
        color="linear-gradient(90deg,#3b82f6,#06b6d4)"
        delay={240}
      />
    </div>
    <div
      className="flex items-center justify-between px-6 py-3 mt-2"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="text-xs text-gray-500">1,284 votes</span>
      <span className="text-xs text-gray-500">miraivote.app/p/ship-it</span>
    </div>
  </div>
);