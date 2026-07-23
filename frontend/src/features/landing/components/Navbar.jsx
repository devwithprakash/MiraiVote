import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


export const Nav = () => {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  
  const EASE = [0.16, 1, 0.3, 1];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl"
    >
      <nav
        className="relative flex items-center justify-between pl-4 pr-2 py-2 rounded-full transition-shadow duration-300"
        style={{
          background: "rgba(16,16,28,0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: scrolled
            ? "0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(168,85,247,0.08)"
            : "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30"
            style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Z"
                stroke="white"
                strokeWidth="1.5"
              />
              <path
                d="M8 5v3l2 2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-bold text-white text-sm tracking-tight hidden sm:inline">
            MiraiVote
          </span>
        </div>

        {/* Navigation Links — centered in the capsule regardless of side content width */}
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-400 font-medium absolute left-1/2 -translate-x-1/2">
          <a
            href="#features"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#steps"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            How It Works
          </a>
          <a
            href="#stats"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            Stats
          </a>
        </div>

        {/* Auth actions */}
        {isSignedIn ? (
          <div className="shrink-0">
            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-1 shrink-0">
            <SignInButton>
              <button className="text-sm text-gray-300 hover:text-white transition-colors duration-200 px-3.5 py-1.5 rounded-full hover:bg-white/5 cursor-pointer">
                Login
              </button>
            </SignInButton>

            <SignUpButton>
              <button
                className="text-sm font-semibold text-white pl-4 pr-4 py-1.5 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105 cursor-pointer shadow-lg shadow-purple-500/20"
                style={{
                  background: "linear-gradient(135deg,#a855f7,#6366f1)",
                }}
              >
                Get Started
              </button>
            </SignUpButton>
          </div>
        )}
      </nav>
    </motion.div>
  );
};
