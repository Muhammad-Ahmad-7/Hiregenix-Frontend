"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Tabs,
  Input,
  Button,
  Dropdown,
  Card,
  Modal,
  Form,
  Row,
  Col,
  Select,
  DatePicker,
  Spin,
} from "antd";

import { PlusOutlined, SearchOutlined, MoreOutlined, ExclamationCircleOutlined, EditOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobApi,
  getCompanyClosedJobsApi,
  getCompanyOpenJobsApi,
  toggleJobStatus,
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
import TableSkeleton from "@/component/Skeletons/TableSkeleton";
import toast from "react-hot-toast";
import { pakistanCities } from "@/constants/job";

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
  interviewGuideline: string;
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm<EditJobFormValues>();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState<JobResponse | null>(null);

  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingJobId, setTogglingJobId] = useState<string | null>(null);


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
      toast.error("Failed to fetch open jobs");
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
      toast.error("Failed to fetch closed jobs");
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

  const handleDeleteConfirm = async () => {
    if (!deleteJobId) return;
    try {
      setIsDeleting(true);
      await deleteJobApi(deleteJobId);
      if (activeTab === "open") fetchOpenJobs();
      else fetchClosedJobs();
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
      setDeleteJobId(null);
    }
  };

  const handleToggleJobStatus = async (jobId: string) => {
    try {
      setTogglingJobId(jobId);
      const res = await toggleJobStatus(jobId);

      if (!res) {
        toast.error("Failed to update job status");
        return;
      }

      if (res.status === "Failed") {
        toast.error(res.message || "Failed to update job status");
        return;
      }

      toast.success(res.message || "Job status updated");
      await Promise.all([fetchOpenJobs(), fetchClosedJobs()]);
    } catch {
      toast.error("Failed to update job status");
    } finally {
      setTogglingJobId(null);
    }
  };

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
      interviewGuideline: job.interviewGuideline,
    });

    setIsEditModalOpen(true);
  };

  // -----------------------
  // Save Job
  // -----------------------
  const handleSaveJob = async (values: EditJobFormValues): Promise<void> => {
    if (!editingJob) return;
    setIsEditing(true);

    // This checks if the selected date is strictly earlier than today
    if (values.deadline.isBefore(dayjs(), "day")) {
      toast.error("Deadline cannot be in the past!");
      setIsEditing(false);
      return;
    }

    if (dayjs(values.deadline).toISOString() < dayjs(editingJob.deadline).toISOString()) {
      toast.error("You cannot move the deadline backwards!");
      setIsEditing(false);
      return;
    }

    const payload = {
      deadline: values.deadline.toISOString(),
      salaryRange: {
        min: Number(values.salaryMin),
        max: Number(values.salaryMax),
        currency: values.currency,
      },
      location: {
        city: values.city,
        country: values.country,
      },
      experienceLevel: values.experienceLevel,
      workMode: values.workMode,
      requiredSkills: values.requiredSkills,
      requirements: values.requirements,
      description: values.description,
      role: values.role,
      title: values.title,
      interviewGuideline: values.interviewGuideline,
    };

    try {
      await updateJobApi({
        jobId: editingJob._id,
        body: payload,
      });

      toast.success("Job updated successfully!");

      if (activeTab === "open") fetchOpenJobs();
      else fetchClosedJobs();

      setIsEditModalOpen(false);
    } catch {
      toast.error("Failed to update job");
    } finally {
      setIsEditing(false);
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
    {
      title: "Title",
      dataIndex: "title" as const,
      responsive: ["xs", "sm", "md", "lg"],
    },

    {
      title: "Role",
      dataIndex: "role" as const,
      responsive: ["sm", "md", "lg"],
    },

    {
      title: "Location",
      responsive: ["md", "lg"],
      render: (_: unknown, record: JobResponse) =>
        `${record.location.city}`,
    },

    {
      title: "Work Mode",
      dataIndex: "workMode" as const,
      responsive: ["md", "lg"],
    },

    {
      title: "Experience",
      dataIndex: "experienceLevel" as const,
      responsive: ["lg"], // only desktop
    },

    {
      title: "Salary",
      responsive: ["lg"],
      render: (_: unknown, record: JobResponse) => {
        if (!record.salaryRange) return "—";
        const s = record.salaryRange;
        return `${s.min} - ${s.max} ${s.currency}`;
      },
    },

    {
      title: "Deadline",
      dataIndex: "deadline" as const,
      responsive: ["sm", "md", "lg"],
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },

    {
      title: "Action",
      key: "actions",
      align: "center" as const,
      fixed: "right", // 🔥 important for usability
      responsive: ["xs", "sm", "md", "lg"],
      render: (_: unknown, record: JobResponse) => {
        const isTogglingThisJob = togglingJobId === record._id;

        return (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "1",
                  label: "View Details",
                  icon: <EyeOutlined />,
                  onClick: () => openViewModal(record),
                },
                {
                  key: "2",
                  label: `Edit ${record.totalInterviews === 0 ? "Job" : "Deadline"}`,
                  icon: <EditOutlined />,
                  disabled: record.status === "closed",
                  onClick: () => openEditModal(record),
                },
                {
                  key: "3",
                  label: isTogglingThisJob
                    ? record.status === "closed"
                      ? "Opening Job..."
                      : "Closing Job..."
                    : record.status === "closed"
                      ? "Open Job"
                      : "Close Job",
                  icon: isTogglingThisJob ? (
                    <Spin size="small" />
                  ) : record.status === "closed" ? (
                    <UnlockOutlined />
                  ) : (
                    <LockOutlined />
                  ),
                  onClick: () => handleToggleJobStatus(record._id),
                  disabled: isTogglingThisJob,
                },
                {
                  key: "4",
                  label: "Delete Job",
                  danger: true,
                  disabled: record.totalInterviews > 0, // disable if interviews are scheduled
                  icon: <ExclamationCircleOutlined />,
                  onClick: () => setDeleteJobId(record._id),
                },
              ],
            }}
          >
            <Button
              type="text"
              icon={isTogglingThisJob ? <Spin size="small" /> : <MoreOutlined />}
              disabled={isTogglingThisJob}
            />
          </Dropdown>
        );
      },
    },
  ];


  const deleteModal = (
    <Modal
      title="Delete Job"
      open={!!deleteJobId}
      onCancel={() => { if (!isDeleting) setDeleteJobId(null); }}
      closable={!isDeleting}
      maskClosable={!isDeleting}
      footer={[
        <Button key="cancel" onClick={() => setDeleteJobId(null)} disabled={isDeleting}>
          Cancel
        </Button>,
        <Button key="confirm" danger type="primary" loading={isDeleting} onClick={handleDeleteConfirm}>
          Yes, Delete
        </Button>,
      ]}
      width={420}
    >
      <div className="flex items-start gap-4 py-4">
        <ExclamationCircleOutlined className="text-red-500 text-2xl mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="text-gray-800 font-semibold text-base m-0">Are you sure?</p>
          <p className="text-gray-500 text-sm m-0">
            This job will be permanently deleted. This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );

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
      title={`Edit ${editingJob?.totalInterviews === 0 ? "Job" : "Deadline"}`} // if no interviews, allow editing entire job. otherwise only deadline 
      open={isEditModalOpen}
      onCancel={() => setIsEditModalOpen(false)}
      footer={null}
      width={700}
    >

      <Form form={form} layout="vertical" onFinish={handleSaveJob}>
        <Row gutter={16}>
          {
            editingJob?.totalInterviews !== 0 && (
              <Col span={24}>
                <div className="bg-blue-50 p-4 mb-4">
                  <p className=" text-sm m-0">
                    This job has {editingJob?.totalInterviews} interview{editingJob?.totalInterviews !== 1 ? "s" : ""} scheduled. You can only update the deadline.
                  </p>
                </div>
              </Col>
            )
          }
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
              <Input placeholder="Enter job title" disabled={editingJob?.totalInterviews !== 0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Input placeholder="Enter job role" disabled={editingJob?.totalInterviews !== 0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Select
                disabled={editingJob?.totalInterviews !== 0}
                options={pakistanCities}
                placeholder="Select city"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="salaryMin" label="Min Salary" rules={[{ required: true }]}>
              <Input type="number" placeholder="Min" disabled={editingJob?.totalInterviews !== 0} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="salaryMax" label="Max Salary" rules={[{ required: true }]}>
              <Input type="number" placeholder="Max" disabled={editingJob?.totalInterviews !== 0} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Job description" disabled={editingJob?.totalInterviews !== 0} />
        </Form.Item>


        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="experienceLevel" label="Experience Level" rules={[{ required: true }]}>
              <Select
                disabled={editingJob?.totalInterviews !== 0}
                options={[
                  { label: "Entry", value: "entry" },
                  { label: "Mid", value: "mid" },
                  { label: "Senior", value: "senior" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="workMode" label="Work Mode" rules={[{ required: true }]}>
              <Select
                disabled={editingJob?.totalInterviews !== 0}
                options={[
                  { label: "Remote", value: "remote" },
                  { label: "Full-time", value: "full-time" },
                  { label: "Part-time", value: "part-time" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="requiredSkills" label="Required Skills">
              <Select disabled={editingJob?.totalInterviews !== 0} mode="tags" placeholder="Add skills" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="interviewGuideline" label="Interview Guideline">
              <TextArea rows={4} placeholder="Interview guideline" disabled={editingJob?.totalInterviews !== 0} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item name="requirements" label="Requirements">
              <Select disabled={editingJob?.totalInterviews !== 0} mode="tags" placeholder="Add requirements" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Button onClick={() => setIsEditModalOpen(false)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isEditing}>
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
              ? `${viewingJob.salaryRange.min} - ${viewingJob.salaryRange.max} PKR`
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
      {deleteModal}

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
        <div className="flex justify-between mb-4 flex-wrap gap-2">
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
            <TableSkeleton />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filteredJobs.map((job) => ({ ...job, key: job._id }))}
              pagination={{
                pageSize: 5,
                responsive: true,
                showSizeChanger: false,
              }}
              className="rounded-lg overflow-hidden"
              scroll={{ x: "max-content" }} // better than fixed 1200
              bordered
              size="middle"
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
