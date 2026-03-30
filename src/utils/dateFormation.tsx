export const formatChatTime = (utcDate: Date | string) => {
  if (!utcDate) return "";

  const date = new Date(utcDate);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
};
export const getTimeOnly = (utcDate: Date | string) => {
  if (!utcDate) return "";

  const date = new Date(utcDate);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
