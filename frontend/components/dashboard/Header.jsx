"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Bell, LogOut, ChevronDown, Menu, X } from 'lucide-react';

const NAV_ITEMS = ['Dashboard', 'Projects', 'Analytics', 'Settings'];

export default function Header({ className = '' }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U';

  return (
    <header
      className={`
        sticky top-0 z-40
        border-b border-white/[0.06]
        bg-[rgba(9,12,20,0.72)]
        backdrop-blur-2xl backdrop-saturate-180
        lg:ml-56
        ${className}
      `}
    >
      <div className="flex h-[64px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-6">

          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center
              rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
              text-[13px] font-semibold text-white">
              A
            </div>
            <span className="hidden text-[14px] font-semibold tracking-tight
              text-white/90 sm:block">
              Acme
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="rounded-md px-3.5 py-1.5 text-[13px] text-white/45
                  transition-colors hover:bg-white/[0.05] hover:text-white/85"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          <button className="relative flex h-[34px] w-[34px] items-center
            justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]
            transition hover:border-white/[0.14] hover:bg-white/[0.09]">
            <Bell className="h-[15px] w-[15px] stroke-white/50" strokeWidth={1.8} />
            <span className="absolute right-[7px] top-1.5 h-1.5 w-1.5 rounded-full
              bg-indigo-400 ring-[1.5px] ring-[#0d1117]" />
          </button>

          <div className="hidden h-[22px] w-px bg-white/[0.08] sm:block" />

          <button className="hidden sm:flex items-center gap-2.5 rounded-[10px]
            border border-white/[0.07] bg-white/[0.04] py-1.5 pl-3 pr-1.5
            transition hover:border-white/[0.12] hover:bg-white/[0.08]">
            <div className="text-right">
              <p className="text-[13px] font-medium leading-tight text-white/88">
                {user?.fullName}
              </p>
              <p className="text-[11px] capitalize tracking-wide text-white/35">
                {user?.publicMetadata?.role}
              </p>
            </div>
            <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center
              justify-center rounded-[7px] bg-gradient-to-br from-indigo-600
              to-violet-600 text-xs font-semibold text-white">
              {initials}
            </div>
            <ChevronDown className="-ml-0.5 h-3 w-3 stroke-white/30" strokeWidth={2} />
          </button>

          <div className="flex sm:hidden h-[34px] w-[34px] flex-shrink-0 items-center
            justify-center rounded-[9px] bg-gradient-to-br from-indigo-600
            to-violet-600 text-xs font-semibold text-white">
            {initials}
          </div>

          <button
            onClick={() => void signOut({ redirectUrl: "/" })}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border
              border-white/[0.07] px-3 py-[7px] text-[13px] text-white/40
              transition hover:border-red-500/20 hover:bg-red-500/[0.07]
              hover:text-red-400/85"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.8} />
            Logout
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-lg
              border border-white/[0.08] bg-white/[0.04] md:hidden"
          >
            {menuOpen
              ? <X className="h-4 w-4 stroke-white/60" strokeWidth={1.8} />
              : <Menu className="h-4 w-4 stroke-white/60" strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/[0.06] bg-[rgba(9,12,20,0.95)]
          px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[13.5px] text-white/55
                  transition hover:bg-white/[0.06] hover:text-white/85"
              >
                {item}
              </Link>
            ))}
            <div className="my-1 h-px bg-white/[0.06]" />
            <button
              onClick={() => void signOut({ redirectUrl: "/" })}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5
                text-[13.5px] text-white/35 transition
                hover:bg-red-500/[0.07] hover:text-red-400/80"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}