"use client";

import Link from "next/link";
import { useState } from "react";

import { ApiError, apiRequest } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-300">We will send a reset link to your email.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-200">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-cyan-300/40 transition focus:ring-2"
              placeholder="you@example.com"
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
            {loading ? "Sending..." : "Send reset link"}
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
