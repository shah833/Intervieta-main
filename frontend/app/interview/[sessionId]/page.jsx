"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import InterviewStartScreen from "@/components/InterviewStartScreen";
import InterviewRoom from "@/components/InterviewRoom";

export default function InterviewSessionPage() {
  const { sessionId } = useParams();
  const { getToken } = useAuth();
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:8000/interview/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load interview session.");
        const data = await res.json();
        setSession(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchSession();
  }, [sessionId, getToken]);

  if (error) return <div className="min-h-screen bg-[#0b0f17] text-red-400 p-8">{error}</div>;
  if (!session) return <div className="min-h-screen bg-[#0b0f17] text-white/60 p-8">Loading interview...</div>;

  if (!started) {
    return (
      <InterviewStartScreen
        domain={session.domain}
        seniority={session.seniority}
        questionCount={session.questions.length}
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <InterviewRoom
      sessionId={sessionId}
      questions={session.questions}
      initialIndex={Math.min(session.current_question_index ?? 0, session.questions.length - 1)}
    />
  );
}