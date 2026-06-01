"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  PlayCircle,
  History,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

function NavItem({ href, icon: Icon, label, active, onClick, collapsed }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ease-out
        ${
          active
            ? "bg-white/10 text-white shadow-lg shadow-indigo-500/20"
            : "text-white/60 hover:bg-white/5 hover:text-white"
        } ${collapsed ? 'justify-center px-2' : ''}`}
      title={collapsed ? label : undefined}
    >
      <Icon
        className={`h-4 w-4 transition-all duration-200 ${
          active ? "text-indigo-400" : "text-white/40 group-hover:text-white"
        }`}
        strokeWidth={1.8}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {active && !collapsed && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
      )}
    </Link>
  );
}

export default function Sidebar({ onStartInterview }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const close = () => setOpen(false);

  const content = (onClick, collapsed = false) => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={`mb-6 flex items-center gap-3 px-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold transition-all duration-200">
          I
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-white">IntervieTA</p>
            <p className="text-xs text-white/40">AI Interview System</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto rounded-lg p-1 text-white/40 hover:bg-white/5 hover:text-white transition-all duration-200"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            active={pathname === item.href}
            onClick={onClick}
            collapsed={collapsed}
          />
        ))}

        {/* Start interview button */}
        <button
          onClick={() => {
            onStartInterview?.();
            onClick?.();
          }}
          className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ease-out text-white/60 hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? "Start interview" : undefined}
        >
          <PlayCircle
            className="h-4 w-4 text-white/40 group-hover:text-white transition-all duration-200"
            strokeWidth={1.8}
          />
          {!collapsed && <span className="truncate">Start interview</span>}
        </button>
      </div>

      {/* Bottom */}
      <div className="mt-auto">
        <div className="my-4 border-t border-white/10" />
        <button
          onClick={() => {
            signOut({ redirectUrl: "/" });
            onClick?.();
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/40 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`fixed left-0 top-0 h-screen border-r border-white/10 bg-[#0b0f17] transition-all duration-300 ease-out hidden lg:flex p-3 ${
        collapsed ? 'w-16' : 'w-60'
      }`}>
        {content()}
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#0b0f17] px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            I
          </div>
          <span className="text-sm font-semibold text-white">IntervieTA</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-white/10 bg-white/5 p-2"
        >
          <Menu className="h-4 w-4 text-white/70" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full border-r border-white/10 p-3 transition-all duration-300 ease-out lg:hidden ${
          collapsed ? 'w-16 bg-[#0b0f17]' : 'w-64 bg-[#0b0f17]'
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 rounded-md p-2 text-white/50 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        {content(close)}
      </aside>
    </>
  );
}