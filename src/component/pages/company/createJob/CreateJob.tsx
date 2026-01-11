"use client";

import React, { useState } from "react";
import { Col, Form, Row, Typography, Spin, message } from "antd";
import { LabelInput, LabelSelect, LabelDatePicker } from "../../../common";
import UiButton from "../../../common/CustomButton";
import { createJobApi } from "@/app/api/job/jobs.api";
import { Dayjs } from "dayjs";
import { JobPosting } from "@/constants/Interfaces/Types/Jobs.interface";
import { ExperienceLevel, JobStatus, WorkMode } from "@/constants/enums";

const { Title } = Typography;

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
  status: string;
}

export default function CreateJob() {
  const [form] = Form.useForm<CreateJobFormValues>();
  const [loading, setLoading] = useState(false);

  // Dropdown options
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

  // Common skills options (can be expanded)
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

  // Common requirements options
  const requirementsOptions = [
    {
      label: "Bachelor's degree in Computer Science or related field",
      value: "Bachelor's degree in Computer Science or related field",
    },
    { label: "1–3 years of experience", value: "1–3 years of experience" },
    { label: "3–5 years of experience", value: "3–5 years of experience" },
    { label: "5+ years of experience", value: "5+ years of experience" },
    {
      label: "Strong problem-solving skills",
      value: "Strong problem-solving skills",
    },
    {
      label: "Excellent communication skills",
      value: "Excellent communication skills",
    },
    {
      label: "Ability to work in a team environment",
      value: "Ability to work in a team environment",
    },
    {
      label: "Experience with Agile methodologies",
      value: "Experience with Agile methodologies",
    },
    {
      label: "Knowledge of mobile testing",
      value: "Knowledge of mobile testing",
    },
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
    const jobData: JobPosting = {
      title: values.title,
      role: values.role,
      interviewGuideline: values.interviewGuideline,
      experienceLevel: values.experienceLevel as ExperienceLevel,
      description: values.description,
      requiredSkills: values.skills || [],
      requirements: values.requirements || [],
      workMode: values.workMode as WorkMode,
      location: {
        city: values.city,
        country: values.country,
      },
      salaryRange: {
        min: Number(values.minSalary),
        max: Number(values.maxSalary),
        currency: values.currency,
      },
      deadline: values.deadline?.toDate?.().toISOString() || undefined,
      status: values.status as JobStatus,
    };

    console.log("🟢 Final Job Data:", jobData);

    try {
      setLoading(true);
      const res = await createJobApi(jobData);
      console.log("🔵 API Response:", res);
      if (!res) return;
      if (res.status === "Success") {
        message.success("✅ Job created successfully!");
        form.resetFields();
      } else {
        message.error("❌ Failed to create job. Try again.");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      message.error("Something went wrong while creating the job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Col xs={24} md={16} className="p-4 lg:px-16 lg:py-8">
      <Title level={2} className="!mb-4">
        Create New Job
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        autoComplete="off"
      >
        {/* BASIC JOB INFO */}
        <Row gutter={16}>
          <Col span={12}>
            <LabelInput
              name="title"
              label="Job Title"
              placeholder="e.g. Mobile App Tester"
              required
            />
          </Col>
          <Col span={12}>
            <LabelInput
              name="role"
              label="Job Role"
              placeholder="e.g. QA Engineer"
              required
            />
          </Col>
        </Row>

        {/* EXPERIENCE + STATUS */}
        <Row gutter={16}>
          <Col span={12}>
            <LabelSelect
              name="experienceLevel"
              label="Experience Level"
              placeholder="Select experience level"
              required
              options={experienceLevels}
            />
          </Col>
          <Col span={12}>
            <LabelSelect
              name="status"
              label="Status"
              placeholder="Select job status"
              required
              options={statuses}
            />
          </Col>
        </Row>

        {/* WORK MODE + DEADLINE */}
        <Row gutter={16}>
          <Col span={12}>
            <LabelSelect
              name="workMode"
              label="Work Mode"
              placeholder="Select work mode"
              required
              options={workModes}
            />
          </Col>
          <Col span={12}>
            <LabelDatePicker
              name="deadline"
              label="Application Deadline"
              placeholder="Select deadline"
              required
            />
          </Col>
        </Row>

        {/* LOCATION */}
        <Row gutter={16}>
          <Col span={12}>
            <LabelInput name="city" label="City" placeholder="City" required />
          </Col>
          <Col span={12}>
            <LabelInput
              name="country"
              label="Country"
              placeholder="Country"
              required
            />
          </Col>
        </Row>

        {/* SALARY RANGE */}
        <Row gutter={16}>
          <Col span={8}>
            <LabelInput
              name="minSalary"
              label="Min Salary"
              placeholder="80000"
              required
              type="number"
            />
          </Col>
          <Col span={8}>
            <LabelInput
              name="maxSalary"
              label="Max Salary"
              placeholder="130000"
              required
              type="number"
            />
          </Col>
          <Col span={8}>
            <LabelInput
              name="currency"
              label="Currency"
              placeholder="PKR"
              required
            />
          </Col>
        </Row>

        {/* DESCRIPTION */}
        <LabelInput
          name="description"
          label="Job Description"
          placeholder="Describe the role..."
          required
          // textArea
        />

        <LabelInput
          name="interviewGuideline"
          label="Interview Guideline"
          placeholder="Explain what the interviewer should focus on..."
          // textArea
          required
        />

        {/* SKILLS - Tag Mode Select (up to 5) */}
        <Row gutter={16}>
          <Col span={24}>
            <LabelSelect
              label={
                <span>
                  Skills{" "}
                  <span style={{ color: "rgba(0,0,0,.45)" }}>(up to 5)</span>
                </span>
              }
              maxCount={5}
              name="skills"
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Type or select skills"
              options={skillsOptions}
              required
            />
          </Col>
        </Row>

        {/* REQUIREMENTS - Multiple Select */}
        <Row gutter={16}>
          <Col span={24}>
            <LabelSelect
              label="Requirements"
              name="requirements"
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Type or select requirements"
              options={requirementsOptions}
              required
            />
          </Col>
        </Row>

        {/* SUBMIT BUTTON */}
        <div className="mt-6 flex justify-start">
          <UiButton
            htmlType="submit"
            type="primary"
            block
            size="large"
            loading={loading}
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
