"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InterviewModal({ onClose }) {
  const [tab, setTab] = useState("resume");
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const router = useRouter();

  const handleFile = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    router.push("/interview");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f1623] p-7 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Start a new interview</h2>
            <p className="text-sm text-white/40 mt-1">Choose how you want to set up your session</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/50 hover:text-white transition">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6">
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

        {/* Resume Panel */}
        {tab === "resume" && (
          <div>
            <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-white/2 py-10 cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-400/5 transition">
              <span className="text-4xl">📄</span>
              <span className="text-sm text-white/50">Drag and drop your resume here</span>
              <span className="text-xs text-white/25">PDF, DOC, DOCX — max 5MB</span>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile} />
            </label>
            {file && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/7 px-3 py-2">
                <span className="text-sm text-cyan-300 flex-1">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-white/30 hover:text-white text-xs">✕</button>
              </div>
            )}
            <button onClick={handleSubmit} className="mt-4 w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition">
              Start interview
            </button>
          </div>
        )}

        {/* Job Description Panel */}
        {tab === "job" && (
          <div className="flex flex-col gap-4">
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
            <button onClick={handleSubmit} className="w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition">
              Start interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}