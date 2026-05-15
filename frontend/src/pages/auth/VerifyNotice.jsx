import { Mail, RefreshCcw, ArrowRight, ShieldCheck } from "lucide-react";

const VerifyNotice = () => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1120] p-10 shadow-2xl">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-violet-600/10 blur-[80px]" />

          {/* Icon Section */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              {/* Animated Pulsing Ring */}
              <div className="absolute inset-0 rounded-2xl bg-violet-500 animate-ping opacity-20" />

              <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <ShieldCheck size={36} className="text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Verify Identity
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed mx-auto max-w-[280px]">
                A secure verification link has been dispatched to your
                registered inbox.
              </p>
            </div>

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-800 bg-[#020617]/50 text-xs font-medium text-slate-400">
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              Waiting for confirmation
            </div>

            <div className="pt-4">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                Please keep this window open while you confirm via your mobile
                or desktop mail client.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyNotice;
