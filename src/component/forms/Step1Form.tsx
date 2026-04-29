"use client";
//can we change (means not tested yet)
import { Col, Form, Row, Typography, Upload, Avatar } from "antd";
import React, { useState } from "react";
import PlusIcon from "@/icons/PlusIcon";
import {
  LabelDatePicker,
  LabelInput,
  LabelPhoneNumber,
  LabelSelect,
} from "../common";
import UiButton from "../common/CustomButton";
import { LoadingOutlined } from "@ant-design/icons";
import { uploadFileApi } from "@/app/api/auth.api";
import { AxiosError } from "axios";
import type { UploadProps } from "antd";
import { Dayjs } from "dayjs";
import toast from "react-hot-toast";
import { pakistanCities } from "@/constants/job";

const { Text } = Typography;

// Type definitions
export interface PhoneNumber {
  countryCode: string;
  areaCode: string;
  phoneNumber: string;
}

export interface Step1FormValues {
  fullName: string;
  dateOfBirth: Dayjs | string;
  gender: string;
  country: string;
  city: string;
  contactNumber: PhoneNumber;
  profilePictureUrl: string;
}

export interface FormattedStep1Values {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  contactNumber: string;
  profilePictureUrl: string;
}

type Step1FormProps = {
  onNext: (values: FormattedStep1Values) => void;
  initialValues?: Partial<Step1FormValues>;
};

export default function Step1Form({ onNext, initialValues }: Step1FormProps) {
  const [form] = Form.useForm<Step1FormValues>();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null
  );
  const [uploading, setUploading] = useState(false);

  const genderOptions = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  const countryOptions = [
    { label: "Pakistan", value: "Pakistan" },
  ];

  const handleImageUpload = async (file: File): Promise<void> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileApi(formData);
      console.log("Upload Response:", response);

      if (response?.data?.url) {
        setProfilePictureUrl(response.data.url);
        form.setFieldValue("profilePictureUrl", response.data.url);
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error("Upload failed: Invalid response from server");
        console.error("Invalid response structure:", response);
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload image. Please try again.";
      toast.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
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
      handleImageUpload(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  const onFinish = (values: Step1FormValues): void => {
    // Check if profile picture is uploaded
    if (!profilePictureUrl) {
      toast.error("Please upload a profile picture");
      return;
    }

    // Format date and contact number
    const formattedValues: FormattedStep1Values = {
      ...values,
      profilePictureUrl: profilePictureUrl,
      dateOfBirth: values.dateOfBirth
        ? new Date(values.dateOfBirth as string).toISOString()
        : "",
      contactNumber:
        "+" +
        values.contactNumber.countryCode +
        values.contactNumber.areaCode +
        values.contactNumber.phoneNumber,
    };

    console.log("✅ Step 1 Values (with UTC):", formattedValues);
    onNext(formattedValues);
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      validateTrigger="onSubmit"
    >
      <div className="flex flex-col">
        {/* Hidden field to store profile picture URL */}
        <Form.Item name="profilePictureUrl" hidden>
          <input type="hidden" />
        </Form.Item>

        <Col span={24}>
          <LabelInput
            name="fullName"
            label="Full Name"
            placeholder="Enter your Full Name"
            required
          />
        </Col>
        <Row gutter={24}>
          <Col span={12}>
            <LabelDatePicker
              label="Date Of Birth"
              placeholder="D.O.B"
              name="dateOfBirth"
              required
            />
          </Col>
          <Col span={12}>
            <LabelSelect
              label="Gender"
              placeholder="Gender"
              name="gender"
              required
              options={genderOptions}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <LabelSelect
              name="country"
              label="Country"
              required
              options={countryOptions}
              itemProps={{
                tooltip: "Pick your country",
                validateTrigger: "onBlur",
              }}
            />
          </Col>
          <Col span={12}>
            <LabelSelect
              label="City"
              placeholder="City"
              name="city"
              required
              options={pakistanCities}
            />
          </Col>
        </Row>
        <Col span={24}>
          <LabelPhoneNumber
            label="Contact Number"
            name="contactNumber"
            required
          />
        </Col>

        {/* Profile Picture Upload Section */}
        <div className="flex justify-between items-center w-full mt-4 mb-6">
          <div className="flex flex-col">
            <Text className="font-semibold">
              Upload profile picture <span className="text-red-500">*</span>
            </Text>
            <Text type="secondary">5MB Limit (JPEG, PNG, SVG)</Text>
          </div>
          <Upload {...uploadProps}>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-all">
              {uploading ? (
                <LoadingOutlined className="text-2xl text-blue-500" />
              ) : profilePictureUrl ? (
                <Avatar size={60} src={profilePictureUrl} />
              ) : (
                <PlusIcon />
              )}
            </div>
          </Upload>
        </div>

        {/* Show preview if image is uploaded */}
        {/* {profilePictureUrl && !uploading && (
          <div className="mb-4 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Avatar size={48} src={profilePictureUrl} />
            <div className="flex-1">
              <Text className="text-green-700 font-medium">
                Profile picture uploaded successfully!
              </Text>
            </div>
            <Upload {...uploadProps}>
              <UiButton type="link" size="small">
                Change
              </UiButton>
            </Upload>
          </div>
        )} */}
      </div>

      <div className="mt-4 gap-2 flex flex-col items-start">
        <Col span={6}>
          <UiButton
            htmlType="submit"
            type="primary"
            block
            size="large"
            className="!rounded-xl"
            loading={uploading}
          >
            Next
          </UiButton>
        </Col>
      </div>
    </Form>
  );
}
