'use client';

import React, { useRef, useState, useEffect, useCallback } from "react";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";

import { useCamera } from "@/hooks/useCamera";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { mockLivenessCheck } from "./mockVerificationApi";
import { useInterviewAI } from "@/hooks/useInterviewAI";
import { Button } from "antd";

type LivenessState =
    | "idle"
    | "countdown"
    | "recording"
    | "uploading"
    | "passed"
    | "failed";

interface Props {
    onPassed: () => void;
    interviewId: string;
}

const LivenessCheck: React.FC<Props> = ({ onPassed, interviewId }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const { streamRef, ready, start, stop } = useCamera(videoRef);
    const { startRecording, stopRecording } = useMediaRecorder(streamRef);

    // metricsRef gives us a non-stale snapshot inside callbacks
    const { aiMetrics, metricsRef, isAiReady } = useInterviewAI(videoRef);

    const [state, setState] = useState<LivenessState>("idle");
    const [countdown, setCountdown] = useState(3);
    // const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    // ── Camera lifecycle ──────────────────────────────────────────────────────
    useEffect(() => {
        start();
        return () => stop();
    }, [start, stop]);

    // ── Countdown → start recording ──────────────────────────────────────────
    useEffect(() => {
        if (state !== "countdown") return;

        if (countdown <= 0) {
            setState("recording");
            startRecording();
            return;
        }

        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [state, countdown, startRecording]);

    // ── Stop + submit once liveness passes ───────────────────────────────────
    const handleStopAndSubmit = useCallback(async () => {
        const blob = await stopRecording();
        // setVideoBlob(blob);
        setState("uploading");

        try {
            await mockLivenessCheck(blob, interviewId);

            // Read from ref — guaranteed fresh, no stale closure
            if (metricsRef.current.livenessPassed) {
                setState("passed");
            } else {
                setState("failed");
                setErrorMsg("Liveness check failed.");
            }
        } catch {
            setState("failed");
            setErrorMsg("Network error. Please retry.");
        }
    }, [stopRecording, interviewId, metricsRef]);

    // ── Trigger submit when liveness passes ──────────────────────────────────
    useEffect(() => {
        if (state === "recording" && aiMetrics.livenessPassed) {
            handleStopAndSubmit();
        }
    }, [aiMetrics.livenessPassed, state, handleStopAndSubmit]);

    // ── Fail immediately on multiple faces ───────────────────────────────────
    useEffect(() => {
        if (state === "recording" && aiMetrics.multipleFaces) {
            setState("failed");
            setErrorMsg("Multiple faces detected. Please ensure you are alone.");
        }
    }, [aiMetrics.multipleFaces, state]);

    // ── Instruction label ─────────────────────────────────────────────────────
    const getInstruction = () => {
        if (aiMetrics.blinkCount < 2) {
            return `Blink twice slowly (${aiMetrics.blinkCount}/2)`;
        }
        if (!aiMetrics.headLeft) return "Turn your head left";
        if (!aiMetrics.headRight) return "Turn your head right";
        return "Hold still…";
    };

    const handleBegin = () => {
        setCountdown(3);
        setState("countdown");
    };

    const handleRetry = () => {
        setErrorMsg("");
        // setVideoBlob(null);
        setState("idle");
    };

    // const handleDownload = () => {
    //     if (!videoBlob) return;
    //     const url = URL.createObjectURL(videoBlob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = `liveness_${Date.now()}.webm`;
    //     a.click();
    //     URL.revokeObjectURL(url);
    // };

    return (
        <div className="flex flex-col gap-6">

            <div>
                <h2 className="text-xl font-bold">Liveness Check</h2>
                <p className="text-sm text-slate-500">
                    Follow the on-screen instructions to verify your identity
                </p>
            </div>

            {/* ── Video frame ── */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />

                <ScanCorners />

                {/* Countdown */}
                {state === "countdown" && (
                    <Overlay>
                        <div className="text-6xl text-white font-bold drop-shadow-lg">
                            {countdown}
                        </div>
                    </Overlay>
                )}

                {/* Recording — instructions */}
                {state === "recording" && (
                    <>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap">
                            {getInstruction()}
                        </div>

                        {!aiMetrics.faceVisible && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-red-400 text-sm px-3 py-1 rounded-full">
                                Face not detected — move closer
                            </div>
                        )}

                        {/* Progress pills */}
                        <div className="absolute bottom-4 right-4 flex flex-col gap-1 items-end">
                            <Pill done={aiMetrics.blinkCount >= 2} label={`Blink (${aiMetrics.blinkCount}/2)`} />
                            <Pill done={aiMetrics.headLeft} label="Head left" />
                            <Pill done={aiMetrics.headRight} label="Head right" />
                        </div>
                    </>
                )}

                {/* Uploading */}
                {state === "uploading" && (
                    <Overlay>
                        <Spinner />
                        <p className="text-white text-sm mt-3">Verifying…</p>
                    </Overlay>
                )}

                {/* Passed */}
                {state === "passed" && (
                    <Overlay>
                        <CheckCircle2 className="text-green-400 w-14 h-14" />
                        <p className="text-white mt-3 font-medium">Liveness verified!</p>
                    </Overlay>
                )}

                {/* Failed */}
                {state === "failed" && (
                    <Overlay>
                        <XCircle className="text-red-400 w-14 h-14" />
                        <p className="text-white text-sm mt-3 text-center px-6">{errorMsg}</p>
                    </Overlay>
                )}
            </div>

            {/* ── Action buttons ── */}
            <div className="flex flex-col gap-3">
                {state === "idle" && (
                    <Button
                        type="primary"
                        onClick={handleBegin}
                        disabled={!ready || !isAiReady}
                        className="bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium"
                    >
                        {isAiReady ? "Begin Liveness Check" : "Loading AI…"}
                    </Button>
                )}

                {state === "passed" && (
                    <Button
                        type="primary"
                        onClick={onPassed}
                    >
                        Continue →
                    </Button>
                )}

                {state === "failed" && (
                    <Button
                        type="default"
                        onClick={handleRetry}
                        className="bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </Button>
                )}

                {/* {videoBlob && (
                    <button
                        onClick={handleDownload}
                        className="border py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
                    >
                        <Download size={16} />
                        Download Debug Video
                    </button>
                )} */}
            </div>
        </div>
    );
};

// ── Shared micro-components ───────────────────────────────────────────────────

export const Overlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-sm">
        {children}
    </div>
);

export const Spinner: React.FC = () => (
    <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-blue-400 animate-spin" />
);

export const ScanCorners: React.FC = () => (
    <>
        <div className="absolute top-3 left-3  w-5 h-5 border-t-2 border-l-2 border-blue-500 rounded-tl-md pointer-events-none z-10" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-blue-500 rounded-tr-md pointer-events-none z-10" />
        <div className="absolute bottom-3 left-3  w-5 h-5 border-b-2 border-l-2 border-blue-500 rounded-bl-md pointer-events-none z-10" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-blue-500 rounded-br-md pointer-events-none z-10" />
    </>
);

// Small progress indicator pill
const Pill: React.FC<{ done: boolean; label: string }> = ({ done, label }) => (
    <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${done
        ? "bg-green-500/80 text-white"
        : "bg-black/50 text-white/70"
        }`}>
        {done ? "✓" : "○"} {label}
    </div>
);

export default LivenessCheck;