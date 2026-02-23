import React from "react";
import {
  MessageOutlined,
  UserOutlined,
  TeamOutlined,
  SendOutlined,
  RocketOutlined,
  StarOutlined,
  BulbOutlined,
} from "@ant-design/icons";

// Version 1: Gradient Card Style
export const EmptyChatStateV1 = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="text-center max-w-lg">
        {/* Floating Icon with Glow Effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>
          <div className="relative z-10 w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-all duration-300">
            <MessageOutlined className="text-white text-5xl" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to Messages
        </h2>
        <p className="text-gray-600 mb-10 text-base md:text-lg leading-relaxed max-w-md mx-auto">
          Your professional conversations start here. Select a chat or start
          connecting with opportunities.
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <UserOutlined className="text-white text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">1-on-1 Chats</h3>
            <p className="text-xs text-gray-500">
              Direct messages with recruiters
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <TeamOutlined className="text-white text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Companies</h3>
            <p className="text-xs text-gray-500">Connect with organizations</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <RocketOutlined className="text-white text-2xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Opportunities</h3>
            <p className="text-xs text-gray-500">Job offers and more</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Version 2: Minimal & Clean
export const EmptyChatStateV2 = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-white p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <MessageOutlined className="text-gray-400 text-6xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            No conversation selected
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Choose a conversation from the sidebar to start messaging with
            companies and recruiters
          </p>
        </div>

        <div className="space-y-3 text-left bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">💬</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Instant Messaging
              </p>
              <p className="text-xs text-gray-500">Real-time conversations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm">📎</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">File Sharing</p>
              <p className="text-xs text-gray-500">Share documents & resumes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm">⚡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Quick Replies</p>
              <p className="text-xs text-gray-500">Pre-written responses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Version 3: Playful & Engaging
export const EmptyChatStateV3 = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div
        className="absolute top-20 left-20 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-bounce"
        style={{ animationDuration: "3s" }}
      ></div>
      <div
        className="absolute bottom-20 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/4 w-12 h-12 bg-red-200 rounded-full opacity-20 animate-bounce"
        style={{ animationDuration: "5s", animationDelay: "2s" }}
      ></div>

      <div className="text-center max-w-xl z-10">
        {/* Emoji Stack */}
        <div className="relative mb-8 h-32">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 text-6xl animate-float">
            💼
          </div>
          <div
            className="absolute left-1/2 top-8 -translate-x-1/2 text-5xl animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            🤝
          </div>
          <div
            className="absolute left-1/2 top-16 -translate-x-1/2 text-4xl animate-float"
            style={{ animationDelay: "1s" }}
          >
            💬
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Ready to Connect? 🚀
        </h2>
        <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
          Pick a conversation and let's get the ball rolling! Your next
          opportunity is just a message away.
        </p>

        {/* Stats or Features */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-xs text-gray-600">Always Available</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-1">🔒</div>
            <div className="text-xs text-gray-600">Secure Chat</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-1">⚡</div>
            <div className="text-xs text-gray-600">Instant Reply</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
          <StarOutlined className="text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            Select a chat to begin
          </span>
          <span className="text-lg">👈</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, 0px);
          }
          50% {
            transform: translate(-50%, -15px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Version 4: Professional & Corporate
export const EmptyChatStateV4 = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-slate-800 rounded-2xl mb-6 shadow-2xl">
            <MessageOutlined className="text-white text-5xl" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Professional Messaging
          </h1>
          <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
            Connect with leading companies, engage with recruiters, and advance
            your career through meaningful conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-left hover:border-blue-300 transition-colors">
            <BulbOutlined className="text-3xl text-blue-600 mb-4" />
            <h3 className="font-semibold text-slate-800 mb-2 text-lg">
              Smart Responses
            </h3>
            <p className="text-sm text-slate-600">
              AI-powered suggestions to help you craft the perfect message
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-left hover:border-green-300 transition-colors">
            <TeamOutlined className="text-3xl text-green-600 mb-4" />
            <h3 className="font-semibold text-slate-800 mb-2 text-lg">
              Company Network
            </h3>
            <p className="text-sm text-slate-600">
              Direct access to hiring managers and decision makers
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-left hover:border-purple-300 transition-colors">
            <SendOutlined className="text-3xl text-purple-600 mb-4" />
            <h3 className="font-semibold text-slate-800 mb-2 text-lg">
              Fast Delivery
            </h3>
            <p className="text-sm text-slate-600">
              Real-time messaging with read receipts and status
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-left hover:border-orange-300 transition-colors">
            <RocketOutlined className="text-3xl text-orange-600 mb-4" />
            <h3 className="font-semibold text-slate-800 mb-2 text-lg">
              Career Growth
            </h3>
            <p className="text-sm text-slate-600">
              Opportunities and connections that accelerate your journey
            </p>
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 inline-block">
          <p className="text-sm text-slate-700">
            <strong className="text-slate-900">Getting started:</strong> Select
            any conversation from your inbox to begin
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatStateV1;
