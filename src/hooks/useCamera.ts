'use client';
import { useRef, useState, useCallback } from 'react';

export function useCamera(videoRef: React.RefObject<HTMLVideoElement>) {
    const streamRef = useRef<MediaStream | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const start = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' },
                audio: true,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setReady(true);
            setError(null);
        } catch {
            setError('Camera access denied. Please enable camera and microphone.');
        }
    }, [videoRef]);

    const stop = useCallback(() => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setReady(false);
    }, []);

    return { streamRef, ready, error, start, stop };
}