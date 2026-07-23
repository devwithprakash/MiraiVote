export const VisualDonut = ({ accent }) => (
  <div className="flex items-center gap-3">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center"
      style={{
        background: `conic-gradient(${accent.from} 0% 62%, ${accent.to} 62% 89%, rgba(255,255,255,0.08) 89% 100%)`,
      }}
    >
      <div className="w-8 h-8 rounded-full" style={{ background: "#101018" }} />
    </div>
    <div className="flex flex-col gap-1 text-[10px] text-gray-400">
      <span className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: accent.from }}
        />
        62% Ship it
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: accent.to }}
        />
        27% Review
      </span>
    </div>
  </div>
);
