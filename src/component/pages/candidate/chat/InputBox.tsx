import { uploadFileApi } from "@/app/api/auth.api";
import { socket } from "@/socket";
import {
  PaperClipOutlined,
  SendOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";

export default function InputBox({
  messageText,
  setMessageText,
  sendMessage,
  setShowEmoji,
  showEmoji,
}: {
  messageText: string;
  setMessageText: (text: string) => void;
  sendMessage: () => void;
  setShowEmoji: (show: boolean) => void;
  showEmoji: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // IMPORTANT: key must be "file"

    try {
      socket.emit("uploadingFile", { fileName: file.name }); // Optional: show uploading status
      const res = await uploadFileApi(formData);
      console.log("Uploaded URL:", res?.data?.url);
      socket.emit("uploadedFileDone", { fileUrl: res?.data?.url }); // Notify server of upload completion
      // socket.emit("sendDocumentMessage", {
      //   chatId: "currentChatId", // replace with actual chat ID
      //   msgId: "generatedMsgId", // generate a unique message ID
      //   sender: "currentUserId", // replace with actual sender ID
      //   msg: res?.data?.url, // send the file URL as the message
      //   isUserOnline: true, // determine if the recipient is online
      // })

      // Example: send file message
      // sendMessageWithFile(res?.data?.url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  return (
    <>
      <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            type="primary"
            icon={<span className="text-base md:text-lg">⚡</span>}
            className="h-9 md:h-10 px-3 md:px-4 hidden sm:flex"
            style={{ backgroundColor: "#7c3aed" }}
          />
          <Input
            placeholder="Write a message..."
            className="flex-1 h-9 md:h-10 text-sm md:text-base"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onPressEnter={sendMessage}
            suffix={
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex gap-1 md:gap-2"
              >
                <Button
                  type="text"
                  icon={<SmileOutlined />}
                  className="hidden sm:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEmoji((v) => !v);
                  }}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  type="text"
                  icon={<PaperClipOutlined />}
                />
              </div>
            }
          />
          {showEmoji && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowEmoji(false)}
              />
              <div
                className="absolute bottom-16 right-4 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <EmojiPicker
                      onEmojiClick={(emojiData) =>
                        setMessageText((prev) => prev + emojiData.emoji)
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            onClick={sendMessage}
            type="primary"
            icon={<SendOutlined />}
            className="h-9 md:h-10 w-9 md:w-10 flex items-center justify-center"
          />
        </div>
      </div>
    </>
  );
}
