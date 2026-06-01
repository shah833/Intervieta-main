"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { ApiError, apiRequest } from "@/lib/api";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = useMemo(() => params.get("token") ?? "", [params]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("Verification token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest("/auth/verify-email", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        setMessage(response.message);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    void verify();
  }, [token]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Verify email</h1>
        {loading && <p className="mt-3 text-sm text-slate-300">Verifying your account...</p>}
        {!loading && message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
        {!loading && error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

        <Link href="/login" className="mt-5 inline-block text-sm text-cyan-300 hover:text-cyan-200">
          Continue to login
        </Link>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-10">
          <p className="text-slate-300">Loading verification...</p>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
