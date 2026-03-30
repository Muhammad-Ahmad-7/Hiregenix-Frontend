'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AudioOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Typography, Progress } from 'antd';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

import {
    createInterviewQuestionResultApi,
    createInterviewQuestionResultForSkipQuestionApi,
    getInterviewByIdApi,
} from '@/app/api/candidate/interview.api';
import { useInterviewAI } from '@/hooks/useInterviewAI';
import AIFrameMonitor from '@/component/interview/AIFrameMonitor';
import VerificationFlow from '@/component/interview/Verifications/VerificationFlow';

// ─── Verification flow (gate) ─────────────────────────────────────────────────

const { Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

type InterviewStateType = {
    isRecording: boolean;
    isSpeaking: boolean;
    currentQuestionIndex: number;
    currentQuestion: string;
    interviewQuestions: string[];
    timeLeft: number;
    waitTimeLeft: number;
    showWaitTimer: boolean;
    hasSpokenCurrent: boolean;
    isUploading: boolean;
};

// ─── LiveInterviewPage ────────────────────────────────────────────────────────

const LiveInterviewPage = () => {
    // ── Verification gate ─────────────────────────────────────────────────────
    const [isVerified, setIsVerified] = useState(false);

    // ── Interview state ───────────────────────────────────────────────────────
    const [interviewState, setInterviewState] = useState<InterviewStateType>({
        isRecording: false,
        isSpeaking: false,
        currentQuestionIndex: 0,
        currentQuestion: '',
        interviewQuestions: [],
        timeLeft: 120,
        waitTimeLeft: 5,
        showWaitTimer: false,
        hasSpokenCurrent: false,
        isUploading: false,
    });

    // ── Refs ──────────────────────────────────────────────────────────────────
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
    const waitTimerRef = useRef<NodeJS.Timeout | null>(null);
    const chunkRef = useRef<Blob[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const suspicionRef = useRef(0);
    const isSkippingRef = useRef(false);

    const { aiMetrics } = useInterviewAI(videoRef);
    const { interviewId } = useParams();

    // ── Camera (interview phase — initialised only after verification) ─────────
    useEffect(() => {
        if (!isVerified) return; // don't touch camera until verified

        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Camera access denied:', err);
                toast.error('Please enable camera and microphone access');
            }
        };

        initCamera();

        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            if (recordTimerRef.current) clearInterval(recordTimerRef.current);
            if (waitTimerRef.current) clearInterval(waitTimerRef.current);
            window.speechSynthesis.cancel();
        };
    }, [isVerified]);

    // ── Fetch questions (uncomment when backend is ready) ─────────────────────
    useEffect(() => {
        if (!isVerified) return;

        const fetchQuestions = async () => {
            if (!interviewId) { toast.error('Interview ID is missing.'); return; }
            if (typeof interviewId !== 'string') { console.error('interviewId is not a string'); return; }

            const res = await getInterviewByIdApi(interviewId);
            if (!res || res.status === 'Failed') {
                toast.error(res?.message || 'Failed to fetch interview details.');
                return;
            }
            const interview = res.data?.interview;
            if (!interview) { toast.error('Interview data is missing.'); return; }

            setInterviewState((prev) => ({
                ...prev,
                interviewQuestions: interview.questions,
                currentQuestion: interview.questions[0],
            }));
        };

        fetchQuestions();
    }, [isVerified, interviewId]);

    // ── Tab-switch monitoring ──────────────────────────────────────────────────
    useEffect(() => {
        if (!isVerified) return;

        const handleVisibilityChange = () => {
            if (document.hidden) suspicionRef.current += 1;
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isVerified]);

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const stopWaitTimer = useCallback(() => {
        if (waitTimerRef.current) {
            clearInterval(waitTimerRef.current);
            waitTimerRef.current = null;
        }
        setInterviewState((prev) => ({ ...prev, showWaitTimer: false, waitTimeLeft: 5 }));
    }, []);

    const moveToNextQuestion = useCallback(() => {
        stopWaitTimer();
        setInterviewState((prev) => {
            if (prev.currentQuestionIndex < prev.interviewQuestions.length - 1) {
                const nextIndex = prev.currentQuestionIndex + 1;
                return {
                    ...prev,
                    currentQuestionIndex: nextIndex,
                    currentQuestion: prev.interviewQuestions[nextIndex],
                };
            }
            toast.success('Interview completed!');
            return prev;
        });
    }, [stopWaitTimer]);

    const handleSkipQuestion = useCallback(async () => {
        if (isSkippingRef.current) return;
        isSkippingRef.current = true;

        const interviewIdString = typeof interviewId === 'string' ? interviewId : interviewId?.[0];
        if (!interviewIdString) { toast.error('Interview ID is invalid'); return; }

        await createInterviewQuestionResultForSkipQuestionApi({
            interviewId: interviewIdString,
            questionId: String(interviewState.currentQuestionIndex + 1),
            questionText: interviewState.currentQuestion,
        });

        moveToNextQuestion();
        isSkippingRef.current = false;
    }, [interviewState.currentQuestionIndex, interviewState.currentQuestion, interviewId, moveToNextQuestion]);

    const startWaitTimer = useCallback(() => {
        setInterviewState((prev) => ({ ...prev, showWaitTimer: true, waitTimeLeft: 5 }));
        waitTimerRef.current = setInterval(() => {
            setInterviewState((prev) => {
                const newWait = prev.waitTimeLeft <= 1 ? 0 : prev.waitTimeLeft - 1;
                if (newWait === 0) handleSkipQuestion();
                return { ...prev, waitTimeLeft: newWait };
            });
        }, 1000);
    }, [handleSkipQuestion]);

    const speakQuestion = useCallback(
        (question: string) => {
            if (!question) return;
            window.speechSynthesis.cancel();
            stopWaitTimer();
            setInterviewState((prev) => ({ ...prev, isSpeaking: true }));

            const utterance = new SpeechSynthesisUtterance(question);
            utterance.lang = 'en-US';
            utterance.rate = 0.95;
            utteranceRef.current = utterance;

            utterance.onend = () => {
                if (utteranceRef.current === utterance) {
                    setInterviewState((prev) => ({ ...prev, isSpeaking: false }));
                    startWaitTimer();
                }
            };
            utterance.onerror = () => {
                if (utteranceRef.current === utterance) {
                    setInterviewState((prev) => ({ ...prev, isSpeaking: false }));
                    startWaitTimer();
                }
            };
            window.speechSynthesis.speak(utterance);
        },
        [startWaitTimer, stopWaitTimer]
    );

    // Reset spoken flag on question change
    useEffect(() => {
        if (!interviewState.currentQuestion) return;
        setInterviewState((prev) => ({ ...prev, hasSpokenCurrent: false }));
    }, [interviewState.currentQuestion]);

    // Auto-speak new question
    useEffect(() => {
        if (
            interviewState.currentQuestion &&
            !interviewState.isRecording &&
            !interviewState.hasSpokenCurrent
        ) {
            speakQuestion(interviewState.currentQuestion);
            setInterviewState((prev) => ({ ...prev, hasSpokenCurrent: true }));
        }
    }, [
        interviewState.currentQuestion,
        interviewState.isRecording,
        interviewState.hasSpokenCurrent,
        speakQuestion,
    ]);

    // ── Recording ─────────────────────────────────────────────────────────────

    const handleStartRecording = () => {
        const stream = streamRef.current;
        if (!stream) return;
        stopWaitTimer();
        chunkRef.current = [];
        try {
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8,opus',
                videoBitsPerSecond: 1_500_000,
            });
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunkRef.current.push(e.data);
            };
            recorder.start(1000);
            recorderRef.current = recorder;
            setInterviewState((prev) => ({ ...prev, isRecording: true, timeLeft: 120 }));
        } catch (err) {
            console.error('Recording failed:', err);
            toast.error('Failed to start recording');
        }
    };

    const handleStopRecording = useCallback(async () => {
        setInterviewState((prev) => ({ ...prev, isUploading: true }));

        if (!recorderRef.current || recorderRef.current.state === 'inactive') {
            console.warn('No active recording');
            return;
        }
        recorderRef.current.stop();
        if (recordTimerRef.current) clearInterval(recordTimerRef.current);

        if (chunkRef.current.length === 0) {
            console.warn('No recording chunks');
            return;
        }

        const blob = new Blob(chunkRef.current, { type: 'video/webm' });
        setInterviewState((prev) => ({ ...prev, isRecording: false }));

        const interviewIdString = typeof interviewId === 'string' ? interviewId : interviewId?.[0];
        if (!interviewIdString) { toast.error('Interview ID is invalid'); return; }

        const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'video/webm' });
        const res = await createInterviewQuestionResultApi({
            interviewId: interviewIdString,
            questionId: String(interviewState.currentQuestionIndex + 1),
            questionText: interviewState.currentQuestion,
            numberOfTabSwitch: suspicionRef.current,
            file,
        });

        suspicionRef.current = 0;
        setInterviewState((prev) => ({ ...prev, isUploading: false }));

        if (res?.status === 'Success') toast.success('Answer submitted successfully');

        moveToNextQuestion();
    }, [moveToNextQuestion, interviewState.currentQuestionIndex, interviewId, interviewState.currentQuestion]);

    // Auto-stop at time limit
    useEffect(() => {
        if (!interviewState.isRecording || interviewState.timeLeft <= 0) return;
        recordTimerRef.current = setInterval(() => {
            setInterviewState((prev) => {
                const newTime = prev.timeLeft <= 1 ? 0 : prev.timeLeft - 1;
                if (newTime === 0) handleStopRecording();
                return { ...prev, timeLeft: newTime };
            });
        }, 1000);
        return () => { if (recordTimerRef.current) clearInterval(recordTimerRef.current); };
    }, [interviewState.isRecording, handleStopRecording, interviewState.timeLeft]);

    const formatTime = (s: number) =>
        `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const waitProgress = ((5 - interviewState.waitTimeLeft) / 5) * 100;

    // ── RENDER: Verification gate ─────────────────────────────────────────────
    if (!isVerified) {
        return (
            <VerificationFlow
                onVerificationComplete={() => setIsVerified(true)}
                interviewId={interviewId ? (typeof interviewId === 'string' ? interviewId : interviewId[0]) : ''}
            />
        );
    }

    // ── RENDER: Interview ─────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="flex flex-col md:flex-row w-full max-w-7xl h-[85vh] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">

                {/* Left: AI Monitor */}
                <div className="w-full md:w-1/2 h-[40vh] md:h-full">
                    <AIFrameMonitor
                        videoRef={videoRef}
                        isSpeaking={interviewState.isSpeaking}
                        isRecording={interviewState.isRecording}
                        currentQuestionIndex={interviewState.currentQuestionIndex}
                        totalQuestions={interviewState.interviewQuestions.length}
                        aiMetrics={aiMetrics}
                    />
                </div>

                {/* Right: Interaction panel */}
                <div className="w-full md:w-1/2 h-[60vh] md:h-full flex flex-col p-8 md:p-12 overflow-y-auto">

                    {/* Question */}
                    <div className="flex-1">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                            Question context
                        </p>
                        <h2 className="text-2xl font-bold text-slate-800 leading-snug">
                            {interviewState.currentQuestion || 'Loading questions…'}
                        </h2>
                    </div>

                    {/* Wait timer */}
                    {interviewState.showWaitTimer && !interviewState.isRecording && (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <Text className="text-sm text-yellow-700 font-medium">
                                    ⏳ Start recording or skip in:
                                </Text>
                                <Text className="text-2xl font-bold text-yellow-600">
                                    {interviewState.waitTimeLeft}s
                                </Text>
                            </div>
                            <Progress
                                percent={waitProgress}
                                strokeColor="#eab308"
                                trailColor="#fef3c7"
                                showInfo={false}
                                strokeWidth={8}
                            />
                        </div>
                    )}

                    {/* Recording countdown */}
                    {interviewState.isRecording && (
                        <div className="text-center bg-gray-100 rounded-xl p-4 mt-4">
                            <Text className="text-sm text-gray-500 block mb-1">Time Remaining</Text>
                            <div
                                className={`text-5xl font-bold ${interviewState.timeLeft < 30 ? 'text-red-500' : 'text-blue-600'}`}
                            >
                                {formatTime(interviewState.timeLeft)}
                            </div>
                        </div>
                    )}

                    {/* Record / Stop button */}
                    <div className="mt-8">
                        {!interviewState.isRecording ? (
                            <Button
                                type="primary"
                                size="large"
                                block
                                icon={<AudioOutlined />}
                                onClick={handleStartRecording}
                                disabled={interviewState.isSpeaking || interviewState.isUploading}
                                className="h-14 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                {interviewState.isSpeaking
                                    ? 'Please wait…'
                                    : interviewState.isUploading
                                        ? 'Uploading…'
                                        : 'Start Recording Answer'}
                            </Button>
                        ) : (
                            <Button
                                danger
                                size="large"
                                block
                                icon={<StopOutlined />}
                                onClick={handleStopRecording}
                                className="h-14 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Stop & Submit Answer
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveInterviewPage;