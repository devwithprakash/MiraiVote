import React, { useState } from "react";
import { BarChart3, ArrowLeft } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await authService.forgotPassword(email);

      navigate("/forgot-password-notice");

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll send you a link to reset your password"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 ml-1">
            Email address
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="name@example.com"
            className="w-full focus:ring-violet-500/40focus:border-violet-500 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-all placeholder:text-slate-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-100 hover:bg-white text-black py-3 rounded-xl font-bold mt-4 transition-all active:scale-[0.98]"
        >
          Send reset link
        </button>

        <div className="text-center mt-6">
          <button className="text-sm text-slate-500 hover:text-slate-200 transition-colors font-medium">
            Return to login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
