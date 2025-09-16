"use client";

import React from "react";
import { Input, InputProps, Typography } from "antd";

const { Text } = Typography;

type InputWrapperProps = InputProps & {
  label: string;
  required?: boolean;
};

const LabelInput: React.FC<InputWrapperProps> = ({
  label,
  required,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Text className="font-normal text-[#000000D9]">
        {label} {required && <span className="text-red-500">*</span>}
      </Text>
      <Input {...rest} />
    </div>
  );
};

export default LabelInput;
