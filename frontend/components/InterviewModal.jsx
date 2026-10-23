"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useTokens } from "@/hooks/useTokens";
import TokenBadge from "@/components/TokenBadge";
import { Cpu } from "lucide-react";

const loadingSteps = [
  "Reading your resume...",
  "Understanding your background...",
  "Crafting tailored questions...",
  "Almost ready...",
];

export default function InterviewModal({ onClose }) {
  const [tab, setTab] = useState("resume");
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();
  const { getToken } = useAuth();
  const { tokens, loading: tokensLoading, refetch: refetchTokens } = useTokens();

  useEffect(() => {
    if (!loading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % loadingSteps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFile = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const submitResume = async () => {
    const token = await getToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/interview/resume", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to generate interview questions.");
    }

    return res.json();
  };

  const handleResumeSubmit = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let data;
      try {
        data = await submitResume();
      } catch {
        data = await submitResume();
      }
      onClose();
      refetchTokens();
      router.push(`/interview/${data.session_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitJobDescription = async () => {
    const token = await getToken();

    const res = await fetch("http://localhost:8000/interview/job-description", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobTitle,
        jobDescription: jobDesc,
        experience,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to generate interview questions.");
    }

    return res.json();
  };

  const handleJobSubmit = async () => {
    if (!jobTitle.trim() || !jobDesc.trim() || !experience.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let data;
      try {
        data = await submitJobDescription();
      } catch {
        data = await submitJobDescription();
      }
      onClose();
      refetchTokens();
      router.push(`/interview/${data.session_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1623] p-7 shadow-2xl">

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Start a new interview</h2>
            <p className="text-sm text-white/40 mt-1">Choose how you want to set up your session</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/50 hover:text-white transition">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setTab("resume")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
              tab === "resume"
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 bg-white/3 text-white/50 hover:text-white"
            }`}
          >
            Upload resume
          </button>
          <button
            onClick={() => setTab("job")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
              tab === "job"
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                : "border-white/10 bg-white/3 text-white/50 hover:text-white"
            }`}
          >
            Fill job description
          </button>
        </div>

        {!loading && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <TokenBadge tokens={tokens} loading={tokensLoading} />
          </div>
        )}

        {!loading && tokens && !tokens.is_pro && (tokens.remaining ?? 0) < 5 && (
          <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
            <p className="text-sm text-red-400">
              ⚠️ Not enough tokens to start an interview. Your tokens refill daily.
            </p>
          </div>
        )}

        {tab === "resume" && (
          <div>
            {!loading && (
              <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-white/2 py-10 cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-400/5 transition">
                <span className="text-4xl">📄</span>
                <span className="text-sm text-white/50">Drag and drop your resume here</span>
                <span className="text-xs text-white/25">PDF only — max 5MB</span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleFile} />
              </label>
            )}

            {!loading && file && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/7 px-3 py-2">
                <span className="text-sm text-cyan-300 flex-1">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-white/30 hover:text-white text-xs">✕</button>
              </div>
            )}

            {loading ? (
              <div className="mt-2 flex flex-col items-center text-center py-4">
                <div className="relative w-14 h-14 mb-4">
                  <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                      border: "2.5px solid transparent",
                      borderTopColor: "#22d3ee",
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-full animate-spin"
                    style={{
                      border: "2.5px solid transparent",
                      borderTopColor: "rgba(34, 211, 238, 0.4)",
                      animationDirection: "reverse",
                      animationDuration: "1.6s",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-400 animate-pulse">
                    <Cpu className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                </div>
                <p className="text-sm font-medium text-white">Generating your interview</p>
                <p className="text-xs text-white/40 mt-1 min-h-[16px]">{loadingSteps[stepIndex]}</p>
              </div>
            ) : (
              <button
                onClick={handleResumeSubmit}
                className="mt-4 w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
              >
                Start interview
              </button>
            )}
          </div>
        )}

        {tab === "job" && (
          <div className="flex flex-col gap-4">
            {!loading && (
              <>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Job title</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/4 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Job description</label>
                  <textarea
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/4 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Experience in years</label>
                  <input
                    type="number"
                    placeholder="e.g. 3"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/4 px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleJobSubmit}
                  className="w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
                >
                  Start interview
                </button>
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center text-center py-4">
                <div className="relative w-14 h-14 mb-4">
                  <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{ border: "2.5px solid transparent", borderTopColor: "#22d3ee" }}
                  />
                  <div
                    className="absolute inset-2 rounded-full animate-spin"
                    style={{
                      border: "2.5px solid transparent",
                      borderTopColor: "rgba(34, 211, 238, 0.4)",
                      animationDirection: "reverse",
                      animationDuration: "1.6s",
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-cyan-400 animate-pulse">
                    <Cpu className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                </div>
                <p className="text-sm font-medium text-white">Generating your interview</p>
                <p className="text-xs text-white/40 mt-1 min-h-[16px]">{loadingSteps[stepIndex]}</p>
              </div>
            )}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}