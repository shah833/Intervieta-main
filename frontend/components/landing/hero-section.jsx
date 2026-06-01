"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InterviewModal from "@/components/InterviewModal";

export function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.25),_transparent_40%),radial-gradient(circle_at_left,_rgba(56,189,248,0.18),_transparent_30%)]" />

      {/* Interview Modal */}
      {showModal && <InterviewModal onClose={() => setShowModal(false)} />}

      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            AI-Powered Interview Training
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Practice Interviews with AI That Feels Human
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            IntervieTA simulates realistic HR and technical interviews, adapting each question to your responses while giving
            instant, actionable coaching.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => setShowModal(true)}
            >
              Start Free Interview
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Learn More
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur md:grid-cols-3">
          {[
            { label: "Mock interviews completed", value: "120k+" },
            { label: "Average confidence boost", value: "94%" },
            { label: "Interview tracks", value: "35+" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
              <p className="text-2xl font-semibold text-cyan-300">{item.value}</p>
              <p className="mt-1 text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}