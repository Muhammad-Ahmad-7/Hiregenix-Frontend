"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Input,
  Avatar,
  Badge,
  Dropdown,
  Button,
  Skeleton,
  Modal,
  List,
} from "antd";
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
  createChatApi,
  getAllChats,
  getAllMessages,
} from "@/app/api/chat/chats.api";
import { formatChatTime } from "@/utils/dateFormation";
import {
  setChats,
  setLoading as setChatsLoading,
  updateLastMessageStatus,
  updateOnlineStatus,
  updateUnreadCount,
} from "@/redux/slices/chat/chatsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Reorder } from "framer-motion";
import { socket } from "@/socket";
import EmptyChatState from "@/component/chats/EmptyChatState";
import {
  getAllCompaniesApi,
  type CompanyListItem,
} from "@/app/api/company/companies.api";
import { IChat, IMessage } from "@/constants/Interfaces/Types/Chat.interface";
import {
  addMessage,
  clearMessages,
  prependMessages,
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
import { useRouter } from "next/navigation";

const getDateKey = (dateStr: string) =>
  new Date(dateStr).toISOString().split("T")[0];

const getDateLabel = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const MessagingInterface = () => {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedChatP, setSelectedChatP] = useState<IChat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [page, setPage] = useState(2);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [companiesModalOpen, setCompaniesModalOpen] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyListItem[] | null>(null);
  const [companiesSearch, setCompaniesSearch] = useState("");
  const { profile } = useSelector((state: RootState) => state.user);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [reactionPickerMessageId, setReactionPickerMessageId] = useState<
    string | null
  >(null);
  const { messages } = useSelector((state: RootState) => state.messages);
  const [docLoading, setDocLoading] = useState(false);
  const dispatch = useDispatch();

  const [currentStickyDate, setCurrentStickyDate] = useState<string | null>(
    null,
  );
  const [stickyVisible, setStickyVisible] = useState(false);

  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isLoadingOldMessages = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const stickyHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [imgError, setImgError] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const [selectReplyId, setSelectReplyId] = useState<string | null>(null);

  // ── Sticky Date Calculator ─────────────────────────────────────────────────
  const updateStickyDate = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;
    const STICKY_OFFSET = 50;

    const entries = Object.entries(dateRefs.current)
      .filter(([, el]) => el !== null)
      .map(([date, el]) => ({
        date,
        top: el!.getBoundingClientRect().top - containerTop,
      }))
      .sort((a, b) => a.top - b.top);

    if (entries.length === 0) return;

    let active = entries[0].date;
    for (const entry of entries) {
      if (entry.top <= STICKY_OFFSET) {
        active = entry.date;
      }
    }

    setCurrentStickyDate(active);

    // Show pill immediately
    setStickyVisible(true);

    // Reset the hide timer on every scroll
    if (stickyHideTimer.current) clearTimeout(stickyHideTimer.current);
    stickyHideTimer.current = setTimeout(() => {
      setStickyVisible(false);
    }, 4000);
  };

  // Cleanup hide timer on unmount
  useEffect(() => {
    return () => {
      if (stickyHideTimer.current) clearTimeout(stickyHideTimer.current);
    };
  }, []);

  // ── File upload socket events ──────────────────────────────────────────────
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

  // ── Scroll handler: pagination + sticky date ───────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      lastScrollTop.current = container.scrollTop;

      // Update sticky date on every scroll tick (up or down)
      updateStickyDate();

      // Pagination: load older messages when scrolled to top
      if (container.scrollTop <= 0 && selectedChat) {
        const scrollHeightBefore = container.scrollHeight;
        isLoadingOldMessages.current = true;
        setIsLoadingOlder(true);
        const requestChatId = selectedChat;
        const requestPage = page;

        getAllMessages({
          chatId: selectedChat,
          params: { page, limit: 20 },
        }).then((res) => {
          // Ignore late responses for a previously selected chat/page
          if (selectedChat !== requestChatId || page !== requestPage) {
            isLoadingOldMessages.current = false;
            setIsLoadingOlder(false);
            return;
          }
          if (!res?.data) return;
          dispatch(prependMessages(res.data.messages));
          setPage((prev) => prev + 1);

          requestAnimationFrame(() => {
            const scrollDiff = container.scrollHeight - scrollHeightBefore;
            container.scrollTop = scrollDiff;
            isLoadingOldMessages.current = false;
            setIsLoadingOlder(false);
          });
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selectedChat, page, dispatch]);

  // Re-calculate sticky date after messages repaint
  useEffect(() => {
    const timer = setTimeout(() => updateStickyDate(), 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // ── Incoming message socket ────────────────────────────────────────────────
  useEffect(() => {
    socket.on("updateReaction", ({ messageId, reaction }) => {
      dispatch(updateReaction({ messageId, reaction }));
    });

    socket.on(
      "sendMessage",
      ({ chatId, msg, msgId, sender, isUserOnline, replyingTo }) => {
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
              replyingTo:
                replyingTo && typeof replyingTo === "string"
                  ? (() => {
                      const ref = messages.find((m) => m._id === replyingTo);
                      return ref ? { _id: ref._id, text: ref.text } : null;
                    })()
                  : replyingTo && typeof replyingTo === "object"
                    ? { _id: replyingTo._id, text: replyingTo.text }
                    : null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            selectedId: selectedChat,
            userId: profile?._id,
            isUserOnline,
          }),
        );
      },
    );

    return () => {
      socket.off("sendMessage");
      socket.off("updateReaction");
    };
  }, [selectedChat, selectedChatP, profile, dispatch, messages]);

  // ── Seen status socket ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    socket.on("updateAllMessagesStatusToSeen", ({ selectedChat: chatId }) => {
      dispatch(
        updateAllMessagesStatusToSeen({ chatId, userId: profile.userId._id }),
      );
      dispatch(updateLastMessageStatus({ status: "seen", chatId }));
    });
  }, [profile, dispatch]);

  const { chats, loading: chatsLoading } = useSelector(
    (state: RootState) => state.chats,
  );

  const filteredCompanies = useMemo(() => {
    const q = companiesSearch.trim().toLowerCase();
    if (!companies) return [];
    if (!q) return companies;
    return companies.filter((c) => {
      const name = (c.companyName ?? "").toLowerCase();
      const email = (c.contactEmail ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [companies, companiesSearch]);

  // ── Online/offline socket ──────────────────────────────────────────────────
  useEffect(() => {
    socket.on("iAmOnline", (onlineUserId: string) => {
      if (!profile) return;
      const yeschats = chats?.find((c) => c.participant._id === onlineUserId);
      if (yeschats) {
        dispatch(
          updateAllMessagesStatusToDelivered({
            userId: profile.userId._id,
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
      dispatch(
        updateOnlineStatus({ userId: offlineUserId, onlineStatus: "offline" }),
      );
    });

    return () => {
      socket.off("iAmOnline");
      socket.off("iAmOffline");
    };
  }, [chats, profile, dispatch]);

  // ── Message status socket ──────────────────────────────────────────────────
  useEffect(() => {
    socket.on("updateMessageStatus", ({ messageId, status }) => {
      dispatch(updateMessageStatus({ messageId, status }));
    });
    return () => {
      socket.off("updateMessageStatus");
    };
  }, [selectedChat, dispatch]);

  // ── Auto-scroll to bottom for new messages only ────────────────────────────
  useEffect(() => {
    if (isLoadingOldMessages.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (selectedChat) {
      dispatch(updateUnreadCount({ chatId: selectedChat, unReadCount: -1 }));
    }
  }, [messages, dispatch, selectedChat]);

  // ── Load all chats on mount ────────────────────────────────────────────────
  useEffect(() => {
    dispatch(setChatsLoading(true));
    getAllChats()
      .then((res) => {
        if (!res?.data) return;
        dispatch(setChats(res.data.chats));
      })
      .catch(console.error)
      .finally(() => {
        dispatch(setChatsLoading(false));
      });
  }, [dispatch]);

  // ── Load companies when modal opens ────────────────────────────────────────
  useEffect(() => {
    if (!companiesModalOpen) return;
    if (companiesLoading) return;
    if (companies !== null) return;

    setCompaniesLoading(true);
    getAllCompaniesApi()
      .then((res) => {
        if (!res?.data) return;
        setCompanies(res.data.companies ?? []);
      })
      .catch(console.error)
      .finally(() => setCompaniesLoading(false));
  }, [companiesModalOpen, companiesLoading, companies]);

  const handleStartChatWithCompany = async (company: CompanyListItem) => {
    // create chat uses the company's USER id, not company profile id
    const participantUserId = company.userId;
    if (!participantUserId) return;

    const res = await createChatApi(participantUserId);
    const chat = res?.data?.chat;
    if (!chat) return;

    // Refresh sidebar list so the chat appears/sorts correctly
    dispatch(setChatsLoading(true));
    getAllChats()
      .then((r) => {
        if (!r?.data) return;
        dispatch(setChats(r.data.chats));
      })
      .catch(console.error)
      .finally(() => dispatch(setChatsLoading(false)));

    setSelectedChatP(chat);
    setSelectedChat(chat._id);
    setShowChatList(false);
    setCompaniesModalOpen(false);
  };

  // ── Debug: log all socket events ──────────────────────────────────────────
  useEffect(() => {
    socket.onAny((event, ...args) => console.log("📩 Received:", event, args));
    return () => {
      socket.offAny();
    };
  }, []);

  // ── Load messages when a chat is selected ─────────────────────────────────
  useEffect(() => {
    if (!selectedChat) return;
    dateRefs.current = {};
    setCurrentStickyDate(null);
    setStickyVisible(false);
    isLoadingOldMessages.current = false;
    dispatch(clearMessages());
    setPage(2);
    setIsMessagesLoading(true);
    setIsLoadingOlder(false);

    socket.emit("private-chat", {
      selectedChat,
      userId: profile?._id,
      selectedChatP,
    });

    const requestChatId = selectedChat;
    getAllMessages({ chatId: selectedChat })
      .then((res) => {
        if (selectedChat !== requestChatId) return;
        if (!res?.data) return;
        dispatch(setMessages(res.data.messages));
      })
      .finally(() => {
        if (selectedChat === requestChatId) setIsMessagesLoading(false);
      });
  }, [selectedChat, profile?._id, selectedChatP, dispatch]);

  // ── Reply scroll-to ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectReplyId) return;
    const el = document.getElementById(`msg-${selectReplyId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const timer = setTimeout(() => setSelectReplyId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectReplyId]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setShowChatList(false);
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
    setSelectedChatP(null);
    dispatch(clearMessages());
    setPage(2);
    setIsMessagesLoading(false);
    setIsLoadingOlder(false);
    dateRefs.current = {};
    setCurrentStickyDate(null);
    setStickyVisible(false);
  };

  const handleOverlayClick = () => {
    setReactionPickerMessageId(null);
    setShowEmoji(false);
  };

  const handleReaction = (messageId: string | number, emoji: string) => {
    dispatch(
      updateReaction({ messageId: messageId.toString(), reaction: emoji }),
    );
    socket.emit("updateReaction", { messageId, reaction: emoji });
    setReactionPickerMessageId(null);
  };

  const toggleReactionPicker = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation();
    setReactionPickerMessageId((prev) =>
      prev === messageId ? null : messageId,
    );
  };

  const handleReply = (msg: IMessage) => setReplyingTo(msg);

  const sendDocumentMessage = (fileUrl: string) => {
    if (!profile) return;
    socket.emit("sendMessage", {
      chatId: selectedChat,
      msg: fileUrl,
      sender: profile._id,
      msgId: Date.now().toString(),
      toUser: selectedChatP?.participant._id,
    });
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat || !profile) return;
    socket.emit("sendMessage", {
      chatId: selectedChat,
      msg: messageText,
      sender: profile._id,
      msgId: Date.now().toString(),
      toUser: selectedChatP?.participant._id,
      replyingTo: replyingTo?._id,
    });
    setMessageText("");
    setReplyingTo(null);
  };

  const onImgErrorHandler = () => {
    setImgError(true);
    return true;
  };

  const sortedChats = chats
    ? [...chats].sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA;
      })
    : [];

  if (profile === null) return null;

  return (
    <div
      className="flex h-[calc(100vh-100px)] bg-white"
      onClick={handleOverlayClick}
    >
      <Modal
        title="Companies"
        open={companiesModalOpen}
        onCancel={() => setCompaniesModalOpen(false)}
        footer={null}
        centered
      >
        <div className="mb-3">
          <Input
            value={companiesSearch}
            onChange={(e) => setCompaniesSearch(e.target.value)}
            placeholder="Search company..."
            allowClear
          />
        </div>

        {companiesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton.Avatar active size={40} shape="circle" />
                <div className="flex-1">
                  <Skeleton
                    active
                    title={{ width: "55%" }}
                    paragraph={{ rows: 1, width: "80%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <List
              dataSource={filteredCompanies}
              locale={{ emptyText: "No companies found." }}
              renderItem={(company) => (
                <List.Item
                  className="!px-0"
                  actions={[
                    <Button
                      key="view"
                      size="small"
                      onClick={() => router.push(`/auth/view/${company._id}`)}
                    >
                      View Profile
                    </Button>,
                    <Button
                      key="chat"
                      size="small"
                      type="primary"
                      onClick={() => handleStartChatWithCompany(company)}
                    >
                      Chat
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar size={40} src={company.logoUrl ?? undefined}>
                        {(company.companyName || "?").charAt(0)}
                      </Avatar>
                    }
                    title={
                      <div className="font-medium text-gray-900">
                        {company.companyName}
                      </div>
                    }
                    description={
                      <div className="text-xs text-gray-500">
                        {company.contactEmail ?? ""}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>

      {/* ── Left Sidebar ──────────────────────────────────────────────────── */}
      <div
        className={`${
          showChatList ? "flex" : "hidden"
        } md:flex w-full md:w-[380px] lg:w-[420px] border-r border-gray-200 flex-col`}
      >
        <div className="p-3 md:p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-900">Chats</div>
          </div>
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
          {chats == null || chatsLoading ? (
            <div className="p-3 md:p-4 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton.Avatar active size={40} shape="circle" />
                  <div className="flex-1 min-w-0">
                    <Skeleton
                      active
                      title={{ width: "55%" }}
                      paragraph={{ rows: 1, width: "90%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
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
                  className={`flex items-start gap-3 p-3 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === chat._id ? "bg-blue-50" : ""
                  }`}
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

      {/* ── Right Side - Chat Window ──────────────────────────────────────── */}
      <div
        className={`${!showChatList ? "flex" : "hidden"} md:flex flex-1 flex-col`}
      >
        {selectedChat ? (
          <>
            {/* Header */}
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
                    selectedChatP?.participant.logoUrl === undefined
                      ? selectedChatP?.participant.profilePictureUrl ||
                        undefined
                      : selectedChatP?.participant.logoUrl || undefined
                  }
                  onError={onImgErrorHandler}
                />
                <span className="font-medium text-gray-900 text-sm md:text-base truncate">
                  {selectedChatP?.participant.companyName === undefined
                    ? selectedChatP?.participant.fullName
                    : selectedChatP?.participant.companyName}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button type="text" icon={<MoreOutlined />} />
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={containerRef}
              className="flex-1 relative overflow-y-auto p-3 md:p-6 bg-gray-50"
            >
              {/* ── Animated Sticky Date Pill ──────────────────────────────── */}
              <div className="sticky top-0 flex justify-center z-10 pointer-events-none py-2">
                <div
                  style={{
                    transition:
                      "opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    opacity: stickyVisible && currentStickyDate ? 1 : 0,
                    transform:
                      stickyVisible && currentStickyDate
                        ? "translateY(0px) scale(1)"
                        : "translateY(-12px) scale(0.85)",
                    // Keep it in DOM always so transition plays correctly
                    pointerEvents: "none",
                  }}
                  className="px-4 py-1.5 bg-white text-gray-600 text-xs font-medium rounded-full shadow-md"
                >
                  {currentStickyDate ? getDateLabel(currentStickyDate) : ""}
                </div>
              </div>

              {isMessagesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex ${i % 3 === 0 ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[80%] w-[min(520px,80%)]">
                        <Skeleton
                          active
                          title={false}
                          paragraph={{ rows: 2, width: ["82%", "55%"] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 && !docLoading ? (
                <div className="text-center text-gray-500 mt-10">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="flex flex-col">
                  {isLoadingOlder && (
                    <div className="mb-4">
                      <Skeleton
                        active
                        title={false}
                        paragraph={{ rows: 1, width: "40%" }}
                      />
                    </div>
                  )}
                  {messages.map((msg, index) => {
                    const currentDateKey = getDateKey(msg.createdAt);
                    const previousDateKey =
                      index > 0
                        ? getDateKey(messages[index - 1].createdAt)
                        : null;
                    const showDateDivider = currentDateKey !== previousDateKey;

                    return (
                      <React.Fragment key={msg._id}>
                        {showDateDivider && (
                          <div
                            ref={(el) => {
                              dateRefs.current[currentDateKey] = el;
                            }}
                            data-date={currentDateKey}
                            className="flex justify-center my-4"
                          >
                            <div className="px-3 py-1 bg-white text-gray-600 text-xs rounded-full shadow-sm">
                              {getDateLabel(currentDateKey)}
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
          <EmptyChatState
            onCompanyChats={() => {
              setCompaniesModalOpen(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
