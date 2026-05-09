import { Col, Flex, Form } from "antd";
import React from "react";
import { LabelInput } from "../common";
import UiButton from "../common/CustomButton";
import {
  gitHubUrlValidator,
  linkedInUrlValidator,
  portfolioUrlValidator,
} from "@/utils/urlValidator";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Define proper types for form values
export interface Step2FormValues {
  githubUrl: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

type Step2FormProps = {
  onNext: (values: Step2FormValues) => void;
  onBack: () => void;
  initialValues?: Partial<Step2FormValues>;
};

export default function Step2Form({
  onNext,
  onBack,
  initialValues,
}: Step2FormProps) {
  const [form] = Form.useForm<Step2FormValues>();

  const onFinish = (values: Step2FormValues) => {
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
            name="githubUrl"
            label="Github Url"
            placeholder="e.g : github.com/ad-dev07"
            required
            rules={[
              {
                required: true,
                message: "GitHub URL is required",
              },
              {
                validator: gitHubUrlValidator,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="linkedinUrl"
            label="Linkdin Url"
            itemProps={{ tooltip: "(optional)" }}
            placeholder="e.g : linkedin.com/in/ad-dev07"
            rules={[
              {
                validator: linkedInUrlValidator,
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="portfolioUrl"
            label={
              <span>
                Portfolio Url{" "}
                <span className="text-gray-400 dark:text-[var(--text-subtle)]">(optional)</span>
              </span>
            }
            placeholder="e.g : abd.com"
            rules={[
              {
                validator: portfolioUrlValidator,
              },
            ]}
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
