import { useState } from "react";
import { BarChart3, ArrowLeft } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { accessToken, setAccessToken } = useAuth();

  const navigate = useNavigate();

  const loginDetails = {
    email,
    password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authService.login(loginDetails);

      setAccessToken(res.data.accessToken);

      toast.success("User logged in successfully")
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your PulseBoard account"
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
        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-all placeholder:text-slate-600"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-100 hover:bg-white text-black py-3 rounded-xl font-bold mt-4 transition-all active:scale-[0.98]"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-slate-200 font-bold cursor-pointer hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
