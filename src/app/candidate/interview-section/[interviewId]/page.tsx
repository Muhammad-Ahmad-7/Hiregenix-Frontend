'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AudioOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Typography, Progress } from 'antd';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { createInterviewQuestionResultApi, createInterviewQuestionResultForSkipQuestionApi, getInterviewByIdApi } from '@/app/api/candidate/interview.api';
import { useInterviewAI } from '@/hooks/useInterviewAI';
import AIFrameMonitor from '@/component/interview/AIFrameMonitor';

const { Text } = Typography;

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
}

const LiveInterviewPage = () => {

    const [interviewState, setInterviewState] = useState<InterviewStateType
    >({
        isRecording: false,
        isSpeaking: false,
        currentQuestionIndex: 0,
        currentQuestion: '',
        interviewQuestions: [],
        timeLeft: 120, // 2 minutes for recording
        waitTimeLeft: 5, // 5 seconds to start recording
        showWaitTimer: false,
        hasSpokenCurrent: false,
        isUploading: false,
    });

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
    const waitTimerRef = useRef<NodeJS.Timeout | null>(null);
    const chunkRef = useRef<Blob[]>([]);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const suspicionRef = useRef(0);
    const isSkippingRef = useRef(false);

    const { aiMetrics } = useInterviewAI(videoRef)

    const { interviewId } = useParams();

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!interviewId) {
                toast.error("Interview ID is missing.");
                return;
            }
            if (typeof interviewId !== 'string') {
                console.error("interviewId is not of type string");
                return;
            }
            const res = await getInterviewByIdApi(interviewId);
            if (!res) {
                toast.error("Failed to fetch interview details.");
                return;
            }
            if (res.status === "Failed") {
                toast.error(res.message || "Failed to fetch interview details.");
                return;
            }
            const interview = res.data?.interview;
            if (!interview) {
                toast.error("Interview data is missing.");
                return;
            }
            setInterviewState(prev => ({ ...prev, interviewQuestions: interview?.questions }));
            setInterviewState(prev => ({ ...prev, currentQuestion: interview?.questions[0] }));
        }

        fetchQuestions();
    }, [interviewId]);

    // Initialize camera
    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
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
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (recordTimerRef.current) clearInterval(recordTimerRef.current);
            if (waitTimerRef.current) clearInterval(waitTimerRef.current);
            window.speechSynthesis.cancel();

        };
    }, []);

    const moveToNextQuestion = useCallback(() => {
        stopWaitTimer();

        if (interviewState.currentQuestionIndex < interviewState.interviewQuestions.length - 1) {
            const nextIndex = interviewState.currentQuestionIndex + 1;
            setInterviewState(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
            setInterviewState(prev => ({ ...prev, currentQuestion: interviewState.interviewQuestions[nextIndex] }))
        } else {
            toast.success('Interview completed!');
            // Handle interview completion
        }
    }, [interviewState.currentQuestionIndex, interviewState.interviewQuestions]);

    //TODO: call the api for skip questions
    const handleSkipQuestion = useCallback(async () => {

        if (isSkippingRef.current) return;
        isSkippingRef.current = true;

        const interviewIdString = typeof interviewId === 'string' ? interviewId : interviewId?.[0];
        if (!interviewIdString) {
            toast.error("Interview ID is invalid");
            return;
        }
        const res = await createInterviewQuestionResultForSkipQuestionApi({
            interviewId: interviewIdString,
            questionId: String(interviewState.currentQuestionIndex + 1),
            questionText: interviewState.currentQuestion,
        })

        if (res?.status === "Failed") {
            console.log("FAILED");
        }

        moveToNextQuestion()
        isSkippingRef.current = false;

    }, [interviewState.currentQuestionIndex, interviewState.currentQuestion, interviewId, moveToNextQuestion])

    const startWaitTimer = useCallback(() => {
        setInterviewState(prev => ({ ...prev, showWaitTimer: true, waitTimeLeft: 5 }));


        waitTimerRef.current = setInterval(() => {
            setInterviewState(prev => {
                const newWaitTimeLeft = prev.waitTimeLeft <= 1 ? 0 : prev.waitTimeLeft - 1;
                if (newWaitTimeLeft === 0) {
                    console.log("user skip it");
                    // if user does not answer the question then upload it as empty means user skip that question
                    handleSkipQuestion()
                }
                return {
                    ...prev, waitTimeLeft: newWaitTimeLeft
                }
            })
        }, 1000);
    }, [handleSkipQuestion]);

    const speakQuestion = useCallback((question: string) => {
        if (!question) return;

        // Stop EVERYTHING first
        window.speechSynthesis.cancel();
        stopWaitTimer();

        // setIsSpeaking(true);
        setInterviewState(prev => ({ ...prev, isSpeaking: true }));

        const utterance = new SpeechSynthesisUtterance(question);
        utterance.lang = 'en-US';
        utterance.rate = 0.95;
        utterance.pitch = 1;

        // Store this instance
        utteranceRef.current = utterance;

        utterance.onend = () => {
            // ONLY react if this is the latest utterance
            if (utteranceRef.current === utterance) {
                // setIsSpeaking(false);
                setInterviewState(prev => ({ ...prev, isSpeaking: false }));
                startWaitTimer();
            }
        };

        utterance.onerror = () => {
            if (utteranceRef.current === utterance) {
                // setIsSpeaking(false);
                setInterviewState(prev => ({ ...prev, isSpeaking: false }));
                startWaitTimer();
            }
        };

        window.speechSynthesis.speak(utterance);

    }, [startWaitTimer]);

    // Speak question when it changes
    useEffect(() => {
        if (!interviewState.currentQuestion) return;

        // Reset spoken flag whenever question changes
        setInterviewState(prev => ({ ...prev, hasSpokenCurrent: false }));
    }, [interviewState.currentQuestion]);

    useEffect(() => {
        if (interviewState.currentQuestion && !interviewState.isRecording && !interviewState.hasSpokenCurrent) {
            speakQuestion(interviewState.currentQuestion);
            setInterviewState(prev => ({ ...prev, hasSpokenCurrent: true }));
        }
    }, [interviewState.currentQuestion, interviewState.isRecording, interviewState.hasSpokenCurrent, speakQuestion]);

    // Tab switch handling
    useEffect(() => {
        const onViolation = (type: string) => {
            console.log("TYPE:", type)
            suspicionRef.current += 1;
        };

        const handleVisibilityChange = () => {
            if (document.hidden) onViolation("tab-switch");
        };

        // const handleBlur = () => {
        //     onViolation("window-blur");
        // };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        // window.addEventListener("blur", handleBlur);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            // window.removeEventListener("blur", handleBlur);
        };
    }, []);

    const stopWaitTimer = () => {
        if (waitTimerRef.current) {
            clearInterval(waitTimerRef.current);
            waitTimerRef.current = null;
        }
        setInterviewState(prev => ({ ...prev, showWaitTimer: false }));
        setInterviewState(prev => ({ ...prev, waitTimeLeft: 5 }));
    };

    const handleStartRecording = () => {
        const stream = streamRef.current;
        if (!stream) return;

        // Stop wait timer when user starts recording
        stopWaitTimer();
        chunkRef.current = [];

        try {
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8,opus',
                videoBitsPerSecond: 1500000
            });
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunkRef.current.push(event.data);
            };

            recorder.start(1000);
            recorderRef.current = recorder;
            // setIsRecording(true);
            setInterviewState(prev => ({ ...prev, isRecording: true }));
            setInterviewState(prev => ({ ...prev, timeLeft: 120 }));
        } catch (err) {
            console.error('Recording failed:', err);
            toast.error('Failed to start recording');
        }
    };

    const handleStopRecording = useCallback(async () => {
        console.log("stop recording")
        setInterviewState(prev => ({ ...prev, isUploading: true }));

        if (!recorderRef.current || recorderRef.current.state === "inactive") {
            console.warn("No active recording to stop");
            return;
        }
        recorderRef.current.stop();
        if (recordTimerRef.current) {
            clearInterval(recordTimerRef.current);
        }

        // Verify we have chunks to upload
        if (chunkRef.current.length === 0) {
            console.warn("No recording chunks collected");
            throw new Error("No recording data available");
        }

        const blob = new Blob(chunkRef.current, { type: 'video/webm' });

        // Verify blob has content
        if (blob.size === 0) {
            console.error("Recording blob is empty");
            throw new Error("Recording is empty");
        }

        console.log(`Recording blob size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
        setInterviewState(prev => ({ ...prev, isRecording: false }));

        console.log("Tab switch", suspicionRef.current);
        suspicionRef.current = 0;
        // Api Calls
        const interviewIdString = typeof interviewId === 'string' ? interviewId : interviewId?.[0];
        if (!interviewIdString) {
            toast.error("Interview ID is invalid");
            return;
        }
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: 'video/webm' });
        const res = await createInterviewQuestionResultApi({
            interviewId: interviewIdString,
            questionId: String(interviewState.currentQuestionIndex + 1),
            questionText: interviewState.currentQuestion,
            numberOfTabSwitch: suspicionRef.current,
            file
        })
        console.log("INTERVIEW RES ", res)

        setInterviewState(prev => ({ ...prev, isUploading: false }));


        // if (res === null) {
        //     toast.error("Failed to submit your answer, Please try later with the interview.");
        // }

        if (res?.status === "Failed") {
            console.log("FAILED");
            // toast.error(res.message || "Failed to submit your answer, Please try later with the interview.")
            // return;
        }

        if (res?.status === "Success") {
            toast.success("Answer submitted successfully")
            // Move to next question after stopping
        }
        moveToNextQuestion();
        // download the file locally

        // Create download link
        // const url = URL.createObjectURL(blob);

        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `recording_${Date.now()}.webm`;   // dynamic filename
        // document.body.appendChild(a);
        // a.click();

        // // Cleanup
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);

        // console.log("Video downloaded successfully");
    }, [moveToNextQuestion, interviewState.currentQuestionIndex, interviewId, interviewState.currentQuestion]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const waitProgress = ((5 - interviewState.waitTimeLeft) / 5) * 100;

    // Recording timer countdown
    useEffect(() => {
        if (interviewState.isRecording && interviewState.timeLeft > 0) {
            recordTimerRef.current = setInterval(() => {
                setInterviewState(prev => {
                    const newTimeLeft = prev.timeLeft <= 1 ? 0 : prev.timeLeft - 1;
                    if (newTimeLeft === 0) {
                        handleStopRecording();
                    }
                    return { ...prev, timeLeft: newTimeLeft };
                });
            }, 1000);
        }

        return () => {
            if (recordTimerRef.current) {
                clearInterval(recordTimerRef.current);
            }
        };
    }, [interviewState.isRecording, handleStopRecording, interviewState.timeLeft]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="flex flex-col md:flex-row w-full max-w-7xl h-[85vh] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">

                {/* Left: AI Monitor Section */}
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

                {/* Right: Interaction Section */}
                <div className="w-full md:w-1/2 h-[60vh] md:h-full flex flex-col p-8 md:p-12 overflow-y-auto">
                    {/* Your Question Card & Buttons go here */}
                    <div className="flex-1">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Question context</p>
                        <h2 className="text-2xl font-bold text-slate-800 leading-snug">
                            {interviewState.currentQuestion}
                        </h2>
                    </div>

                    {interviewState.showWaitTimer && !interviewState.isRecording && (
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
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

                    {/* Recording buttons as you already have them */}
                    {interviewState.isRecording && (
                        <div className="text-center bg-gray-100 rounded-xl p-4">
                            <Text className="text-sm text-gray-500 block mb-1">Time Remaining</Text>
                            <div className={`text-5xl font-bold ${interviewState.timeLeft < 30 ? 'text-red-500' : 'text-blue-600'}`}>
                                {formatTime(interviewState.timeLeft)}
                            </div>
                        </div>
                    )}
                    <div className="mt-8">

                        {/* Recording Button */}
                        {!interviewState.isRecording ? (
                            <Button
                                type="primary"
                                size="large"
                                block
                                icon={<AudioOutlined />}
                                onClick={handleStartRecording}
                                disabled={interviewState.isSpeaking}
                                className="h-14 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                {interviewState.isSpeaking ? 'Please wait...' :
                                    interviewState.isUploading ? "Uploading..." : 'Start Recording Answer'}
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