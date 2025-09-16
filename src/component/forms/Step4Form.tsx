import { Col, Flex, Form, Typography } from "antd";
import React, { useState } from "react";
import UiButton from "../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";
import LabelCheckboxGroup from "../common/LabelCheckBox";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const { Text } = Typography;

type Step2FormProps = {
  onNext: () => void;
  onBack: () => void;
};

export default function Step4Form({ onNext, onBack }: Step2FormProps) {
  const [form] = Form.useForm();

  // Track checkbox states individually
  const [checkboxState, setCheckboxState] = useState({
    extractData: false,
    dataPolicy: false,
    terms: false,
  });

  const onFinish = (values: any) => {
    console.log("Form Values:", values);
    form.resetFields();
    setCheckboxState({
      extractData: false,
      dataPolicy: false,
      terms: false,
    });
    onNext();
  };

  const handleCheckboxChange = (
    key: keyof typeof checkboxState,
    values: any[]
  ) => {
    const isChecked = values.length > 0;
    setCheckboxState((prev) => ({ ...prev, [key]: isChecked }));
    console.log(`${key} checked?`, isChecked); // true/false
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      validateTrigger="onSubmit" // only validate when clicking Next
    >
      <div className="flex flex-col gap-4 my-10">
        <Col span={24}>
          <LabelCheckboxGroup
            name="extractData"
            options={[
              {
                label:
                  "Allow to extract experience and certification data from resume",
                value: "yes",
              },
            ]}
            onChange={(values) => handleCheckboxChange("extractData", values)}
          />
        </Col>

        <Col span={24}>
          <LabelCheckboxGroup
            name="dataPolicy"
            options={[
              {
                label: (
                  <span>
                    I agree to RecruiterAI’s{" "}
                    <Link href={ROUTES.company} color="blue">
                      data policy
                    </Link>
                  </span>
                ),
                value: "yes",
              },
            ]}
            onChange={(values) => handleCheckboxChange("dataPolicy", values)}
          />
        </Col>

        <Col span={24}>
          <LabelCheckboxGroup
            name="terms"
            options={[
              {
                label: (
                  <span>
                    {" "}
                    I agree to{" "}
                    <Link href={ROUTES.company} color="blue">
                      terms and conditions{" "}
                    </Link>
                  </span>
                ),
                value: "yes",
              },
            ]}
            onChange={(values) => handleCheckboxChange("terms", values)}
          />
        </Col>
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
            block
            size="large"
            disabled={
              !checkboxState.extractData ||
              !checkboxState.dataPolicy ||
              !checkboxState.terms
            }
            className="!rounded-xl"
          >
            Lets Start
          </UiButton>
        </Col>
      </Flex>
    </Form>
  );
}
