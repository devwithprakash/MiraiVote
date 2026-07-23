export const VisualAuthToggle = ({ accent }) => (
  <div
    className="inline-flex p-1 rounded-lg text-[11px] font-medium"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <span
      className="px-3 py-1.5 rounded-md text-white"
      style={{
        background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
      }}
    >
      Anonymous
    </span>
    <span className="px-3 py-1.5 rounded-md text-gray-500">Signed in</span>
  </div>
);
