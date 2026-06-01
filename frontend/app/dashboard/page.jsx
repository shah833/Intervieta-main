"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import StatsCards from "@/components/dashboard/StatsCards";
import InterviewCard from "@/components/dashboard/InterviewCard";
import RecentInterviews from "@/components/dashboard/RecentInterviews";
import InterviewModal from "@/components/InterviewModal";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] text-white">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f17] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
          <p className="text-white/80">You are not authenticated.</p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white">

      <Sidebar onStartInterview={() => setShowModal(true)} />

      {showModal && <InterviewModal onClose={() => setShowModal(false)} />}

      <main className="lg:ml-60">

        <div className="h-14 lg:hidden" />

        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur-md shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                  Dashboard overview
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Welcome back, {user.firstName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
                  Ready for your next AI interview?
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-400"
              >
                Start Interview
              </button>

            </div>
          </div>

          <section className="mt-6">
            <StatsCards />
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-3">

            <div className="lg:col-span-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md shadow-xl hover:border-white/20">
                <InterviewCard />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-5 sm:p-6 backdrop-blur-md shadow-xl">
              <h3 className="text-sm font-semibold text-white">
                AI Feedback (Coming Soon)
              </h3>
              <p className="mt-2 text-sm text-white/60">
                Get real-time insights on your speaking, confidence, and answers.
              </p>

              <div className="mt-5 space-y-2">
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-4/5 rounded-full bg-white/10" />
                <div className="h-2 w-3/5 rounded-full bg-white/10" />
              </div>
            </div>

          </section>

          <section className="mt-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md shadow-xl">
              <RecentInterviews />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}