import React from "react";
import { KeyRound } from "lucide-react";

const ForgotPasswordNotice = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 font-sans text-slate-200">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-8 text-center space-y-6 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <KeyRound size={24} className="text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Reset Link Sent</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              If an account exists, a secure recovery link is in your inbox. The
              link expires in 60 minutes.
            </p>
          </div>

          {/* Simple Status */}
          <div className="pt-2 border-t border-slate-800/50 flex justify-center">
            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Check your email
            </span>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="mt-6 text-center">
          <button className="text-xs font-semibold text-slate-500 hover:text-indigo-400 transition-colors">
            Try a different email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordNotice;
