import { Col, Flex, Form } from "antd";
import React from "react";
import { LabelInput } from "../common";
import UiButton from "../common/CustomButton";
import LabelTextArea from "../common/LabelTextArea";
import type { SelectProps } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Define proper types for form values
export interface Step3FormValues {
  skills: string[];
  bio: string;
  tagline?: string;
}

type Step3FormProps = {
  onNext: (values: Step3FormValues) => void;
  onBack: () => void;
  initialValues?: Partial<Step3FormValues>;
};

// Generate options for skills select
const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

export default function Step3Form({
  onNext,
  onBack,
  initialValues,
}: Step3FormProps) {
  const [form] = Form.useForm<Step3FormValues>();

  const onFinish = (values: Step3FormValues) => {
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
          {/* <LabelSelect
            label={
              <span>
                Skills{" "}
                <span className="text-gray-500 dark:text-[var(--text-subtle)] text-sm">(upto 10)</span>
              </span>
            }
            maxCount={10}
            name="skills"
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Tags Mode"
            onChange={handleChange}
            options={skillsOptions}
          /> */}
        </Col>
        <Col span={24}>
          <LabelTextArea
            name="bio"
            label="Bio (max 500 characters)"
            placeholder="Write about yourself..."
            required
            autoSize={{ minRows: 3, maxRows: 5 }}
            itemProps={{ tooltip: "(optional)" }}
            maxLength={500}
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="tagline"
            label="Tagline"
            placeholder="e.g Frontend Developer | MERN Stack expert"
          />
        </Col>
      </div>
      <Flex gap="small" wrap className="!mt-6">
        <Col span={2}>
          <UiButton onClick={onBack} block size="large" className="!rounded-xl">
            <ArrowLeftOutlined />
          </UiButton>
        </Col>
        <Col span={6}>
          <UiButton
            htmlType="submit"
            type="primary"
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
