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
  message,
  Upload,
  Spin,
  Tooltip,
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

const { Text } = Typography;
const { TextArea } = Input;

// Tech stack options
const techStackOptions = [
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "Python", value: "Python" },
  { label: "Java", value: "Java" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "MongoDB", value: "MongoDB" },
  { label: "PostgreSQL", value: "PostgreSQL" },
  { label: "AWS", value: "AWS" },
  { label: "Docker", value: "Docker" },
  { label: "Kubernetes", value: "Kubernetes" },
];

export default function CompanyProfile() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [kbUploading, setKbUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { profile } = useSelector((state: RootState) => state.user);

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
        message.error("Failed to load company profile");
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
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
      message.success("Knowledge base uploaded. Indexing will start shortly.");
    } catch (e) {
      console.error(e);
      message.error("Failed to upload knowledge base PDF.");
    } finally {
      setKbUploading(false);
    }
  };

  const handleEditClick = () => {
    if (!companyProfile) return;

    form.setFieldsValue({
      companyName: companyProfile?.companyName || "",
      city: companyProfile?.city || "",
      country: companyProfile?.country || "",
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
      };

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

  // const SidebarCard = (
  //   <Card className="rounded-xl">
  //     <Space direction="vertical" style={{ width: "100%" }}>
  //       {/* Header */}
  //       <div className="flex justify-between items-center">
  //         <div className="flex items-center gap-3">
  //           <Avatar
  //             size={72}
  //             src={
  //               companyProfile.logoUrl
  //             }
  //           />

  //           <div>
  //             <Title level={4} style={{ marginBottom: 0 }}>
  //               {companyProfile?.companyName}
  //             </Title>
  //             <Text type="secondary">
  //               {companyProfile.hiringStatus === "actively_hiring"
  //                 ? "Actively Hiring"
  //                 : "Not Hiring"}
  //             </Text>
  //           </div>
  //         </div>

  //         <div onClick={handleEditClick} className="cursor-pointer">
  //           <IconWrapper icon={<EditOutlined />} bgColorIcon="default" />
  //         </div>
  //       </div>

  //       <Divider className="!my-3" />

  //       {/* Location */}
  //       <div className="flex justify-between items-center">
  //         <Text strong>Location</Text>
  //         <Text>
  //           {companyProfile.city && companyProfile.country
  //             ? `${companyProfile.city}, ${companyProfile.country}`
  //             : "Not specified"}
  //         </Text>
  //       </div>

  //       {/* Founded Year */}
  //       {companyProfile.foundedYear && (
  //         <div className="flex justify-between items-center">
  //           <Text strong>Founded</Text>
  //           <Text>{companyProfile.foundedYear}</Text>
  //         </div>
  //       )}

  //       {/* NTN Number */}
  //       {companyProfile.ntnNumber && (
  //         <div className="flex justify-between items-center">
  //           <Text strong>NTN Number</Text>
  //           <Text>{companyProfile.ntnNumber}</Text>
  //         </div>
  //       )}

  //       {/* Contact Email */}
  //       <div className="flex justify-between items-center">
  //         <Text strong>Contact Email</Text>
  //         <Text>{companyProfile.contactEmail || "No email available"}</Text>
  //       </div>

  //       <Divider className="!my-3" />

  //       {/* About Company */}
  //       <Text strong>About Company</Text>
  //       <Paragraph>
  //         {companyProfile.description || "No company description added yet."}
  //       </Paragraph>

  //       <Divider className="!my-3" />

  //       {/* Tech Stack */}
  //       <Text strong>Tech Stack</Text>
  //       <Space wrap>
  //         {companyProfile.techStack?.length > 0 ? (
  //           companyProfile.techStack.map((tech: string, i: number) => (
  //             <Tag key={i} color="blue" className="rounded-full">
  //               {tech}
  //             </Tag>
  //           ))
  //         ) : (
  //           <Text type="secondary">No tech stack added</Text>
  //         )}
  //       </Space>

  //       <Divider className="!my-3" />

  //       {/* Links */}
  //       <Text strong>Links</Text>

  //       {/* Website */}
  //       {companyProfile.website && (
  //         <div className="flex items-center gap-2">
  //           <GlobalOutlined className="text-2xl" />
  //           <a
  //             href={companyProfile.website}
  //             target="_blank"
  //             className="hover:text-blue-500"
  //           >
  //             <Text strong>Website</Text>
  //           </a>
  //         </div>
  //       )}

  //       {/* LinkedIn */}
  //       {companyProfile.linkedInUrl && (
  //         <div className="flex items-center gap-2">
  //           <LinkedinFilled className="text-3xl text-[#0A66C2]" />
  //           <a
  //             href={companyProfile.linkedInUrl}
  //             target="_blank"
  //             className="hover:text-blue-500"
  //           >
  //             <Text strong>LinkedIn</Text>
  //           </a>
  //         </div>
  //       )}

  //       {!companyProfile.website && !companyProfile.linkedInUrl && (
  //         <Text type="secondary">No links added</Text>
  //       )}
  //     </Space>
  //   </Card>
  // );

  return (
    <div className="bg-gray-50  p-2">
      <div className="max-w-6xl mx-auto">
        <Row gutter={[24, 24]}>
          {/* Profile Sidebar */}
          <Col xs={24} lg={8}>
            <div className="sticky top-6">
              <Card
                className="rounded-2xl shadow-md border-0"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)",
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-center">
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
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50">
                        <MailOutlined className="text-cyan-600 text-lg" />
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
                      type="secondary"
                      className="text-sm mb-3"
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(companyProfile as unknown as any)?.knowledgeBasePdfUrl
                        ? "✓ PDF uploaded"
                        : "Upload PDF for AI"}
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
                        className="!border-blue-500 !text-blue-600"
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
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter city" }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Please enter country" }]}
              >
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Founded Year" name="foundedYear">
                <Input placeholder="e.g., 2020" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="NTN Number" name="ntnNumber">
                <Input placeholder="Enter NTN number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Contact Email"
            name="contactEmail"
            rules={[
              { required: true, message: "Please enter contact email" },
              { type: "email", message: "Please enter valid email" },
            ]}
          >
            <Input placeholder="contact@company.com" />
          </Form.Item>

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
              options={techStackOptions}
              maxTagCount={10}
            />
          </Form.Item>

          <Form.Item
            label="Website URL"
            name="website"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
          >
            <Input
              placeholder="https://yourcompany.com"
              prefix={<GlobalOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="LinkedIn URL"
            name="linkedInUrl"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
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
