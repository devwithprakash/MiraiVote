import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { authService } from "../../services/auth.service";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const NewPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await authService.resetPassword(token, password);

      console.log(data);
      toast.success("Password changed successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Must be at least 8 characters long with a mix of letters and numbers."
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
        {/* New Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 ml-1">
            New Password
          </label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full focus:ring-violet-500/40 focus:border-violet-500 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-all placeholder:text-slate-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-100 hover:bg-white text-black py-3 rounded-xl font-bold mt-4 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Updating password..." : "Reset password"}
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            className="text-sm text-slate-500 hover:text-slate-200 transition-colors font-medium"
          >
            Return to login
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default NewPasswordPage;
