"use client";

import React from "react";
import { Input } from "antd";
import LabelWrapper from "./LabelWrapper";

const { TextArea } = Input;

type LabelTextAreaProps = React.ComponentProps<typeof TextArea> & {
  label: string;
  name: string;
  required?: boolean;
  itemProps?: unknown; // for tooltip, rules, etc
};

const LabelTextArea: React.FC<LabelTextAreaProps> = ({
  label,
  name,
  required,
  itemProps,
  ...rest
}) => {
  return (
    <LabelWrapper label={label} name={name} required={required} {...itemProps}>
      <TextArea {...rest} />
    </LabelWrapper>
  );
};

export default LabelTextArea;
