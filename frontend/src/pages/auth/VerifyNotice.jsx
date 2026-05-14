import { Mail, RefreshCcw, ArrowRight } from "lucide-react";

const VerifyNotice = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-8 sm:p-10 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Mail size={28} className="text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Verify your email</h1>

            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              We’ve sent a verification link to your email address.
            </p>

            {/* Email */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#020617] px-4 py-3">
              <p className="text-sm font-medium text-slate-200 break-all">
                prakash@gmail.com
              </p>
            </div>

            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Please check your inbox and click the verification link to
              activate your account.
            </p>

            {/* Buttons */}
            <div className="mt-8 space-y-3">
              <button className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2">
                Open Gmail
                <ArrowRight size={18} />
              </button>

              <button className="w-full h-12 rounded-2xl border border-slate-700 bg-[#020617] hover:bg-slate-900 text-slate-200 font-medium transition-all flex items-center justify-center gap-2">
                <RefreshCcw size={16} />
                Resend email
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerifyNotice;
