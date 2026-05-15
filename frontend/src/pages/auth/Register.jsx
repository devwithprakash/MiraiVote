import React, { useState } from "react";
import { BarChart3, ArrowLeft } from "lucide-react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service.js";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registerDetails = {
    name,
    email,
    password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await authService.register(registerDetails);
      toast.success("User logged in successfully");
      navigate("/verify-notice");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start building live polls for your audience"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 ml-1">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="John Doe"
            className="w-full focus:ring-violet-500/40focus:border-violet-500 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-all placeholder:text-slate-500"
          />
        </div>
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

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 ml-1">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full focus:ring-violet-500/40focus:border-violet-500 bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-600 transition-all placeholder:text-slate-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-100 hover:bg-white text-black py-3 rounded-xl font-bold mt-4 transition-all active:scale-[0.98]"
        >
          Create account
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-200 font-bold cursor-pointer hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
