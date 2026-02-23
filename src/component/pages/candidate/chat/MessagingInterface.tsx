"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input, Avatar, Badge, Dropdown, Button } from "antd";
import {
  SearchOutlined,
  DownOutlined,
  MoreOutlined,
  ArrowLeftOutlined,
  MenuOutlined,
  FileTextOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import {
  getAllChats,
  getAllMessages,
  getAllMessages2,
} from "@/app/api/chat/chats.api";
import { formatChatTime } from "@/utils/dateFormation";
import {
  setChats,
  updateLastMessageStatus,
  updateOnlineStatus,
  updateUnreadCount,
} from "@/redux/slices/chat/chatsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Reorder } from "framer-motion";
import { socket } from "@/socket";
import EmptyChatState from "@/component/chats/EmptyChatState";
import { IChat } from "@/constants/Interfaces/Types/Chat.interface";
import {
  addMessage,
  setMessages,
  updateAllMessagesStatusToDelivered,
  updateAllMessagesStatusToSeen,
  updateMessageStatus,
  updateReaction,
} from "@/redux/slices/chat/messagesSlice";
import InputBox from "./InputBox";
import MessageStatus from "./MessageStatus";
import Message from "./Message";
import LoadingMessage from "./LoadingMessage";
import { isDocumentUrl } from "@/utils/isDocumentUrl";
import { isImageUrl } from "@/utils/isImageUrl";

const MessagingInterface = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedChatP, setSelectedChatP] = useState<IChat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [page, setPage] = useState(2);
  const { profile } = useSelector((state: RootState) => state.user);
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [reactionPickerMessageId, setReactionPickerMessageId] = useState<
    number | null
  >(null);
  const { messages } = useSelector((state: RootState) => state.messages);
  const [docLoading, setDocLoading] = useState(false);
  const dispatch = useDispatch();
  const [currentStickyDate, setCurrentStickyDate] = useState<string | null>(
    null,
  );
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Track whether the next messages update is from pagination (old msgs) or new msg
  const isLoadingOldMessages = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const date = entry.target.getAttribute("data-date");
            if (date) {
              setCurrentStickyDate(date);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0,
        rootMargin: "-40px 0px 0px 0px",
      },
    );

    Object.entries(dateRefs.current).forEach(([date, el]) => {
      if (el) {
        el.setAttribute("data-date", date);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [messages]);
  useEffect(() => {
    const handleUploading = () => setDocLoading(true);
    const handleUploaded = () => setDocLoading(false);

    socket.on("uploadingFile", handleUploading);
    socket.on("uploadedFileDone", handleUploaded);

    return () => {
      socket.off("uploadingFile", handleUploading);
      socket.off("uploadedFileDone", handleUploaded);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll listener for pagination (loading older messages)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop <= 0) {
        const scrollHeightBefore = container.scrollHeight;

        // Mark that we're loading old messages — suppress auto-scroll
        isLoadingOldMessages.current = true;

        getAllMessages({
          chatId: selectedChat!,
          params: { page, limit: 20 },
        }).then((res) => {
          console.log("hurrah:", res);
          dispatch(setMessages(res.data.messages));
          setPage((prev) => prev + 1);

          // After DOM updates, restore scroll position so user stays in place
          requestAnimationFrame(() => {
            const scrollDiff = container.scrollHeight - scrollHeightBefore;
            container.scrollTop = scrollDiff;
            // Reset flag after position is restored
            isLoadingOldMessages.current = false;
          });
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, selectedChat, page]);

  useEffect(() => {
    socket.on("updateReaction", ({ messageId, reaction }) => {
      dispatch(updateReaction({ messageId, reaction }));
    });
    socket.on("sendMessage", ({ chatId, msg, msgId, sender, isUserOnline }) => {
      console.log(
        "sendEvent",
        chatId,
        msg,
        msgId,
        sender,
        "selectedChat:",
        selectedChat,
        isUserOnline,
      );

      if (sender !== profile?._id) {
        if (selectedChat !== chatId) {
          socket.emit("updateMessageStatus", {
            messageId: msgId,
            status: "delivered",
            chatId,
            sender,
            toUser: selectedChatP?.participant._id,
          });
          dispatch(updateLastMessageStatus({ status: "delivered", chatId }));
        } else {
          socket.emit("updateMessageStatus", {
            messageId: msgId,
            status: "seen",
            chatId,
            sender,
            toUser: selectedChatP?.participant._id,
          });
          dispatch(updateLastMessageStatus({ status: "seen", chatId }));
        }
      } else {
        socket.emit("updateMessageStatus", {
          messageId: msgId,
          status: isUserOnline ? "delivered" : "sent",
          chatId,
          sender,
          toUser: selectedChatP?.participant._id,
        });
        dispatch(
          updateLastMessageStatus({
            status: isUserOnline ? "delivered" : "sent",
            chatId,
          }),
        );
      }

      dispatch(
        addMessage({
          message: {
            _id: msgId,
            chat: chatId,
            sender,
            text: msg,
            status: "sent",
            reaction: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          selectedId: selectedChat,
          userId: profile?._id,
          isUserOnline: isUserOnline,
        }),
      );
    });

    return () => {
      socket.off("sendMessage");
    };
  }, [selectedChat, selectedChatP]);

  useEffect(() => {
    if (!profile) return;

    socket.on("updateAllMessagesStatusToSeen", ({ selectedChat }) => {
      dispatch(
        updateAllMessagesStatusToSeen({
          chatId: selectedChat,
          userId: profile?.userId._id,
        }),
      );
      dispatch(
        updateLastMessageStatus({ status: "seen", chatId: selectedChat }),
      );
    });
  }, [profile, selectedChat]);

  const { chats } = useSelector((state: RootState) => state.chats);

  useEffect(() => {
    socket.on("iAmOnline", (onlineUserId: string) => {
      const yeschats = chats?.find(
        (chat) => chat.participant._id === onlineUserId,
      );
      if (yeschats) {
        dispatch(
          updateAllMessagesStatusToDelivered({
            userId: profile?.userId._id,
            chatId: yeschats._id,
          }),
        );
        dispatch(
          updateLastMessageStatus({
            status: "delivered",
            chatId: yeschats._id,
          }),
        );
        dispatch(
          updateOnlineStatus({ userId: onlineUserId, onlineStatus: "online" }),
        );
      }
    });
    socket.on("iAmOffline", (offlineUserId: string) => {
      const yeschats = chats?.find(
        (chat) => chat.participant._id === offlineUserId,
      );
      if (yeschats) {
        dispatch(
          updateOnlineStatus({
            userId: offlineUserId,
            onlineStatus: "offline",
          }),
        );
      }
    });

    return () => {
      socket.off("iAmOnline");
      socket.off("iAmOffline");
    };
  }, [chats, profile]);

  const [imgError, setImgError] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!selectedChat) return;
    dispatch(updateUnreadCount({ chatId: selectedChat, unReadCount: -1 }));
  };

  // Only scroll to bottom for new messages, NOT when loading old ones
  useEffect(() => {
    if (isLoadingOldMessages.current) return;
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    getAllChats()
      .then((res) => {
        if (!res || !res.data) return;
        dispatch(setChats(res.data.chats));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log("📩 Received:", event, args);
    });
    return () => {
      socket.offAny();
    };
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    socket.emit("private-chat", {
      selectedChat,
      userId: profile?._id,
      selectedChatP,
    });
    getAllMessages({ chatId: selectedChat }).then((res) => {
      if (!res || !res.data) return;
      dispatch(setMessages(res.data.messages));
    });
  }, [selectedChat, dispatch]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setShowChatList(false);
    // Reset page when switching chats
    setPage(2);
  };

  useEffect(() => {
    socket.on(
      "updateMessageStatus",
      ({ messageId, status, chatId, sender, isUserOnline }) => {
        dispatch(updateMessageStatus({ messageId, status }));
      },
    );
  }, [selectedChat]);

  const sortedChats = chats
    ? [...chats].sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      })
    : [];

  const handleBackToList = () => setShowChatList(true);

  const handleReaction = (messageId: string | number, emoji: string) => {
    dispatch(
      updateReaction({ messageId: messageId.toString(), reaction: emoji }),
    );
    socket.emit("updateReaction", { messageId, reaction: emoji });
    setReactionPickerMessageId(null);
  };

  const toggleReactionPicker = (e: React.MouseEvent, messageId: number) => {
    e.stopPropagation();
    setReactionPickerMessageId((prev) =>
      prev === messageId ? null : messageId,
    );
  };

  const handleOverlayClick = () => {
    setReactionPickerMessageId(null);
    setShowEmoji(false);
  };

  const [selectReplyId, setSelectReplyId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectReplyId) return;
    if (typeof window === "undefined") return;

    const el = document.getElementById(`msg-${selectReplyId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setSelectReplyId(selectReplyId);
      const timer = setTimeout(() => setSelectReplyId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectReplyId]);

  const sendDocumentMessage = (fileUrl: string) => {
    const uniqueId = Date.now().toString();
    if (!profile) return;
    socket.emit("sendMessage", {
      chatId: selectedChat,
      msg: fileUrl,
      sender: profile._id,
      msgId: uniqueId,
      toUser: selectedChatP?.participant._id,
    });
  };

  const handleReply = (msg: any) => {
    setReplyingTo(msg);
    console.log("replying to:", msg);
  };

  const sendMessage = () => {
    const uniqueId = Date.now().toString();
    if (messageText.trim()) {
      if (!selectedChat) return;
      setMessageText("");
    }
    if (!profile) return;
    socket.emit("sendMessage", {
      chatId: selectedChat,
      msg: messageText,
      sender: profile._id,
      msgId: uniqueId,
      toUser: selectedChatP?.participant._id,
      replyingTo: replyingTo?._id,
    });
  };

  const onImgErrorHandler = () => {
    setImgError(true);
    return true;
  };

  if (profile === null) return;

  return (
    <div
      className="flex h-[calc(100vh-100px)] bg-white"
      onClick={handleOverlayClick}
    >
      {/* ── Left Sidebar ─────────────────────────────────────────────────────── */}
      <div
        className={`${
          showChatList ? "flex" : "hidden"
        } md:flex w-full md:w-[380px] lg:w-[420px] border-r border-gray-200 flex-col`}
      >
        <div className="p-3 md:p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Search name"
              prefix={<SearchOutlined className="text-gray-400" />}
              className="flex-1"
            />
            <Dropdown
              menu={{
                items: [
                  { key: "1", label: "All" },
                  { key: "2", label: "Unread" },
                  { key: "3", label: "Archived" },
                ],
              }}
            >
              <Button className="hidden sm:flex">
                All <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                items: [
                  { key: "1", label: "All" },
                  { key: "2", label: "Unread" },
                  { key: "3", label: "Archived" },
                ],
              }}
            >
              <Button icon={<MenuOutlined />} className="sm:hidden" />
            </Dropdown>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats == null ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            <Reorder.Group
              axis="y"
              values={sortedChats}
              onReorder={() => {}}
              className="flex flex-col"
            >
              {sortedChats.map((chat) => (
                <Reorder.Item
                  key={chat._id}
                  value={chat}
                  as="div"
                  className={`flex items-start gap-3 p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === chat._id ? "bg-blue-50" : ""}`}
                  onClick={() => {
                    setSelectedChatP(chat);
                    handleChatSelect(chat._id);
                  }}
                >
                  <div className="relative">
                    <Avatar
                      size={40}
                      src={
                        chat.participant.logoUrl === undefined
                          ? chat.participant.profilePictureUrl || undefined
                          : chat.participant.logoUrl || undefined
                      }
                      onError={onImgErrorHandler}
                    >
                      {imgError
                        ? chat.participant.companyName === undefined
                          ? chat.participant.fullName?.charAt(0)
                          : chat.participant.companyName?.charAt(0)
                        : null}
                    </Avatar>
                    {chat.onlineStatus === "online" && (
                      <span className="absolute bottom-0 right-0 block w-3 h-3 bg-[#1677ff] rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm md:text-base truncate">
                        {chat.participant.companyName === undefined
                          ? chat.participant.fullName
                          : chat.participant.companyName}
                      </span>
                      <span
                        className={`text-xs ml-2 flex-shrink-0 ${
                          chat.unReadCount > 0 &&
                          chat.lastMessage.sender !== profile._id
                            ? "text-[#1677ff]"
                            : "text-gray-500"
                        }`}
                      >
                        {chat.updatedAt && formatChatTime(chat.updatedAt)}
                      </span>
                    </div>
                    <p
                      className="text-xs md:text-sm text-gray-800 flex justify-between"
                      style={{
                        fontWeight:
                          chat.unReadCount > 0 &&
                          chat.lastMessage.sender !== profile._id
                            ? "bold"
                            : "normal",
                      }}
                    >
                      <div className="truncate">
                        {chat.lastMessage.sender === profile._id && (
                          <MessageStatus
                            status={chat.lastMessage.status ?? "000"}
                          />
                        )}{" "}
                        {isImageUrl(chat.lastMessage?.text) ? (
                          <>
                            <FileImageOutlined style={{ fontSize: 18 }} />
                            Image
                          </>
                        ) : isDocumentUrl(chat.lastMessage?.text) ? (
                          <>
                            <FileTextOutlined style={{ fontSize: 18 }} />
                            Document
                          </>
                        ) : (
                          <span className="truncate">
                            {chat.lastMessage?.text ?? "No messages yet ..."}
                          </span>
                        )}
                      </div>
                      {chat.unReadCount > 0 &&
                        chat.lastMessage.sender !== profile._id && (
                          <Badge
                            color="#1677ff"
                            count={
                              chat.unReadCount > 9 ? "9+" : chat.unReadCount
                            }
                            className="mt-1 flex-shrink-0"
                          />
                        )}
                    </p>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      </div>

      {/* ── Right Side - Chat Window ──────────────────────────────────────────── */}
      <div
        className={`${!showChatList ? "flex" : "hidden"} md:flex flex-1 flex-col`}
      >
        {selectedChat ? (
          <>
            <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-gray-200">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBackToList}
                  className="md:hidden flex-shrink-0"
                />
                <Avatar
                  size={40}
                  src={
                    selectedChatP.participant.logoUrl === undefined
                      ? selectedChatP.participant.profilePictureUrl || undefined
                      : selectedChatP.participant.logoUrl || undefined
                  }
                  onError={onImgErrorHandler}
                >
                  {imgError
                    ? selectedChatP.participant.companyName === undefined
                      ? selectedChatP.participant.fullName?.charAt(0)
                      : selectedChatP.participant.companyName?.charAt(0)
                    : null}
                </Avatar>
                <span className="font-medium text-gray-900 text-sm md:text-base truncate">
                  {selectedChatP?.participant.companyName === undefined
                    ? selectedChatP?.participant.fullName
                    : selectedChatP?.participant.companyName}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs md:text-sm text-gray-500 hidden sm:block">
                  Sun, Aug 17, 3:57 PM
                </span>
                <Button type="text" icon={<MoreOutlined />} />
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={containerRef}
              className="flex-1 relative overflow-y-auto p-3 md:p-6 bg-gray-50"
            >
              <div className="sticky top-0 flex  justify-center z-10 bg-transparent py-2">
                {currentStickyDate && (
                  <div className="px-3 py-1 bg-white text-gray-600 text-xs rounded-full shadow">
                    {currentStickyDate}
                  </div>
                )}
              </div>
              {messages.length === 0 && !docLoading ? (
                <div className="text-center text-gray-500 mt-10">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="flex flex-col">
                  {messages.map((msg, index) => {
                    const currentDate = new Date(msg.createdAt).toDateString();

                    const previousDate =
                      index > 0
                        ? new Date(messages[index - 1].createdAt).toDateString()
                        : null;

                    const showDate = currentDate !== previousDate;

                    return (
                      <React.Fragment key={msg._id}>
                        {showDate && (
                          <div
                            ref={(el) => {
                              if (el) dateRefs.current[currentDate] = el;
                            }}
                            className="flex justify-center my-4"
                          >
                            <div className="px-3 py-1 bg-white text-gray-600 text-xs rounded-full">
                              {currentDate}
                            </div>
                          </div>
                        )}

                        <Message
                          selectReplyId={selectReplyId}
                          setSelectReplyId={setSelectReplyId}
                          onReply={handleReply}
                          msg={msg}
                          profile={profile}
                          hoveredMessageId={hoveredMessageId}
                          setHoveredMessageId={setHoveredMessageId}
                          handleReaction={handleReaction}
                          toggleReactionPicker={toggleReactionPicker}
                          reactionPickerMessageId={reactionPickerMessageId}
                          dispatch={dispatch}
                        />
                      </React.Fragment>
                    );
                  })}

                  {docLoading && <LoadingMessage text="Uploading..." loading />}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <InputBox
              setSelectReplyId={setSelectReplyId}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              selectedChat={selectedChat}
              sendDocumentMessage={sendDocumentMessage}
              messageText={messageText}
              setMessageText={setMessageText}
              sendMessage={sendMessage}
              setShowEmoji={setShowEmoji}
              showEmoji={showEmoji}
            />
          </>
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
