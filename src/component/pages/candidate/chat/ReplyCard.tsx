export default function ReplyCard({
  sender = "Ahmad Waheed CUI",
  text = "Wo Tu Nahi jay ga",
  messageId = "123456",
}) {
  return (
    // <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
    <div className="flex items-stretch bg-[#1c1f26] rounded-lg   overflow-hidden">
      {/* Left accent bar */}
      <div className="w-1 bg-sky-400 flex-shrink-0" />

      {/* Content */}
      <div className="flex flex-col px-4 py-3 flex-1 gap-1">
        <span className="text-sky-400 font-bold text-sm tracking-wide">
          {sender.split(" ")[0]}
        </span>
        <span className="text-gray-300 text-sm leading-snug">{text}</span>
      </div>

      {/* Close icon */}
      <span className="text-gray-500 px-3 pt-2 text-sm self-start">✕</span>
    </div>
    // {/* </div> */}
  );
}
