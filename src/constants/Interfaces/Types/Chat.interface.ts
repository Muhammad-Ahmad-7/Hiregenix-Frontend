import { Role } from "./Auth.interface";

export interface IChatParticipant {
  _id: string;
  email: string;
  role: Role;
  companyName?: string;
  logoUrl?: string | null;

  fullName?: string;
  profilePictureUrl?: string | null;
}

export interface IChat {
  _id: string;
  participant: IChatParticipant;
  participantType: Role;
  lastMessage: IMessage;
  lastMessageAt: Date | string | null; // ISO UTC string
  unReadCount: number;
  onlineStatus?: "online" | "offline";
  createdAt: string; // ISO UTC string
  updatedAt: string; // ISO UTC string
}
export type MessageStatus = "sent" | "delivered" | "seen";

export interface IMessage {
  _id: string;
  chat: string;
  sender: string;
  text: string;
  status: MessageStatus;
  reaction: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
