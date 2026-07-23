import React from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const FeatureCard = ({
  Icon,
  title,
  desc,
  index,
  accent,
  span = "1",
  visual: Visual,
  eyebrow,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
    whileHover={{ y: -4 }}
    className={`feature-card rounded-2xl p-6 relative overflow-hidden group transition-shadow duration-300 ${
      span === "2"
        ? "sm:col-span-2"
        : span === "3"
          ? "sm:col-span-2 lg:col-span-3"
          : ""
    }`}
    style={{
      "--accent-from": accent.from,
      "--accent-to": accent.to,
      background:
        "linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    }}
  >
    <div
      className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
      style={{ background: accent.from }}
    />

    <div
      className={`relative z-[2] ${
        span === "3"
          ? "flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          : ""
      }`}
    >
      <div className={span === "3" ? "max-w-sm" : ""}>
        {eyebrow && (
          <span
            className="inline-block text-[10px] font-bold tracking-widest uppercase mb-3 px-2 py-0.5 rounded-full"
            style={{ color: accent.from, background: `${accent.from}1a` }}
          >
            {eyebrow}
          </span>
        )}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${accent.from}33, ${accent.to}33)`,
            border: `1px solid ${accent.from}4d`,
          }}
        >
          <Icon size={19} strokeWidth={1.75} color={accent.from} />
        </div>
        <h4 className="text-white font-bold text-base mb-2">{title}</h4>
        <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
      </div>

      {Visual && (
        <div className={span === "3" ? "shrink-0" : "mt-5"}>
          <Visual accent={accent} />
        </div>
      )}
    </div>
  </motion.div>
);