'use client';
import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import VerificationIntro from './VerificationIntro';
import LivenessCheck from './LivenessCheck';
import FaceCapture from './FaceCapture';
import VerificationComplete from './VerificationComplete';

type VerificationPhase = 'intro' | 'liveness' | 'face' | 'complete';

const STEPS = [
    { key: 'liveness', label: 'Liveness' },
    { key: 'face', label: 'Face' },
];

interface StepIndicatorProps {
    phase: VerificationPhase;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ phase }) => {
    // const phaseOrder: VerificationPhase[] = ['intro', 'liveness', 'face', 'complete'];
    // const currentIdx = phaseOrder.indexOf(phase);

    // Map phase to step index (liveness=0, face=1, complete=done)
    const activeStep = phase === 'liveness' ? 0 : phase === 'face' ? 1 : phase === 'complete' ? 2 : -1;

    if (activeStep === -1) return null;

    return (
        <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
                const done = activeStep > i;
                const active = activeStep === i;
                return (
                    <React.Fragment key={step.key}>
                        <div className="flex items-center gap-1.5">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 text-[11px] font-bold border-2
                                    ${done ? 'bg-emerald-500 border-emerald-500 text-white' :
                                        active ? 'bg-blue-600 border-blue-600 text-white' :
                                            'bg-transparent border-slate-300 text-slate-400'}`}
                            >
                                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                            </div>
                            <span className={`text-[11px] font-semibold tracking-wide hidden sm:block
                                ${done ? 'text-emerald-600' : active ? 'text-blue-700' : 'text-slate-400'}`}>
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`w-8 h-0.5 mx-1 rounded transition-all duration-500
                                ${activeStep > i ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

interface VerificationFlowProps {
    onVerificationComplete: () => void;
    interviewId: string;
}

const VerificationFlow: React.FC<VerificationFlowProps> = ({ onVerificationComplete, interviewId }) => {
    const [phase, setPhase] = useState<VerificationPhase>('intro'); // Start at 'complete' for testing, change to 'intro' for production

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-blue-700 tracking-wide">SecureVerify</span>
                    </div>
                    <StepIndicator phase={phase} />
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8">
                    {phase === 'intro' && (
                        <VerificationIntro onStart={() => setPhase('liveness')} />
                    )}
                    {phase === 'liveness' && (
                        <LivenessCheck onPassed={() => setPhase('face')} interviewId={interviewId} />
                    )}
                    {phase === 'face' && (
                        <FaceCapture onVerified={() => setPhase('complete')} />
                    )}
                    {phase === 'complete' && (
                        <VerificationComplete onStartInterview={onVerificationComplete} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationFlow;