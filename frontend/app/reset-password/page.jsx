"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { ApiError, apiRequest } from "@/lib/api";

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      setMessage(response.message);
      setNewPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Reset password</h1>
        <p className="mt-2 text-sm text-slate-300">Create a new secure password for your account.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-200">New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-md border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-300/40 transition focus:ring-2"
              placeholder="At least 8 characters"
              required
            />
          </label>

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {message && <p className="text-sm text-emerald-300">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-300">
          Back to{" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-10">
          <p className="text-slate-300">Loading reset form...</p>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
