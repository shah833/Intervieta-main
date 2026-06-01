"use client";

import { Users, Target, CheckCircle, TrendingUp } from 'lucide-react';

const stats = [
  {
    label: 'Total interviews',
    value: 24, unit: null, change: '+12%', period: 'All time',
    icon: Users,
    iconBg: 'rgba(99,102,241,0.14)', iconColor: '#818cf8',
  },
  {
    label: 'Average score',
    value: 87, unit: '%', change: '+5%', period: 'This month',
    icon: Target,
    iconBg: 'rgba(16,185,129,0.11)', iconColor: '#34d399',
  },
  {
    label: 'Completed',
    value: 12, unit: null, change: '+3', period: 'This week',
    icon: CheckCircle,
    iconBg: 'rgba(245,158,11,0.11)', iconColor: '#fbbf24',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="group rounded-xl border border-white/10 bg-[#111827] p-4 sm:p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: stat.iconBg }}
              >
                <Icon className="h-4 w-4" style={{ stroke: stat.iconColor }} strokeWidth={1.8} />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} />
                {stat.change}
              </span>
            </div>

            <p className="mb-1.5 font-['Space_Grotesk'] text-2xl sm:text-[28px] font-semibold leading-none tracking-tight text-white">
              {stat.value}
              {stat.unit && (
                <span className="text-base sm:text-lg font-normal text-white/60">
                  {stat.unit}
                </span>
              )}
            </p>

            <p className="text-sm text-white/40">{stat.label}</p>

            <div className="mt-3 flex items-center gap-2 text-sm text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span>{stat.period}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}