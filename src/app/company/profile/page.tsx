"use client";

import React, { useState } from "react";
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
} from "antd";
import {
  EditOutlined,
  GlobalOutlined,
  LinkedinFilled,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import IconWrapper from "@/icons/IconWrapper";
import { updateCompanyProfileApi } from "@/app/api/company/profile.api";
import { setProfile } from "@/redux/slices/userSlice";
import {
  CompleteCompanyProfile,
  CompanyResponse,
} from "@/constants/Interfaces/Types/Profile.interface";

const { Title, Text, Paragraph } = Typography;
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
  const { profile } = useSelector((state: RootState) => state.user);

  type CompanyProfile = CompanyResponse & { userType: "company" };
  const companyProfile =
    profile?.userType === "company" ? (profile as CompanyProfile) : null;

  if (!companyProfile) return null;

  const handleEditClick = () => {
    form.setFieldsValue({
      companyName: companyProfile.companyName || "",
      city: companyProfile.city || "",
      country: companyProfile.country || "",
      foundedYear: companyProfile.foundedYear || "",
      ntnNumber: companyProfile.ntnNumber || "",
      contactEmail: companyProfile.contactEmail || "",
      description: companyProfile.description || "",
      techStack: companyProfile.techStack || [],
      website: companyProfile.website || "",
      linkedInUrl: companyProfile.linkedInUrl || "",
      hiringStatus: companyProfile.hiringStatus || "not_hiring",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (values: Partial<CompleteCompanyProfile>) => {
    setSaveLoading(true);
    try {
      const updatedProfile: CompanyProfile = {
        ...companyProfile,
        ...values,
      };

      // Update Redux state locally
      dispatch(setProfile(updatedProfile));

      // Update backend
      await updateCompanyProfileApi(
        updatedProfile as CompleteCompanyProfile
      );

      message.success("Company profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Failed to update company profile");
      console.error(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const SidebarCard = (
    <Card className="rounded-xl">
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar
              size={72}
              src={
                companyProfile.logoUrl
              }
            />

            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {companyProfile.companyName}
              </Title>
              <Text type="secondary">
                {companyProfile.hiringStatus === "actively_hiring"
                  ? "Actively Hiring"
                  : "Not Hiring"}
              </Text>
            </div>
          </div>

          <div onClick={handleEditClick} className="cursor-pointer">
            <IconWrapper icon={<EditOutlined />} bgColorIcon="default" />
          </div>
        </div>

        <Divider className="!my-3" />

        {/* Location */}
        <div className="flex justify-between items-center">
          <Text strong>Location</Text>
          <Text>
            {companyProfile.city && companyProfile.country
              ? `${companyProfile.city}, ${companyProfile.country}`
              : "Not specified"}
          </Text>
        </div>

        {/* Founded Year */}
        {companyProfile.foundedYear && (
          <div className="flex justify-between items-center">
            <Text strong>Founded</Text>
            <Text>{companyProfile.foundedYear}</Text>
          </div>
        )}

        {/* NTN Number */}
        {companyProfile.ntnNumber && (
          <div className="flex justify-between items-center">
            <Text strong>NTN Number</Text>
            <Text>{companyProfile.ntnNumber}</Text>
          </div>
        )}

        {/* Contact Email */}
        <div className="flex justify-between items-center">
          <Text strong>Contact Email</Text>
          <Text>{companyProfile.contactEmail || "No email available"}</Text>
        </div>

        <Divider className="!my-3" />

        {/* About Company */}
        <Text strong>About Company</Text>
        <Paragraph>
          {companyProfile.description || "No company description added yet."}
        </Paragraph>

        <Divider className="!my-3" />

        {/* Tech Stack */}
        <Text strong>Tech Stack</Text>
        <Space wrap>
          {companyProfile.techStack?.length > 0 ? (
            companyProfile.techStack.map((tech: string, i: number) => (
              <Tag key={i} color="blue" className="rounded-full">
                {tech}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No tech stack added</Text>
          )}
        </Space>

        <Divider className="!my-3" />

        {/* Links */}
        <Text strong>Links</Text>

        {/* Website */}
        {companyProfile.website && (
          <div className="flex items-center gap-2">
            <GlobalOutlined className="text-2xl" />
            <a
              href={companyProfile.website}
              target="_blank"
              className="hover:text-blue-500"
            >
              <Text strong>Website</Text>
            </a>
          </div>
        )}

        {/* LinkedIn */}
        {companyProfile.linkedInUrl && (
          <div className="flex items-center gap-2">
            <LinkedinFilled className="text-3xl text-[#0A66C2]" />
            <a
              href={companyProfile.linkedInUrl}
              target="_blank"
              className="hover:text-blue-500"
            >
              <Text strong>LinkedIn</Text>
            </a>
          </div>
        )}

        {!companyProfile.website && !companyProfile.linkedInUrl && (
          <Text type="secondary">No links added</Text>
        )}
      </Space>
    </Card>
  );

  return (
    <div style={{ minHeight: "100vh" }} className="fixed mx-auto w-full">
      <Row gutter={[24, 24]} className="flex justify-center items-center">
        {/* Left Sidebar */}
        <Col xs={24} md={24} lg={9}>
          {/* <Affix offsetTop={80}>{SidebarCard}</Affix> */}
          <div className="fixed">{SidebarCard}</div>
        </Col>
      </Row>

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
