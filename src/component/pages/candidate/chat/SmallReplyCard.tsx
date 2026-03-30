"use client";
import type { Dispatch, SetStateAction } from "react";

type SmallReplyCardProps = {
  setSelectReplyId: Dispatch<SetStateAction<string | null>>;
  messageId: string;
  text?: string;
};

export default function SmallReplyCard({
  setSelectReplyId,
  text = "Wo Tu Nahi jay ga",
  messageId,
}: SmallReplyCardProps) {
  return (
    // <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
    <div
      onClick={() => {
        setSelectReplyId(messageId);
      }}
      className="flex bg-[#1c1f26] rounded-lg   overflow-hidden"
    >
      {/* Left accent bar */}
      <div className="w-1 bg-sky-400 flex-shrink-0" />

      {/* Content */}
      <div className="flex flex-col px-2 py-1 flex-1 ">
        <span className="text-sky-400 font-bold text-sm tracking-wide">
          Ahmad
        </span>
        <span className="text-gray-300 text-sm leading-snug">{text}</span>
      </div>

      {/* Close icon */}
      <span
        onClick={(e) => {
          e.stopPropagation();
          console.log("delelelele");
          setSelectReplyId(null);
        }}
        className="text-gray-500 px-3 pt-2 text-sm self-start"
      >
        ✕
      </span>
    </div>
    // {/* </div> */}
  );
}
