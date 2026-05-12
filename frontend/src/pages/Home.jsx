import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"
                />
              </svg>
            </div>

            <h1 className="text-lg font-semibold tracking-tight">PulseBoard</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:block">
              Sign in
            </button>

            <button className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700">
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-100 to-pink-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-32 lg:px-8">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
            Live polling, simplified
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Real-time
            <br />
            polls that feel
            <br />
            like the room
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            PulseBoard lets you create a poll, share a link, and watch your
            audience respond live — with clean analytics for every question.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
            <button className="w-full rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700 sm:w-auto">
              Create your first poll
            </button>

            <button className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-auto">
              I already have an account
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {/* Card 1 */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Real-time results
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Votes stream in instantly. Watch the bars move as your audience
              responds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m4-4l1.5-1.5a4 4 0 015.656 5.656l-3 3"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Share with one link
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Every poll gets a clean shareable URL. No installs, no friction.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V7a4.5 4.5 0 10-9 0v3.5m-1 0h11a1 1 0 011 1V19a1 1 0 01-1 1h-11a1 1 0 01-1-1v-7.5a1 1 0 011-1z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Anonymous or authenticated
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Pick the trust model per poll — open responses or signed-in only.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-8 0v2m8 0H9"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Live participants
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              See who's in the room and how engagement evolves over time.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3v18h18M9 17V9m4 8V5m4 12v-6"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Beautiful analytics
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Per-question breakdowns, totals, and response distribution at a
              glance.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h6m-6 4h10"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Multi-question polls
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              Group several questions into one session and review them together.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Ready to hear from your audience?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Spin up a poll in under a minute. Share the link. Watch results
            stream in.
          </p>

          <button className="mt-10 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700">
            Get started — it's free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="text-center text-sm text-slate-500">
          © 2026 PulseBoard
        </div>
      </footer>
    </div>
  );
};

export default Home;
