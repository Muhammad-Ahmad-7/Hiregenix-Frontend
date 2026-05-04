'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AudioOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Typography, Progress, Modal, Result, Input } from 'antd';
import { redirect, useParams, usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import {
    createInterviewQuestionResultApi,
    createInterviewQuestionResultForSkipQuestionApi,
    endInterviewApi,
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

    const [answerReceivedArray, setAnswerReceivedArray] = useState<number[]>([]); // New state to track received answers

    const [showInterviewEndModal, setShowInterviewEndModal] = useState(false); // State to control interview end modal visibility

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

    const [showEndInterviewModal, setShowEndInterviewModal] = useState(false);
    const [confirmEndText, setConfirmEndText] = useState("");
    const [endingInterview, setEndingInterview] = useState(false);

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
            return prev;
        });
        if (answerReceivedArray.length === interviewState.interviewQuestions.length - 1) {
            // toast.success('You have completed all questions! Thank you for your time.');
            setShowInterviewEndModal(true);
        }
    }, [stopWaitTimer, answerReceivedArray, interviewState.interviewQuestions]);

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
        // Update the state to reflect the skipped question as "answered" so it doesn't block interview completion
        setAnswerReceivedArray((prev) => [...prev, interviewState.currentQuestionIndex]);
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
        createInterviewQuestionResultApi({
            interviewId: interviewIdString,
            questionId: String(interviewState.currentQuestionIndex + 1),
            questionText: interviewState.currentQuestion,
            numberOfTabSwitch: suspicionRef.current,
            file,
        }).then((res) => {
            const status = res?.status === 'Success' ? 'success' : 'error';
            // toast[status](res?.message || (status === 'success' ? 'Answer submitted successfully' : 'Failed to submit answer'));
            if (status === 'success') {
                setAnswerReceivedArray((prev) => [...prev, interviewState.currentQuestionIndex]);
            }
        }).catch((err) => {
            console.error('Submission error:', err);
            toast.error('Failed to submit answer');
        });

        // console.log("State", interviewState);

        suspicionRef.current = 0;
        setInterviewState((prev) => ({ ...prev, isUploading: false }));

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


    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // 1. Handle Refresh/Tab Close (The code you already have)
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        // 2. Handle Browser Back/Forward
        // We push a "dummy" state to the history stack. 
        // When the user hits 'Back', they hit this dummy state instead of leaving.
        const handlePopState = () => {
            const confirmLeave = window.confirm(
                "Wait! Your interview progress will be lost if you leave. Are you sure?"
            );

            if (!confirmLeave) {
                // If they want to stay, push the state again to keep the "trap" active
                window.history.pushState(null, "", window.location.pathname);
            } else {
                // If they want to leave, we let them go (this is tricky in Next.js)
                window.history.back();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        // Initialize the history trap
        window.history.pushState(null, "", window.location.pathname);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [pathname, searchParams]); // Re-run if the route changes
    const formatTime = (s: number) =>
        `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const waitProgress = ((5 - interviewState.waitTimeLeft) / 5) * 100;
    const totalQuestions = interviewState.interviewQuestions.length || 1;
    const questionNumber = interviewState.currentQuestionIndex + 1;
    const interviewProgress = Math.round((questionNumber / totalQuestions) * 100);
    const statusLabel = interviewState.isRecording
        ? "Recording"
        : interviewState.isSpeaking
            ? "Listening"
            : "Ready";

    // ── RENDER: Verification gate ─────────────────────────────────────────────
    if (!isVerified) {
        return (
            <VerificationFlow
                onVerificationComplete={() => setIsVerified(true)}
                interviewId={interviewId ? (typeof interviewId === 'string' ? interviewId : interviewId[0]) : ''}
            />
        );
    }
    const handleEndInterview = async () => {
        setEndingInterview(true);
        const res = await endInterviewApi(typeof interviewId === 'string' ? interviewId : interviewId?.[0] || '')
        if (!res || res.status === 'Failed') {
            toast.error(res?.message || 'Failed to end interview.');
            setEndingInterview(false);
            return;
        }
        setEndingInterview(false);
        toast.success('Interview ended successfully.');
        setShowEndInterviewModal(false);
        redirect('/candidate/interview-section/'); // Redirect to dashboard or another page after ending interview
    }
    // ── RENDER: Interview ─────────────────────────────────────────────────────
    return (
        <div className="interview-page">
            <div className="interview-shell">
                <div className="interview-header">
                    <div>
                        <p className="interview-eyebrow">Live interview</p>
                        <h1 className="interview-title">Focused, AI-guided assessment</h1>
                        <p className="interview-subtitle">Answer clearly. Keep your video in frame for accurate scoring.</p>
                    </div>
                    <div className="interview-header-right">
                        <div className={`interview-status-pill ${interviewState.isRecording ? "is-recording" : ""}`}>
                            <span className="interview-status-dot" />
                            {statusLabel}
                        </div>
                        <div className="interview-progress">
                            <span>Question {questionNumber} / {totalQuestions}</span>
                            <Progress
                                percent={interviewProgress}
                                showInfo={false}
                                strokeColor={
                                    document.documentElement.getAttribute("data-theme") === "dark"
                                        ? "#60a5fa"
                                        : "#1677ff"
                                }
                                trailColor={
                                    document.documentElement.getAttribute("data-theme") === "dark"
                                        ? "#1f2937"
                                        : "#e5e7eb"
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="interview-body">
                    {/* Left: AI Monitor */}
                    <div className="interview-left">
                        <div className="interview-video-frame">
                            <AIFrameMonitor
                                videoRef={videoRef}
                                isSpeaking={interviewState.isSpeaking}
                                isRecording={interviewState.isRecording}
                                currentQuestionIndex={interviewState.currentQuestionIndex}
                                totalQuestions={interviewState.interviewQuestions.length}
                                aiMetrics={aiMetrics}
                            />
                        </div>
                    </div>

                    {/* Right: Interaction panel */}
                    <div className="interview-right">

                        {/* Question */}
                        <div className="interview-question">
                            <p className="interview-question-label">Question</p>
                            <h2 className="interview-question-text">
                                {interviewState.currentQuestion || 'Loading questions…'}
                            </h2>
                        </div>

                        {/* Wait timer */}
                        {interviewState.showWaitTimer && !interviewState.isRecording && (
                            <div className="wait-timer-card mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Text className="wait-timer-label text-sm text-yellow-700 font-medium">
                                        ⏳ Start recording or skip in:
                                    </Text>
                                    <Text className="wait-timer-value text-2xl font-bold text-yellow-600">
                                        {interviewState.waitTimeLeft}s
                                    </Text>
                                </div>
                                <Progress
                                    percent={waitProgress}
                                    strokeColor={
                                        document.documentElement.getAttribute("data-theme") === "dark"
                                            ? "#f59e0b"
                                            : "#eab308"
                                    }
                                    trailColor={
                                        document.documentElement.getAttribute("data-theme") === "dark"
                                            ? "#3f2f12"
                                            : "#fef3c7"
                                    }
                                    showInfo={false}
                                    strokeWidth={8}
                                />
                            </div>
                        )}

                        {/* Recording countdown */}
                        {interviewState.isRecording && (
                            <div className="recording-timer">
                                <Text className="recording-label">Time Remaining</Text>
                                <div
                                    className={`recording-time ${interviewState.timeLeft < 30 ? 'is-critical' : ''}`}
                                >
                                    {formatTime(interviewState.timeLeft)}
                                </div>
                            </div>
                        )}

                        {/* Record / Stop button */}
                        <div className="interview-controls">
                            {!interviewState.isRecording ? (
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    icon={<AudioOutlined />}
                                    onClick={handleStartRecording}
                                    disabled={interviewState.isSpeaking}
                                    className="interview-primary-button"
                                >
                                    {interviewState.isSpeaking
                                        ? 'Please wait…'
                                        : 'Start Recording Answer'}
                                </Button>
                            ) : (
                                <Button
                                    danger
                                    size="large"
                                    block
                                    icon={<StopOutlined />}
                                    onClick={handleStopRecording}
                                    className="interview-primary-button"
                                >
                                    Stop & Submit Answer
                                </Button>
                            )}

                            <Button
                                danger
                                size="large"
                                block
                                className="interview-secondary-button"
                                onClick={() => setShowEndInterviewModal(true)}
                            >
                                End Interview
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Interview end modal */}
                {showInterviewEndModal && (
                    <Modal
                        open={showInterviewEndModal}
                        onCancel={() => {
                            console.log("Modal closed by user");
                            setShowInterviewEndModal(false);
                        }}
                        footer={null} // Removing default footer for a cleaner look
                        centered
                        width={600}
                    >
                        <div style={{ padding: '20px 0' }}>
                            <Result
                                status="success"
                                title={<span style={{ fontWeight: 700, fontSize: '24px' }}>Interview Completed!</span>}
                                subTitle={
                                    <div style={{ fontSize: '16px', color: '#595959' }}>
                                        <Text>Thank you for completing your interview. We truly appreciate your time, presence, and patience throughout this process.</Text>
                                        <Text><strong>What&apos;s next?</strong> Our team is now reviewing your responses. You will receive an email notification once your evaluation is finalized.</Text>
                                    </div>
                                }
                                extra={[
                                    <Button
                                        type="primary"
                                        key="close"
                                        size="large"
                                        shape="round"
                                        style={{ padding: '0 40px', height: '45px', fontWeight: 600 }}
                                        onClick={() => {
                                            console.log("Close button clicked");
                                            setShowInterviewEndModal(false);
                                            redirect('/candidate/interview-section/'); // Redirect to dashboard or another page after closing modal
                                        }}
                                    >
                                        Got it, thanks!
                                    </Button>
                                ]}
                            />
                        </div>
                    </Modal>
                )}

                <Modal
                    open={showEndInterviewModal}
                    title="End Interview?"
                    onCancel={() => setShowEndInterviewModal(false)}
                    footer={null}
                    centered
                >
                    <div className="space-y-3 text-gray-700">

                        <p className="text-red-600 font-semibold">
                            ⚠️ This action is irreversible
                        </p>

                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li>You will NOT be able to continue this interview again</li>
                            <li>Your current progress will be permanently lost</li>
                            <li>Any unanswered questions will be marked as incomplete</li>
                            <li>Final Interview AI evaluation will not be generated.</li>
                        </ul>

                        <p className="text-sm text-gray-600">
                            Type <b>END</b> to confirm you want to stop the interview.
                        </p>

                        <Input
                            value={confirmEndText}
                            onChange={(e) => setConfirmEndText(e.target.value)}
                            placeholder="Type END"
                        />

                        <div className="flex gap-2 mt-4">
                            <Button
                                onClick={() => setShowEndInterviewModal(false)}
                                block
                            >
                                Cancel
                            </Button>

                            <Button
                                danger
                                block
                                loading={endingInterview}
                                disabled={confirmEndText !== "END"}
                                onClick={handleEndInterview}
                            >
                                Permanently End Interview
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default LiveInterviewPage;