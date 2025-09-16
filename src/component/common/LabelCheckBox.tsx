"use client";

import React from "react";
import { Checkbox } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox"; // ✅ correct import
import LabelWrapper from "./LabelWrapper";
import { Rule } from "antd/es/form";

type LabelCheckboxGroupProps = CheckboxGroupProps & {
  label?: string;
  name?: string;
  required?: boolean;
  rules?: Rule[];
  fullLabel?: boolean;
};

const LabelCheckboxGroup: React.FC<LabelCheckboxGroupProps> = ({
  label,
  name,
  required = false,
  rules,
  fullLabel,
  ...rest
}) => {
  if (!(label && name)) {
    return <Checkbox.Group {...rest} />;
  }
  return (
    <LabelWrapper
      label={label}
      name={name}
      required={required}
      rules={rules}
      fullLabel={fullLabel}
    >
      <Checkbox.Group {...rest} />
    </LabelWrapper>
  );
};

export default LabelCheckboxGroup;
