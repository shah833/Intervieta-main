"use client";

const scoreColor = (score) => {
  if (score >= 80) return '#818cf8';
  if (score >= 60) return '#34d399';
  return '#fbbf24';
};

const resolveIcon = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('behavioral') || t.includes('hr'))
    return { bg: 'rgba(99,102,241,0.15)', stroke: '#818cf8', d: 'chat' };
  if (t.includes('technical') || t.includes('coding') || t.includes('react'))
    return { bg: 'rgba(16,185,129,0.12)', stroke: '#34d399', d: 'code' };
  return { bg: 'rgba(245,158,11,0.12)', stroke: '#fbbf24', d: 'design' };
};

function TypeIcon({ d, stroke }) {
  if (d === 'chat') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
  if (d === 'code') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  );
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

export default function InterviewCard({ type, score, date, status = 'completed' }) {
  const done = status === 'completed';
  const color = done ? scoreColor(score) : null;
  const icon = resolveIcon(type);

  return (
    <div className="group relative overflow-hidden rounded-xl border
      border-white/10 bg-[#111827] p-4 sm:p-5
      transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/10">

      <div className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0
        bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.06),transparent_65%)]
        transition-opacity duration-200 group-hover:opacity-100" />

      {/* Icon */}
      <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-[9px]"
        style={{ background: icon.bg }}>
        <TypeIcon d={icon.d} stroke={icon.stroke} />
      </div>

      {/* Title + badge */}
      <div className="mb-3.5 flex items-start justify-between gap-2">
        <p className="flex-1 text-sm font-medium
          leading-snug text-white">
          {type}
        </p>
        <span className={`inline-flex flex-shrink-0 items-center gap-1.5
          rounded-full border px-2.5 py-0.5 text-[11px] font-medium
          ${done
            ? 'border-emerald-400/20 bg-emerald-400/[0.12] text-emerald-400'
            : 'border-amber-400/20 bg-amber-400/[0.12] text-amber-400'
          }`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {done ? 'Done' : 'Pending'}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-3.5 flex items-center gap-2.5">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: done ? `${score}%` : '0%', background: color ?? 'transparent' }}
          />
        </div>
        <span
          className="min-w-[28px] text-right text-[13px] font-medium"
          style={{ color: done ? color : 'rgba(255,255,255,0.2)' }}
        >
          {done ? score : '—'}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className="text-sm text-white/40">{date}</span>
      </div>
    </div>
  );
}