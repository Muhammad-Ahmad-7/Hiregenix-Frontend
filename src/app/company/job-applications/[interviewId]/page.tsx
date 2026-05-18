"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Alert,
    Button,
    Card,
    Collapse,
    Empty,
    Progress,
    Skeleton,
    Space,
    Tag,
    Typography,
} from "antd";
import { ArrowLeftOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { fetchQuestionsResultForInterview } from "@/app/api/candidate/interview.api";
import { InterviewQuestionResult } from "@/constants/Interfaces/Types/Jobs.interface";

const { Title, Text, Paragraph } = Typography;

type ReportOverview = {
    topStrengths?: string[];
    topWeaknesses?: string[];
    commonMissingConcepts?: string[];
    interviewSummary?: string | null;
};

type ReportResponse = {
    questionResults: InterviewQuestionResult[];
    reportUrl?: string | null;
    report?: ReportOverview;
};

type ReportPayload = {
    questionResults?: InterviewQuestionResult[];
    report?: ReportOverview & { pdfUrl?: string | null };
    reportUrl?: string | null;
    pdfUrl?: string | null;
    topStrengths?: string[];
    topWeaknesses?: string[];
    commonMissingConcepts?: string[];
    interviewSummary?: string | null;
};

type VideoMeta = {
    duration: number | null;
    current: number;
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const mapFluencyToPercent = (value?: string) => {
    if (!value) return 50;
    const normalized = value.toLowerCase();
    if (normalized.includes("excellent") || normalized.includes("strong")) return 90;
    if (normalized.includes("good") || normalized.includes("smooth") || normalized.includes("clear")) return 75;
    if (normalized.includes("average") || normalized.includes("moderate")) return 55;
    if (normalized.includes("poor") || normalized.includes("weak") || normalized.includes("choppy")) return 35;
    if (normalized.includes("fast") || normalized.includes("slow") || normalized.includes("inconsistent")) return 40;
    return 50;
};

const formatTime = (seconds: number | null) => {
    if (seconds === null || !Number.isFinite(seconds)) return "--:--";
    const safe = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const renderList = (items: string[] | undefined) => {
    if (!items || items.length === 0) return <Text type="secondary">No data available</Text>;

    return (
        <ul className="flex flex-col gap-2">
            {items.map((item, index) => (
                <li key={`${item}-${index}`} className="candidate-report-list-item flex items-start gap-2 text-sm">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.7)]" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
};

export default function CompanyInterviewReportPage({
    params,
}: {
    params: { interviewId: string };
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ReportResponse | null>(null);
    const [reportUrl, setReportUrl] = useState<string | null>(null);
    const [videoMeta, setVideoMeta] = useState<Record<string, VideoMeta>>({});

    const updateVideoMeta = useCallback((id: string, patch: Partial<VideoMeta>) => {
        setVideoMeta((prev) => ({
            ...prev,
            [id]: {
                duration: prev[id]?.duration ?? null,
                current: prev[id]?.current ?? 0,
                ...patch,
            },
        }));
    }, []);

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetchQuestionsResultForInterview(params.interviewId);

                if (!res || res.status !== "Success" || !res.data) {
                    setData(null);
                    setError("Unable to load interview report.");
                    return;
                }

                const payload = res.data as ReportPayload;
                const resolvedReportUrl = payload.report?.pdfUrl ?? payload.reportUrl ?? payload.pdfUrl ?? null;
                const report: ReportOverview = {
                    topStrengths: payload.report?.topStrengths ?? payload.topStrengths ?? [],
                    topWeaknesses: payload.report?.topWeaknesses ?? payload.topWeaknesses ?? [],
                    commonMissingConcepts: payload.report?.commonMissingConcepts ?? payload.commonMissingConcepts ?? [],
                    interviewSummary: payload.report?.interviewSummary ?? payload.interviewSummary ?? null,
                };

                setData({
                    questionResults: payload.questionResults || [],
                    reportUrl: resolvedReportUrl,
                    report,
                });
                setReportUrl(resolvedReportUrl);
            } catch (fetchError) {
                console.error(fetchError);
                setData(null);
                setReportUrl(null);
                setError("Unable to load interview report.");
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [params.interviewId]);

    return (
        <div className="min-h-screen px-4 py-8 md:px-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                <div className="candidate-report-hero overflow-hidden rounded-[28px] border border-white/30 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                    <div className="candidate-report-hero__glow" />
                    <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} className="candidate-report-back-btn">
                                Back
                            </Button>
                            <div>
                                <div className="candidate-report-badge mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                                    <ThunderboltOutlined /> Candidate Interview
                                </div>
                                <Title level={2} className="!mb-2">
                                    Interview Detail
                                </Title>
                                <Text className="candidate-report-muted block max-w-2xl text-sm md:text-base">
                                    Review the candidate responses, video answers, scores, and integrity details.
                                </Text>
                            </div>
                        </div>

                        <div className="candidate-report-actions flex flex-col items-end gap-3 shrink-0">
                            {reportUrl && (
                                <a
                                    href={reportUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="candidate-report-pdf-link inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-100"
                                >
                                    View Report PDF
                                </a>
                            )}
                            <Link href="/company/job-applications">
                                <Button type="default" size="large" className="candidate-report-secondary-btn candidate-report-secondary-btn--block">
                                    Back to Applications
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <Card className="candidate-report-card rounded-[24px] border-0">
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </Card>
                ) : error ? (
                    <Alert
                        type="error"
                        showIcon
                        message="Report unavailable"
                        description={error}
                        className="candidate-report-alert"
                    />
                ) : data ? (
                    <div className="flex flex-col gap-6">
                        {(data.report?.topStrengths?.length || data.report?.topWeaknesses?.length || data.report?.commonMissingConcepts?.length || data.report?.interviewSummary) && (
                            <Card
                                className="candidate-report-card rounded-[24px] border-0"
                                title={<span className="text-base font-semibold">Interview Overview</span>}
                            >
                                <Space direction="vertical" size="middle" className="w-full">
                                    <div className="candidate-report-panel candidate-report-panel--strengths rounded-2xl p-4">
                                        <div className="mb-3 flex items-center gap-2 text-emerald-700">
                                            <span className="font-semibold">Top Strengths</span>
                                        </div>
                                        {renderList(data.report?.topStrengths)}
                                    </div>

                                    <div className="candidate-report-panel candidate-report-panel--weaknesses rounded-2xl p-4">
                                        <div className="mb-3 flex items-center gap-2 text-rose-700">
                                            <span className="font-semibold">Top Weaknesses</span>
                                        </div>
                                        {renderList(data.report?.topWeaknesses)}
                                    </div>

                                    <div className="candidate-report-panel candidate-report-panel--improvements rounded-2xl p-4">
                                        <div className="mb-3 flex items-center gap-2 text-sky-700">
                                            <span className="font-semibold">Common Missing Concepts</span>
                                        </div>
                                        {renderList(data.report?.commonMissingConcepts)}
                                    </div>

                                    <div className="candidate-report-panel rounded-2xl p-4">
                                        <div className="mb-3 flex items-center gap-2 text-indigo-500">
                                            <span className="font-semibold">Overall Interview Summary</span>
                                        </div>
                                        <Paragraph className="candidate-report-text !mb-0">
                                            {data.report?.interviewSummary || "No summary available."}
                                        </Paragraph>
                                    </div>
                                </Space>
                            </Card>
                        )}

                        <Card
                            className="candidate-report-card rounded-[24px] border-0"
                            title={<span className="text-base font-semibold">Question Results</span>}
                        >
                            {data.questionResults.length > 0 ? (
                                <Collapse
                                    accordion
                                    className="candidate-report-collapse"
                                    items={data.questionResults.map((question, index) => {
                                        const overallScore = question.lLMAnalysis?.scores?.overallScore ?? 0;
                                        const isUnanswered = overallScore === 0;
                                        const scores = question.lLMAnalysis?.scores;
                                        const fluency = question.lLMAnalysis?.fluencyAssessment;

                                        return {
                                            key: question._id,
                                            label: (
                                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                    <div>
                                                        <Tag color="cyan" className="mb-2 rounded-full px-3 py-1">Question {index + 1}</Tag>
                                                        <Title level={5} className="my-1">
                                                            {question.questionText}
                                                        </Title>
                                                    </div>
                                                    {!isUnanswered && (
                                                        <div className="candidate-report-score-card min-w-[200px] rounded-2xl p-3">
                                                            <Text type="secondary" className="block text-xs uppercase tracking-wide">
                                                                Overall Score
                                                            </Text>
                                                            <div className="mt-1 text-2xl font-bold">
                                                                {overallScore}
                                                            </div>
                                                            <Progress percent={clampPercent(overallScore)} showInfo={false} className="mt-2" />
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                            children: (
                                                <div className="candidate-report-question rounded-[22px] p-5 md:p-6">
                                                    {isUnanswered ? (
                                                        <div className="space-y-4">
                                                            <div>
                                                                <Text strong>Answer Summary</Text>
                                                                <Paragraph className="candidate-report-text mt-2 !mb-0">
                                                                    {question.lLMAnalysis?.shortSummary || "No summary available."}
                                                                </Paragraph>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="grid gap-4 lg:grid-cols-2">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <Text strong>Answer Summary</Text>
                                                                    <Paragraph className="candidate-report-text mt-2 !mb-0">
                                                                        {question.lLMAnalysis?.shortSummary || "No summary available."}
                                                                    </Paragraph>
                                                                </div>

                                                                <div>
                                                                    <Text strong>Answer Quality</Text>
                                                                    <Paragraph className="candidate-report-text mt-2 !mb-0">
                                                                        <Tag>
                                                                            {question.lLMAnalysis?.answerQuality || "No answer quality analysis available."}
                                                                        </Tag>
                                                                    </Paragraph>
                                                                </div>
                                                                <div className="grid gap-3 md:grid-cols-2">
                                                                    <div className="candidate-report-mini-card rounded-2xl p-4">
                                                                        <Text strong>Fluency</Text>
                                                                        <div className="mt-3 space-y-3">
                                                                            <div>
                                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                                    <span>Grammar</span>
                                                                                    <span>{fluency?.grammarQuality || "N/A"}</span>
                                                                                </div>
                                                                                <Progress percent={clampPercent(mapFluencyToPercent(fluency?.grammarQuality))} showInfo={false} size="small" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                                    <span>Flow</span>
                                                                                    <span>{fluency?.speechFlow || "N/A"}</span>
                                                                                </div>
                                                                                <Progress percent={clampPercent(mapFluencyToPercent(fluency?.speechFlow))} showInfo={false} size="small" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                                    <span>Pace</span>
                                                                                    <span>{fluency?.paceAssessment || "N/A"}</span>
                                                                                </div>
                                                                                <Progress percent={clampPercent(mapFluencyToPercent(fluency?.paceAssessment))} showInfo={false} size="small" />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="candidate-report-mini-card rounded-2xl p-4">
                                                                        <Text strong>Scores</Text>
                                                                        <div className="mt-3 space-y-3">
                                                                            <div>
                                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                                    <span>Content</span>
                                                                                    <span>{scores?.contentScore ?? 0}</span>
                                                                                </div>
                                                                                <Progress percent={clampPercent(scores?.contentScore ?? 0)} showInfo={false} size="small" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                                    <span>Communication</span>
                                                                                    <span>{scores?.communicationScore ?? 0}</span>
                                                                                </div>
                                                                                <Progress percent={clampPercent(scores?.communicationScore ?? 0)} showInfo={false} size="small" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                                    <span>Fluency</span>
                                                                                    <span>{scores?.fluencyScore ?? 0}</span>
                                                                                </div>
                                                                                <Progress percent={clampPercent(scores?.fluencyScore ?? 0)} showInfo={false} size="small" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center justify-between text-xs text-slate-500">
                                                                                    <span>Confidence</span>
                                                                                    <span>{scores?.confidenceScore ?? 0}</span>
                                                                                </div>
                                                                                <Progress percent={clampPercent(scores?.confidenceScore ?? 0)} showInfo={false} size="small" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="grid gap-3 md:grid-cols-2">
                                                                    <div className="candidate-report-mini-card rounded-2xl p-4">
                                                                        <Text strong>Fluency Issues</Text>
                                                                        <div className="candidate-report-text mt-3 text-sm">
                                                                            {renderList(fluency?.detectedIssues)}
                                                                        </div>
                                                                    </div>

                                                                    <div className="candidate-report-mini-card rounded-2xl p-4">
                                                                        <Text strong>Missing Concepts</Text>
                                                                        <div className="candidate-report-text mt-3 text-sm">
                                                                            {renderList(question.lLMAnalysis?.insights?.missingConcepts)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="candidate-report-video-shell relative rounded-2xl p-3">
                                                                    {question.videoUrl ? (
                                                                        <>
                                                                            <video
                                                                                controls
                                                                                className="h-auto w-full rounded-xl"
                                                                                src={question.videoUrl}
                                                                                onLoadedMetadata={(event) => {
                                                                                    const video = event.currentTarget;
                                                                                    const duration = Number.isFinite(video.duration) ? video.duration : null;
                                                                                    updateVideoMeta(question._id, { duration });
                                                                                    if (video.duration === Infinity) {
                                                                                        video.currentTime = 1e7;
                                                                                    }
                                                                                }}
                                                                                onDurationChange={(event) => {
                                                                                    const video = event.currentTarget;
                                                                                    if (Number.isFinite(video.duration)) {
                                                                                        updateVideoMeta(question._id, { duration: video.duration });
                                                                                    }
                                                                                }}
                                                                                onTimeUpdate={(event) => {
                                                                                    const video = event.currentTarget;
                                                                                    if (video.currentTime >= 1e7 && Number.isFinite(video.duration)) {
                                                                                        video.currentTime = 0;
                                                                                    }
                                                                                    updateVideoMeta(question._id, { current: video.currentTime });
                                                                                    if (video.duration === Infinity && Number.isFinite(video.currentTime)) {
                                                                                        updateVideoMeta(question._id, { duration: video.currentTime });
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                            <div className="candidate-report-video-timecode absolute bottom-5 right-5 rounded-full px-3 py-1 text-xs font-semibold">
                                                                                {formatTime(videoMeta[question._id]?.current ?? 0)} / {formatTime(videoMeta[question._id]?.duration ?? null)}
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <div className="candidate-report-missing-answer flex min-h-[260px] flex-col items-center justify-center rounded-xl px-6 text-center text-sm">
                                                                            <span className="mb-2 text-lg font-semibold">Candidate did not provide an answer for this question.</span>
                                                                            <span className="candidate-report-muted text-xs md:text-sm">
                                                                                This question was skipped, so there is no video response to display.
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="candidate-report-mini-card rounded-2xl p-4">
                                                                    <Text strong>Integrity</Text>
                                                                    <div className="candidate-report-text mt-3 text-sm">
                                                                        <p className="mb-1"><strong>Concern:</strong> {question.lLMAnalysis?.integrity?.integrityConcern ? "Yes" : "No"}</p>
                                                                        <p className="mb-0"><strong>Notes:</strong> {question.lLMAnalysis?.integrity?.integrityNotes || "None"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        };
                                    })}
                                />
                            ) : (
                                <Empty description="No question results available" />
                            )}
                        </Card>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
