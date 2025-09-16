import { Form, Button } from "antd";
import LabelInput from "../common/LabelInput";
import LabelDatePicker from "../common/LabelDatePicker";

const MyForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form Values:", values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
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
