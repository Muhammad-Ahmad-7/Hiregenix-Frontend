"use client";

import React, { useState } from "react";
import { Typography, Upload, Space } from "antd";
import { UploadOutlined, PaperClipOutlined } from "@ant-design/icons";
import UiButton from "@/component/common/CustomButton";
import { uploadResumeApi } from "@/app/api/candidate/profile.api";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

export default function ResumeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "removed") {
      setFile(null);
      return;
    }

    const selectedFile = info.file.originFileObj;
    if (selectedFile) {
      setFile(selectedFile);
      console.log("📄 Selected file:", selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file before uploading!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await uploadResumeApi(formData); // your API call
      console.log("✅ Upload response:", res);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload failed:", error);
      toast.error("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div>
          <Title level={5} style={{ margin: 0 }}>
            Upload Your Resume
          </Title>
          <Text type="secondary">Supported format: PDF (max 5MB)</Text>
        </div>

        <Upload
          beforeUpload={() => false} // prevent auto upload
          onChange={handleFileChange}
          maxCount={1}
          accept=".pdf"
          showUploadList={{
            showPreviewIcon: false,
            showRemoveIcon: true,
          }}
        >
          <UiButton icon={<UploadOutlined />}>Select Resume</UiButton>
        </Upload>

        {file && (
          <div className="flex items-center gap-2 mt-2">
            <PaperClipOutlined />
            <Text>{file.name}</Text>
          </div>
        )}

        <UiButton
          type="primary"
          loading={uploading}
          disabled={!file}
          onClick={handleUpload}
        >
          Upload Resume
        </UiButton>
      </Space>
    </div>
  );
}
