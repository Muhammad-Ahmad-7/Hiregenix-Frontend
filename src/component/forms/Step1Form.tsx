"use client";
import { Col, Form, Row, Typography, Upload, message, Avatar } from "antd";
import React, { useState } from "react";
import PlusIcon from "@/icons/PlusIcon";
import {
  LabelDatePicker,
  LabelInput,
  LabelPhoneNumber,
  LabelSelect,
} from "../common";
import UiButton from "../common/CustomButton";
import {
  LoadingOutlined,
  //  UserOutlined
} from "@ant-design/icons";
import { uploadFileApi } from "@/app/api/auth.api";

const { Text } = Typography;

type Step1FormProps = {
  onNext: (values: unknown) => void;
  initialValues?: unknown;
};

export default function Step1Form({ onNext, initialValues }: Step1FormProps) {
  const [form] = Form.useForm();
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    initialValues?.profilePictureUrl || null
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
    { label: "USA", value: "USA" },
    { label: "UK", value: "UK" },
    { label: "Pakistan", value: "Pakistan" },
    { label: "India", value: "India" },
    { label: "Canada", value: "Canada" },
  ];

  const cityOptions = [
    { label: "Lahore", value: "Lahore" },
    { label: "Karachi", value: "Karachi" },
    { label: "Islamabad", value: "Islamabad" },
    { label: "New York", value: "New York" },
    { label: "London", value: "London" },
  ];

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileApi(formData);
      console.log("Upload Response:", response);

      if (response?.data?.url) {
        setProfilePictureUrl(response.data.url);
        form.setFieldValue("profilePictureUrl", response.data.url);
        message.success("Profile picture uploaded successfully!");
      } else {
        message.error("Upload failed: Invalid response from server");
        console.error("Invalid response structure:", response);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload image. Please try again.";
      message.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg+xml";
      if (!isImage) {
        message.error("You can only upload JPEG, PNG, or SVG files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      handleImageUpload(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  const onFinish = (values: any) => {
    // Check if profile picture is uploaded
    if (!profilePictureUrl) {
      message.error("Please upload a profile picture");
      return;
    }

    // Format date and contact number
    const formattedValues = {
      ...values,
      profilePictureUrl: profilePictureUrl,
      dateOfBirth: values.dateOfBirth
        ? new Date(values.dateOfBirth).toISOString()
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
              placeholder="Country"
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
              options={cityOptions}
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
// "use client";

// import { Col, Form, Row, Typography, Upload, message, Avatar } from "antd";
// import React, { useState } from "react";
// import PlusIcon from "@/icons/PlusIcon";
// import { LabelInput, LabelSelect } from "@/component/common";
// import UiButton from "@/component/common/CustomButton";
// import { uploadFileApi } from "@/app/api/auth.api";
// import { LoadingOutlined } from "@ant-design/icons";
// import { AxiosError } from "axios";

// const { Text } = Typography;

// // Define proper types for form values
// interface CompanyFormValues {
//   companyName: string;
//   country: string;
//   city: string;
//   foundedYear: number;
//   ntnNumber: string;
//   contactEmail: string;
//   logoUrl: string;
// }

// type CompanyStep1FormProps = {
//   onNext: (values: CompanyFormValues) => void;
//   initialValues?: Partial<CompanyFormValues>;
// };

// export default function CompanyStep1Form({
//   onNext,
//   initialValues,
// }: CompanyStep1FormProps) {
//   const [form] = Form.useForm<CompanyFormValues>();
//   const [uploading, setUploading] = useState(false);
//   const [logoUrl, setLogoUrl] = useState<string | null>(
//     initialValues?.logoUrl || null
//   );

//   const countryOptions = [
//     { label: "USA", value: "USA" },
//     { label: "UK", value: "UK" },
//     { label: "Pakistan", value: "Pakistan" },
//     { label: "India", value: "India" },
//     { label: "Canada", value: "Canada" },
//   ];

//   const cityOptions = [
//     { label: "Lahore", value: "Lahore" },
//     { label: "Karachi", value: "Karachi" },
//     { label: "Islamabad", value: "Islamabad" },
//     { label: "New York", value: "New York" },
//     { label: "London", value: "London" },
//   ];

//   // 📤 Handle company logo upload
//   const handleLogoUpload = async (file: File) => {
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await uploadFileApi(formData);
//       console.log("Upload Response:", response);

//       if (response?.data?.url) {
//         setLogoUrl(response.data.url);
//         form.setFieldValue("logoUrl", response.data.url);
//         message.success("Logo uploaded successfully!");
//       } else {
//         message.error("Upload failed: Invalid response from server");
//       }
//     } catch (err: unknown) {
//       const error = err as AxiosError<{ message?: string }>;
//       message.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to upload logo. Please try again."
//       );
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const uploadProps = {
//     beforeUpload: (file: File) => {
//       const isImage =
//         file.type === "image/jpeg" ||
//         file.type === "image/png" ||
//         file.type === "image/svg+xml";
//       if (!isImage) {
//         message.error("You can only upload JPEG, PNG, or SVG files!");
//         return false;
//       }

//       const isLt5M = file.size / 1024 / 1024 < 5;
//       if (!isLt5M) {
//         message.error("Logo must be smaller than 5MB!");
//         return false;
//       }

//       handleLogoUpload(file);
//       return false; // prevent default upload
//     },
//     showUploadList: false,
//   };

//   const onFinish = (values: CompanyFormValues) => {
//     if (!logoUrl) {
//       message.error("Please upload your company logo");
//       return;
//     }

//     const formattedValues: CompanyFormValues = {
//       ...values,
//       logoUrl: logoUrl,
//     };

//     console.log("✅ Company Step 1 Values:", formattedValues);
//     onNext(formattedValues);
//   };

//   return (
//     <Form
//       form={form}
//       initialValues={initialValues}
//       onFinish={onFinish}
//       validateTrigger="onSubmit"
//       layout="vertical"
//     >
//       {/* Hidden field for logo URL */}
//       <Form.Item name="logoUrl" hidden>
//         <input type="hidden" />
//       </Form.Item>

//       <div className="flex flex-col gap-4">
//         <Col span={24}>
//           <LabelInput
//             name="companyName"
//             label="Company Name"
//             placeholder="Enter your Company Name"
//             required
//           />
//         </Col>

//         <Row gutter={24}>
//           <Col span={12}>
//             <LabelSelect
//               name="country"
//               label="Country"
//               placeholder="Country"
//               required
//               options={countryOptions}
//             />
//           </Col>
//           <Col span={12}>
//             <LabelSelect
//               name="city"
//               label="City"
//               placeholder="City"
//               required
//               options={cityOptions}
//             />
//           </Col>
//         </Row>

//         <Row gutter={24}>
//           <Col span={12}>
//             <LabelInput
//               type="number"
//               label="Founded Year"
//               placeholder="e.g., 1990"
//               name="foundedYear"
//               required
//             />
//           </Col>
//           <Col span={12}>
//             <LabelInput
//               label="NTN Number"
//               placeholder="e.g., 1234567-8"
//               name="ntnNumber"
//               required
//             />
//           </Col>
//         </Row>

//         <Col span={24}>
//           <LabelInput
//             label="Contact Email"
//             name="contactEmail"
//             required
//             placeholder="Enter your contact email"
//           />
//         </Col>

//         {/* Logo Upload */}
//         <div className="flex justify-between items-center w-full mt-4 mb-6">
//           <div className="flex flex-col">
//             <Text className="font-semibold">
//               Upload Company Logo <span className="text-red-500">*</span>
//             </Text>
//             <Text type="secondary">5MB Limit (JPEG, PNG, SVG)</Text>
//           </div>

//           <Upload {...uploadProps}>
//             <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-all">
//               {uploading ? (
//                 <LoadingOutlined className="text-2xl text-blue-500" />
//               ) : logoUrl ? (
//                 <Avatar size={60} src={logoUrl} />
//               ) : (
//                 <PlusIcon />
//               )}
//             </div>
//           </Upload>
//         </div>
//       </div>

//       {/* Next Button */}
//       <div className="mt-4 flex justify-start">
//         <Col span={6}>
//           <UiButton
//             htmlType="submit"
//             type="primary"
//             block
//             size="large"
//             className="!rounded-xl"
//             loading={uploading}
//           >
//             Next
//           </UiButton>
//         </Col>
//       </div>
//     </Form>
//   );
// }
