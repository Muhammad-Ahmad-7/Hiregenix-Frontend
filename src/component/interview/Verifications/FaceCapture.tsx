'use client';
import React, { useRef, useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, CheckCircle2, XCircle, CameraIcon } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { Overlay, Spinner, ScanCorners } from './LivenessCheck';
import Image from 'next/image';
import { mockFaceVerification } from './mockVerificationApi';
import { Button } from 'antd';

type FaceState = 'idle' | 'captured' | 'uploading' | 'verified' | 'failed';

interface FaceCaptureProps {
    onVerified: () => void;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({ onVerified }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { ready, error: camError, start, stop } = useCamera(videoRef);

    const [faceState, setFaceState] = useState<FaceState>('idle');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        start();
        return () => stop();
    }, [start, stop]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Mirror the image to match the mirrored video preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedImage(dataUrl);
        setFaceState('captured');
    };

    const handleSubmit = async () => {
        if (!capturedImage) return;
        setFaceState('uploading');
        try {
            const res = await mockFaceVerification(capturedImage);
            if (res.faceVerified) {
                setFaceState('verified');
            } else {
                setFaceState('failed');
                setErrorMsg('Face could not be matched. Ensure your face is clearly visible and try again.');
            }
        } catch {
            setFaceState('failed');
            setErrorMsg('Network error — please retry.');
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setErrorMsg('');
        setFaceState('idle');
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Face Capture</h2>
                <p className="text-sm text-slate-500">
                    Centre your face in the frame and take a clear photo.
                </p>
            </div>

            {/* Camera / Preview box */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 ring-1 ring-slate-800">

                {/* Live video — shown only when idle */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${faceState === 'idle' ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* Captured image — shown after capture */}
                {capturedImage && faceState !== 'idle' && (
                    <Image
                        src={capturedImage}
                        alt="Captured face"
                        className="absolute inset-0 w-full h-full object-cover"
                        width={640}
                        height={480}
                    />
                )}

                {/* Face guide oval (idle only) */}
                {faceState === 'idle' && ready && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="w-[45%] h-[70%] rounded-full border-2 border-dashed border-white/40" />
                    </div>
                )}

                <ScanCorners />

                {/* Camera loading */}
                {!ready && faceState === 'idle' && (
                    <Overlay>
                        {camError ? (
                            <div className="flex flex-col items-center gap-3 px-6 text-center">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                                <p className="text-red-300 text-sm">{camError}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3">
                                <Spinner />
                                <p className="text-slate-300 text-sm">Starting camera…</p>
                            </div>
                        )}
                    </Overlay>
                )}

                {/* Uploading overlay — sits on top of captured image */}
                {faceState === 'uploading' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                        <Spinner />
                        <p className="text-slate-300 text-sm mt-3">Verifying identity…</p>
                    </div>
                )}

                {/* Verified overlay */}
                {faceState === 'verified' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-950/60 backdrop-blur-sm">
                        <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                        <p className="text-white text-sm font-semibold mt-3">Face verified!</p>
                    </div>
                )}

                {/* Failed overlay */}
                {faceState === 'failed' && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-950/60 backdrop-blur-sm">
                        <XCircle className="w-14 h-14 text-red-400" />
                        <p className="text-white text-sm mt-3 text-center px-8 leading-relaxed">{errorMsg}</p>
                    </div>
                )}
            </div>

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
                {faceState === 'idle' && (
                    <Button
                        type="primary"
                        onClick={handleCapture}
                        disabled={!ready}
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <CameraIcon className="w-4 h-4" />
                        {ready ? 'Capture Photo' : 'Waiting for camera…'}
                    </Button>
                )}

                {faceState === 'captured' && (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleRetake}
                            className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retake
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
                        >
                            Submit & Verify
                        </Button>
                    </div>
                )}

                {faceState === 'failed' && (
                    <Button
                        onClick={handleRetake}
                        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retake Photo
                    </Button>
                )}

                {faceState === 'verified' && (
                    <Button
                        onClick={onVerified}
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
                    >
                        Continue →
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FaceCapture;