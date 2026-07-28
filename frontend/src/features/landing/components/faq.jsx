import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";

const faqs = [
  {
    question: "Is MiraiVote free to use?",
    answer:
      "Yes, MiraiVote is completely free to start. You can create polls and collect responses without any credit card required. Our core features are available to everyone.",
  },
  {
    question: "Do my participants need an account to vote?",
    answer:
      "No, participants don't need an account by default. You can choose to allow anonymous voting or require authentication depending on your audience and needs.",
  },
  {
    question: "Is there a limit to how many polls I can create?",
    answer:
      "There are no limits on the number of polls you can create on our free plan. Feel free to use it for as many events, meetings, or classes as you'd like.",
  },
  {
    question: "Can I view results in real-time?",
    answer:
      "Absolutely! Responses are updated in real-time as they come in. You don't even need to refresh the page—watch the bars move as your audience responds.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.15)",
              color: "#c084fc",
            }}
          >
            Got questions?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight"
          >
            Frequently asked questions
          </motion.h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className={`text-base transition-colors duration-200 ${isOpen ? "text-white font-medium" : "text-gray-300 font-normal group-hover:text-gray-100"}`}>
                    {faq.question}
                  </span>
                  <div
                    className="flex-shrink-0 ml-4 flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-200"
                    style={{ background: isOpen ? "rgba(139,92,246,0.15)" : "transparent" }}
                  >
                    <Plus
                      size={16}
                      className={`transition-all duration-300 ${isOpen ? "text-purple-400 rotate-45" : "text-gray-500 group-hover:text-gray-300"}`}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="pb-6 pr-8 text-gray-400 text-sm leading-relaxed font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
