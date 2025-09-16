"use client";

import React from "react";
import { Select, SelectProps } from "antd";
import LabelWrapper from "./LabelWrapper";

type LabelSelectProps = SelectProps & {
  label: string;
  name: string;
  required?: boolean;
};

const LabelSelect: React.FC<LabelSelectProps> = ({
  label,
  name,
  required,
  ...rest
}) => {
  return (
    <LabelWrapper label={label} name={name} required={required}>
      <Select
        {...rest}
        showSearch
        optionFilterProp="label" // 🔑 ensures search uses the "label"
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
      />
    </LabelWrapper>
  );
};

export default LabelSelect;
