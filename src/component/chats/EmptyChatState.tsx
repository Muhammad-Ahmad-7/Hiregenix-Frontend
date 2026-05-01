import React from "react";
import { MessageOutlined } from "@ant-design/icons";
import { Button } from "antd";
const EmptyChatState = ({
  userType,
  onDirectoryOpen,
  directoryLabel = "Company Chats",
}: {
  userType?: "candidate" | "company";
  onDirectoryOpen?: () => void;
  directoryLabel?: string;
}) => {
  return (
    <div className="card flex-1 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Animated Icon Container */}
        <div className="relative mb-8 inline-block">
          {/* Background Circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full animate-pulse opacity-20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-200 rounded-full animate-pulse opacity-30 animation-delay-150"></div>
          </div>

          {/* Main Icon */}
          <div className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
            <MessageOutlined className="text-white text-4xl" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Start a Conversation
        </h2>
        <p className="text-gray-500 mb-8 text-sm md:text-base leading-relaxed">
          Open the people list and start chatting. You can then switch between
          conversations from the left sidebar.
        </p>

        <div className="mb-6">
          <Button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onDirectoryOpen}
            disabled={!onDirectoryOpen}
          >
            {directoryLabel}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
          <p className="text-xs text-blue-700 leading-relaxed">
            Use the button above to open the list, then choose a {userType === "candidate" ? "company" : "candidate"} to chat.
            Your conversations will appear in the left sidebar.
          </p>
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.2;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.3;
            }
          }

          .animate-pulse {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .animation-delay-150 {
            animation-delay: 150ms;
          }
        `}</style>
      </div>
    </div>
  );
};

export default EmptyChatState;
