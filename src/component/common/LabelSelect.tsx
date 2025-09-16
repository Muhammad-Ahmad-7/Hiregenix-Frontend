"use client";

import React from "react";
import { Select, SelectProps } from "antd";
import type { Rule } from "antd/es/form";
import type { FormItemProps } from "antd";
import LabelWrapper from "./LabelWrapper";

type LabelSelectProps = SelectProps & {
  label: string | React.ReactNode;
  name: string;
  required?: boolean;
  rules?: Rule[];
  fullLabel?: boolean;
  itemProps?: FormItemProps; // pass additional Form.Item props
};

const LabelSelect: React.FC<LabelSelectProps> = ({
  label,
  name,
  required,
  rules,
  fullLabel,
  itemProps,
  ...rest
}) => {
  return (
    <LabelWrapper
      label={label}
      name={name}
      required={required}
      rules={rules}
      fullLabel={fullLabel}
      itemProps={itemProps}
    >
      <Select
        {...rest}
        showSearch
        optionFilterProp="label"
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
