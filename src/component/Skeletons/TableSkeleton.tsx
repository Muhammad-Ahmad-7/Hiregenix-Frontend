import React from "react";

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
    columnWidths?: (string | number)[];
    showHeader?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 6,
    columns = 5,
    columnWidths = [],
    showHeader = true,
}) => {
    const getWidth = (index: number) =>
        columnWidths[index] || "100%";

    return (
        <div className="w-full overflow-x-auto border border-gray-200 rounded-lg">

            {/* Header */}
            {showHeader && (
                <div className="flex gap-4 px-4 py-3 bg-gray-50">
                    {Array.from({ length: columns }).map((_, i) => (
                        <div
                            key={i}
                            style={{ width: getWidth(i) }}
                            className="h-3 bg-gray-200 rounded animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="flex items-center gap-4 px-4 py-3"
                >
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            style={{ width: getWidth(colIndex) }}
                            className="h-4 bg-gray-200 rounded animate-pulse"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TableSkeleton;