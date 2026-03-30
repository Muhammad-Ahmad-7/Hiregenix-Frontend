import { CheckOutlined } from "@ant-design/icons";
import React from "react";

export default function MessageStatus({ status }: { status?: string }) {
  const s = status?.toLowerCase();
  if (s === "sent")
    return (
      <CheckOutlined className="text-gray-300 flex items-end text-[10px] w-3 h-3" />
    );
  if (s === "delivered") {
    return (
      <span className="relative inline-flex items-end text-gray-300  text-[10px] w-3 h-3">
        <CheckOutlined className="absolute left-0.5" />
        <CheckOutlined className="absolute left-0" />
      </span>
    );
  }
  if (s === "seen") {
    return (
      <span className="relative inline-flex text-blue-400 items-end text-[10px] w-3 h-3">
        <CheckOutlined className="absolute left-0.5" />
        <CheckOutlined className="absolute left-0" />
      </span>
    );
  }
  return null;
}
