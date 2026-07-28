import React from "react";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export const VisualShareLink = ({ accent }) => (
  <div className="flex flex-col gap-2">
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-gray-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Link2 size={12} color={accent.from} />
      <span className="truncate">miraivote.app/p/ship-it</span>
    </div>
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
      className="self-start text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}
    >
      Link copied
    </motion.span>
  </div>
);