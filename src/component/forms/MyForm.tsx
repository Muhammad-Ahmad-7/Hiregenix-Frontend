// import { Form, Button } from "antd";
// import LabelInput from "../common/LabelInput";
// import LabelDatePicker from "../common/LabelDatePicker";

// const MyForm = () => {
//   const [form] = Form.useForm();

//   const onFinish = (values: any) => {
//     console.log("Form Values:", values);
//   };

//   return (
//     <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
//       <LabelInput name="firstName" label="First Name" required />
//       <LabelInput name="lastName" label="Last Name" />
//       <LabelDatePicker name="dob" label="Date of Birth" required />

//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default MyForm;
import React from "react";
import { Form, Button } from "antd";
import type { Dayjs } from "dayjs"; // for DatePicker value type
import LabelInput from "../common/LabelInput";
import LabelDatePicker from "../common/LabelDatePicker";

interface MyFormValues {
  firstName: string;
  lastName?: string;
  dob?: Dayjs; // or `string` / `Date` depending on how you handle it
}

const MyForm: React.FC = () => {
  const [form] = Form.useForm<MyFormValues>();

  const onFinish = (values: MyFormValues) => {
    console.log("Form Values:", values);
  };

  return (
    <Form<MyFormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <LabelInput name="firstName" label="First Name" required />
      <LabelInput name="lastName" label="Last Name" />
      <LabelDatePicker name="dob" label="Date of Birth" required />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
