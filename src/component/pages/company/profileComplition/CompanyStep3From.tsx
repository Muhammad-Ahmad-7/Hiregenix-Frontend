import { Col, Flex, Form } from "antd";
import React from "react";
import { LabelSelect } from "../../../common";
import UiButton from "../../../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";
import LabelTextArea from "../../../common/LabelTextArea";
import type { SelectProps } from "antd";
import { skillsOptions } from "@/constants/job";

// Define proper types for form values
export interface CompanyStep3FormValues {
  techStack: string[];
  description: string;
  hiringStatus?: "actively_hiring" | "paused" | "not_hiring";
}

type CompanyStep3FormProps = {
  onNext: (values: CompanyStep3FormValues) => void;
  onBack: () => void;
  initialValues?: Partial<CompanyStep3FormValues>;
};

export default function CompanyStep3Form({
  onNext,
  onBack,
  initialValues,
}: CompanyStep3FormProps) {
  const [form] = Form.useForm<CompanyStep3FormValues>();

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const onFinish = (values: CompanyStep3FormValues) => {
    console.log("Form Values:", values);
    onNext(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      validateTrigger="onSubmit"
    >
      <div className="flex flex-col ">
        {/* Tech Stack */}
        <Col span={24}>
          <LabelSelect
            label={
              <span>
                Tech Stack{" "}
                <span style={{ color: "rgba(0,0,0,.45)" }}>(You work with)</span>
              </span>
            }
            name="techStack"
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Tags Mode"
            onChange={handleChange}
            options={skillsOptions}
          />
        </Col>

        {/* Description */}
        <Col span={24}>
          <LabelTextArea
            name="description"
            label="Description"
            placeholder="Write about your company..."
            required
            autoSize={{ minRows: 3, maxRows: 5 }}
            itemProps={{ tooltip: "(optional)" }}
          />
        </Col>

        {/* 🔥 Hiring Status (added here) */}
        <Col span={24}>
          <LabelSelect
            name="hiringStatus"
            label="Hiring Status"
            placeholder="Select hiring status"
            required
            options={[
              { value: "actively_hiring", label: "Actively Hiring" },
              { value: "paused", label: "Paused" },
              { value: "not_hiring", label: "Not Hiring" },
            ]}
          />
        </Col>
      </div>

      {/* Buttons */}
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
