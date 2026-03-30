import { Button } from "antd";
import React from "react";

export default function EmptyChatStateV3() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
          <span className="text-4xl text-white">💬</span>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Start a conversation
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Select a chat from the list or start a new conversation to sent
          messages in real time.
        </p>

        {/* CTA */}
        <div className="mt-6">
          <Button
            type="primary"
            size="large"
            className="rounded-full px-6 shadow-md"
            style={{ backgroundColor: "#7c3aed" }}
            onClick={() => {
              // open new chat modal or focus chat list
            }}
          >
            + New Conversation
          </Button>
        </div>

        {/* Hint */}
        <p className="mt-4 text-xs text-gray-400">
          Your messages are end-to-end encrypted 🔒
        </p>
      </div>
    </div>
  );
}
