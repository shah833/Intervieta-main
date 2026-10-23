"use client";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import DailyIframe from "@daily-co/daily-js";

export default function AvatarTestPage() {
    const { getToken } = useAuth();
    const containerRef = useRef(null);
    const callRef = useRef(null);
    const conversationIdRef = useRef(null);
    const [status, setStatus] = useState("idle");
    const [text, setText] = useState("Hello! Can you hear me now?");
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            callRef.current?.destroy();
            callRef.current = null;
        };
    }, []);

    async function startAvatar() {
        if (callRef.current) return;
        setError("");
        setStatus("starting");
        try {
            const token = await getToken();
            const res = await fetch("http://localhost:8000/avatar/start", {
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

            frame.on("left-meeting", () => {
                frame.destroy();
                callRef.current = null;
                setStatus("idle");
            });

            await frame.join({ url: data.conversation_url });
            setStatus("connected");
        } catch (err) {
            setError(err.message);
            callRef.current?.destroy();
            callRef.current = null;
            setStatus("idle");
        }
    }

    function speak() {
        if (!callRef.current || !conversationIdRef.current) return;
        callRef.current.sendAppMessage(
            {
                message_type: "conversation",
                event_type: "conversation.echo",
                conversation_id: conversationIdRef.current,
                properties: {
                    modality: "text",
                    text,
                    done: true,
                },
            },
            "*"
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f17] text-white p-8 flex flex-col gap-4 items-center">
            <h1 className="text-xl font-semibold">Avatar speak test</h1>

            <div
                ref={containerRef}
                className="w-full max-w-3xl h-[480px] rounded-2xl overflow-hidden border border-white/10 bg-[#141b28]"
            />

            {status === "idle" && (
                <button
                    onClick={startAvatar}
                    className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
                >
                    Start avatar
                </button>
            )}
            {status === "starting" && <p className="text-white/50 text-sm">Connecting to Alex...</p>}

            {status === "connected" && (
                <div className="w-full max-w-3xl flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                        onClick={speak}
                        className="rounded-xl bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition"
                    >
                        Make Alex speak
                    </button>
                </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
    );
}