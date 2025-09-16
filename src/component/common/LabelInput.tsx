"use client";

import React from "react";
import { Input, InputProps } from "antd";
import LabelWrapper from "./LabelWrapper";
import type { Rule } from "antd/es/form";
import type { FormItemProps } from "antd";

type LabelInputProps = InputProps & {
  label: string | React.ReactNode;
  name: string;
  required?: boolean;
  fullLabel?: boolean;
  rules?: Rule[];
  itemProps?: FormItemProps; // pass any Form.Item props
};

const LabelInput: React.FC<LabelInputProps> = ({
  label,
  name,
  required,
  fullLabel,
  rules,
  itemProps,
  ...rest
}) => {
  return (
    <LabelWrapper
      label={label}
      name={name}
      required={required}
      fullLabel={fullLabel}
      rules={rules}
      itemProps={itemProps}
    >
      <Input {...rest} />
    </LabelWrapper>
  );
};

export default LabelInput;
