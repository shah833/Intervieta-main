"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import DailyIframe from "@daily-co/daily-js";
import { Mic, MicOff, Send } from "lucide-react";

const API = "http://localhost:8000";

const STATUS_LABEL = {
    ready: "Ready to join",
    connecting: "Connecting to Alex...",
    "alex-speaking": "Alex is speaking...",
    "your-turn": "Your turn: answer by voice or text",
    saving: "Saving your answer...",
    done: "Interview complete",
    ended: "Call ended",
};

// Tavus sends both a legacy event name and a newer role-based one, so handle both.
function replicaEvent(msg) {
    if (!msg || msg.message_type !== "conversation") return null;
    const t = msg.event_type;
    if (t === "conversation.replica.started_speaking") return "started";
    if (t === "conversation.replica.stopped_speaking") return "stopped";
    const role = msg.properties?.role;
    if (role === "replica" || role === "pal") {
        if (t === "conversation.started_speaking") return "started";
        if (t === "conversation.stopped_speaking") return "stopped";
    }
    return null;
}

function waitForReplica(frame) {
    return new Promise((resolve) => {
        const hasRemote = () =>
            Object.keys(frame.participants()).some((k) => k !== "local");
        if (hasRemote()) return resolve();
        const timeout = setTimeout(done, 20000);
        function done() {
            clearTimeout(timeout);
            frame.off("participant-joined", done);
            resolve();
        }
        frame.on("participant-joined", done);
    });
}

function micMessage(code) {
    switch (code) {
        case "not-allowed":
        case "service-not-allowed":
            return "Microphone is blocked for this site. Click the lock icon next to the address bar, allow Microphone, then press Speak again.";
        case "audio-capture":
            return "No working microphone was found, or another app is using it. Check your headset and try again.";
        case "network":
            return "Chrome's speech service could not be reached. Voice input needs a working connection to Google. Type your answer instead.";
        default:
            return `Voice input stopped (${code}). You can type your answer instead.`;
    }
}

