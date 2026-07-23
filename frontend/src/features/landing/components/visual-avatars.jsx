import React from "react";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const VisualAvatars = ({ accent }) => {
  const colors = [accent.from, accent.to, "#a855f7", "#f43f5e"];
  return (
    <div className="flex items-center">
      {colors.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{
            background: c,
            marginLeft: i === 0 ? 0 : -10,
            border: "2px solid #0e0e18",
            zIndex: colors.length - i,
          }}
        >
          {String.fromCharCode(65 + i)}
        </motion.div>
      ))}
      <span className="ml-3 text-[11px] text-gray-500 font-medium">
        +241 more
      </span>
    </div>
  );
};
