'use client'
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    AudioOutlined, VideoCameraOutlined, PhoneOutlined, SendOutlined,
    ThunderboltFilled, LoadingOutlined, CheckCircleFilled, CloseCircleFilled,
} from '@ant-design/icons';
import { Button, Avatar, Spin, Card, Typography, Alert } from 'antd';
import { getInterviewByIdApi } from '@/app/api/candidate/interview.api';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { GetInterviewDataByIdApiResponse } from '@/constants/Interfaces/Types/Jobs.interface';
import ReadyInterviewStatus from '@/component/interview/interview-status/ReadyInterviewStatus';

const { Title, Paragraph } = Typography;

type InterviewState =
    | "IDLE"                // waiting to start
    | "PLAYING_TTS"        // asking question
    | "RECORDING"          // MediaRecorder running
    | "UPLOADING"          // upload in progress
    | "UPLOADED"           // success
    | "ERROR";             // any failure


const LiveInterviewPage = () => {
    // --- STATUS: loading | ready | preview | active | completed | rejected ---
    const [status, setStatus] = useState<'loading' | 'ready' | 'preview' | 'active' | 'completed' | 'rejected'>('loading');
    const [interviewState, setInterviewState] = useState<InterviewState>('IDLE');
    const [questions, setQuestions] = useState<string[]>([]); // state to store the interview questions fetched from api
    const [interviewData, setInterviewData] = useState<GetInterviewDataByIdApiResponse | null>(null);
    const [interviewQuestion, setInterviewQuestion] = useState<string[]>([]); // state to store the interviewQuestions that are asked by the AI during the interview. 

    const [interviewAnswer, setInterviewAnswer] = useState<string[]>([]);

    const [answerValue, setAnswerValue] = useState<string>("");
    const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    // --- REFS (Crucial for hardware and timing) ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunkRef = useRef<Blob[]>([]);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // NEW: Use ref to track the current interview state for event handlers
    const interviewStateRef = useRef<InterviewState>('IDLE');

    const { interviewId } = useParams();

    // Update ref whenever state changes
    useEffect(() => {
        interviewStateRef.current = interviewState;
    }, [interviewState]);

    // Auto-scroll chat to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [interviewQuestion, interviewAnswer]);

    // Auto-focus and move cursor to end when answer value changes
    useEffect(() => {
        if (textAreaRef.current && answerValue) {
            const length = answerValue.length;
            textAreaRef.current.focus();
            textAreaRef.current.setSelectionRange(length, length);
        }
    }, [answerValue]);

    useEffect(() => {
        if (status === 'active' && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [status]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const fetchInterviewDetails = useCallback(async () => {
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
        setQuestions(interview?.questions);
        setInterviewData(interview);
        setStatus('ready');
    }, [interviewId]);

    // --- 1. INITIAL LOADING ---
    useEffect(() => {
        fetchInterviewDetails();
    }, [fetchInterviewDetails]);

    // --- 2. SPEECH RECOGNITION LOGIC (FIXED) ---
    const startSpeechRecognition = () => {
        // Stop any existing recognition first
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        const SpeechRecognition = window.SpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            // Use ref instead of state to get current value
            if (interviewStateRef.current === "RECORDING") {
                const transcript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join('');
                console.log("transcript", transcript);
                setAnswerValue(transcript);

                // Detect if user is speaking
                const isFinal = event.results[event.results.length - 1].isFinal;
                setIsSpeaking(!isFinal);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            console.log("Speech recognition ended");
            recognitionRef.current = null;
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    // --- 3. SPEECH SYNTHESIS ---
    const speakQuestion = (question: string) => {
        setInterviewState("PLAYING_TTS");
        console.log("speak questions");
        setInterviewQuestion(prev => [...prev, question]);

        const utterance = new SpeechSynthesisUtterance(question);
        utterance.lang = 'en-US';
        utterance.rate = 1;

        utterance.onend = () => {
            console.log("AI finished speaking. Opening mic...");
            // Update state and start recording
            setInterviewState("RECORDING");
            startRecording();
            startSpeechRecognition();
        };

        window.speechSynthesis.speak(utterance);
    };

    // --- 4. RECORDING LOGIC ---
    const startRecording = () => {
        const stream = streamRef.current;
        if (!stream) return;

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
        } catch (err) {
            console.error("Recorder start failed", err);
        }
    };

    const stopRecordingAndDownload = () => {
        setInterviewState("UPLOADING");

        if (recorderRef.current && recorderRef.current.state !== "inactive") {
            recorderRef.current.stop();
            // upload recording to the backend api call...
            // download the video
            const blob = new Blob(chunkRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `interview_answer_${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }

        setInterviewState("UPLOADED");
    };
    // --- 6. INTERVIEW FLOW CONTROL ---
    const startCameraPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            streamRef.current = stream;
            setStatus('active');
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error('Access Denied:', err);
            setStatus('rejected');
        }
    };

    window.onbeforeunload = () => {
        if (status === 'active') {
            return "Refreshing or leaving the page will disqualify you from the interview.";
        }
        return undefined;
    }

    const handleBeginInterview = () => {
        console.log("starting interview");
        setInterviewStarted(true);
        speakQuestion(questions[0]);
    }

    const handleSendAnswer = () => {
        // Stop recognition first
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        stopRecordingAndDownload();

        // Save current answer
        const currentAnswer = answerValue;
        setInterviewAnswer(prev => [...prev, currentAnswer]);

        // Clear answer value and AI text immediately
        setAnswerValue("");

        const nextIndex = interviewAnswer.length + 1;

        if (nextIndex < questions.length) {
            // Small delay to ensure state is cleared before next question
            setTimeout(() => {
                speakQuestion(questions[nextIndex]);
            }, 100);
        } else {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setStatus('completed');
        }
    };

    // --- RENDER LOGIC ---

    if (status === 'loading') {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white">
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                <Title level={4} className="mt-6">Loading Interview Portal...</Title>
            </div>
        );
    }

    if (status === 'rejected') {
        return (
            <div className="h-screen flex items-center justify-center bg-red-50 p-4">
                <Card className="max-w-[450px] shadow-2xl rounded-2xl text-center border-red-200">
                    <CloseCircleFilled className="text-6xl text-red-500 mb-4" />
                    <Title level={3}>Access Denied</Title>
                    <Paragraph className="text-gray-600">
                        Camera and Microphone access are required to proceed.
                    </Paragraph>
                    <Button type="primary" danger onClick={() => window.location.reload()}>Reload & Grant Access</Button>
                </Card>
            </div>
        );
    }

    if (status === 'ready') {
        return (
            <ReadyInterviewStatus
                logoUrl={interviewData?.companyId.logoUrl || ""}
                companyName={interviewData?.companyId.companyName || ""}
                startCameraPreview={startCameraPreview}
            />
        );
    }

    if (status === 'completed') {
        return (
            <div className="h-screen flex items-center justify-center bg-white p-4">
                <Card className="max-w-[500px] w-full shadow-2xl rounded-3xl text-center border-none p-10">
                    <CheckCircleFilled className="text-7xl text-green-500 mb-6" />
                    <Title level={2}>Interview Submitted</Title>
                    <Paragraph className="text-lg text-gray-500 mb-8">
                        Your session has been recorded and sent to {interviewData?.companyId.companyName} for review.
                    </Paragraph>
                    <Button size="large" type="primary" className="rounded-xl px-12 h-12" onClick={() => window.close()}>Exit Portal</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen md:max-h-[86vh] flex flex-col items-center overflow-hidden bg-gray-50 md:p-4">
            <div className="flex flex-col md:flex-row w-full max-w-[1100px] h-full md:h-[650px] border-none md:border-[1px] md:border-gray-200 md:rounded-[24px] overflow-hidden bg-white shadow-2xl">

                {/* Video Section */}
                <div className="relative h-[40%] md:h-full md:w-1/2 bg-black flex justify-center items-center shrink-0">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />

                    {interviewStarted && (
                        <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Recording Answer</span>
                        </div>
                    )}

                    <div className="absolute bottom-6 bg-black/50 backdrop-blur-md p-2 rounded-full flex gap-3 z-10">
                        <Button shape="circle" size="large" icon={<VideoCameraOutlined />} ghost />
                        <Button
                            onClick={handleBeginInterview}
                            shape="circle"
                            size="large"
                            icon={<PhoneOutlined rotate={225} />}
                            danger
                            type="primary"
                            disabled={interviewStarted}
                        />
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex flex-col h-[60%] md:h-full md:w-1/2 border-l border-gray-100">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <Avatar shape="square" src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" />
                            <div>
                                <div className="font-bold text-sm">IBM Recruitment AI</div>
                                <div className="text-green-500 text-[10px] flex items-center font-bold tracking-tighter uppercase">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" /> Interview in progress
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto bg-[#fafafa] space-y-4" ref={chatContainerRef}>
                        {!interviewStarted && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <Alert
                                        message="Ready to Begin"
                                        description="Click the red phone button below to start your interview. Please speak clearly and a bit loudly for better speech recognition."
                                        type="info"
                                        showIcon
                                        className="mb-4 rounded-xl"
                                    />
                                    <Paragraph className="text-gray-500 text-xs">
                                        💡 Tip: Ensure you&apos;re in a quiet environment for best results
                                    </Paragraph>
                                </div>
                            </div>
                        )}
                        {interviewQuestion.map((q, i) => (
                            <React.Fragment key={i}>
                                <div className="flex gap-3 max-w-[90%] animate-fadeIn">
                                    <Avatar className="bg-blue-600 shrink-0" icon={<ThunderboltFilled />} />
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-[13px] border border-gray-100">
                                        {q}
                                    </div>
                                </div>
                                {interviewAnswer[i] && (
                                    <div className="flex flex-col items-end animate-fadeIn">
                                        <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md text-[13px] max-w-[90%]">
                                            {interviewAnswer[i]}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="relative">
                            <div className="absolute left-3 top-1/4 -translate-y-1/2 z-10">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isSpeaking && interviewState === "RECORDING"
                                    ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse'
                                    : interviewState === "PLAYING_TTS"
                                        ? 'bg-gray-300'
                                        : interviewState === "RECORDING"
                                            ? 'bg-blue-400'
                                            : 'bg-gray-200'
                                    }`}>
                                    <AudioOutlined
                                        className={`text-lg ${isSpeaking && interviewState === "RECORDING"
                                            ? 'text-white'
                                            : interviewState === "PLAYING_TTS"
                                                ? 'text-gray-500'
                                                : interviewState === "RECORDING"
                                                    ? 'text-white'
                                                    : 'text-gray-500'
                                            }`}
                                    />
                                </div>
                            </div>
                            <textarea
                                ref={textAreaRef}
                                placeholder={
                                    interviewState === "PLAYING_TTS"
                                        ? "AI is speaking..."
                                        : interviewState === "RECORDING"
                                            ? "Listening for your response..."
                                            : "Waiting to start..."
                                }
                                className="w-full rounded-2xl py-3 pl-16 pr-4 bg-gray-50 border-none text-[13px] resize-none min-h-[50px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={interviewState === "PLAYING_TTS" ? "AI is speaking..." : answerValue}
                                onChange={(e) => {
                                    if (interviewState === "RECORDING") {
                                        setAnswerValue(e.target.value);
                                    }
                                }}
                                rows={4}
                                disabled={interviewState === "PLAYING_TTS"}
                            />
                            <div className="mt-3 flex justify-end">
                                <Button
                                    onClick={handleSendAnswer}
                                    disabled={interviewState !== "RECORDING" || answerValue.trim() === ""}
                                    type="primary"
                                    shape="round"
                                    icon={<SendOutlined />}
                                    className="bg-blue-600"
                                    size="large"
                                >
                                    Next Question
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveInterviewPage;