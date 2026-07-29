import { useEffect, useState } from "react";

export const AnimatedBar = ({ label, emoji, pct, color, delay = 0 }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      requestAnimationFrame(() => setWidth(pct));
    }, 500 + delay);

    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-base">{emoji}</span>

          <span className="truncate text-sm font-medium text-gray-200">
            {label}
          </span>
        </div>

        <span className="shrink-0 text-sm font-semibold text-gray-300">
          {pct}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: color,
            transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
};
