"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const videoRef = useRef(null);
  const userVideoRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();

  const [messages, setMessages] = useState([
    { role: "ai", content: "Welcome! Tell me about yourself." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [aiImage, setAiImage] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [showControls, setShowControls] = useState(true);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    startCamera();
    setMeetingStartTime(new Date());

    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const showSubtitle = (text) => {
    setSubtitle(text);
    setTimeout(() => setSubtitle(""), 3000);
  };

  const formatMeetingTime = () => {
    if (!meetingStartTime) return "00:00";
    const elapsed = Math.floor((new Date() - meetingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    showSubtitle(input);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiText = "Interesting. Can you explain that further?";
      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
      showSubtitle(aiText);
      setLoading(false);
    }, 1500);
  };

  const toggleCamera = () => {
    if (cameraOn) stopCamera();
    else startCamera();

    setCameraOn(!cameraOn);
  };

  const toggleMic = () => {
    setMicOn(!micOn);
  };

  const endMeeting = () => {
    stopCamera();
    router.push("/dashboard");
  };

  const handleAiImage = (e) => {
    const file = e.target.files[0];
    if (file) setAiImage(URL.createObjectURL(file));
  };

  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (file) setBgImage(URL.createObjectURL(file));
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden text-white bg-black"
      onMouseMove={() => setShowControls(true)}
    >
      {cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <span className="text-lg font-semibold text-white/80">Camera is Off</span>
        </div>
      )}

      {bgImage && (
        <img
          src={bgImage}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      {subtitle && (
        <div className="absolute left-1/2 bottom-32 z-20 w-[min(92vw,640px)] -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-6 py-3 text-center text-lg font-medium text-white shadow-2xl backdrop-blur transition-all duration-200">
          {subtitle}
        </div>
      )}

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-4 md:flex-row md:items-end lg:top-6 lg:right-6">
        <div className="flex-1 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl shadow-xl sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">AI Avatar</p>
          <div className="mt-3 h-40 overflow-hidden rounded-3xl bg-black/20 border border-white/10">
            {aiImage ? (
              <img src={aiImage} alt="AI avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/40">AI Avatar</div>
            )}
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl shadow-xl sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-white/40">Your camera</p>
          <div className="mt-3 h-40 overflow-hidden rounded-3xl bg-black/20 border border-white/10">
            {cameraOn ? (
              <video
                ref={userVideoRef}
                autoPlay
                muted
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/40">Camera Off</div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute left-4 right-4 bottom-24 z-20 sm:left-6 sm:right-auto sm:max-w-sm lg:left-6 lg:right-auto">
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl shadow-2xl transition-all duration-200">
          <div className="max-h-64 overflow-y-auto pr-2">
            <div className="flex flex-col-reverse gap-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                    msg.role === "user" ? "self-end bg-cyan-500/80 text-white" : "self-start bg-white/10 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-4 right-4 bottom-4 z-20 flex flex-col gap-3 sm:left-6 sm:right-6 sm:flex-row sm:justify-center lg:left-auto lg:right-6 lg:bottom-6">
        <button
          onClick={toggleCamera}
          className={`min-h-11 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 ${cameraOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white hover:bg-red-400'}`}
        >
          {cameraOn ? "Camera On" : "Camera Off"}
        </button>

        <button
          onClick={toggleMic}
          className={`min-h-11 rounded-full px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 ${micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white hover:bg-red-400'}`}
        >
          {micOn ? "Mic On" : "Mic Off"}
        </button>

        <button
          onClick={endMeeting}
          className="min-h-11 rounded-full bg-red-500 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-400"
        >
          End Meeting
        </button>
      </div>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/90 backdrop-blur-xl shadow-lg">
          <span className="font-semibold">Live</span>
        </div>
        <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-mono text-white/90 backdrop-blur-xl shadow-lg">
          {formatMeetingTime()}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <label className="flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/90 transition-all duration-200 hover:bg-white/10">
          Upload AI Avatar
          <input type="file" hidden onChange={handleAiImage} />
        </label>
        <label className="flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/90 transition-all duration-200 hover:bg-white/10">
          Change Background
          <input type="file" hidden onChange={handleBgChange} />
        </label>
      </div>
    </div>
  );
}