'use client';
import React from 'react';
import { ShieldCheck, Scan, Camera } from 'lucide-react';
import { Button } from 'antd';

interface VerificationIntroProps {
    onStart: () => void;
}

const VerificationIntro: React.FC<VerificationIntroProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center text-center gap-8 py-4">
            {/* Icon */}
            <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
            </div>

            {/* Heading */}
            <div className="space-y-3 max-w-sm">
                <h1 className="text-2xl font-bold tracking-tight leading-snug">
                    Identity Verification Required
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                    To maintain the integrity of this interview, we need to verify your
                    identity before you begin. This takes under 60 seconds.
                </p>
            </div>

            {/* Steps */}
            <div className="w-full max-w-sm space-y-3">
                {[
                    {
                        icon: <Scan className="w-5 h-5 text-blue-600" />,
                        bg: 'bg-blue-50',
                        step: 'Step 1',
                        title: 'Liveness Check',
                        desc: 'A 5-second video challenge to confirm you are live.',
                    },
                    {
                        icon: <Camera className="w-5 h-5 text-blue-600" />,
                        bg: 'bg-blue-50',
                        step: 'Step 2',
                        title: 'Face Capture',
                        desc: 'A clear photo to match your identity on record.',
                    },
                ].map((item) => (
                    <div
                        key={item.step}
                        className="flex items-start gap-4 p-4 rounded-xl  border  text-left"
                    >
                        <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                                {item.step}
                            </p>
                            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Privacy note */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-emerald-500">🔒</span>
                Your data is processed securely and used only for this session.
            </p>

            {/* CTA */}
            <Button
                type="primary"
                onClick={onStart}
                className="w-full"
            >
                Start Verification →
            </Button>
        </div>
    );
};

export default VerificationIntro;