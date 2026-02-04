// hooks/useInterviewAI.ts
import { useEffect, useRef, useState } from 'react';

export const useInterviewAI = (videoRef: React.RefObject<HTMLVideoElement>) => {
    const workerRef = useRef<Worker | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [aiMetrics, setAiMetrics] = useState({ faceVisible: true, multipleFaces: false });

    useEffect(() => {
        // 1. Initialize Worker
        const worker = new Worker('/mediapipe-worker.js');
        workerRef.current = worker;

        worker.onmessage = (e) => {
            if (e.data.type === 'READY') setIsReady(true);
            if (e.data.type === 'RESULTS') setAiMetrics(e.data.metrics);
        };

        // 2. Throttled Processing Loop
        let lastProcessedTime = 0;
        const THROTTLE_MS = 500; // Check every 0.5 seconds

        const processLoop = async (time: number) => {
            if (videoRef.current) {
                // CHECK 1: Ensure video is actually playing and has dimensions
                const isVideoReady =
                    videoRef.current.readyState >= 2 &&
                    videoRef.current.videoWidth > 0 &&
                    videoRef.current.paused === false;

                if (isVideoReady && isReady && time - lastProcessedTime > THROTTLE_MS) {
                    try {
                        // Capture the frame
                        const bitmap = await createImageBitmap(videoRef.current);

                        worker.postMessage({
                            type: 'PROCESS_FRAME',
                            image: bitmap,
                            timestamp: performance.now()
                        }, [bitmap]);

                        lastProcessedTime = time;
                    } catch (err) {
                        // This catches the 'InvalidStateError' silently
                        console.warn("Skipping frame capture:", err);
                    }
                }
            }
            requestAnimationFrame(processLoop);
        };

        const animationId = requestAnimationFrame(processLoop);
        return () => {
            cancelAnimationFrame(animationId);
            worker.terminate();
        };
    }, [isReady, videoRef]);

    return { aiMetrics, isAiReady: isReady };
};