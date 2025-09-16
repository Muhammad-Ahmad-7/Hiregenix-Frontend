"use client";

import React from "react";
import { DatePicker, DatePickerProps } from "antd";
import LabelWrapper from "./LabelWrapper";

type LabelDatePickerProps = DatePickerProps & {
  label: string;
  name: string;
  required?: boolean;
};

const LabelDatePicker: React.FC<LabelDatePickerProps> = ({
  label,
  name,
  required,
  ...rest
}) => {
  return (
    <LabelWrapper label={label} name={name} required={required}>
      <DatePicker className="w-full" {...rest} />
    </LabelWrapper>
  );
};

export default LabelDatePicker;
