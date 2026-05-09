import React from "react";

interface MessageProps {
  text: string;
  loading?: boolean;
}

export default function LoadingMessage({
  text,
  loading = false,
}: MessageProps) {
  return (
    <div className="mb-4 flex justify-end">
      <div className="max-w-[85%] md:max-w-2xl flex flex-col items-start">
        <div className="relative px-3 py-2 md:px-4 md:py-2.5 shadow-sm bg-white border border-gray-200 rounded-lg">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
            </div>
          ) : (
            <p className="text-xs md:text-sm whitespace-pre-line break-words text-gray-800">
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
