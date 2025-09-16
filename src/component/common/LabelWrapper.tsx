"use client";

import React from "react";
import { Form } from "antd";
import type { FormItemProps } from "antd";
import type { Rule } from "antd/es/form";

type LabelWrapperProps = {
  label?: string | React.ReactNode;
  name: string;
  required?: boolean;
  fullLabel?: boolean;
  rules?: Rule[]; // extra rules to merge
  itemProps?: FormItemProps; // user-provided Form.Item props (tooltip, extra, validateTrigger, etc.)
  children: React.ReactNode;
};

const LabelWrapper: React.FC<LabelWrapperProps> = ({
  label = "",
  name,
  required = false,
  fullLabel = true,
  rules = [],
  itemProps,
  children,
}) => {
  // pick out rules/label/name from itemProps so they don't override our controlled values
  const {
    rules: itemPropsRules,
    label: itemPropsLabel,
    name: itemPropsName,
    labelCol: itemPropsLabelCol,
    wrapperCol: itemPropsWrapperCol,
    ...restItemProps
  } = itemProps ?? {};

  // merge rules: required rule -> itemProps.rules -> explicit rules
  const finalRules: Rule[] = [
    ...(required ? [{ required: true, message: `${label} is required` }] : []),
    ...(Array.isArray(itemPropsRules) ? itemPropsRules : []),
    ...(Array.isArray(rules) ? rules : []),
  ];

  // prefer itemProps labelCol/wrapperCol if provided, otherwise apply fullLabel default
  const labelCol = itemPropsLabelCol ?? (fullLabel ? { span: 24 } : undefined);
  const wrapperCol =
    itemPropsWrapperCol ?? (fullLabel ? { span: 24 } : undefined);

  return (
    <Form.Item
      name={name}
      label={<span>{label}</span>}
      rules={finalRules}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      {...restItemProps} // other Form.Item props (tooltip, extra, validateTrigger, colon, help, etc.)
    >
      {children}
    </Form.Item>
  );
};

export default LabelWrapper;
