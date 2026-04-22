"use client";

import React, { useState } from "react";
import {
  Col,
  Form,
  Row,
  Typography,
  Spin,
  Button,
  Tooltip,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import UiButton from "../../../common/CustomButton";
import { createJobApi } from "@/app/api/job/jobs.api";
import { Dayjs } from "dayjs";
import { JobPostingCompany } from "@/constants/Interfaces/Types/Jobs.interface";
import { ExperienceLevel, WorkMode } from "@/constants/enums";
import { generateJobDataUsingAIApi } from "@/app/api/company/jobs.api";
import { SparklesIcon } from "lucide-react";
import toast from "react-hot-toast";

const { Title } = Typography;
const { TextArea } = Input;

interface CreateJobFormValues {
  title: string;
  role: string;
  interviewGuideline: string;
  experienceLevel: string;
  description: string;
  skills: string[];
  requirements: string[];
  workMode: string;
  city: string;
  country: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  deadline: Dayjs;
  status: "open" | "closed";
}

export default function CreateJob() {
  const [form] = Form.useForm<CreateJobFormValues>();
  const jobTitle = Form.useWatch("title", form);
  const role = Form.useWatch("role", form);
  const workMode = Form.useWatch("workMode", form);
  const experienceLevel = Form.useWatch("experienceLevel", form);
  const skills = Form.useWatch("skills", form);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({
    description: false,
    requirements: false,
    interviewGuideline: false,
  });

  const isAnyAiLoading =
    aiLoading.description || aiLoading.requirements || aiLoading.interviewGuideline;

  const canAutoFill =
    !!jobTitle?.trim() &&
    !!role?.trim() &&
    !!workMode?.trim() &&
    !!experienceLevel?.trim() &&
    !!skills?.length;

  const workModes = [
    { label: "Remote", value: "remote" },
    { label: "Full Time", value: "full-time" },
    { label: "Part Time", value: "part-time" },
  ];

  const experienceLevels = [
    { label: "Entry", value: "entry" },
    { label: "Mid", value: "mid" },
    { label: "Senior", value: "senior" },
  ];

  const statuses = [
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
  ];

  const skillsOptions = [
    { label: "JavaScript", value: "JavaScript" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "React", value: "React" },
    { label: "Node.js", value: "Node.js" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "Appium", value: "Appium" },
    { label: "Postman", value: "Postman" },
    { label: "JIRA", value: "JIRA" },
    { label: "TestRail", value: "TestRail" },
    { label: "SQL", value: "SQL" },
    { label: "MongoDB", value: "MongoDB" },
    { label: "AWS", value: "AWS" },
    { label: "Docker", value: "Docker" },
    { label: "Git", value: "Git" },
  ];

  const requirementsOptions = [
    {
      label: "Bachelor's degree in Computer Science or related field",
      value: "Bachelor's degree in Computer Science or related field",
    },
    { label: "1-3 years of experience", value: "1-3 years of experience" },
    { label: "3-5 years of experience", value: "3-5 years of experience" },
    { label: "5+ years of experience", value: "5+ years of experience" },
    { label: "Strong problem-solving skills", value: "Strong problem-solving skills" },
    { label: "Excellent communication skills", value: "Excellent communication skills" },
    {
      label: "Ability to work in a team environment",
      value: "Ability to work in a team environment",
    },
    {
      label: "Experience with Agile methodologies",
      value: "Experience with Agile methodologies",
    },
    { label: "Knowledge of mobile testing", value: "Knowledge of mobile testing" },
    {
      label: "Experience with bug tracking tools",
      value: "Experience with bug tracking tools",
    },
    {
      label: "Self-motivated and detail-oriented",
      value: "Self-motivated and detail-oriented",
    },
  ];

  const onFinish = async (values: CreateJobFormValues) => {
    const jobData: JobPostingCompany = {
      title: values.title,
      role: values.role,
      interviewGuideline: values.interviewGuideline,
      experienceLevel: values.experienceLevel as ExperienceLevel,
      description: values.description,
      requiredSkills: values.skills || [],
      requirements: values.requirements || [],
      workMode: values.workMode as WorkMode,
      location: { city: values.city, country: values.country },
      salaryRange: {
        min: Number(values.minSalary),
        max: Number(values.maxSalary),
        currency: values.currency,
      },
      deadline: values.deadline?.toDate?.().toISOString() || "",
      status: values.status,
    };

    try {
      setLoading(true);
      const res = await createJobApi(jobData);
      if (!res) return;
      if (res.status === "Success") {
        toast.success("Job created successfully!");
        form.resetFields();
      } else {
        toast.error("Failed to create job. Try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong while creating the job.");
    } finally {
      setLoading(false);
    }
  };

  const generateJobData = async (
    type: "description" | "requirements" | "interviewGuideline"
  ) => {
    setAiLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await generateJobDataUsingAIApi({
        jobTitle: form.getFieldValue("title") || "Software Engineer",
        jobRole: form.getFieldValue("role") || "Software Engineer",
        experienceLevel: form.getFieldValue("experienceLevel") || "mid",
        workMode: form.getFieldValue("workMode") || "full-time",
        skills: form.getFieldValue("skills") || [],
        type,
      });

      if (!res || res.status !== "Success") {
        toast.error("Failed to generate job data. Please try again.");
        return;
      }

      const d = res.data?.jobData;
      if (!d) {
        toast.error("No data returned from AI. Please try again.");
        return;
      }

      if (type === "description") {
        form.setFieldValue("description", d.jobDescription || "");
      } else if (type === "interviewGuideline") {
        form.setFieldValue("interviewGuideline", d.interviewGuideline || "");
      } else if (type === "requirements") {
        form.setFieldValue("requirements", d.requirements || []);
      }

      toast.success("✨ Field filled with AI-generated data!");
    } catch (error) {
      console.error("Error generating job data using AI:", error);
      toast.error("Something went wrong while generating job data.");
    } finally {
      // Always reset — this was a bug source in the original code
      setAiLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const AutoFillButton = ({
    type,
  }: {
    type: "description" | "requirements" | "interviewGuideline";
  }) => (
    <Tooltip title={!canAutoFill ? "Complete required fields first" : "Auto-fill using AI"}>
      <Button
        onClick={() => generateJobData(type)}
        loading={aiLoading[type]}
        disabled={loading || !canAutoFill}
        icon={!aiLoading[type] && <SparklesIcon size={15} />}
        className="!flex !items-center !gap-1 !border-purple-400 !text-purple-600 hover:!bg-purple-50"
      >
        {aiLoading[type] ? "Generating..." : "Auto-fill"}
      </Button>
    </Tooltip>
  );

  return (
    <Col xs={24} md={16} className="p-4 lg:px-16 lg:py-8">
      <div className="flex items-center justify-between !mb-6">
        <Title level={2} className="!mb-0">
          Create New Job
        </Title>
      </div>

      {/* 
        KEY FIX: Removed `disabled` from <Form> entirely.
        Disabling the whole form was blocking manual typing whenever
        any aiLoading key got stuck or was briefly true.
        Individual fields are disabled below only when needed.
      */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Row 1: Title & Role */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Job Title"
              rules={[{ required: true, message: "Job title is required" }]}
            >
              <Input placeholder="e.g. Mobile App Tester" disabled={loading} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Job Role"
              rules={[{ required: true, message: "Job role is required" }]}
            >
              <Input placeholder="e.g. QA Engineer" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: Experience Level & Status */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="experienceLevel"
              label="Experience Level"
              rules={[{ required: true, message: "Experience level is required" }]}
            >
              <Select
                placeholder="Select experience level"
                options={experienceLevels}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Status is required" }]}
            >
              <Select
                placeholder="Select job status"
                options={statuses}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Work Mode & Deadline */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="workMode"
              label="Work Mode"
              rules={[{ required: true, message: "Work mode is required" }]}
            >
              <Select
                placeholder="Select work mode"
                options={workModes}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deadline"
              label="Application Deadline"
              rules={[{ required: true, message: "Deadline is required" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select deadline"
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: City & Country */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "City is required" }]}
            >
              <Input placeholder="City" disabled={loading} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input placeholder="Country" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Salary */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="minSalary"
              label="Min Salary"
              rules={[{ required: true, message: "Min salary is required" }]}
            >
              <InputNumber
                placeholder="80000"
                style={{ width: "100%" }}
                min={0}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="maxSalary"
              label="Max Salary"
              rules={[{ required: true, message: "Max salary is required" }]}
            >
              <InputNumber
                placeholder="130000"
                style={{ width: "100%" }}
                min={0}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: "Currency is required" }]}
            >
              <Input placeholder="PKR" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>

        {/* Skills */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="skills"
              label={
                <span>
                  Skills{" "}
                  <span style={{ color: "rgba(0,0,0,.45)" }}>(up to 5)</span>
                </span>
              }
              rules={[{ required: true, message: "At least one skill is required" }]}
            >
              <Select
                mode="tags"
                maxCount={5}
                style={{ width: "100%" }}
                placeholder="Type or select skills"
                options={skillsOptions}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <div className="mt-2 mb-2 flex justify-end">
          <AutoFillButton type="description" />
        </div>
        <Form.Item
          name="description"
          label="Job Description"
          rules={[{ required: true, message: "Job description is required" }]}
        >
          {/* KEY FIX: TextArea instead of Input — lets users type freely */}
          <TextArea
            rows={5}
            placeholder="Describe the role..."
            disabled={loading || aiLoading.description}
          />
        </Form.Item>

        {/* Interview Guideline */}
        <div className="mt-2 mb-2 flex justify-end">
          <AutoFillButton type="interviewGuideline" />
        </div>
        <Form.Item
          name="interviewGuideline"
          label="Interview Guideline"
          rules={[{ required: true, message: "Interview guideline is required" }]}
        >
          <TextArea
            rows={5}
            placeholder="Explain what the interviewer should focus on..."
            disabled={loading || aiLoading.interviewGuideline}
          />
        </Form.Item>

        {/* Requirements */}
        <div className="mt-2 mb-2 flex justify-end">
          <AutoFillButton type="requirements" />
        </div>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="requirements"
              label="Requirements"
              rules={[{ required: true, message: "At least one requirement is required" }]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Type or select requirements"
                options={requirementsOptions}
                disabled={loading || aiLoading.requirements}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit */}
        <div className="mt-6 flex justify-start">
          <UiButton
            htmlType="submit"
            type="primary"
            block
            size="large"
            loading={loading}
            disabled={loading || isAnyAiLoading}
            className="!rounded-xl !w-40"
          >
            {loading ? "Creating..." : "Create Job"}
          </UiButton>
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-6">
            <Spin />
          </div>
        )}
      </Form>
    </Col>
  );
}