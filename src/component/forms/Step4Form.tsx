import { Col, Flex, Form, Modal, Typography, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
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

function useIsCompany(): boolean {
  const [isCompany, setIsCompany] = useState(false);

  useEffect(() => {
    // Reads the segment right after /profile-completion/
    const parts = window.location.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("profile-completion");
    if (idx !== -1 && parts[idx + 1] === "company") {
      setIsCompany(true);
    }
  }, []);

  return isCompany;
}

export default function Step4Form({ onNext, onBack }: Step4FormProps) {
  const [form] = Form.useForm<Step4FormValues>();
  const isCompany = useIsCompany();

  const [checkboxState, setCheckboxState] = useState<CheckboxState>({
    extractData: false,
    dataPolicy: false,
    terms: false,
  });

  const [modalType, setModalType] = useState<"data" | "terms" | null>(null);

  const extractLabel = isCompany
    ? "Allow extraction of job posting and company data"
    : "Allow extraction of resume data";

  const onFinish = (values: Step4FormValues) => onNext(values);

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <div className="flex flex-col gap-4 my-10">

          {/* Extract Data */}
          <Checkbox
            checked={checkboxState.extractData}
            onChange={(e) => {
              const checked = e.target.checked;
              setCheckboxState((prev) => ({ ...prev, extractData: checked }));
              form.setFieldValue("extractData", checked ? ["yes"] : []);
            }}
          >
            {extractLabel}
          </Checkbox>

          {/* Data Policy */}
          <Checkbox
            checked={checkboxState.dataPolicy}
            onChange={(e) => {
              const checked = e.target.checked;
              setCheckboxState((prev) => ({ ...prev, dataPolicy: checked }));
              form.setFieldValue("dataPolicy", checked ? ["yes"] : []);
            }}
          >
            I agree to{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
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
              setCheckboxState((prev) => ({ ...prev, terms: checked }));
              form.setFieldValue("terms", checked ? ["yes"] : []);
            }}
          >
            I agree to{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
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
          {modalType === "data" && (
            isCompany ? <CompanyDataPolicy /> : <CandidateDataPolicy />
          )}
          {modalType === "terms" && (
            isCompany ? <CompanyTerms /> : <CandidateTerms />
          )}
        </div>
      </Modal>
    </>
  );
}

// ─── Candidate Policies ────────────────────────────────────────────────────────

function CandidateDataPolicy() {
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

function CandidateTerms() {
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
      <Paragraph>You are responsible for your account and uploaded data.</Paragraph>
      <Paragraph>We are not liable for decisions made using this platform.</Paragraph>
      <Paragraph>We may suspend accounts that violate terms.</Paragraph>
    </>
  );
}

// ─── Company Policies ──────────────────────────────────────────────────────────

function CompanyDataPolicy() {
  return (
    <>
      <Title level={4}>Data Policy — Company</Title>
      <Paragraph>
        We collect company information such as name, industry, contact details,
        and job postings to power AI-driven recruitment workflows.
      </Paragraph>
      <Paragraph>
        Job posting data is processed to match candidates and generate shortlists.
        Company profile data may be shown to candidates during the application
        process.
      </Paragraph>
      <Paragraph>
        We do not sell your company data to third parties. Data is used solely
        within the HireGenix platform.
      </Paragraph>
      <Paragraph>
        You are responsible for ensuring the job descriptions and requirements
        you upload comply with applicable employment laws and do not discriminate
        unlawfully.
      </Paragraph>
      <Paragraph>
        You may request deletion or export of your company data at any time by
        contacting support.
      </Paragraph>
    </>
  );
}

function CompanyTerms() {
  return (
    <>
      <Title level={4}>Terms & Conditions — Company</Title>
      <Paragraph>
        By using HireGenix as a company, you agree to post only genuine job
        openings and to use candidate data solely for recruitment purposes.
      </Paragraph>
      <Paragraph>
        AI-generated candidate rankings and interview reports are advisory only.
        All final hiring decisions remain your sole responsibility.
      </Paragraph>
      <Paragraph>
        You are responsible for your company account, all sub-users you invite,
        and any data uploaded under your organisation.
      </Paragraph>
      <Paragraph>
        HireGenix is not liable for hiring outcomes, losses, or disputes arising
        from use of the platform.
      </Paragraph>
      <Paragraph>
        Accounts found to misuse candidate data or violate platform policies will
        be suspended or permanently banned.
      </Paragraph>
    </>
  );
}