export default function InterviewRoom({ sessionId, questions, initialIndex = 0 }) {
    const router = useRouter();
    const { getToken } = useAuth();

    const containerRef = useRef(null);
    const callRef = useRef(null);
    const conversationIdRef = useRef(null);
    const recognitionRef = useRef(null);
    const wantListeningRef = useRef(false);
    const committedRef = useRef("");
    const fallbackTimerRef = useRef(null);
    const heardStartRef = useRef(false);
    const statusRef = useRef("ready");

    const [status, setStatus] = useState("ready");
    const [index, setIndex] = useState(initialIndex);
    const [answer, setAnswer] = useState("");
    const [listening, setListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [micError, setMicError] = useState("");
    const [endReason, setEndReason] = useState("");
    const [error, setError] = useState("");

    const current = questions[index];

    function changeStatus(next) {
        statusRef.current = next;
        setStatus(next);
    }

    useEffect(() => {
        setVoiceSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
        return () => {
            clearTimeout(fallbackTimerRef.current);
            wantListeningRef.current = false;
            recognitionRef.current?.stop();
            callRef.current?.destroy();
            callRef.current = null;
        };
    }, []);

    function sendToAlex(text) {
        callRef.current?.sendAppMessage(
            {
                message_type: "conversation",
                event_type: "conversation.echo",
                conversation_id: conversationIdRef.current,
                properties: { modality: "text", text, done: true },
            },
            "*"
        );
    }

    function askQuestion(i, intro = "") {
        const text = intro + questions[i].question;

        setIndex(i);
        setAnswer("");
        committedRef.current = "";
        setMicError("");
        heardStartRef.current = false;
        changeStatus("alex-speaking");
        sendToAlex(text);

        // Fallback in case Tavus doesn't send a "stopped speaking" event.
        const words = text.split(/\s+/).length;
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = setTimeout(() => {
            if (statusRef.current === "alex-speaking") changeStatus("your-turn");
        }, (words * 0.45 + 4) * 1000);
    }

    function handleAppMessage(e) {
        const msg = e?.data;
        if (msg?.event_type) {
            console.log("Tavus event:", msg.event_type, msg.properties?.role ?? "");
        }
        if (statusRef.current !== "alex-speaking") return;
        const kind = replicaEvent(msg);
        if (kind === "started") heardStartRef.current = true;
        if (kind === "stopped" && heardStartRef.current) {
            clearTimeout(fallbackTimerRef.current);
            changeStatus("your-turn");
        }
    }

    async function loadEndReason() {
        const id = conversationIdRef.current;
        if (!id) return;
        try {
            // Tavus can take a moment to record why the call ended.
            await new Promise((r) => setTimeout(r, 2500));
            const token = await getToken();
            const res = await fetch(`${API}/avatar/${id}/status`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            console.log("Tavus conversation status:", data);
            setEndReason(data.shutdown_reason || data.status || "");
        } catch {
            /* the reason is only a diagnostic, ignore failures */
        }
    }

    function handleLeft() {
        clearTimeout(fallbackTimerRef.current);
        wantListeningRef.current = false;
        recognitionRef.current?.stop();
        setListening(false);
        callRef.current?.destroy();
        callRef.current = null;
        if (statusRef.current !== "done") {
            changeStatus("ended");
            loadEndReason();
        }
    }

    async function startInterview() {
        if (callRef.current) return;
        setError("");
        setEndReason("");
        changeStatus("connecting");
        try {
            const token = await getToken();
            const res = await fetch(`${API}/avatar/start`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Could not start the avatar conversation.");
            const data = await res.json();
            conversationIdRef.current = data.conversation_id;

            const frame = DailyIframe.createFrame(containerRef.current, {
                iframeStyle: { width: "100%", height: "100%", border: "0" },
                showLeaveButton: true,
            });
            callRef.current = frame;
            frame.on("app-message", handleAppMessage);
            frame.on("left-meeting", handleLeft);
            frame.on("participant-left", (e) => console.log("Daily participant-left:", e));
            frame.on("error", (e) => console.log("Daily error:", e));

            await frame.join({ url: data.conversation_url });
            try {
                // Alex is driven by text, so the call doesn't need your mic.
                frame.setLocalAudio(false);
            } catch {
                /* not critical */
            }
            await waitForReplica(frame);
            await new Promise((r) => setTimeout(r, 2000));

            askQuestion(
                index,
                index === 0
                    ? "Hello, I'm Alex, and I'll be your interviewer today. Let's begin. "
                    : "Welcome back. Let's pick up where we left off. "
            );
        } catch (err) {
            setError(err.message);
            callRef.current?.destroy();
            callRef.current = null;
            changeStatus("ready");
        }
    }

    async function toggleMic() {
        if (listening) {
            wantListeningRef.current = false;
            recognitionRef.current?.stop();
            setListening(false);
            return;
        }
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        setMicError("");

        // Ask for mic permission for this page first, so a block shows a clear message.
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((t) => t.stop());
        } catch {
            setMicError(micMessage("not-allowed"));
            return;
        }

        committedRef.current = answer.trim() ? answer.trim() + " " : "";
        wantListeningRef.current = true;

        const rec = new SR();
        rec.lang = "en-US";
        rec.continuous = true;
        rec.interimResults = true;

        rec.onresult = (e) => {
            let interim = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const r = e.results[i];
                if (r.isFinal) committedRef.current += r[0].transcript + " ";
                else interim += r[0].transcript;
            }
            setAnswer((committedRef.current + interim).trimStart());
        };

        rec.onerror = (e) => {
            // Silence and manual stops are normal; onend restarts listening.
            if (e.error === "no-speech" || e.error === "aborted") return;
            wantListeningRef.current = false;
            setMicError(micMessage(e.error));
        };

        rec.onend = () => {
            // Chrome ends a session after pauses, so restart while the user still wants to talk.
            if (wantListeningRef.current && statusRef.current === "your-turn") {
                try {
                    rec.start();
                    return;
                } catch {
                    /* fall through and stop */
                }
            }
            wantListeningRef.current = false;
            setListening(false);
        };

        try {
            rec.start();
            recognitionRef.current = rec;
            setListening(true);
        } catch {
            setMicError(micMessage("audio-capture"));
        }
    }

    async function submitAnswer() {
        const text = answer.trim();
        if (!text || statusRef.current !== "your-turn") return;
        wantListeningRef.current = false;
        recognitionRef.current?.stop();
        setListening(false);
        changeStatus("saving");
        setError("");
        try {
            const token = await getToken();
            const res = await fetch(`${API}/interview/${sessionId}/answer`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question_id: current.id, answer: text }),
            });
            if (!res.ok) throw new Error("Could not save your answer. Try again.");

            if (index + 1 >= questions.length) {
                changeStatus("done");
                sendToAlex("Thank you for your time. That concludes our interview.");
                return;
            }
            askQuestion(index + 1);
        } catch (err) {
            setError(err.message);
            changeStatus("your-turn");
        }
    }

    function finish() {
        callRef.current?.leave();
        router.push("/dashboard");
    }

    const progress = ((index + (status === "done" ? 1 : 0)) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#0b0f17] text-white p-4 lg:p-8">
            <div className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-6">
                {/* Avatar side */}
                <div className="flex-1 flex flex-col gap-3">
                    <div className="relative h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#141b28]">
                        <div ref={containerRef} className="absolute inset-0" />

                        {status === "ready" && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0b0f17]/95 px-6 text-center">
                                <p className="text-sm text-white/60 max-w-xs">
                                    {index > 0
                                        ? `You answered ${index} question${index === 1 ? "" : "s"} already. Join to continue from question ${index + 1}.`
                                        : "Allow camera and microphone if your browser asks, then join the call with Alex."}
                                </p>
                                <button
                                    onClick={startInterview}
                                    className="rounded-xl bg-cyan-400 px-8 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
                                >
                                    {index > 0 ? "Continue interview" : "Join interview"}
                                </button>
                            </div>
                        )}

                        {status === "connecting" && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0b0f17]/80 pointer-events-none">
                                <p className="text-sm text-white/70 animate-pulse">Connecting to Alex...</p>
                            </div>
                        )}

                        {status === "ended" && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0b0f17]/95 px-6 text-center">
                                <p className="text-sm text-white/80">The call ended.</p>
                                {endReason && (
                                    <p className="text-xs text-white/40">Reason: {endReason}</p>
                                )}
                                <p className="text-xs text-white/40 max-w-xs">
                                    Your saved answers are safe. You can reconnect and continue from question {index + 1}.
                                </p>
                                <button
                                    onClick={startInterview}
                                    className="rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
                                >
                                    Reconnect and continue
                                </button>
                                <Link href="/dashboard" className="text-xs text-white/40 hover:text-white">
                                    Back to dashboard
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/50">
                        <span>{STATUS_LABEL[status]}</span>
                        <span>
                            Question {Math.min(index + 1, questions.length)} of {questions.length}
                        </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full bg-cyan-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question + answer side */}
                <div className="w-full lg:w-96 flex flex-col gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-wide text-cyan-400 mb-1">{current?.type}</p>
                        <p className="text-sm text-white/90 leading-relaxed">{current?.question}</p>
                    </div>

                    {status === "done" ? (
                        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-center">
                            <p className="text-sm text-cyan-300 mb-3">
                                Interview complete. Your answers are saved.
                            </p>
                            <button
                                onClick={finish}
                                className="w-full rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
                            >
                                Finish and go to dashboard
                            </button>
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={answer}
                                onChange={(e) => {
                                    setAnswer(e.target.value);
                                    committedRef.current = e.target.value
                                        ? e.target.value.replace(/\s*$/, " ")
                                        : "";
                                }}
                                disabled={status !== "your-turn"}
                                placeholder={
                                    status === "your-turn"
                                        ? "Type your answer, or press Speak and talk..."
                                        : "Wait for Alex to finish the question..."
                                }
                                rows={7}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/25 focus:border-cyan-400 focus:outline-none resize-none disabled:opacity-50"
                            />

                            <div className="flex gap-2">
                                {voiceSupported && (
                                    <button
                                        onClick={toggleMic}
                                        disabled={status !== "your-turn"}
                                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition disabled:opacity-40 ${listening
                                                ? "border-red-400/40 bg-red-400/10 text-red-300"
                                                : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                                            }`}
                                    >
                                        {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                        {listening ? "Stop" : "Speak"}
                                    </button>
                                )}
                                <button
                                    onClick={submitAnswer}
                                    disabled={status !== "your-turn" || !answer.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition disabled:opacity-40"
                                >
                                    <Send className="h-4 w-4" />
                                    {index + 1 >= questions.length ? "Submit and finish" : "Submit answer"}
                                </button>
                            </div>

                            {listening && (
                                <p className="text-xs text-cyan-300 animate-pulse">Listening... speak now</p>
                            )}
                            {micError && <p className="text-xs text-amber-300">{micError}</p>}
                        </>
                    )}

                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>
            </div>
        </div>
    );
}