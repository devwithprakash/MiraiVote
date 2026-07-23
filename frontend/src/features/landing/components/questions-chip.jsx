export const VisualQuestionChips = ({ accent }) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4].map((n, i) => (
      <div key={n} className="flex items-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
          style={{
            background:
              i === 0
                ? `linear-gradient(135deg, ${accent.from}, ${accent.to})`
                : "rgba(255,255,255,0.06)",
            border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)",
            color: i === 0 ? "white" : "#8b8b9a",
          }}
        >
          {n}
        </div>
        {n !== 4 && (
          <div
            className="w-4 h-px"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
        )}
      </div>
    ))}
  </div>
);