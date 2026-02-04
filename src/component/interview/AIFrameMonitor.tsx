import React from 'react';
import { SoundOutlined, WarningOutlined, StopOutlined } from '@ant-design/icons';

interface AIFrameMonitorProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isSpeaking: boolean;
    isRecording: boolean;
    currentQuestionIndex: number;
    totalQuestions: number;
    aiMetrics: {
        faceVisible: boolean;
        multipleFaces: boolean;
    };
}

const AIFrameMonitor: React.FC<AIFrameMonitorProps> = ({
    videoRef,
    isSpeaking,
    isRecording,
    currentQuestionIndex,
    totalQuestions,
    aiMetrics,
}) => {
    return (
        <div className="relative w-full h-full bg-slate-950 overflow-hidden group rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            {/* 1. Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] transition-transform duration-1000 group-hover:scale-[1.03]"
            />

            {/* 2. Overlays & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

            {/* 3. Pure Tailwind Glassmorphism Warnings */}
            <div className="absolute inset-x-0 top-6 flex flex-col items-center gap-3 pointer-events-none z-50 px-6">

                {/* Face Detection Alert */}
                {!aiMetrics.faceVisible && (
                    <div className="w-full max-w-sm flex items-center gap-4 p-4 rounded-2xl border border-amber-500/40 bg-slate-900/70 backdrop-blur-md shadow-2xl animate-bounce">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <WarningOutlined className="text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">Face Not Detected</span>
                            <span className="text-slate-300 text-xs">Please stay centered in the camera.</span>
                        </div>
                    </div>
                )}

                {/* Multiple Faces Alert */}
                {aiMetrics.multipleFaces && (
                    <div className="w-full max-w-sm flex items-center gap-4 p-4 rounded-2xl border border-red-500/40 bg-slate-900/70 backdrop-blur-md shadow-2xl transition-all duration-500">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <StopOutlined className="text-xl" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">Integrity Alert</span>
                            <span className="text-slate-300 text-xs">Only one person should be present.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Status Badges (Left) */}
            <div className="absolute top-6 left-6 flex flex-col gap-2.5">
                {isSpeaking && (
                    <div className="flex items-center gap-2.5 bg-blue-600 px-4 py-2 rounded-full shadow-lg shadow-blue-900/40 transition-opacity">
                        <SoundOutlined className="text-white text-sm animate-pulse" />
                        <span className="text-white text-[11px] font-bold uppercase tracking-wider">AI Assistant</span>
                    </div>
                )}

                {isRecording && (
                    <div className="flex items-center gap-2.5 bg-red-600 px-4 py-2 rounded-full shadow-lg shadow-red-900/40 border border-red-400/20">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-white text-[11px] font-bold uppercase tracking-wider">Recording Live</span>
                    </div>
                )}
            </div>

            {/* 5. Question Counter (Right) */}
            <div className="absolute top-6 right-6">
                <div className="bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex flex-col items-end">
                    <span className="text-slate-400 text-[9px] uppercase font-black tracking-widest leading-none mb-1">Status</span>
                    <span className="text-white text-xs font-mono">
                        {currentQuestionIndex + 1} <span className="text-slate-500">/</span> {totalQuestions}
                    </span>
                </div>
            </div>

            {/* 6. System Status Indicator (Bottom) */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2.5 bg-slate-950/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
                <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-slate-300 text-[10px] font-bold tracking-tight">AI PROCTOR ACTIVE</span>
            </div>
        </div>
    );
};

export default AIFrameMonitor;