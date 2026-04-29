"use client";

import React from "react";
import { FormItemProps } from "antd";
import PhoneInput, { PhoneInputProps } from "antd-phone-input";
import LabelWrapper from "./LabelWrapper";

type LabelPhoneNumberProps = PhoneInputProps & {
  label: string | React.ReactNode;
  name: string;
  required?: boolean;
  rules?: FormItemProps["rules"];
  fullLabel?: boolean;
  itemProps?: FormItemProps;
};

const LabelPhoneNumber: React.FC<LabelPhoneNumberProps> = ({
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
      <PhoneInput onlyCountries={["pk"]} enableSearch {...rest} />
    </LabelWrapper>
  );
};

export default LabelPhoneNumber;
