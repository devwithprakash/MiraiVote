import { useEffect, useState } from "react";

export const AnimatedBar = ({ label, emoji, pct, color, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    // rAF ensures the browser paints the 0% state first, so the transition
    // to the target width is always smooth instead of sometimes snapping in.
    const t = setTimeout(() => {
      requestAnimationFrame(() => setWidth(pct));
    }, 500 + delay);
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
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-2 rounded-full"
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
