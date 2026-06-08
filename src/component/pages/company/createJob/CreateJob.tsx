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
import { pakistanCities, requirementsOptions, skillsOptions } from "@/constants/job";

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
  minSalary: number;
  maxSalary: number;
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

  const onFinish = async (values: CreateJobFormValues) => {
    if (values.minSalary > values.maxSalary) {
      toast.error("Min salary cannot be greater than max salary.");
      return;
    }
    const jobData: JobPostingCompany = {
      title: values.title,
      role: values.role,
      interviewGuideline: values.interviewGuideline,
      experienceLevel: values.experienceLevel as ExperienceLevel,
      description: values.description,
      requiredSkills: values.skills || [],
      requirements: values.requirements || [],
      workMode: values.workMode as WorkMode,
      location: { city: values.city, country: "Pakistan" }, // Country is hardcoded for now
      salaryRange: {
        min: Number(values.minSalary),
        max: Number(values.maxSalary),
        currency: "PKR", // Currency is hardcoded for now
      },
      deadline: values.deadline?.toDate?.().toISOString() || "",
      status: "open", // Defaulting to open, can be changed later if needed
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

      toast.success("Field filled with AI-generated data!");
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
    <Tooltip title={!canAutoFill ? "Complete the above fields first" : "Auto-fill using AI"}>
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
    <Col xs={24} md={20} lg={16} className="p-4 lg:px-16 lg:py-8 mx-auto">
      <div className="flex items-center justify-between !mb-6">
        <Title level={2} className="!mb-0">
          Create New Job
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark="optional"
      >
        {/* Row 1: Title & Role - Stacks on mobile (24), side-by-side on tablet+ (12) */}
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="title"
              label={
                <span>
                  Job Title <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Job title is required" }]}
            >
              <Input placeholder="e.g. Mobile App Tester" disabled={loading} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="role"
              label={
                <span>
                  Job Role <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Job role is required" }]}
            >
              <Input placeholder="e.g. QA Engineer" disabled={loading} />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: Experience Level & Status */}
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="experienceLevel"
              label={
                <span>
                  Experience Level <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Experience level is required" }]}
            >
              <Select
                placeholder="Select experience level"
                options={experienceLevels}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="workMode"
              label={
                <span>
                  Work Mode <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Work mode is required" }]}
            >
              <Select
                placeholder="Select work mode"
                options={workModes}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: City & Deadline */}
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="deadline"
              label={
                <span>
                  Application Deadline <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Deadline is required" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select deadline"
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="city"
              label={
                <span>
                  City <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "City is required" }]}
            >
              <Select
                showSearch
                placeholder="Select city"
                options={pakistanCities}
                disabled={loading}
                filterOption={(input, option) =>
                  option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                }
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Salary - Stacks on mobile, 3 columns on tablet/desktop */}
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="minSalary"
              label={
                <span>
                  Min Salary (PKR) <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Min salary is required" }, { type: "number", min: 0, message: "Min salary must be a positive number" }]}
            >
              <InputNumber
                placeholder="80000"
                style={{ width: "100%" }}
                min={0}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxSalary"
              label={
                <span>
                  Max Salary (PKR) <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Max salary is required" }, { type: "number", min: 0, message: "Max salary must be a positive number" }]}
            >
              <InputNumber
                placeholder="130000"
                style={{ width: "100%" }}
                min={0}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Skills, Description, etc. (Full width) */}
        <Row>
          <Col span={24}>
            <Form.Item
              name="skills"
              label={
                <span>
                  Required Skills <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "At least one skill is required" }]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Type or select skills"
                options={skillsOptions}
                disabled={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* AI Assisted Sections */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex justify-end">
              <AutoFillButton type="description" />
            </div>
            <Form.Item
              name="description"
              label={
                <span>
                  Job Description <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Job description is required" }]}
            >
              <TextArea
                rows={5}
                placeholder="Describe the role..."
                className="app-textarea-scroll"
                disabled={loading || aiLoading.description}
              />
            </Form.Item>
          </div>

          <div>
            <div className="mb-2 flex justify-end">
              <AutoFillButton type="interviewGuideline" />
            </div>
            <Form.Item
              name="interviewGuideline"
              label={
                <span>
                  Interview Guideline <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Interview guideline is required" }]}
            >
              <TextArea
                rows={5}
                placeholder="Explain what the interviewer should focus on..."
                className="app-textarea-scroll"
                disabled={loading || aiLoading.interviewGuideline}
              />
            </Form.Item>
          </div>

          <div>
            <div className="mb-2 flex justify-end">
              <AutoFillButton type="requirements" />
            </div>
            <Form.Item
              name="requirements"
              label={
                <span>
                  Requirements <span className="text-red-500">*</span>
                </span>
              }
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
          </div>
        </div>

        {/* Submit Section */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <UiButton
            htmlType="submit"
            type="primary"
            size="large"
            loading={loading}
            disabled={loading || isAnyAiLoading}
            className="!rounded-xl !w-full sm:!w-40"
          >
            {loading ? "Creating..." : "Create Job"}
          </UiButton>

          {loading && <Spin className="ml-4" />}
        </div>
      </Form>
    </Col>
  );
}