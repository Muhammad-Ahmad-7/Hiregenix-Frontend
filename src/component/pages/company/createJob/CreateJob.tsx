"use client";

import React, { use, useEffect, useState } from "react";
import { Col, Form, Row, Typography, Spin, message } from "antd";
import { LabelInput, LabelSelect, LabelDatePicker } from "../../../common";
import UiButton from "../../../common/CustomButton";
import { createJobApi } from "@/app/api/job/jobs.api";
import { getCompanyOpenJobsApi } from "@/app/api/company/jobs.api";

const { Title } = Typography;

export default function CreateJob() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Dropdown options
  const workModes = [
    { label: "Remote", value: "remote" },
    { label: "Onsite", value: "onsite" },
    { label: "Hybrid", value: "hybrid" },
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

  const onFinish = async (values: any) => {
    const jobData = {
      title: values.title,
      role: values.role,
      interviewGuideline: values.interviewGuideline,
      experienceLevel: values.experienceLevel,
      description: values.description,
      requiredSkills: values.requiredSkills
        ? values.requiredSkills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      requirements: values.requirements
        ? values.requirements
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      workMode: values.workMode,
      location: {
        city: values.city,
        country: values.country,
      },
      salaryRange: {
        min: Number(values.minSalary),
        max: Number(values.maxSalary),
        currency: values.currency,
      },
      deadline: values.deadline?.toDate?.().toISOString() || null,
      status: values.status,
    };

    console.log("🟢 Final Job Data:", jobData);

    try {
      setLoading(true);
      const res = await createJobApi(jobData);
      console.log("🔵 API Response:", res);

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
      {/* <div> JOBSSSS:{jobs}</div> */}
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
          textArea
        />

        <LabelInput
          name="interviewGuideline"
          label="Interview Guideline"
          placeholder="Explain what the interviewer should focus on..."
          textArea
          required
        />

        {/* SKILLS & REQUIREMENTS */}
        <LabelInput
          name="requiredSkills"
          label="Required Skills (comma-separated)"
          placeholder="e.g. Appium, Postman, JIRA, TestRail"
          required
        />

        <LabelInput
          name="requirements"
          label="Requirements (one per line)"
          placeholder={`1–3 years of experience\nKnowledge of mobile testing\nExperience with bug tracking tools`}
          textArea
          required
        />

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
