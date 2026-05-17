import React from "react";

interface CardSkeletonProps {
    count?: number;
    showAvatar?: boolean;
    avatarSize?: number;
    lines?: number;
    showActions?: boolean;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
    count = 3,
    showAvatar = true,
    avatarSize = 48,
    lines = 3,
    showActions = true,
}) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm"
                >
                    {/* Top section */}
                    <div className="flex items-start gap-3 mb-4">
                        {showAvatar && (
                            <div
                                className="bg-gray-200 animate-pulse rounded-lg"
                                style={{
                                    width: avatarSize,
                                    height: avatarSize,
                                }}
                            />
                        )}

                        <div className="flex-1 space-y-2">
                            {/* Title */}
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />

                            {/* Subtitle */}
                            <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse opacity-70" />
                        </div>
                    </div>

                    {/* Content lines */}
                    <div className="space-y-2 mb-4">
                        {Array.from({ length: lines }).map((_, j) => (
                            <div
                                key={j}
                                className={`h-3 bg-gray-200 rounded animate-pulse ${j === lines - 1 ? "w-2/3" : "w-full"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    {showActions && (
                        <div className="flex justify-between items-center">
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CardSkeleton;