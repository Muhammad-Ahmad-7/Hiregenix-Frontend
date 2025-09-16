// "use client";

// import React from "react";
// import { Input, InputProps, Typography } from "antd";

// const { Text } = Typography;

// type InputWrapperProps = InputProps & {
//   label: string;
//   required?: boolean;
// };

// const LabelInput: React.FC<InputWrapperProps> = ({
//   label,
//   required,
//   ...rest
// }) => {
//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <Text className="font-normal text-[#000000D9]">
//         {label} {required && <span className="text-red-500">*</span>}
//       </Text>
//       <Input {...rest} />
//     </div>
//   );
// };

// export default LabelInput;
// "use client";

// import React from "react";
// import { Form, Input, InputProps } from "antd";

// type LabelInputProps = InputProps & {
//   label: string;
//   name: string;
//   required?: boolean;
// };

// const LabelInput: React.FC<LabelInputProps> = ({
//   label,
//   name,
//   required = false,
//   ...rest
// }) => {
//   return (
//     <Form.Item
//       label={label}
//       name={name}
//       rules={
//         required
//           ? [{ required: true, message: `${label} is required` }]
//           : undefined
//       }
//     >
//       <Input {...rest} />
//     </Form.Item>
//   );
// };

// export default LabelInput;
"use client";

import React from "react";
import { Input, InputProps } from "antd";
import LabelWrapper from "./LabelWrapper";

type LabelInputProps = InputProps & {
  label: string;
  name: string;
  required?: boolean;
};

const LabelInput: React.FC<LabelInputProps> = ({
  label,
  name,
  required,
  ...rest
}) => {
  return (
    <LabelWrapper label={label} name={name} required={required}>
      <Input {...rest} />
    </LabelWrapper>
  );
};

export default LabelInput;
