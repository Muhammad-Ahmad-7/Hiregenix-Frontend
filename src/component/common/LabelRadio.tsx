"use client";

import React from "react";
import { Radio, RadioGroupProps } from "antd";
import LabelWrapper from "./LabelWrapper";

type LabelRadioGroupProps = RadioGroupProps & {
  label: string;
  name: string;
  required?: boolean;
  itemProps?: unknown; // rules, tooltip, etc.
  options?: { label: string; value: string | number }[]; // convenient option format
};

const LabelRadioGroup: React.FC<LabelRadioGroupProps> = ({
  label,
  name,
  required,
  itemProps,
  options,
  children,
  ...rest
}) => {
  return (
    <LabelWrapper label={label} name={name} required={required} {...itemProps}>
      <Radio.Group {...rest}>
        {options
          ? options.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                {opt.label}
              </Radio>
            ))
          : children}
      </Radio.Group>
    </LabelWrapper>
  );
};

export default LabelRadioGroup;
