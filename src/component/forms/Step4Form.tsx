import { Col, Flex, Form, Modal, Typography, Checkbox } from "antd";
import React, { useState } from "react";
import UiButton from "../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";

const { Paragraph, Title } = Typography;

export interface Step4FormValues {
  extractData?: string[];
  dataPolicy?: string[];
  terms?: string[];
}

interface CheckboxState {
  extractData: boolean;
  dataPolicy: boolean;
  terms: boolean;
}

type Step4FormProps = {
  onNext: (values: Step4FormValues) => void;
  onBack: () => void;
  initialValues?: Partial<Step4FormValues>;
};

export default function Step4Form({
  onNext,
  onBack,
}: Step4FormProps) {
  const [form] = Form.useForm<Step4FormValues>();

  const [checkboxState, setCheckboxState] = useState<CheckboxState>({
    extractData: false,
    dataPolicy: false,
    terms: false,
  });

  const [modalType, setModalType] = useState<"data" | "terms" | null>(null);

  const onFinish = (values: Step4FormValues) => {
    onNext(values);
  };

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <div className="flex flex-col gap-4 my-10">

          {/* Extract Data */}
          <Checkbox
            checked={checkboxState.extractData}
            onChange={(e) => {
              const checked = e.target.checked;
              setCheckboxState((prev) => ({
                ...prev,
                extractData: checked,
              }));
              form.setFieldValue("extractData", checked ? ["yes"] : []);
            }}
          >
            Allow extraction of resume data
          </Checkbox>

          {/* Data Policy */}
          <Checkbox
            checked={checkboxState.dataPolicy}
            onChange={(e) => {
              const checked = e.target.checked;
              setCheckboxState((prev) => ({
                ...prev,
                dataPolicy: checked,
              }));
              form.setFieldValue("dataPolicy", checked ? ["yes"] : []);
            }}
          >
            I agree to{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // 🔥 prevents checkbox toggle
                setModalType("data");
              }}
            >
              Data Policy
            </span>
          </Checkbox>

          {/* Terms */}
          <Checkbox
            checked={checkboxState.terms}
            onChange={(e) => {
              const checked = e.target.checked;
              setCheckboxState((prev) => ({
                ...prev,
                terms: checked,
              }));
              form.setFieldValue("terms", checked ? ["yes"] : []);
            }}
          >
            I agree to{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // 🔥 prevents checkbox toggle
                setModalType("terms");
              }}
            >
              Terms & Conditions
            </span>
          </Checkbox>
        </div>

        <Flex gap="small">
          <Col span={2}>
            <UiButton onClick={onBack} block>
              <LeftArrow />
            </UiButton>
          </Col>

          <Col span={6}>
            <UiButton
              className=""
              htmlType="submit"
              type="primary"
              block
              disabled={
                !checkboxState.extractData ||
                !checkboxState.dataPolicy ||
                !checkboxState.terms
              }
            >
              Lets Start
            </UiButton>
          </Col>
        </Flex>
      </Form>

      {/* MODAL */}
      <Modal
        open={!!modalType}
        onCancel={() => setModalType(null)}
        footer={
          <UiButton onClick={() => setModalType(null)} type="primary">
            Close
          </UiButton>
        }
        width={700}
      >
        <div className="max-h-[400px] overflow-y-auto pr-2">
          {modalType === "data" && <DataPolicy />}
          {modalType === "terms" && <Terms />}
        </div>
      </Modal>
    </>
  );
}

function DataPolicy() {
  return (
    <>
      <Title level={4}>Data Policy</Title>

      <Paragraph>
        We collect personal data such as name, email, and resume information to
        provide AI-powered recruitment services.
      </Paragraph>

      <Paragraph>
        Your data is processed to extract skills, experience, and match job
        opportunities.
      </Paragraph>

      <Paragraph>
        We do not sell your data. Data may be shared with recruiters using the
        platform.
      </Paragraph>

      <Paragraph>
        While we apply security measures, no system is completely secure.
      </Paragraph>

      <Paragraph>
        You may request deletion or access to your data at any time.
      </Paragraph>
    </>
  );
}

function Terms() {
  return (
    <>
      <Title level={4}>Terms & Conditions</Title>

      <Paragraph>
        By using HireGenix, you agree to provide accurate information and not
        misuse the platform.
      </Paragraph>

      <Paragraph>
        AI results are not guaranteed to be accurate. All hiring decisions are
        your responsibility.
      </Paragraph>

      <Paragraph>
        You are responsible for your account and uploaded data.
      </Paragraph>

      <Paragraph>
        We are not liable for decisions made using this platform.
      </Paragraph>

      <Paragraph>
        We may suspend accounts that violate terms.
      </Paragraph>
    </>
  );
}