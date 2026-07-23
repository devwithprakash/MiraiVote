import React from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const VisualLiveBars = ({ accent }) => {
  const heights = [38, 68, 30, 90, 52, 76];
  return (
    <div className="flex items-end gap-1.5 h-16">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: EASE }}
          className="flex-1 rounded-full"
          style={{
            background: `linear-gradient(180deg, ${accent.from}, ${accent.to})`,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
};