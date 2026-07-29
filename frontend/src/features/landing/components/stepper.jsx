import React, { useRef } from "react";
import { motion } from "framer-motion";
import { PenSquare, Share2, Radio } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export const StepperSection = () => {
  const steps = [
    {
      Icon: PenSquare,
      title: "Create a poll",
      desc: "Add questions and options. Pick anonymous or authenticated mode.",
    },
    {
      Icon: Share2,
      title: "Share the link",
      desc: "Drop the URL in chat, slides, or email. Anyone can join instantly.",
    },
    {
      Icon: Radio,
      title: "Watch it live",
      desc: "Results stream in real time with rich analytics for every question.",
    },
  ];

  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto">
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
        {/* Connecting rail — desktop: horizontal through the node centers */}
        <div
          className="hidden md:block absolute left-0 right-0 pointer-events-none"
          style={{ top: "28px" }}
        >
          <div
            className="mx-[16.6%] h-px"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <motion.div
            className="mx-[16.6%] h-px -mt-px"
            style={{
              background: "linear-gradient(90deg,#a855f7,#6366f1)",
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
          />
        </div>

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.18, ease: EASE }}
            className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center"
          >
            {/* Vertical rail segment for mobile, sits behind the node */}
            {i !== steps.length - 1 && (
              <div
                className="md:hidden absolute left-[27px] top-[56px] bottom-[-40px] w-px"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
            )}

            {/* Node */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.18 + 0.15, ease: EASE }}
              className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg,#a855f7,#6366f1)",
                boxShadow:
                  "0 0 0 6px #09090f, 0 8px 20px rgba(139,92,246,0.35)",
              }}
            >
              <step.Icon size={22} color="white" strokeWidth={1.75} />
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                style={{
                  background: "#09090f",
                  border: "1px solid rgba(168,85,247,0.5)",
                }}
              >
                {i + 1}
              </span>
            </motion.div>

            <div className="md:mt-5 md:px-2">
              <h4 className="text-white font-bold text-lg mb-1.5">
                {step.title}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] md:mx-auto">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
