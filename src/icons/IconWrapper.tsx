import React from "react";

export default function IconWrapper({
  icon,
  bgColorIcon,
}: {
  icon: React.ReactNode;
  bgColorIcon: string;
}) {
  return (
    <div
      className="w-8 h-8 flex justify-center items-center rounded-full border-[1px] border-[#F0F0F0]"
      style={{ backgroundColor: bgColorIcon }}
    >
      {icon}
    </div>
  );
}
