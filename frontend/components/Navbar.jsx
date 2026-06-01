"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const closeMenu = () => setIsOpen(false);

  const isReady = isLoaded;
  const isAuthenticated = !!user;

  const desktopAuthActions = !isReady ? (
    <div className="h-10 w-44 animate-pulse rounded-full border border-white/10 bg-white/5" />
  ) : isAuthenticated ? (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-cyan-300 hover:text-cyan-200"
      >
        Dashboard
      </Link>

      <button
        type="button"
        onClick={() => void signOut({ redirectUrl: "/" })}
        className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-700"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-cyan-300 hover:text-cyan-200"
      >
        Login
      </Link>

      <Link
        href="/register"
        className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-cyan-400"
      >
        Sign Up
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="#top"
          className="text-xl font-bold tracking-tight text-white"
        >
          Intervie<span className="text-cyan-400">TA</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:block">{desktopAuthActions}</div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-slate-100 transition hover:border-cyan-300 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "block h-0.5 w-5 bg-current transition",
              isOpen && "translate-y-1.5 rotate-45"
            )}
          />

          <span
            className={cn(
              "absolute block h-0.5 w-5 bg-current transition",
              isOpen && "opacity-0"
            )}
          />

          <span
            className={cn(
              "block h-0.5 w-5 bg-current transition",
              isOpen && "-translate-y-1.5 -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "transition-all duration-300 md:hidden",
          isOpen
            ? "max-h-[32rem] border-t border-white/10 opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        )}
      >
        <div className="space-y-4 px-4 py-5 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="block text-sm font-medium text-slate-200 transition hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}

          {!isReady ? (
            <div className="h-10 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
          ) : isAuthenticated ? (
            <div className="space-y-3">
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="block rounded-md border border-white/20 px-4 py-2 text-center text-sm font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  void signOut({ redirectUrl: "/" });
                }}
                className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block rounded-md border border-white/20 px-4 py-2 text-center text-sm font-semibold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="block rounded-md bg-cyan-500 px-4 py-2 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}