'use client';
import { useRef, useCallback } from 'react';

export function useMediaRecorder(streamRef: React.RefObject<MediaStream | null>) {
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(() => {
        if (!streamRef.current) return;
        chunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current, {
            mimeType: 'video/webm;codecs=vp8,opus',
            videoBitsPerSecond: 1_500_000,
        });
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.start(100);
        recorderRef.current = recorder;
    }, [streamRef]);

    const stopRecording = useCallback((): Promise<Blob> => {
        return new Promise((resolve) => {
            if (!recorderRef.current || recorderRef.current.state === 'inactive') {
                resolve(new Blob(chunksRef.current, { type: 'video/webm' }));
                return;
            }
            recorderRef.current.onstop = () => {
                resolve(new Blob(chunksRef.current, { type: 'video/webm' }));
            };
            recorderRef.current.stop();
        });
    }, []);

    return { startRecording, stopRecording };
}