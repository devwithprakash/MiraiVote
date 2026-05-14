import React from "react";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const AuthLayout = ({ children, title, subtitle, backLink = true }) => (
  <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col items-center justify-center p-6">
    <div className="w-full max-w-[440px] space-y-8">
      {/* Branding */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-2 rounded-xl">
          <BarChart3 className="text-black" size={28} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-slate-400 mt-2">{subtitle}</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-[#0f172a]/30 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {children}
      </div>

      <Link
        to="/"
        className="flex justify-center items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm mx-auto font-medium"
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </div>
  </div>
);
