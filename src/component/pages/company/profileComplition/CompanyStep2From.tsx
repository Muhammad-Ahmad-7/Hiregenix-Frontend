import { Col, Flex, Form, Row, Typography } from "antd";
import React from "react";
import PlusIcon from "@/icons/PlusIcon";
import {
  LabelDatePicker,
  LabelInput,
  LabelPhoneNumber,
  LabelSelect,
} from "../../../common";
import UiButton from "../../../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";
const { Text } = Typography;
type CompanyStep2FromProps = {
  onNext: () => void;
  onBack: () => void;

  initialValues?: { any };
};

export default function CompanyStep2From({
  onNext,
  onBack,
  initialValues,
}: CompanyStep2FromProps) {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form Values:", values);

    onNext(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      validateTrigger="onSubmit" // only validate when clicking Next
    >
      <div className="flex flex-col ">
        <Col span={24}>
          <LabelInput
            name="linkedInUrl"
            label="Linkdin Url"
            itemProps={{ tooltip: "(optional)" }}
            placeholder="e.g : linkdin.com/ad-dev07"
            required
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
            // type="email"
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="website"
            label=" Website Link  "
            required
            // label="Website Url"
            placeholder="e.g : abd.com"
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
            // type="email"
          />
        </Col>
        {/* <Col span={24} className="bg-red-600 flex justify-start"> */}
        {/* <UiButton type="link" className=" !justify-start !px-0">
          Add Addition Link +
        </UiButton> */}
        {/* </Col> */}
      </div>
      <Flex gap="small" wrap className="!mt-6">
        <Col span={2}>
          <UiButton onClick={onBack} block size="large" className="!rounded-xl">
            <LeftArrow />
          </UiButton>
        </Col>
        <Col span={6}>
          <UiButton
            htmlType="submit"
            type="primary"
            onClick={() => {}}
            block
            size="large"
            className="!rounded-xl"
          >
            Next
          </UiButton>
        </Col>
      </Flex>
    </Form>
  );
}
