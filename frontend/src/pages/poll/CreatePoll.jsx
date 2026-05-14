import React from "react";
import {
  ArrowLeft,
  ChevronDown,
  Plus,
  LayoutDashboard,
  BarChart3,
  LogOut,
  PanelLeftClose,
} from "lucide-react";

const InputWrapper = ({ label, children, optional = false }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-200">
      {label}{" "}
      {optional && (
        <span className="text-slate-500 font-normal">(optional)</span>
      )}
    </label>
    {children}
  </div>
);

const CreatePoll = () => {
  return (
    <div className="w-full">
      {/* Container aligned like dashboard pages */}
      <div className="max-w-5xl">
        {/* Back Button */}
        <button className="group flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />

          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Create a poll
          </h1>

          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            Add your questions, choose a voting mode, and share the link.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* General Info */}
          <section className="rounded-3xl border border-slate-800 bg-[#0B1120] p-6 sm:p-8">
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  General information
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Configure the basics of your poll.
                </p>
              </div>

              <InputWrapper label="Poll title">
                <input
                  type="text"
                  placeholder="Q4 Product priorities"
                  className="w-full h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:outline-none transition-colors"
                />
              </InputWrapper>

              <InputWrapper label="Description" optional>
                <textarea
                  rows={4}
                  placeholder="Tell participants what this poll is about..."
                  className="w-full rounded-2xl border border-slate-800 bg-[#020617] px-4 py-3 text-slate-200 placeholder:text-slate-500 resize-none focus:border-slate-600 focus:outline-none transition-colors"
                />
              </InputWrapper>

              <InputWrapper label="Voting mode">
                <div className="relative">
                  <select className="w-full h-12 appearance-none rounded-2xl border border-slate-800 bg-[#020617] px-4 text-slate-200 focus:border-slate-600 focus:outline-none transition-colors">
                    <option>Anonymous — anyone with the link can vote</option>

                    <option>Authenticated — users must sign in</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  />
                </div>
              </InputWrapper>
            </div>
          </section>

          {/* Question Card */}
          <section className="rounded-3xl border border-slate-800 bg-[#0B1120] p-6 sm:p-8">
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Question 1</h2>

                <p className="text-sm text-slate-400 mt-1">
                  Add a question and answer options.
                </p>
              </div>

              <InputWrapper label="Question">
                <input
                  type="text"
                  placeholder="What should we build next?"
                  className="w-full h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:outline-none transition-colors"
                />
              </InputWrapper>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-slate-300">
                    Options
                  </label>

                  <span className="text-xs text-slate-500">
                    Minimum 2 options
                  </span>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Option 1"
                    className="w-full h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:outline-none transition-colors"
                  />

                  <input
                    type="text"
                    placeholder="Option 2"
                    className="w-full h-12 rounded-2xl border border-slate-800 bg-[#020617] px-4 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:outline-none transition-colors"
                  />
                </div>

                <button className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-[#020617] hover:bg-slate-900 px-4 h-11 text-sm font-medium text-slate-300 transition-all">
                  <Plus size={16} />
                  Add option
                </button>
              </div>
            </div>
          </section>

          {/* Add Question */}
          <button className="w-full rounded-3xl border border-dashed border-slate-700 bg-[#0B1120]/40 hover:bg-[#0B1120] hover:border-slate-600 transition-all py-5 flex items-center justify-center gap-2 text-slate-300 font-medium">
            <Plus size={18} />
            Add another question
          </button>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button className="h-12 px-6 rounded-2xl border border-slate-800 bg-[#0B1120] hover:bg-slate-900 text-slate-300 font-medium transition-all">
              Cancel
            </button>

            <button className="h-12 px-6 rounded-2xl bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Create poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
