import React from "react";
import { KeyRound, RefreshCcw, ArrowRight, ExternalLink } from "lucide-react";

const ForgotPasswordNotice = ({ email = "prakash@gmail.com" }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-8 sm:p-10 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <KeyRound size={28} className="text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Check your email</h1>

            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              If an account exists for that address, we’ve sent a password reset
              link.
            </p>

            {/* Email Display */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#020617] px-4 py-3">
              <p className="text-sm font-medium text-slate-200 break-all">
                {email}
              </p>
            </div>

            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              The link will expire in 60 minutes for security reasons. Click the
              link in the email to reset your password.
            </p>

            {/* Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => window.open("https://mail.google.com", "_blank")}
                className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Open Gmail
                <ExternalLink size={18} />
              </button>

              <button className="w-full h-12 rounded-2xl border border-slate-700 bg-[#020617] hover:bg-slate-900 text-slate-200 font-medium transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                <RefreshCcw size={16} />
                Resend reset link
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-slate-500">
            Didn’t receive the email? Check your spam folder.
          </p>
          <button className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
            Try a different email address
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordNotice;
