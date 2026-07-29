import { AnimatedBar } from "./animate-bar";

export const LivePollCard = () => (
  <div
    className="relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
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
          "radial-gradient(circle at top, rgba(139,92,246,0.12), transparent 70%)",
      }}
    />

    <div className="relative p-3 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em]"
            style={{ color: "#a855f7" }}
          >
            Live Poll
          </p>

          <h3 className="mt-1 text-sm sm:text-lg font-bold text-white leading-snug break-words">
            Should we ship the new feature?
          </h3>
        </div>

        <div
          className="flex w-fit shrink-0 items-center gap-2 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap"
          style={{
            background: "rgba(34,197,94,0.12)",
            color: "#4ade80",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-400 animate-pulse" />
          <span>247 live</span>
        </div>
      </div>

      {/* Poll Options */}
      <div className="space-y-2.5 sm:space-y-3">
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
    </div>

    {/* Footer */}
    <div className="relative flex flex-col gap-1.5 border-t border-white/5 px-3 py-2.5 text-[11px] sm:gap-2 sm:px-6 sm:py-3 sm:flex-row sm:items-center sm:justify-between sm:text-xs text-gray-400">
      <span className="shrink-0">1,284 votes</span>

      <span className="truncate text-gray-500">miraivote.app/p/ship-it</span>
    </div>
  </div>
);
