"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollToContact = () => {
    const section = document.getElementById("contact");
    section?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link href="#top" className="text-xl font-bold tracking-tight text-white">
          Intervie<span className="text-cyan-400">TA</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-slate-300 transition hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button className="rounded-full" onClick={scrollToContact}>
            Start Interview
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-slate-100 transition hover:border-cyan-300 md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <span className={cn("block h-0.5 w-5 bg-current transition", isOpen && "translate-y-1.5 rotate-45")} />
          <span className={cn("absolute block h-0.5 w-5 bg-current transition", isOpen && "opacity-0")} />
          <span className={cn("block h-0.5 w-5 bg-current transition", isOpen && "-translate-y-1.5 -rotate-45")} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "transition-all duration-300 md:hidden",
          isOpen ? "max-h-80 border-t border-white/10 opacity-100" : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <div className="space-y-4 px-4 py-5 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-sm font-medium text-slate-200 transition hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}
          <Button className="w-full" onClick={scrollToContact}>
            Start Interview
          </Button>
        </div>
      </div>
    </header>
  );
}
