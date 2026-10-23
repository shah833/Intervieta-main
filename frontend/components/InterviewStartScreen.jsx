"use client";
import { Clock, ListChecks, Camera } from "lucide-react";

export default function InterviewStartScreen({ domain, questionCount = 10, onStart }) {
  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col items-center justify-center px-4 py-16 text-center">
      <svg className="w-[280px] h-[220px] mb-8" viewBox="0 0 280 220" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="glow3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="faceShade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0bd93" />
            <stop offset="100%" stopColor="#cf9868" />
          </linearGradient>
          <linearGradient id="hairShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2c1e" />
            <stop offset="100%" stopColor="#241a10" />
          </linearGradient>
          <linearGradient id="blazer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3644" />
            <stop offset="100%" stopColor="#1c2733" />
          </linearGradient>
          <clipPath id="screenClip3">
            <rect x="70" y="45" width="140" height="90" rx="6" />
          </clipPath>
        </defs>

        <ellipse cx="140" cy="185" rx="110" ry="18" fill="url(#glow3)" />
        <rect x="55" y="30" width="170" height="120" rx="12" fill="#141b28" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />

        <g clipPath="url(#screenClip3)">
          <rect x="70" y="45" width="140" height="90" fill="#0b0f17" />
          <ellipse cx="140" cy="215" rx="46" ry="45" fill="url(#blazer)" />
          <path d="M118 178 L140 190 L162 178 L162 172 L140 182 L118 172 Z" fill="#e8e4dd" />
          <path d="M112 62 Q140 50 168 62 Q172 82 165 100 Q166 90 160 84 Q140 74 120 84 Q114 90 115 100 Q108 82 112 62 Z" fill="url(#hairShade)" />
          <path d="M120 82 Q140 74 160 82 L162 100 Q162 118 140 122 Q118 118 118 100 Z" fill="url(#faceShade)" />
          <ellipse cx="140" cy="102" rx="21" ry="24" fill="url(#faceShade)" />
          <path d="M125 96 Q129 93 134 95" stroke="#241a10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M146 95 Q151 93 155 96" stroke="#241a10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <ellipse cx="130" cy="101" rx="2.2" ry="2.8" fill="#2c2116" />
          <ellipse cx="150" cy="101" rx="2.2" ry="2.8" fill="#2c2116" />
          <path d="M139 104 Q141 109 138 112" stroke="#c17f4f" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <path d="M133 117 Q140 120 147 117" stroke="#a5674a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M118 100 Q114 108 118 116" stroke="#c9945f" strokeWidth="1" fill="none" strokeOpacity="0.5" />
          <path d="M162 100 Q166 108 162 116" stroke="#c9945f" strokeWidth="1" fill="none" strokeOpacity="0.5" />
        </g>

        <rect x="100" y="112" width="80" height="6" rx="3" fill="#22d3ee" fillOpacity="0.3" />
        <rect x="115" y="122" width="50" height="6" rx="3" fill="#22d3ee" fillOpacity="0.18" />
        <rect x="130" y="150" width="20" height="14" fill="#1e293b" />
        <rect x="100" y="164" width="80" height="8" rx="4" fill="#1e293b" />

        <circle cx="222" cy="45" r="4" fill="#22d3ee" fillOpacity="0.6" />
        <circle cx="235" cy="70" r="3" fill="#22d3ee" fillOpacity="0.4" />
        <circle cx="45" cy="55" r="3" fill="#22d3ee" fillOpacity="0.4" />
        <circle cx="35" cy="90" r="4" fill="#22d3ee" fillOpacity="0.6" />
      </svg>

      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-medium text-cyan-400 mb-5">
        AI avatar interview
      </span>

      <h1 className="text-2xl font-medium text-white mb-2.5">Ready to meet your interviewer?</h1>
      <p className="text-sm text-white/45 max-w-sm mb-6 leading-relaxed">
        {domain ? `Alex will guide you through your ${domain} interview.` : "Alex will guide you through your interview."} Speak naturally or type — take your time.
      </p>

      <div className="flex gap-5 mb-7">
       <div className="flex items-center gap-1.5 text-sm text-white/50">
        <Clock className="w-4 h-4 text-cyan-400" strokeWidth={1.8} />
        <span>~20 minutes</span>
      </div>
        <div className="flex items-center gap-1.5 text-sm text-white/50">
        <ListChecks className="w-4 h-4 text-cyan-400" strokeWidth={1.8} />
        <span>{questionCount} questions</span>
    </div>
        <div className="flex items-center gap-1.5 text-sm text-white/50">
        <Camera className="w-4 h-4 text-cyan-400" strokeWidth={1.8} />
        <span>Camera optional</span>
      </div>
    </div>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
      >
        Start interview
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}