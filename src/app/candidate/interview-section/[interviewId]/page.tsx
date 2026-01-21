'use client'
import React, { useRef, useState, useEffect } from 'react';
import {
    AudioOutlined, VideoCameraOutlined, PhoneOutlined, SendOutlined,
    ThunderboltFilled, LoadingOutlined, CheckCircleFilled, WarningFilled, EyeOutlined, DesktopOutlined, CloseCircleFilled,
} from '@ant-design/icons';
import { Button, Input, Avatar, Spin, Card, Typography, Alert, List } from 'antd';

const { Title, Paragraph } = Typography;

const LiveInterviewPage = () => {
    // --- STATUS: loading | ready | preview | active | completed | rejected ---
    const [status, setStatus] = useState<'loading' | 'ready' | 'preview' | 'active' | 'completed' | 'rejected'>('loading');
    const [questions] = useState([
        "Can you tell me about yourself?",
        "Why are you interested in this position?",
        "What are your strengths and weaknesses?"
    ]);
    const [interviewQuestion, setInterviewQuestion] = useState<string[]>([]);
    const [interviewAnswer, setInterviewAnswer] = useState<string[]>([]);
    const [answerValue, setAnswerValue] = useState<string>("");
    const [volume, setVolume] = useState<number>(0);

    // --- REFS (Crucial for hardware and timing) ---
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunkRef = useRef<Blob[]>([]);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // --- 1. INITIAL LOADING ---
    useEffect(() => {
        const timer = setTimeout(() => setStatus('ready'), 2000);
        return () => {
            clearTimeout(timer);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, []);

    // --- 2. SPEECH RECOGNITION LOGIC ---
    const startSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join('');
            setAnswerValue(transcript);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    // --- 3. SPEECH SYNTHESIS & SYNC ---
    const speakQuestion = (question: string) => {
        setInterviewQuestion(prev => [...prev, question]);
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.lang = 'en-US';
        utterance.rate = 1;

        utterance.onend = () => {
            console.log("AI finished speaking. Opening mic...");
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
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
            recorderRef.current.stop();

            setTimeout(() => {
                const recordedBlob = new Blob(chunkRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(recordedBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `answer_${interviewAnswer.length + 1}.webm`;
                a.click();
            }, 500);
        }
    };

    // --- 5. AUDIO VISUALIZER LOGIC ---
    const startVolumeAnalysis = (stream: MediaStream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            setVolume(Math.round((average / 128) * 100));
            animationFrameRef.current = requestAnimationFrame(updateVolume);
        };

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        updateVolume();
    };

    // --- 6. INTERVIEW FLOW CONTROL ---
    const startCameraPreview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            streamRef.current = stream;
            setStatus('preview');
            startVolumeAnalysis(stream);

            setTimeout(() => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            }, 500);
        } catch (err) {
            console.error('Access Denied:', err);
            setStatus('rejected');
        }
    };

    const handleBeginInterview = () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
        setStatus('active');

        setTimeout(() => {
            if (videoRef.current && streamRef.current) {
                videoRef.current.srcObject = streamRef.current;
            }
            speakQuestion(questions[0]);
        }, 800);
    };

    const handleSendAnswer = () => {
        stopRecordingAndDownload();
        if (recognitionRef.current) recognitionRef.current.stop();

        setInterviewAnswer(prev => [...prev, answerValue]);
        const nextIndex = interviewAnswer.length + 1;
        setAnswerValue("");

        if (nextIndex < questions.length) {
            speakQuestion(questions[nextIndex]);
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
            <div className="h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
                <Card className="max-w-[600px] w-full shadow-xl rounded-3xl border-none p-6">
                    <div className="text-center mb-8">
                        <Avatar size={64} src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" />
                        <Title level={3} className="mt-4 italic text-blue-600">IBM Candidate Portal</Title>
                    </div>

                    <Alert
                        message="Strict Interview Rules"
                        description="Refreshing the page or switching tabs will result in immediate disqualification."
                        type="error"
                        showIcon
                        icon={<WarningFilled />}
                        className="mb-8 rounded-xl font-medium"
                    />

                    <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                        <Title level={5}>Instructions & Warnings:</Title>
                        <List split={false} className="space-y-2">
                            <List.Item className="p-0 border-none"><EyeOutlined className="mr-3 text-blue-500" /> Look directly into the camera lens.</List.Item>
                            <List.Item className="p-0 border-none"><DesktopOutlined className="mr-3 text-blue-500" /> Do not use external aids.</List.Item>
                            <List.Item className="p-0 border-none"><WarningFilled className="mr-3 text-red-500" /> Everything is recorded.</List.Item>
                        </List>
                    </div>

                    <Button type="primary" size="large" block onClick={startCameraPreview}
                        icon={<ThunderboltFilled />} className="h-14 rounded-xl text-lg bg-blue-600 font-bold hover:scale-[1.02] transition-transform">
                        Check Device Setup
                    </Button>
                </Card>
            </div>
        );
    }

    if (status === 'preview') {
        return (
            <div className="h-screen flex items-center justify-center bg-[#f0f2f5] p-4">
                <Card className="max-w-[700px] w-full shadow-2xl rounded-3xl border-none p-8 text-center">
                    <Title level={3} className="mb-2">Device Check</Title>
                    <Paragraph className="text-gray-500 mb-6">Confirm your camera and microphone are working correctly.</Paragraph>

                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-inner mb-6">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                        <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/20">
                            <div className="flex items-center gap-3">
                                <AudioOutlined className="text-white" />
                                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-75"
                                        style={{ width: `${Math.min(volume * 1.5, 100)}%` }}
                                    />
                                </div>
                                <span className="text-white text-[10px] font-mono">MIC CHECK</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button className="flex-1 h-12 rounded-xl" onClick={() => window.location.reload()}>Cancel</Button>
                        <Button type="primary" className="flex-1 h-12 rounded-xl bg-blue-600 font-bold" onClick={handleBeginInterview}>
                            Everything Looks Good
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (status === 'completed') {
        return (
            <div className="h-screen flex items-center justify-center bg-white p-4">
                <Card className="max-w-[500px] w-full shadow-2xl rounded-3xl text-center border-none p-10">
                    <CheckCircleFilled className="text-7xl text-green-500 mb-6" />
                    <Title level={2}>Interview Submitted</Title>
                    <Paragraph className="text-lg text-gray-500 mb-8">
                        Your session has been recorded and sent to IBM Talent Acquisition.
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

                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">Recording Answer</span>
                    </div>

                    <div className="absolute bottom-6 bg-black/50 backdrop-blur-md p-2 rounded-full flex gap-3 z-10">
                        <Button shape="circle" size="large" icon={<AudioOutlined />} ghost />
                        <Button shape="circle" size="large" icon={<VideoCameraOutlined />} ghost />
                        <Button onClick={handleSendAnswer} shape="circle" size="large" icon={<PhoneOutlined rotate={225} />} danger type="primary" />
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

                    <div className="flex-1 p-6 overflow-y-auto bg-[#fafafa] space-y-4">
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
                        <Input
                            placeholder="Listening to your response..."
                            className="rounded-2xl p-3 bg-gray-50 border-none text-[13px]"
                            value={answerValue}
                            onChange={(e) => setAnswerValue(e.target.value)}
                            suffix={
                                <Button
                                    onClick={handleSendAnswer}
                                    type="primary"
                                    shape="round"
                                    icon={<SendOutlined />}
                                    className="bg-blue-600"
                                >
                                    Next Question
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveInterviewPage;