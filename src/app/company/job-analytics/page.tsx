"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Tabs,
  Input,
  Button,
  Dropdown,
  Card,
  Spin,
  message,
  Modal,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
} from "antd";

import { PlusOutlined, SearchOutlined, MoreOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobApi,
  getCompanyClosedJobsApi,
  getCompanyOpenJobsApi,
  updateJobApi,
} from "@/app/api/company/jobs.api";

import {
  appendClosedJobs,
  appendOpenJobs,
  setCompanyClosedJobs,
  setCompanyOpenJobs,
  setLoading,
} from "@/redux/slices/company/companyJobSlice";

import { RootState } from "@/redux/store";
import dayjs, { Dayjs } from "dayjs";
import UiButton from "@/component/common/CustomButton";
import type { ColumnsType } from "antd/es/table";
import { JobResponse } from "@/constants/Interfaces/Types/Jobs.interface";
import { ExperienceLevel, WorkMode } from "@/constants/enums";

const { TextArea } = Input;

interface EditJobFormValues {
  title: string;
  role: string;
  description: string;
  experienceLevel: string;
  workMode: string;
  requiredSkills: string[];
  requirements: string[];
  city: string;
  country: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  deadline: Dayjs;
  status: "open" | "closed";
}

interface JobWithKey extends JobResponse {
  key: string;
}

const MyJobsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { openJobs, closedJobs, openMeta, closedMeta, loading } = useSelector(
    (state: RootState) => state.companyJob
  );

  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [search, setSearch] = useState<string>("");

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobResponse | null>(null);
  const [form] = Form.useForm<EditJobFormValues>();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState<JobResponse | null>(null);
  // -----------------------
  // Fetch Jobs
  // -----------------------
  const fetchOpenJobs = async (page: number = 1): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const res = await getCompanyOpenJobsApi(page);

      const jobs = res?.data?.findActiveJobs || [];
      const meta = res?.meta;

      if (page === 1) {
        if (meta != null && meta != undefined) {
          dispatch(setCompanyOpenJobs({ jobs, meta }));
        }
      } else {
        if (meta != null && meta != undefined) {
          dispatch(appendOpenJobs({ jobs, meta }));
        }
      }
    } catch {
      message.error("Failed to fetch open jobs");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchClosedJobs = async (page: number = 1): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const res = await getCompanyClosedJobsApi(page);

      const jobs = res?.data?.findClosedJobs || [];
      const meta = res?.meta;

      if (page === 1) {
        if (meta != null && meta != undefined) {
          dispatch(setCompanyClosedJobs({ jobs, meta }));
        }
      } else {
        if (meta != null && meta != undefined) {
          dispatch(appendClosedJobs({ jobs, meta }));
        }
      }
    } catch {
      message.error("Failed to fetch closed jobs");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (openJobs === null || closedJobs === null) {
      if (activeTab === "open") fetchOpenJobs();
      else fetchClosedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // -----------------------
  // Open Edit Modal
  // -----------------------
  const openEditModal = (job: JobResponse): void => {
    setEditingJob(job);

    form.setFieldsValue({
      title: job.title,
      role: job.role,
      description: job.description,
      experienceLevel: job.experienceLevel,
      workMode: job.workMode,
      requiredSkills: job.requiredSkills,
      requirements: job.requirements,
      city: job.location.city,
      country: job.location.country,
      salaryMin: job.salaryRange?.min,
      salaryMax: job.salaryRange?.max,
      currency: job.salaryRange?.currency,
      deadline: dayjs(job.deadline),
    });

    setIsEditModalOpen(true);
  };

  // -----------------------
  // Save Job
  // -----------------------
  const handleSaveJob = async (values: EditJobFormValues): Promise<void> => {
    if (!editingJob) return;

    const payload = {
      title: values.title,
      role: values.role,
      description: values.description,
      experienceLevel: values.experienceLevel as ExperienceLevel,
      workMode: values.workMode as WorkMode,
      requiredSkills: values.requiredSkills,
      requirements: values.requirements,
      location: {
        city: values.city,
        country: values.country,
      },
      salaryRange: {
        min: values.salaryMin,
        max: values.salaryMax,
        currency: values.currency,
      },
      deadline: values.deadline.toISOString(),
      status: values.status,
    };

    try {
      await updateJobApi({
        jobId: editingJob._id,
        body: payload,
      });

      message.success("Job updated successfully!");

      if (activeTab === "open") fetchOpenJobs();
      else fetchClosedJobs();

      setIsEditModalOpen(false);
    } catch {
      message.error("Failed to update job");
    }
  };

  // -----------------------
  // Filtered Jobs
  // -----------------------
  const filteredJobs =
    (activeTab === "open" ? openJobs : closedJobs)?.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const openViewModal = (job: JobResponse) => {
    setViewingJob(job);
    setIsViewModalOpen(true);
  };

  // -----------------------
  // Table Columns
  // -----------------------
  const columns: ColumnsType<JobWithKey> = [
    { title: "Title", dataIndex: "title" as const },
    { title: "Role", dataIndex: "role" as const },

    {
      title: "Location",
      render: (_: unknown, record: JobResponse) =>
        `${record.location.city}, ${record.location.country}`,
    },

    { title: "Work Mode", dataIndex: "workMode" as const },
    { title: "Experience", dataIndex: "experienceLevel" as const },

    {
      title: "Salary",
      render: (_: unknown, record: JobResponse) => {
        if (!record.salaryRange) return "—";
        const s = record.salaryRange;
        return `${s.min} - ${s.max} ${s.currency}`;
      },
    },

    {
      title: "Deadline",
      dataIndex: "deadline" as const,
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },

    {
      title: "",
      key: "actions",
      align: "center" as const,
      render: (_: unknown, record: JobResponse) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "1",
                label: "View Details",
                onClick: () => openViewModal(record),
              },

              {
                key: "2",
                label: "Edit Job",
                onClick: () => openEditModal(record),
              },

              {
                key: "3",
                label: "Delete Job",
                danger: true,
                onClick: () =>
                  deleteJobApi(record._id)
                    .then(() => {
                      message.success("Job deleted");
                      if (activeTab === "open") {
                        fetchOpenJobs();
                      } else {
                        fetchClosedJobs();
                      }
                    })
                    .catch(() => message.error("Delete failed")),
              },
            ],
          }}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // -----------------------
  // Load More
  // -----------------------
  const loadMoreJobs = (): void => {
    if (activeTab === "open" && openMeta) {
      const next = openMeta.page + 1;
      if (next <= openMeta.totalPages) fetchOpenJobs(next);
    } else if (activeTab === "closed" && closedMeta) {
      const next = closedMeta.page + 1;
      if (next <= closedMeta.totalPages) fetchClosedJobs(next);
    }
  };

  // -----------------------
  // Edit Modal Component
  // -----------------------
  const editModal = (
    <Modal
      title="Edit Job"
      open={isEditModalOpen}
      onCancel={() => setIsEditModalOpen(false)}
      footer={null}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSaveJob}>
        <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
          <Input placeholder="Enter job title" />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Input placeholder="Enter job role" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} placeholder="Job description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="experienceLevel"
              label="Experience Level"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Junior", value: "junior" },
                  { label: "Mid", value: "mid" },
                  { label: "Senior", value: "senior" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="workMode"
              label="Work Mode"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Remote", value: "remote" },
                  { label: "Hybrid", value: "hybrid" },
                  { label: "Onsite", value: "onsite" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { label: "Open", value: "open" },
                  { label: "Closed", value: "closed" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="requiredSkills" label="Required Skills">
          <Select mode="tags" placeholder="Add skills" />
        </Form.Item>

        <Form.Item name="requirements" label="Requirements">
          <Select mode="tags" placeholder="Add requirements" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input placeholder="City" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true }]}
            >
              <Input placeholder="Country" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="salaryMin"
              label="Min Salary"
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="Min" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="salaryMax"
              label="Max Salary"
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="Max" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true }]}
            >
              <Input placeholder="PKR / USD" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Button
            onClick={() => setIsEditModalOpen(false)}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>

          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  );

  const viewModal = (
    <Modal
      title="Job Details"
      open={isViewModalOpen}
      onCancel={() => setIsViewModalOpen(false)}
      footer={null}
      width={800}
    >
      {viewingJob && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{viewingJob.title}</h2>

          <p><b>Role:</b> {viewingJob.role}</p>

          <p>
            <b>Location:</b>{" "}
            {viewingJob.location.city}, {viewingJob.location.country}
          </p>

          <p><b>Work Mode:</b> {viewingJob.workMode}</p>
          <p><b>Experience:</b> {viewingJob.experienceLevel}</p>

          <p>
            <b>Salary:</b>{" "}
            {viewingJob.salaryRange
              ? `${viewingJob.salaryRange.min} - ${viewingJob.salaryRange.max} ${viewingJob.salaryRange.currency}`
              : "—"}
          </p>

          <p>
            <b>Deadline:</b>{" "}
            {dayjs(viewingJob.deadline).format("DD MMM YYYY")}
          </p>

          <div>
            <b>Description:</b>
            <p className="text-gray-600 mt-1">{viewingJob.description}</p>
          </div>

          <div>
            <b>Interview Guideline:</b>
            <p className="text-gray-600 mt-1">
              {viewingJob.interviewGuideline}
            </p>
          </div>

          <div>
            <b>Skills:</b>
            <div className="flex flex-wrap gap-2 mt-1">
              {viewingJob.requiredSkills?.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <b>Requirements:</b>
            <ul className="list-disc pl-5 text-gray-600">
              {viewingJob.requirements?.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <>
      {editModal}
      {viewModal}

      <Card className="rounded-2xl shadow-sm p-6">
        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "open" | "closed")}
          items={[
            { key: "open", label: "Open Jobs" },
            { key: "closed", label: "Closed Jobs" },
          ]}
        />

        {/* Search + Add */}
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search jobs..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />

          <UiButton
            href={"/company/create-job"}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add New
          </UiButton>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filteredJobs.map((job) => ({ ...job, key: job._id }))}
              pagination={false}
              bordered
              className="rounded-lg"
            />

            {openMeta &&
              closedMeta &&
              (activeTab === "open" ? openMeta : closedMeta)?.page <
              (activeTab === "open"
                ? openMeta?.totalPages
                : closedMeta?.totalPages) && (
                <div className="flex justify-center mt-4">
                  <Button onClick={loadMoreJobs} type="dashed">
                    Load More
                  </Button>
                </div>
              )}
          </>
        )}
      </Card>
    </>
  );
};

export default MyJobsTable;
