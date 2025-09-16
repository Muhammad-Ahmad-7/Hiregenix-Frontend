// components/UiButton.tsx
"use client";

import React from "react";
import { Button, ButtonProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UiButtonProps = ButtonProps & {
  href?: string; // for navigation
  onClick?: () => void; // for custom action
};

const UiButton: React.FC<UiButtonProps> = ({
  href,
  onClick,
  children,
  className,
  ...rest
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    if (href) router.push(href);
  };

  // If href is provided, wrap with Link
  if (href) {
    return (
      <Link href={href} passHref>
        <Button {...rest} className={className}>
          {children}
        </Button>
      </Link>
    );
  }

  // Otherwise just normal Button
  return (
    <Button {...rest} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default UiButton;
