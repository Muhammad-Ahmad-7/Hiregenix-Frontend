import { useCallback, useEffect, useRef, useState } from "react";

export interface AiMetrics {
    faceVisible: boolean;
    multipleFaces: boolean;
    blinkDetected: boolean;
    blinkCount: number;
    headLeft: boolean;
    headRight: boolean;
    headDirection: string;
    livenessPassed: boolean;
    blinkScoreLeft: number;
    blinkScoreRight: number;
    status: string;
}

const DEFAULT_METRICS: AiMetrics = {
    faceVisible: false,
    multipleFaces: false,
    blinkDetected: false,
    blinkCount: 0,
    headLeft: false,
    headRight: false,
    headDirection: "NONE",
    livenessPassed: false,
    blinkScoreLeft: 0,
    blinkScoreRight: 0,
    status: "CHECKING",
};

export const useInterviewAI = (
    videoRef: React.RefObject<HTMLVideoElement>,
    enabled = true,
) => {
    const workerRef = useRef<Worker | null>(null);
    const isReadyRef = useRef(false);
    const enabledRef = useRef(enabled);
    const metricsRef = useRef<AiMetrics>(DEFAULT_METRICS);

    const [isReady, setIsReady] = useState(false);
    const [aiMetrics, setAiMetrics] = useState<AiMetrics>(DEFAULT_METRICS);

    useEffect(() => {
        enabledRef.current = enabled;
    }, [enabled]);

    const resetAiMetrics = useCallback(() => {
        metricsRef.current = DEFAULT_METRICS;
        setAiMetrics(DEFAULT_METRICS);
        workerRef.current?.postMessage({ type: "RESET_LIVENESS" });
    }, []);

    useEffect(() => {
        const worker = new Worker("/mediapipe-worker.js");
        workerRef.current = worker;

        worker.onmessage = (e) => {
            if (e.data.type === "READY") {
                isReadyRef.current = true;
                setIsReady(true);
            }

            if (e.data.type === "RESULTS") {
                metricsRef.current = e.data.metrics;
                setAiMetrics(e.data.metrics);

                console.debug(
                    `[AI] blinks: ${e.data.metrics.blinkCount}`,
                    `| eyeL: ${e.data.metrics.blinkScoreLeft.toFixed(2)}`,
                    `| eyeR: ${e.data.metrics.blinkScoreRight.toFixed(2)}`,
                    `| head: ${e.data.metrics.headDirection}`,
                    `| live: ${e.data.metrics.livenessPassed}`,
                );
            }
        };

        const THROTTLE_MS = 100;
        let lastProcessedTime = 0;
        let animationId: number;

        const processLoop = async (time: number) => {
            const video = videoRef.current;

            if (
                video &&
                isReadyRef.current &&
                enabledRef.current &&
                video.readyState >= 2 &&
                video.videoWidth > 0 &&
                !video.paused &&
                time - lastProcessedTime > THROTTLE_MS
            ) {
                try {
                    const bitmap = await createImageBitmap(video);

                    worker.postMessage(
                        { type: "PROCESS_FRAME", image: bitmap, timestamp: performance.now() },
                        [bitmap],
                    );

                    lastProcessedTime = time;
                } catch (err) {
                    console.warn("Frame capture skipped:", err);
                }
            }

            animationId = requestAnimationFrame(processLoop);
        };

        animationId = requestAnimationFrame(processLoop);

        return () => {
            cancelAnimationFrame(animationId);
            worker.terminate();
        };
    }, [videoRef]);

    return { aiMetrics, metricsRef, isAiReady: isReady, resetAiMetrics };
};
