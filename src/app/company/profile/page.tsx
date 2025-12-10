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
  Affix,
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

  if (!profile) return null;

  const handleEditClick = () => {
    form.setFieldsValue({
      companyName: profile.companyName || "",
      city: profile.city || "",
      country: profile.country || "",
      foundedYear: profile.foundedYear || "",
      ntnNumber: profile.ntnNumber || "",
      contactEmail: profile.contactEmail || "",
      description: profile.description || "",
      techStack: profile.techStack || [],
      website: profile.website || "",
      linkedInUrl: profile.linkedInUrl || "",
      hiringStatus: profile.hiringStatus || "not_hiring",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (values: any) => {
    setSaveLoading(true);
    try {
      // Update Redux state locally
      dispatch(setProfile(values));

      // Update backend
      await updateCompanyProfileApi(values);

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
                profile.logoUrl ||
                "data:image/jpeg;base64,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"
              }
            />

            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {profile.companyName}
              </Title>
              <Text type="secondary">
                {profile.hiringStatus === "actively_hiring"
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
            {profile.city && profile.country
              ? `${profile.city}, ${profile.country}`
              : "Not specified"}
          </Text>
        </div>

        {/* Founded Year */}
        {profile.foundedYear && (
          <div className="flex justify-between items-center">
            <Text strong>Founded</Text>
            <Text>{profile.foundedYear}</Text>
          </div>
        )}

        {/* NTN Number */}
        {profile.ntnNumber && (
          <div className="flex justify-between items-center">
            <Text strong>NTN Number</Text>
            <Text>{profile.ntnNumber}</Text>
          </div>
        )}

        {/* Contact Email */}
        <div className="flex justify-between items-center">
          <Text strong>Contact Email</Text>
          <Text>{profile.contactEmail || "No email available"}</Text>
        </div>

        <Divider className="!my-3" />

        {/* About Company */}
        <Text strong>About Company</Text>
        <Paragraph>
          {profile.description || "No company description added yet."}
        </Paragraph>

        <Divider className="!my-3" />

        {/* Tech Stack */}
        <Text strong>Tech Stack</Text>
        <Space wrap>
          {profile.techStack?.length > 0 ? (
            profile.techStack.map((tech: string, i: number) => (
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
        {profile.website && (
          <div className="flex items-center gap-2">
            <GlobalOutlined className="text-2xl" />
            <a
              href={profile.website}
              target="_blank"
              className="hover:text-blue-500"
            >
              <Text strong>Website</Text>
            </a>
          </div>
        )}

        {/* LinkedIn */}
        {profile.linkedInUrl && (
          <div className="flex items-center gap-2">
            <LinkedinFilled className="text-3xl text-[#0A66C2]" />
            <a
              href={profile.linkedInUrl}
              target="_blank"
              className="hover:text-blue-500"
            >
              <Text strong>LinkedIn</Text>
            </a>
          </div>
        )}

        {!profile.website && !profile.linkedInUrl && (
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
