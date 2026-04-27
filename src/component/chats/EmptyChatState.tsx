import React from "react";
import {
  MessageOutlined,
  UserOutlined,
  TeamOutlined,
  SendOutlined,
} from "@ant-design/icons";
const EmptyChatState = ({
  onCompanyChats,
}: {
  onCompanyChats?: () => void;
}) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
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
          Select a conversation from the list to view messages and connect with
          recruiters, companies, and opportunities.
        </p>

        {/* <div className="flex justify-center mb-6">
          <Button
            type="primary"
            size="middle"
          >
            Company Chats
          </Button>
        </div> */}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <UserOutlined className="text-blue-500 text-lg" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Direct Messages</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <TeamOutlined className="text-green-500 text-lg" />
            </div>
            <button
              className="text-xs text-gray-600 font-medium"
              onClick={onCompanyChats}
              disabled={!onCompanyChats}
            >
              Company Chats
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <SendOutlined className="text-purple-500 text-lg" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Quick Replies</p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
          <p className="text-xs font-semibold text-blue-900 mb-2">
            💡 Quick Tip
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Click on any conversation in the sidebar to start messaging. You can
            also use the search bar to quickly find specific chats.
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
