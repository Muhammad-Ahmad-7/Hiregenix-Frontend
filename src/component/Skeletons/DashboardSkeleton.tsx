import React from "react";
import TableSkeleton from "@/component/Skeletons/TableSkeleton";

interface DashboardSkeletonProps {
    variant?: "candidate" | "company";
    className?: string;
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
    className = "",
}) => {
    return (
        <div
            className={`w-full h-screen min-h-screen flex flex-col gap-3 ${className}`.trim()}
            style={{ background: "var(--surface-2)" }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                            <div className="h-6 w-14 rounded-full bg-gray-200 animate-pulse" />
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="mt-4">
                        <TableSkeleton rows={4} columns={4} />
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="mt-4">
                        <TableSkeleton rows={4} columns={4} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
