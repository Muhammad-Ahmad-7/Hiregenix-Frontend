"use client";
import { getTimeOnly } from "@/utils/dateFormation";
import {
  FileImageOutlined,
  FileTextOutlined,
  SmileOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import MessageStatus from "./MessageStatus";
import { socket } from "@/socket";
import { updateReaction } from "@/redux/slices/chat/messagesSlice";
import { isImageUrl } from "@/utils/isImageUrl";
import { isDocumentUrl } from "@/utils/isDocumentUrl";
import SmallReplyCard from "./SmallReplyCard";
import type { IMessage } from "@/constants/Interfaces/Types/Chat.interface";
import type { AppDispatch, RootState } from "@/redux/store";

type UserProfile = NonNullable<RootState["user"]["profile"]>;

type MessageProps = {
  msg: IMessage;
  setSelectReplyId: React.Dispatch<React.SetStateAction<string | null>>;
  selectReplyId: string | null;
  profile: UserProfile;
  hoveredMessageId: string | null;
  setHoveredMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  handleReaction: (messageId: string | number, emoji: string) => void;
  toggleReactionPicker: (e: React.MouseEvent, messageId: string) => void;
  reactionPickerMessageId: string | null;
  dispatch: AppDispatch;
  onReply?: (msg: IMessage) => void;
};

export default function Message({
  msg,
  setSelectReplyId,
  selectReplyId,
  profile,
  hoveredMessageId,
  setHoveredMessageId,
  handleReaction,
  toggleReactionPicker,
  reactionPickerMessageId,
  dispatch,

  onReply = () => undefined,
}: MessageProps) {

  return (
    <div
      key={msg._id}
      id={`msg-${msg._id}`}
      style={{
        background: selectReplyId === msg._id ? "#80d4ff" : "",
      }}
      className={`mb-4 flex ${msg.sender === profile._id ? "justify-end" : "justify-start"}`}
      // onMouseEnter={() => setHoveredMessageId(msg._id)}
      // onMouseLeave={() => setHoveredMessageId(null)}
      onMouseEnter={() => setHoveredMessageId(msg._id)}
      onMouseLeave={() => {
        setHoveredMessageId(null);
      }}
    >
      {/* Message column */}
      <div
        className={`max-w-[85%] md:max-w-2xl flex flex-col ${msg.sender === profile._id ? "items-end" : "items-start"}`}
      >
        <div className="relative">
          {/* "YOU" smile button — floats left of bubble, zero layout width */}
          {msg.sender === profile._id && hoveredMessageId === msg._id && (
            <AnimatePresence>
              <motion.div
                key="smile-you"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-full bottom-1 mr-1 z-10"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<SmileOutlined />}
                  onClick={(e) => toggleReactionPicker(e, msg._id)}
                  className="bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
                />
                {reactionPickerMessageId === msg._id && (
                  <div
                    className="absolute bottom-8 right-0 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EmojiPicker
                      reactionsDefaultOpen={true}
                      allowExpandReactions={false}
                      onReactionClick={(emojiData) =>
                        handleReaction(msg._id, emojiData.emoji)
                      }
                      onEmojiClick={(emojiData) =>
                        handleReaction(msg._id, emojiData.emoji)
                      }
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── Bubble ──────────────────────────────────────────────── */}
          <div
            className={`
              overflow-hidden-cmt
              relative px-3 py-2 md:px-4 md:py-2.5 shadow-sm ${
                msg.sender === profile._id
                  ? "bg-[#005C4B] text-white rounded-lg" // top-right corner is the tail point
                  : "bg-white border border-gray-200 rounded-lg"
              }`}
          >
            {msg.replyingTo && (
              // <div onClick={() => setSelectReplyId(msg.replyingTo._id)}>
              <SmallReplyCard
                messageId={msg.replyingTo._id}
                setSelectReplyId={setSelectReplyId}
                text={msg.replyingTo.text}
              />
              // </div>
            )}
            {hoveredMessageId === msg._id && (
              <AnimatePresence>
                <motion.div
                  key="dropdown-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -right-0 -top-0  border-r- z-10"
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<RetweetOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReply(msg);
                    }}
                    className="!bg-gray-100 shadow-sm border border-gray-200 hover:bg-gray-50"
                  />
                </motion.div>
              </AnimatePresence>
            )}
            {isImageUrl(msg.text) ? (
              <a
                href={msg.text}
                target="_blank"
                rel="noopener noreferrer"
                // className="flex items-center gap-1 text-blue-600 hover:underline"
                style={{
                  color: msg.sender === profile._id ? "white" : "#005C4B",
                }}
                className="flex items-center gap-1 text-blue-100 hover:underline"
              >
                <FileImageOutlined style={{ fontSize: 18 }} />
                Image
              </a>
            ) : isDocumentUrl(msg.text) ? (
              <a
                href={msg.text}
                target="_blank"
                rel="noopener noreferrer"
                // className="flex items-center gap-1 text-blue-600 hover:underline"
                style={{
                  color: msg.sender === profile._id ? "white" : "#005C4B",
                }}
                className="flex items-center gap-1 text-blue-100 hover:underline"
              >
                <FileTextOutlined style={{ fontSize: 18 }} />
                Document
              </a>
            ) : (
              <p
                className={`text-xs md:text-sm whitespace-pre-line break-words ${msg.sender === profile._id ? "text-white" : "text-gray-800"}`}
              >
                {msg.text}
              </p>
            )}
            {/* <p
              className={`text-xs md:text-sm whitespace-pre-line break-words ${msg.sender === profile._id ? "text-white" : "text-gray-800"}`}
            >
              {msg.text}
            </p> */}

            {msg.emoji && (
              <div className="mt-2">
                <span className="text-lg md:text-xl">{msg.emoji}</span>
              </div>
            )}

            {/* Time + status */}
            <div className="flex items-center justify-end gap-1 mt-1">
              <span
                className={`text-[10px] ${msg.sender === profile._id ? "text-gray-300" : "text-gray-400"}`}
              >
                {getTimeOnly(msg.createdAt)}
              </span>
              {msg.sender === profile._id && msg.status && (
                <MessageStatus status={msg.status} />
              )}
            </div>
          </div>
        </div>

        {/* Reaction badge */}
        {msg.reaction && (
          <div
            className={`mt-1 ${msg.sender === profile._id ? "self-end mr-1" : "self-start ml-1"} bg-white rounded-full px-1.5 py-0.5 shadow-md border border-gray-200 text-xs cursor-pointer select-none`}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                updateReaction({
                  messageId: msg._id,
                  reaction: null,
                }),
              );
              socket.emit("updateReaction", {
                messageId: msg._id,
                reaction: null,
              });
            }}
            title="Click to remove reaction"
          >
            {msg.reaction}
          </div>
        )}
      </div>

      {/* "IBM" smile button — in the flex row to the right of the column */}
      {msg.sender !== profile?._id && hoveredMessageId === msg._id && (
        <AnimatePresence>
          <motion.div
            key="smile-ibm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative flex items-end mb-1 ml-1"
          >
            <Button
              type="text"
              size="small"
              icon={<SmileOutlined />}
              onClick={(e) => toggleReactionPicker(e, msg._id)}
              className="bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
            />
            {reactionPickerMessageId === msg._id && (
              <div
                className="absolute bottom-8 left-0 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <EmojiPicker
                  reactionsDefaultOpen={true}
                  allowExpandReactions={false}
                  onReactionClick={(emojiData) =>
                    handleReaction(msg._id, emojiData.emoji)
                  }
                  onEmojiClick={(emojiData) =>
                    handleReaction(msg._id, emojiData.emoji)
                  }
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
