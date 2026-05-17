import React from "react";

interface JobDetailSkeletonProps {
    className?: string;
}

const JobDetailSkeleton: React.FC<JobDetailSkeletonProps> = ({
    className = "",
}) => {
    return (
        <div className={`flex flex-col h-full ${className}`.trim()}>
            <div className="flex-shrink-0 px-6 pt-6">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="h-16 w-16 rounded-lg bg-gray-200 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                </div>
                <div className="mt-4 h-px w-full bg-gray-200" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="mt-4 space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-7 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 space-y-3">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className={`h-3 bg-gray-200 rounded animate-pulse ${index === 3 ? "w-2/3" : "w-full"
                                }`}
                        />
                    ))}
                </div>

                <div className="mt-6 space-y-3">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-7 w-20 rounded-full bg-gray-200 animate-pulse"
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className={`h-3 bg-gray-200 rounded animate-pulse ${index === 2 ? "w-3/4" : "w-full"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobDetailSkeleton;
