"use client";

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Typography,
  Divider,
  Space,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Tooltip,
  UploadProps,
} from "antd";
import {
  EditOutlined,
  GlobalOutlined,
  LinkedinFilled,
  UploadOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  updateCompanyProfileApi,
  getCompanyProfileApi,
} from "@/app/api/company/profile.api";
import { setProfile } from "@/redux/slices/userSlice";
import {
  CompleteCompanyProfile,
  CompanyResponse,
} from "@/constants/Interfaces/Types/Profile.interface";
import { uploadCompanyKnowledgeBasePdfApi } from "@/app/api/company/knowledgeBase.api";
import toast from "react-hot-toast";
import CompanyProfileSkeleton from "@/component/Skeletons/CompanyProfileSkeleton";
import { skillsOptions } from "@/constants/job";
import { linkedInUrlValidator, portfolioUrlValidator } from "@/utils/urlValidator";
import { uploadFileApi } from "@/app/api/auth.api";

const { Text } = Typography;
const { TextArea } = Input;

export default function CompanyProfile() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [kbUploading, setKbUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { profile } = useSelector((state: RootState) => state.user);
  const [avatarUploading, setAvatarUploading] = useState(false);

  type CompanyProfile = CompanyResponse & { userType: "company" };
  const companyProfile =
    profile?.userType === "company" ? (profile as CompanyProfile) : null;

  // Load profile data only once on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getCompanyProfileApi();
        if (res?.data?.company) {
          const companyData = {
            ...res.data.company,
            userType: "company" as const,
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dispatch(setProfile(companyData as unknown as any));
        }
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
        toast.error("Failed to load company profile");
      } finally {
        setLoading(false);
      }
    };

    if (!companyProfile) {
      fetchProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!companyProfile && loading) {
    return <CompanyProfileSkeleton />;
  }

  if (!companyProfile && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Text type="secondary">No profile found</Text>
        </div>
      </div>
    );
  }

  const handleKbUpload = async (file: File) => {
    setKbUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadCompanyKnowledgeBasePdfApi(fd);
      const pdfUrl = res?.data?.pdfUrl;
      if (pdfUrl) {
        dispatch(
          setProfile({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(companyProfile as unknown as any),
            knowledgeBasePdfUrl: pdfUrl,
          }),
        );
      }
      toast.success("Knowledge base uploaded. Indexing will start shortly.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload knowledge base PDF.");
    } finally {
      setKbUploading(false);
    }
  };

  const handleEditClick = () => {
    if (!companyProfile) return;

    form.setFieldsValue({
      companyName: companyProfile?.companyName || "",
      city: companyProfile?.city || "",
      foundedYear: Number(companyProfile?.foundedYear) || "",
      ntnNumber: companyProfile?.ntnNumber || "",
      contactEmail: companyProfile?.contactEmail || "",
      description: companyProfile?.description || "",
      techStack: companyProfile?.techStack || [],
      website: companyProfile?.website || "",
      linkedInUrl: companyProfile?.linkedInUrl || "",
      hiringStatus: companyProfile?.hiringStatus || "not_hiring",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (values: Partial<CompleteCompanyProfile>) => {
    if (!companyProfile) return;
    setSaveLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedProfile: any = {
        ...companyProfile,
        ...values,
        isProfileComplete: true, // Mark profile as complete after editing
        country: "Pakistan", // Set default country as Pakistan
        foundedYear: values.foundedYear ? Number(values.foundedYear) : undefined, // Ensure foundedYear is a number

      };

      console.log("Updated profile", updatedProfile)

      if (profile?.userType === "company" && !profile.logoUrl) {
        toast.error("Please upload a company logo before saving changes.");
        setSaveLoading(false);
        return;
      }

      console.log("PROFILE", profile)
      if (profile?.userType === "company" && !profile.knowledgeBasePdfUrl) {
        toast.error("Please upload a knowledge base PDF before saving changes.");
        setSaveLoading(false);
        return;
      }

      console.log("update profile", updatedProfile);

      // Update Redux state locally
      dispatch(setProfile(updatedProfile));

      // Update backend
      await updateCompanyProfileApi(updatedProfile as CompleteCompanyProfile);

      toast.success("Company profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update company profile");
      console.error(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File): Promise<void> => {

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileApi(formData);
      const logoUrl = response?.data?.url;

      if (!logoUrl) {
        toast.error("Failed to upload logo.");
        return;
      }

      dispatch(
        setProfile({
          ...profile,
          userType: "company",
          logoUrl,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any),
      );

      toast.success("Logo updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update logo");
    } finally {
      setAvatarUploading(false);
    }
  };

  const avatarUploadProps: UploadProps = {
    beforeUpload: (file: File) => {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg+xml";
      if (!isImage) {
        toast.error("You can only upload JPEG, PNG, or SVG files!");
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toast.error("Image must be smaller than 5MB!");
        return false;
      }

      setAvatarUploading(true);
      handleAvatarUpload(file);
      return false;
    },
    showUploadList: false,
  };

  return (
    <div className="  p-2">
      <div className="max-w-6xl mx-auto">
        <Row gutter={[24, 24]}>
          {/* Profile Sidebar */}
          <Col xs={24} lg={8}>
            <div className="sticky top-6">
              <Card
                className="rounded-2xl shadow-md border-0"
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar
                        size={80}
                        src={companyProfile?.logoUrl}
                        style={{
                          backgroundColor: "#1890FF",
                          border: "3px solid #e6f7ff",
                        }}
                      >
                        {companyProfile?.companyName?.charAt(0) || "C"}
                      </Avatar>
                      <Upload {...avatarUploadProps} accept="image/*">
                        <Button
                          type="text"
                          size="small"
                          icon={<UploadOutlined />}
                          loading={avatarUploading}
                          disabled={avatarUploading}
                          className="!px-0"
                        >
                          Change Photo
                        </Button>
                      </Upload>
                      {/* Company Info */}
                      <div>
                        <Typography.Title level={4} className="!mb-1">
                          {companyProfile?.companyName}
                        </Typography.Title>
                        <Tag
                          color={
                            companyProfile?.hiringStatus === "actively_hiring"
                              ? "success"
                              : "default"
                          }
                          className="!rounded-full"
                        >
                          {companyProfile?.hiringStatus === "actively_hiring"
                            ? "✓ Actively Hiring"
                            : "Not Hiring"}
                        </Tag>
                      </div>
                    </div>
                    <div>
                      {" "}
                      <Tooltip title="Edit Profile">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          size="large"
                          onClick={handleEditClick}
                          className="!text-blue-600 hover:!bg-blue-50"
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <Divider className="!my-4" />

                  {/* Info Items */}
                  <Row gutter={[16, 16]}>
                    {/* Location */}
                    <Col xs={24}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                        <EnvironmentOutlined className="text-blue-600 text-lg" />
                        <div>
                          <Typography.Text
                            type="secondary"
                            className="text-xs block"
                          >
                            Location
                          </Typography.Text>
                          <Typography.Text strong>
                            {companyProfile?.city && companyProfile?.country
                              ? `${companyProfile.city}, ${companyProfile.country}`
                              : "Not specified"}
                          </Typography.Text>
                        </div>
                      </div>
                    </Col>

                    {/* Founded */}
                    {companyProfile?.foundedYear && (
                      <Col xs={24}>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                          <CalendarOutlined className="text-purple-600 text-lg" />
                          <div>
                            <Typography.Text
                              type="secondary"
                              className="text-xs block"
                            >
                              Founded
                            </Typography.Text>
                            <Typography.Text strong>
                              {companyProfile.foundedYear}
                            </Typography.Text>
                          </div>
                        </div>
                      </Col>
                    )}

                    {/* Email */}
                    <Col xs={24}>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                        <MailOutlined className="text-blue-600 text-lg" />
                        <div className="min-w-0">
                          <Typography.Text
                            type="secondary"
                            className="text-xs block"
                          >
                            Contact Email
                          </Typography.Text>
                          <Typography.Text strong ellipsis>
                            {companyProfile?.contactEmail || "No email"}
                          </Typography.Text>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Divider className="!my-4" />

                  {/* Knowledge Base */}
                  <div>
                    <Typography.Text
                      strong
                      className="flex items-center gap-2 mb-2"
                    >
                      <FileOutlined className="text-blue-600" />
                      Knowledge Base
                    </Typography.Text>
                    <Typography.Paragraph
                      type="success"
                      className="text-sm mb-3"
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(companyProfile as unknown as any)?.knowledgeBasePdfUrl
                        ? "✓ PDF uploaded"
                        : "Upload PDF for AI chatbot to answer questions about your company"}
                    </Typography.Paragraph>
                    <Upload
                      accept="application/pdf"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleKbUpload(file as unknown as File);
                        return false;
                      }}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        loading={kbUploading}
                        disabled={kbUploading}
                        block
                        type="primary"
                      >
                        {kbUploading ? "Uploading..." : "Upload PDF"}
                      </Button>
                    </Upload>
                  </div>
                </Space>
              </Card>
            </div>
          </Col>

          {/* Details Section */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {/* About */}
              <Card className="rounded-2xl shadow-md border-0">
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="middle"
                >
                  <Typography.Title level={5} className="!mb-0">
                    About Company
                  </Typography.Title>
                  <Typography.Paragraph className="!mb-0">
                    {companyProfile?.description || (
                      <span className="text-gray-400">
                        No description added
                      </span>
                    )}
                  </Typography.Paragraph>
                </Space>
              </Card>

              {/* Tech Stack */}
              <Card className="rounded-2xl shadow-md border-0">
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="middle"
                >
                  <Typography.Title level={5} className="!mb-0">
                    Tech Stack
                  </Typography.Title>
                  <div className="flex flex-wrap gap-2">
                    {companyProfile?.techStack &&
                      companyProfile.techStack.length > 0 ? (
                      companyProfile.techStack.map(
                        (tech: string, i: number) => (
                          <Tag
                            key={i}
                            color="blue"
                            className="!rounded-lg border-0 font-medium"
                          >
                            {tech}
                          </Tag>
                        ),
                      )
                    ) : (
                      <Typography.Text type="secondary">
                        No tech stack added
                      </Typography.Text>
                    )}
                  </div>
                </Space>
              </Card>

              {/* Additional Info */}
              <Row gutter={[16, 16]}>
                {companyProfile?.ntnNumber && (
                  <Col xs={24} sm={12}>
                    <Card className="rounded-2xl shadow-md border-0 h-full">
                      <Typography.Text type="secondary" className="text-sm">
                        NTN Number
                      </Typography.Text>
                      <Typography.Title level={5} className="!mt-2 !mb-0">
                        {companyProfile.ntnNumber}
                      </Typography.Title>
                    </Card>
                  </Col>
                )}

                {(companyProfile?.website || companyProfile?.linkedInUrl) && (
                  <Col xs={24} sm={12}>
                    <Card className="rounded-2xl shadow-md border-0 h-full">
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Typography.Text type="secondary" className="text-sm">
                          Quick Links
                        </Typography.Text>
                        <Space>
                          {companyProfile?.website && (
                            <Button
                              type="text"
                              icon={<GlobalOutlined />}
                              onClick={() =>
                                window.open(companyProfile.website, "_blank")
                              }
                              className="!text-blue-600"
                            >
                              Website
                            </Button>
                          )}
                          {companyProfile?.linkedInUrl && (
                            <Button
                              type="text"
                              icon={<LinkedinFilled />}
                              onClick={() =>
                                window.open(
                                  companyProfile.linkedInUrl,
                                  "_blank",
                                )
                              }
                              className="!text-[#0A66C2]"
                            >
                              LinkedIn
                            </Button>
                          )}
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                )}
              </Row>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Company Profile"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSave}
          className="mt-4"
        >
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>

          <Form.Item
            label="Hiring Status"
            name="hiringStatus"
            rules={[{ required: true, message: "Please select hiring status" }]}
          >
            <Select placeholder="Select hiring status">
              <Select.Option value="actively_hiring">
                Actively Hiring
              </Select.Option>
              <Select.Option value="not_hiring">Not Hiring</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter city" }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Please enter country" }]}
              >
                <Input placeholder="Country" />
              </Form.Item>
            </Col> */}
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Founded Year" name="foundedYear">
                <Input placeholder="e.g., 2020" type="number" max={new Date().getFullYear()} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="NTN Number" name="ntnNumber">
                <Input placeholder="Enter NTN number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Company Description"
            name="description"
            rules={[
              { required: true, message: "Please enter company description" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Tell us about your company..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                Tech Stack{" "}
                <span style={{ color: "rgba(0,0,0,.45)" }}>(up to 10)</span>
              </span>
            }
            name="techStack"
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add or select technologies"
              options={skillsOptions}
              maxTagCount={10}
            />
          </Form.Item>

          <Form.Item
            label="Website URL"
            name="website"
            rules={[{ type: "url", message: "Please enter a valid URL" }, { required: true, message: "Please enter website URL or leave it blank" }, { validator: portfolioUrlValidator }]}
          >
            <Input
              placeholder="https://yourcompany.com"
              prefix={<GlobalOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="LinkedIn URL"
            name="linkedInUrl"
            rules={[{ type: "url", message: "Please enter a valid URL" }, { required: true, message: "Please enter LinkedIn URL or leave it blank" }, { validator: linkedInUrlValidator }]}
          >
            <Input
              placeholder="https://linkedin.com/company/yourcompany"
              prefix={<LinkedinFilled />}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={saveLoading}>
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
