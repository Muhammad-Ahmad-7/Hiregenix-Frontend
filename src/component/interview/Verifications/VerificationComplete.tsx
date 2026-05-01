'use client';
import React from 'react';
import { CheckCircle2, ShieldCheck, Scan } from 'lucide-react';
import { Button } from 'antd';

interface VerificationCompleteProps {
    onStartInterview: () => void;
}

const VerificationComplete: React.FC<VerificationCompleteProps> = ({ onStartInterview }) => {
    return (
        <div className="flex flex-col items-center text-center gap-8 py-4">
            {/* Animated success ring */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                    </div>
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full bg-emerald-200 opacity-30 animate-ping" />
            </div>

            {/* Text */}
            <div className="space-y-3 max-w-sm">
                <h1 className="text-2xl font-bold tracking-tight">
                    Verification Complete
                </h1>
                <p className="text-sm  leading-relaxed">
                    Your identity has been verified successfully. You are cleared to begin your interview.
                </p>
            </div>

            {/* Verification badges */}
            <div className="w-full max-w-sm space-y-2">
                <div className="verification-badge verification-badge--success">
                    <div className="verification-badge__icon">
                        <Scan className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="verification-badge__title">Liveness Check</p>
                        <p className="verification-badge__subtitle">Confirmed — you are live</p>
                    </div>
                    <CheckCircle2 className="verification-badge__check w-5 h-5 flex-shrink-0" />
                </div>

                <div className="verification-badge verification-badge--success">
                    <div className="verification-badge__icon">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="verification-badge__title">Face Verification</p>
                        <p className="verification-badge__subtitle">Identity matched successfully</p>
                    </div>
                    <CheckCircle2 className="verification-badge__check w-5 h-5 flex-shrink-0" />
                </div>
            </div>

            {/* Start button */}
            <Button
                onClick={onStartInterview}
                className="w-full max-w-sm py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-base font-bold tracking-wide transition-all duration-150 shadow-sm shadow-blue-200"
            >
                Start Interview →
            </Button>
        </div>
    );
};

export default VerificationComplete;