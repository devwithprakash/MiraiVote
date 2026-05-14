import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { authService } from "../../services/auth.service.js";
import { useAuth } from "../../context/AuthContext.jsx";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");
  const { token } = useParams();
  const { accessToken, setAccessToken } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await authService.verifyEmail(token);
        console.log("data response", res);
        if (res.success) {
          setAccessToken(res.data.accessToken);

          setStatus("success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (err) {
        console.log(err);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0B1120] p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Mail size={24} className="text-white" />
            </div>
          </div>

          {/* Loading */}
          {status === "loading" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-14 w-14 rounded-full border border-slate-700 flex items-center justify-center">
                  <Loader2 size={28} className="animate-spin text-slate-300" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white">
                Verifying your email
              </h1>

              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Please wait while we verify your account.
              </p>
            </div>
          )}

          {/* Success */}
          {status === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={30} className="text-emerald-400" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white">Email verified</h1>

              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Your account has been verified successfully. Redirecting you to
                login...
              </p>

              <button
                onClick={() => navigate("/login")}
                className="mt-8 w-full h-12 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-all"
              >
                Continue to login
              </button>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <XCircle size={30} className="text-red-400" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white">
                Verification failed
              </h1>

              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                This verification link is invalid or has expired.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={() => navigate("/register")}
                  className="flex-1 h-12 rounded-2xl border border-slate-700 bg-[#020617] hover:bg-slate-900 text-slate-200 font-medium transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 PulseBoard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
