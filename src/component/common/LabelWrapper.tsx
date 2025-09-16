"use client";

import React from "react";
import { Form } from "antd";

type LabelWrapperProps = {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
  fullLabel?: boolean;
};

const LabelWrapper: React.FC<LabelWrapperProps> = ({
  label,
  name,
  required = false,
  fullLabel = true,
  children,
}) => {
  return (
    <Form.Item
      name={name}
      label={<span>{label}</span>}
      labelCol={fullLabel ? { span: 24 } : undefined}
      wrapperCol={fullLabel ? { span: 24 } : undefined}
      rules={
        required
          ? [{ required: true, message: `${label} is required` }]
          : undefined
      }
    >
      {children}
    </Form.Item>
  );
};

export default LabelWrapper;
