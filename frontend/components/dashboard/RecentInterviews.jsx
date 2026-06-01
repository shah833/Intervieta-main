"use client";

import Link from "next/link";
import InterviewCard from './InterviewCard';

const recentInterviews = [
  { type: 'Frontend Developer Interview', score: 92, date: 'Oct 15, 2024', status: 'completed' },
  { type: 'System Design Mock',           score: 78, date: 'Oct 12, 2024', status: 'completed' },
  { type: 'React Technical Round',        score: null, date: 'Oct 10, 2024', status: 'pending' },
  { type: 'Behavioral Interview',         score: 89, date: 'Oct 8, 2024',  status: 'completed' },
];

export default function RecentInterviews() {
  return (
    <div className="overflow-hidden">
      <div className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight text-white/90">Recent interviews</h2>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/5 text-xs font-medium text-white/50">
            {recentInterviews.length}
          </span>
        </div>

        <a
          href="#"
          className="group inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white"
        >
          <span className="hidden sm:inline">View all</span>
          <span className="sm:hidden">All</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-0.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>

      {recentInterviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 overflow-hidden">
          {recentInterviews.map((interview, index) => (
            <InterviewCard key={index} {...interview} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-slate-950/70 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/40">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">No interviews yet</h3>
          <p className="max-w-sm text-sm text-white/60">Start your first AI interview to see your progress and build your confidence.</p>
          <Link
            href="/dashboard/interview"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 ease-out hover:scale-105 hover:bg-cyan-400"
          >
            Start Your First Interview
          </Link>
        </div>
      )}
    </div>
  );
}