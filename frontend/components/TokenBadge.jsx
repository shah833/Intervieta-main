"use client";

export default function TokenBadge({ tokens, loading, compact = false }) {
  if (loading) {
    return <div className="h-5 w-24 animate-pulse rounded-full bg-white/10" />;
  }

  if (!tokens) return null;

  if (tokens.is_pro) {
    return (
      <div className={`flex items-center gap-1.5 ${compact ? "text-xs" : "text-sm"}`}>
        <span className="text-yellow-400">✦</span>
        <span className="text-yellow-300 font-medium">Pro — unlimited</span>
      </div>
    );
  }

  const remaining = tokens.remaining ?? 0;
  const capacity = tokens.capacity ?? 15;
  const percentage = (remaining / capacity) * 100;
  const interviews = Math.floor(remaining / 5);

  const color =
    remaining >= 10 ? "text-cyan-400" :
    remaining >= 5 ? "text-amber-400" :
    "text-red-400";

  const barColor =
    remaining >= 10 ? "bg-cyan-400" :
    remaining >= 5 ? "bg-amber-400" :
    "bg-red-400";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🪙</span>
          <span className={`font-semibold ${color} ${compact ? "text-xs" : "text-sm"}`}>
            {remaining} / {capacity} tokens
          </span>
        </div>
        <span className="text-xs text-white/40">
          {interviews} interview{interviews !== 1 ? "s" : ""} left
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {compact && (
        <p className="text-xs text-white/30">5 tokens per interview · resets daily</p>
      )}
    </div>
  );
}