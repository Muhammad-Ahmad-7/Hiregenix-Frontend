"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Card,
  Tag,
  Typography,
  Divider,
  Button,
  Space,
  Row,
  Col,
  Timeline,
  Affix,
  Grid,
  Upload,
  Empty,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
  Progress,
} from "antd";
import {
  EditOutlined,
  GithubFilled,
  LinkedinFilled,
  PaperClipOutlined,
  UploadOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ProjectOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addResumeData,
  deleteResumeData,
  editResumeData,
  getResumeDataApi,
  updateProfileApi,
  uploadResumeApi,
} from "@/app/api/candidate/profile.api";
import { uploadFileApi } from "@/app/api/auth.api";
import {
  CandidateProfileResponse,
  CompleteCandidateProfile,
} from "@/constants/Interfaces/Types/Profile.interface";
import { CandidateResume } from "@/constants/Interfaces/Types/Resume.interface";
import { RootState } from "@/redux/store";
import { setProfile } from "@/redux/slices/userSlice";
import type { UploadProps } from "antd";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

interface ResumeExperience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface ResumeEducation {
  _id: string;
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}

interface ResumeProject {
  _id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string | null;
}

interface ResumeCertification {
  _id: string;
  name?: string;
  issuer?: string;
  year?: string;
}

interface ResumeParsedData {
  portfolio: string | null;
  summary: string | null;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications?: ResumeCertification[];
}

interface ResumeData {
  parsedData: ResumeParsedData;
  fileUrl: string;
  aiScore: number;
  aiSuggestions: string[];
}

interface UserProfile {
  fullName: string;
  profilePictureUrl: string;
  tagline: string;
  city: string;
  country: string;
  bio: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeUrl?: string;
}

const isCandidateProfile = (
  profile: CandidateProfileResponse | unknown
): profile is CandidateProfileResponse => {
  return (
    profile !== null && typeof profile === "object" && "fullName" in profile
  );
};

// ─── helper to generate temp IDs for new entries ───────────────────────────
const tempId = () => `temp_${Date.now()}_${Math.random()}`;

export default function ProfileDashboard() {
  const screens = useBreakpoint();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [parsingStatus, setParsingStatus] = useState<
    "idle" | "uploading" | "queued" | "parsing" | "finalizing" | "completed" | "failed"
  >("idle");
  const [parsingProgress, setParsingProgress] = useState(0);
  const [parsingMessage, setParsingMessage] = useState("");
  const pollingActiveRef = useRef(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form] = Form.useForm<CandidateProfileResponse>();
  const { profile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // ─── section-edit modal state ────────────────────────────────────────────
  type SectionType = "experience" | "education" | "project" | "certification";
  const [sectionModal, setSectionModal] = useState<{
    open: boolean;
    type: SectionType | null;
    editingItem: ResumeExperience | ResumeEducation | ResumeProject | ResumeCertification | null;
  }>({ open: false, type: null, editingItem: null });
  const [sectionForm] = Form.useForm();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: profile?.userType === "candidate" ? profile.fullName : "",
    profilePictureUrl: profile?.userType === "candidate" ? profile.profilePictureUrl : "",
    tagline: profile?.userType === "candidate" ? profile.tagline : "",
    city: profile?.userType === "candidate" ? profile.city : "",
    country: profile?.userType === "candidate" ? profile.country : "",
    bio: profile?.userType === "candidate" ? profile.bio : "",
    githubUrl: profile?.userType === "candidate" ? profile.githubUrl : "",
    linkedinUrl: profile?.userType === "candidate" ? profile.linkedinUrl : "",
    portfolioUrl: profile?.userType === "candidate" ? profile.portfolioUrl : "",
  });

  const isLargeScreen = screens.lg;

  const mapApiResumeToState = (apiResume: CandidateResume): ResumeData => {
    const parsed = apiResume.parsedData || {};
    return {
      parsedData: {
        portfolio: parsed.portfolio ?? null,
        summary: parsed.summary ?? null,
        name: parsed.name ?? "",
        email: parsed.email ?? "",
        phone: parsed.phone ?? "",
        linkedin: parsed.linkedin ?? "",
        github: parsed.github ?? "",
        skills: parsed.skills ?? [],
        experience: parsed.experience ?? [],
        education: parsed.education ?? [],
        projects: parsed.projects ?? [],
        certifications: parsed.certifications ?? [],
      },
      fileUrl: apiResume.fileUrl ?? "",
      aiScore: apiResume.aiScore ?? 0,
      aiSuggestions: apiResume.aiSuggestions ?? [],
    };
  };

  const fetchResumeData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getResumeDataApi();
      const apiResume = response?.data?.resume;
      if (!apiResume) { setResumeData(null); setResumeUrl(null); return; }
      const mapped = mapApiResumeToState(apiResume);
      setResumeData(mapped);
      setResumeUrl(mapped.fileUrl);
      if (mapped.parsedData) {
        setUserProfile((prev) => ({
          ...prev,
          fullName: mapped.parsedData.name || prev.fullName,
          githubUrl: mapped.parsedData.github || prev.githubUrl,
          linkedinUrl: mapped.parsedData.linkedin || prev.linkedinUrl,
          portfolioUrl: mapped.parsedData.portfolio || prev.portfolioUrl,
        }));
      }
    } catch (error) {
      toast.error("Failed to load resume data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    fetchResumeData();
  }, [fetchResumeData]);

  useEffect(() => {
    return () => {
      pollingActiveRef.current = false;
    };
  }, []);

  const parsingSteps = [
    { key: "uploading", label: "Uploading resume" },
    { key: "queued", label: "Queued for parsing" },
    { key: "parsing", label: "Parsing resume content" },
    { key: "finalizing", label: "Finalizing profile" },
  ];

  const stepOrder = ["uploading", "queued", "parsing", "finalizing", "completed"] as const;

  const getStepState = (key: string) => {
    const statusForIndex =
      parsingStatus === "idle"
        ? "uploading"
        : parsingStatus === "failed"
          ? "parsing"
          : parsingStatus;
    const currentIndex = stepOrder.indexOf(statusForIndex);
    const stepIndex = stepOrder.indexOf(key as (typeof stepOrder)[number]);
    if (parsingStatus === "failed") return stepIndex <= currentIndex ? "error" : "pending";
    if (stepIndex < currentIndex) return "done";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const resetParsingUi = () => {
    setParsingStatus("idle");
    setParsingProgress(0);
    setParsingMessage("");
  };

  const pollResumeTask = async (taskId: string): Promise<CandidateResume | null> => {
    pollingActiveRef.current = true;
    setParsingStatus("queued");
    setParsingProgress(20);
    setParsingMessage("Queued for parsing");

    const maxAttempts = 24; // 2 minutes at 5s interval
    let attempts = 0;

    while (pollingActiveRef.current && attempts < maxAttempts) {
      const res = await getTask(taskId);
      if (!res || res.status !== "Success" || !res.data?.task) {
        setParsingStatus("failed");
        setParsingMessage("Parsing failed. Please try again.");
        setParsingProgress(100);
        return null;
      }

      const status = res.data.task.status;
      if (status === "completed") {
        setParsingStatus("finalizing");
        setParsingMessage("Finalizing profile");
        setParsingProgress(92);

        const resumeRes = await getResumeDataApi();
        const apiResume = resumeRes?.data?.resume || null;
        if (!apiResume) {
          setParsingStatus("failed");
          setParsingMessage("Parsed data unavailable. Please retry upload.");
          setParsingProgress(100);
          return null;
        }

        setParsingStatus("completed");
        setParsingMessage("Resume parsed successfully");
        setParsingProgress(100);
        window.setTimeout(resetParsingUi, 2500);
        return apiResume;
      }

      if (status === "failed") {
        setParsingStatus("failed");
        setParsingMessage("Parsing failed. Please try again.");
        setParsingProgress(100);
        return null;
      }

      setParsingStatus("parsing");
      setParsingMessage("Parsing resume content");
      setParsingProgress((prev) => Math.min(prev + 12, 85));

      attempts += 1;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    setParsingStatus("failed");
    setParsingMessage("Parsing timed out. Please retry.");
    setParsingProgress(100);
    return null;
  };

  const handleResumeUpload = async (file: File): Promise<void> => {
    setUploading(true);
    setParsingStatus("uploading");
    setParsingProgress(10);
    setParsingMessage("Uploading resume");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadResumeApi(formData);
      console.log("Upload response", response)

      const taskId = response?.data?.taskId;

      if (!taskId) {
        setParsingStatus("failed");
        setParsingMessage("Upload failed. No task assigned.");
        setParsingProgress(100);
        return;
      }

      // Short polling on taskId to check for resume is parsed or not
      const apiResume = await pollResumeTask(taskId);


      if (apiResume) {
        const mapped = mapApiResumeToState(apiResume);
        setResumeData(mapped);
        setResumeUrl(mapped.fileUrl);
        if (mapped.parsedData) {
          setUserProfile((prev) => ({
            ...prev,
            fullName: mapped.parsedData.name || prev.fullName,
            githubUrl: mapped.parsedData.github || prev.githubUrl,
            linkedinUrl: mapped.parsedData.linkedin || prev.linkedinUrl,
            portfolioUrl: mapped.parsedData.portfolio || prev.portfolioUrl,
          }));
        }
      }
      toast.success("Resume uploaded successfully and parsing completed!");
    } catch (error: unknown) {
      setParsingStatus("failed");
      setParsingMessage("Failed to upload resume");
      setParsingProgress(100);
      toast.error("Failed to upload resume");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (file: File): Promise<void> => {
    if (!isCandidateProfile(profile)) {
      toast.error("Profile is not ready yet. Please try again.");
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileApi(formData);
      const profilePictureUrl = response?.data?.url;

      if (!profilePictureUrl) {
        toast.error("Failed to upload profile picture.");
        return;
      }

      const updatedProfile: CompleteCandidateProfile = {
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        country: profile.country,
        city: profile.city,
        contactNumber: profile.contactNumber,
        profilePictureUrl,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        portfolioUrl: profile.portfolioUrl,
        bio: profile.bio,
        tagline: profile.tagline,
      };

      await updateProfileApi(updatedProfile);
      dispatch(
        setProfile({
          ...profile,
          profilePictureUrl,
          userType: "candidate",
        } as CandidateProfileResponse & { userType: "candidate" }),
      );

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture");
    } finally {
      setAvatarUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);

        await handleResumeUpload(file as File);

        onSuccess?.("ok");
      } catch (err) {
        onError?.(err as Error);
      } finally {
        setUploading(false);
      }
    },
    showUploadList: false,
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

      handleAvatarUpload(file);
      return false;
    },
    showUploadList: false,
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // ─── Profile edit ─────────────────────────────────────────────────────────
  const handleEditClick = (): void => {
    if (isCandidateProfile(profile)) {
      form.setFieldsValue({
        fullName: profile?.fullName || resumeData?.parsedData.name || "",
        tagline: profile?.tagline || "",
        email: profile?.userId?.email || resumeData?.parsedData.email || "",
        phone: profile?.contactNumber || resumeData?.parsedData.phone || "",
        city: profile?.city || "",
        country: profile?.country || "",
        bio: profile?.bio || "",
        githubUrl: profile?.githubUrl || resumeData?.parsedData.github || "",
        linkedinUrl: profile?.linkedinUrl || resumeData?.parsedData.linkedin || "",
        portfolioUrl: profile?.portfolioUrl || resumeData?.parsedData.portfolio || "",
      } as Partial<CandidateProfileResponse>);
    }
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (values: CandidateProfileResponse): Promise<void> => {
    try {
      setProfileEditing(true);
      const valuesWithUserType: CandidateProfileResponse & { userType: "candidate", profilePictureUrl: string } = { ...values, userType: "candidate", profilePictureUrl: userProfile?.profilePictureUrl || "" };
      console.log("Values of editing modal data", valuesWithUserType);
      console.log("Profile data", userProfile);
      dispatch(setProfile(valuesWithUserType));
      await updateProfileApi(values);
      setUserProfile((prev) => ({ ...prev, ...values }));
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally { setProfileEditing(false); }
  };

  // ─── Section CRUD helpers ─────────────────────────────────────────────────
  const openAddSection = (type: SectionType) => {
    sectionForm.resetFields();
    setSectionModal({ open: true, type, editingItem: null });
  };

  const openEditSection = (type: SectionType, item: ResumeExperience | ResumeEducation | ResumeProject | ResumeCertification) => {
    // Pre-populate form
    if (type === "experience") {
      const exp = item as ResumeExperience;
      sectionForm.setFieldsValue({
        ...exp,
        startDate: exp.startDate ? dayjs(exp.startDate) : null,
        endDate: exp.endDate ? dayjs(exp.endDate) : null,
      });
    } else if (type === "project") {
      const proj = item as ResumeProject;
      sectionForm.setFieldsValue({
        ...proj,
        technologies: proj.technologies || [],
      });
    } else {
      sectionForm.setFieldsValue(item);
    }
    setSectionModal({ open: true, type, editingItem: item });
  };

  const closeSectionModal = () => {
    setSectionModal({ open: false, type: null, editingItem: null });
    sectionForm.resetFields();
  };

  const [isEditModalLoading, setIsEditModalLoading] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);

  const handleSectionSave = async () => {
    setIsEditModalLoading(true);
    try {
      const values = await sectionForm.validateFields();
      if (!resumeData) { toast.error("Resume data not loaded"); return; }
      const updated = { ...resumeData };

      if (sectionModal.type === "experience") {
        console.log("in experience editing")
        const formatted: ResumeExperience = {
          _id: (sectionModal.editingItem as ResumeExperience)?._id || tempId(),
          company: values.company,
          position: values.position,
          startDate: values.startDate ? values.startDate.toISOString() : "",
          endDate: values.endDate ? values.endDate.toISOString() : "",
          description: values.description,
        };
        if (sectionModal.editingItem) {
          const res = await editResumeData({ type: "experience", _id: formatted._id, data: { company: formatted.company, position: formatted.position, startDate: formatted.startDate, endDate: formatted.endDate, description: formatted.description } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to update experience");
            return;
          }
          updated.parsedData.experience = res.data?.resume.parsedData.experience || updated.parsedData.experience;
        } else {
          const { company, position, startDate, endDate, description } = formatted
          updated.parsedData.experience = [...updated.parsedData.experience, formatted];
          const res = await addResumeData({ type: "experience", data: { company, position, startDate, endDate, description } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to add experience");
            return;
          }
          updated.parsedData.experience = res.data?.resume.parsedData.experience || [...updated.parsedData.experience, formatted];
        }
      }

      if (sectionModal.type === "education") {
        const formatted: ResumeEducation = {
          _id: (sectionModal.editingItem as ResumeEducation)?._id || tempId(),
          institution: values.institution,
          degree: values.degree,
          startYear: values.startYear,
          endYear: values.endYear,
        };
        console.log("formatted", formatted)
        if (sectionModal.editingItem) {
          const res = await editResumeData({ type: "education", _id: formatted._id, data: { institution: formatted.institution, degree: formatted.degree, startYear: formatted.startYear, endYear: formatted.endYear } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to update education");
            return;
          }
          updated.parsedData.education = res.data?.resume.parsedData.education || updated.parsedData.education;
        } else {
          const { institution, degree, startYear, endYear } = formatted
          const res = await addResumeData({ type: "education", data: { institution, degree, startYear, endYear } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to add education");
            return;
          }
          updated.parsedData.education = res.data?.resume.parsedData.education || [...updated.parsedData.education, formatted];
        }
      }

      if (sectionModal.type === "project") {
        const formatted: ResumeProject = {
          _id: (sectionModal.editingItem as ResumeProject)?._id || tempId(),
          name: values.name,
          description: values.description,
          technologies: values.technologies || [],
          link: values.link || "",
        };
        if (sectionModal.editingItem) {
          const res = await editResumeData({ type: "project", _id: formatted._id, data: { name: formatted.name, description: formatted.description, technologies: formatted.technologies, link: formatted.link } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to update project");
            return;
          }
          updated.parsedData.projects = res.data?.resume.parsedData.projects || updated.parsedData.projects;
        } else {
          const { name, description, technologies, link } = formatted
          const res = await addResumeData({ type: "project", data: { name, description, technologies, link } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to add project");
            return;
          }
          updated.parsedData.projects = res.data?.resume.parsedData.projects || [...updated.parsedData.projects, formatted];
        }
      }

      if (sectionModal.type === "certification") {
        const formatted: ResumeCertification = {
          _id: (sectionModal.editingItem as ResumeCertification)?._id || tempId(),
          name: values.name,
          issuer: values.issuer,
          year: values.year,
        };
        console.log("data", formatted);
        if (sectionModal.editingItem) {
          const res = await editResumeData({ type: "certification", _id: formatted._id, data: { name: formatted.name, issuer: formatted.issuer, year: Number(formatted.year) } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to update certification");
            return;
          }
          updated.parsedData.certifications = res.data?.resume.parsedData.certifications || updated.parsedData.certifications;
        } else {
          const { name, issuer, year } = formatted
          const res = await addResumeData({ type: "certification", data: { name, issuer, year: Number(year) } });
          if (!res || res.status === "Failed") {
            toast.error("Failed to add certification");
            return;
          }
          updated.parsedData.certifications = res.data?.resume.parsedData.certifications || [...(updated.parsedData.certifications || []), formatted];
        }
      }

      setResumeData(updated);
      toast.success(`${sectionModal.editingItem ? "Updated" : "Added"} successfully!`);
      setIsEditModalLoading(false);
      closeSectionModal();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsEditModalLoading(false);
    }
  };

  const handleDeleteItem = async (type: SectionType, id: string) => {
    if (!resumeData) return;
    const updated = { ...resumeData };
    if (type === "experience") {
      console.log("data", id);
      const res = await deleteResumeData({ type, _id: id });
      if (!res || res.status === "Failed") {
        toast.error("Failed to delete experience");
        return;
      }
      updated.parsedData.experience = updated.parsedData.experience.filter((e) => e._id !== id);
    }
    if (type === "education") {
      const res = await deleteResumeData({ type, _id: id });
      if (!res || res.status === "Failed") {
        toast.error("Failed to delete education");
        return;
      }
      updated.parsedData.education = updated.parsedData.education.filter((e) => e._id !== id);
    }
    if (type === "project") {
      const res = await deleteResumeData({ type, _id: id });
      if (!res || res.status === "Failed") {
        toast.error("Failed to delete project");
        return;
      }
      updated.parsedData.projects = updated.parsedData.projects.filter((p) => p._id !== id);
    }
    if (type === "certification") {
      const res = await deleteResumeData({ type, _id: id });
      if (!res || res.status === "Failed") {
        toast.error("Failed to delete certification");
        return;
      }
      updated.parsedData.certifications = updated.parsedData.certifications?.filter((c) => c._id !== id);
    }
    setResumeData(updated);
    toast.success("Deleted successfully!");
  };

  // ─── Section modal form ───────────────────────────────────────────────────
  const renderSectionForm = () => {
    switch (sectionModal.type) {
      case "experience":
        return (
          <>
            <Form.Item label="Position" name="position" rules={[{ required: true }]}>
              <Input placeholder="e.g. Frontend Developer" />
            </Form.Item>
            <Form.Item label="Company" name="company" rules={[{ required: true }]}>
              <Input placeholder="e.g. Acme Corp" />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
                  <DatePicker picker="month" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="End Date" name="endDate">
                  <DatePicker picker="month" style={{ width: "100%" }} placeholder="Present (leave blank)" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="Describe your responsibilities..." />
            </Form.Item>
          </>
        );
      case "education":
        return (
          <>
            <Form.Item label="Degree / Qualification" name="degree" rules={[{ required: true }]}>
              <Input placeholder="e.g. B.Sc Computer Science" />
            </Form.Item>
            <Form.Item label="Institution" name="institution" rules={[{ required: true }]}>
              <Input placeholder="e.g. LUMS" />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Start Year" name="startYear" rules={[{ required: true }]}>
                  <InputNumber style={{ width: "100%" }} min={1950} max={2100} placeholder="2020" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="End Year" name="endYear" rules={[{ required: true }]}>
                  <InputNumber style={{ width: "100%" }} min={1950} max={2100} placeholder="2024" />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      case "project":
        return (
          <>
            <Form.Item label="Project Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Portfolio Website" />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
              <TextArea rows={3} placeholder="Describe the project..." />
            </Form.Item>
            <Form.Item label="Technologies" name="technologies">
              <Select mode="tags" placeholder="e.g. React, Node.js, MongoDB" />
            </Form.Item>
            <Form.Item label="Project Link" name="link" rules={[{ type: "url", message: "Enter a valid URL" }]}>
              <Input placeholder="https://github.com/you/project" />
            </Form.Item>
          </>
        );
      case "certification":
        return (
          <>
            <Form.Item label="Certification Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="e.g. AWS Solutions Architect" />
            </Form.Item>
            <Form.Item label="Issuer" name="issuer">
              <Input placeholder="e.g. Amazon Web Services" />
            </Form.Item>
            <Form.Item label="Year" name="year">
              <Input placeholder="e.g. 2024" type="number" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  const sectionModalTitle = {
    experience: sectionModal.editingItem ? "Edit Experience" : "Add Experience",
    education: sectionModal.editingItem ? "Edit Education" : "Add Education",
    project: sectionModal.editingItem ? "Edit Project" : "Add Project",
    certification: sectionModal.editingItem ? "Edit Certification" : "Add Certification",
  };

  // ─── Card extra (+ add button) ────────────────────────────────────────────
  const sectionExtra = (type: SectionType) => (
    <Button
      type="text"
      icon={<PlusOutlined />}
      onClick={() => openAddSection(type)}
      size="small"
      disabled={!resumeData}
    >
      Add
    </Button>
  );

  const SidebarCard = (
    <Card className="rounded-xl">
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                size={72}
                src={
                  isCandidateProfile(profile)
                    ? profile?.profilePictureUrl
                    : "https://api.dicebear.com/8.x/avataaars/svg?seed=user"
                }
              />
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
            </div>
            <div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {isCandidateProfile(profile)
                  ? profile?.fullName || resumeData?.parsedData.name || "No Name"
                  : resumeData?.parsedData.name || "No Name"}
              </Title>
              <Text type="secondary">
                {isCandidateProfile(profile) ? profile?.tagline || "No tagline available" : "No tagline available"}
              </Text>
            </div>
          </div>
          <EditOutlined className="cursor-pointer text-lg hover:text-blue-500 transition-colors" onClick={handleEditClick} />
        </div>

        <Divider className="!my-3" />

        <div className="flex justify-between items-center">
          <Text strong>Email</Text>
          <Text>{isCandidateProfile(profile) ? profile?.userId?.email || resumeData?.parsedData.email || "Not specified" : resumeData?.parsedData.email || "Not specified"}</Text>
        </div>
        <div className="flex justify-between items-center">
          <Text strong>Phone</Text>
          <Text>{isCandidateProfile(profile) ? profile?.contactNumber || resumeData?.parsedData.phone || "Not specified" : resumeData?.parsedData.phone || "Not specified"}</Text>
        </div>
        <div className="flex justify-between items-center">
          <Text strong>Location</Text>
          <Text>{isCandidateProfile(profile) && profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : "Not specified"}</Text>
        </div>

        <Divider className="!my-3" />

        <Text strong>Bio</Text>
        <Paragraph ellipsis={{ rows: 6 }} style={{ marginBottom: 0 }}>
          {isCandidateProfile(profile) ? profile?.bio || "No bio available" : "No bio available"}
        </Paragraph>

        <Divider className="!my-3" />

        <div className="flex flex-col gap-4">
          <Text strong>Links</Text>
          {(() => {
            const githubUrl = isCandidateProfile(profile) ? profile?.githubUrl || resumeData?.parsedData.github : resumeData?.parsedData.github;
            const linkedinUrl = isCandidateProfile(profile) ? profile?.linkedinUrl || resumeData?.parsedData.linkedin : resumeData?.parsedData.linkedin;
            const portfolioUrl = isCandidateProfile(profile) ? profile?.portfolioUrl || resumeData?.parsedData.portfolio : resumeData?.parsedData.portfolio;
            return (
              <div className="flex gap-4">
                {githubUrl && (<div className="flex gap-2 items-center"><GithubFilled className="text-3xl" /><a href={githubUrl} target="_blank" rel="noreferrer"><Text strong>GitHub</Text></a></div>)}
                {linkedinUrl && (<div className="flex gap-2 items-center"><LinkedinFilled className="text-3xl text-[#0A66C2]" /><a href={linkedinUrl} target="_blank" rel="noreferrer"><Text strong>LinkedIn</Text></a></div>)}
                {portfolioUrl && (<div className="flex gap-2 items-center"><GlobalOutlined className="text-3xl" /><a href={portfolioUrl} target="_blank" rel="noreferrer"><Text strong>Portfolio</Text></a></div>)}
              </div>
            );
          })()}
        </div>
      </Space>
    </Card>
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24} lg={9}>
          {isLargeScreen ? <Affix offsetTop={80}>{SidebarCard}</Affix> : SidebarCard}
        </Col>

        <Col xs={24} md={24} lg={15}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">

            {/* AI Score */}
            {resumeData && (
              <Card className="rounded-xl" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <div className="text-white flex justify-between items-center">
                  <div>
                    <Title level={5} style={{ color: "white", margin: 0 }}>AI Resume Score</Title>
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>Your resume has been analyzed by AI</Text>
                  </div>
                  <div className="text-right">
                    <Title level={2} style={{ color: "white", margin: 0 }}>{resumeData.aiScore}/100</Title>
                    <Text style={{ color: "rgba(255,255,255,0.9)" }}>Score</Text>
                  </div>
                </div>
              </Card>
            )}

            {/* Resume Upload */}
            <Card className="rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  {resumeUrl ? (
                    <>
                      <Title level={5} style={{ margin: 0 }}><CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />Resume Uploaded Successfully</Title>
                      <Text type="secondary">Your resume has been received and analyzed.</Text>
                      <div className="!mt-4 gap-2 flex items-center">
                        <PaperClipOutlined />
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="!text-[#52C41A] hover:!text-[#73D13D]">
                          {(isCandidateProfile(profile) ? profile?.fullName || userProfile.fullName || "Resume" : userProfile.fullName || "Resume").replace(/\s+/g, "")}Resume.pdf
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <Title level={5} style={{ margin: 0 }}>Upload Your Resume</Title>
                      <Text type="secondary">Upload your resume in PDF format to complete your profile.</Text>
                      <div className="!mt-4">
                        <Upload {...uploadProps} accept=".pdf">
                          <Button icon={<UploadOutlined />} loading={uploading} type="primary" disabled={parsingStatus !== "idle"}>
                            {uploading ? "Uploading..." : "Upload Resume"}
                          </Button>
                        </Upload>
                      </div>
                    </>
                  )}
                </div>
                {
                  resumeUrl &&
                  (
                    <Upload {...uploadProps}>
                      <Button
                        type="text"
                        loading={uploading}
                        icon={<EditOutlined />}
                        disabled={uploading || parsingStatus !== "idle"}
                      />
                    </Upload>
                  )
                }
              </div>
              {parsingStatus !== "idle" && (
                <div className="resume-parsing">
                  <div className="resume-parsing-header">
                    <Text strong>Resume parsing</Text>
                    <Tag className={`resume-parsing-tag resume-parsing-${parsingStatus}`}>
                      {parsingStatus === "failed" ? "Failed" : parsingStatus === "completed" ? "Completed" : "In progress"}
                    </Tag>
                  </div>
                  <Text type="secondary" className="resume-parsing-message">
                    {parsingMessage}
                  </Text>
                  <Progress
                    percent={parsingProgress}
                    status={parsingStatus === "failed" ? "exception" : parsingStatus === "completed" ? "success" : "active"}
                    strokeColor={parsingStatus === "failed" ? "#ef4444" : undefined}
                  />
                  <div className="resume-parsing-steps">
                    {parsingSteps.map((step) => (
                      <div key={step.key} className={`resume-parsing-step resume-step-${getStepState(step.key)}`}>
                        <span className="resume-parsing-dot" />
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* AI Suggestions */}
            {resumeData?.aiSuggestions && resumeData.aiSuggestions.length > 0 && (
              <Card title={<Title level={5}>AI Suggestions</Title>} className="rounded-xl">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {resumeData.aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex gap-2">
                      <Text type="secondary">{index + 1}.</Text>
                      <AIResponseViewer aiResult={suggestion} />
                    </div>
                  ))}
                </Space>
              </Card>
            )}

            {/* Skills */}
            {resumeData?.parsedData.skills && resumeData.parsedData.skills.length > 0 && (
              <Card title={<Title level={5}>Skills</Title>} className="rounded-xl" style={{ overflow: "hidden" }}>
                <div className="flex flex-wrap gap-2">
                  {resumeData.parsedData.skills.map((skill: string, index: number) => {
                    const MAX_LENGTH = 28;
                    const truncated = skill.length > MAX_LENGTH ? skill.slice(0, MAX_LENGTH).trimEnd() + "…" : skill;
                    return (
                      <Tag
                        key={index}
                        color="blue"
                        className="rounded-full !m-0 text-sm px-3 py-0.5"
                        title={skill} // shows full text on hover as tooltip
                      >
                        {truncated}
                      </Tag>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* ── Experience ──────────────────────────────────────────────── */}
            <Card
              title={<Title level={5}>Experience</Title>}
              className="rounded-xl"
              extra={sectionExtra("experience")}
            >
              {resumeData?.parsedData.experience && resumeData.parsedData.experience.length > 0 ? (
                <Timeline>
                  {resumeData.parsedData.experience.map((exp) => (
                    <Timeline.Item key={exp._id}>
                      <div className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Text strong className="text-lg">{exp.position}</Text>
                            <div>
                              <Text type="secondary">{exp.company} • {formatDate(exp.startDate)}{exp.endDate ? ` – ${formatDate(exp.endDate)}` : " – Present"}</Text>
                            </div>
                            <Paragraph className="mt-2" style={{ whiteSpace: "pre-line" }}>{exp.description}</Paragraph>
                          </div>
                          <Space>
                            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEditSection("experience", exp)} />
                            <Popconfirm title="Delete this experience?" onConfirm={() => handleDeleteItem("experience", exp._id)} okText="Yes" cancelText="No">
                              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                            </Popconfirm>
                          </Space>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Empty description="No experience data available">
                  <Button disabled={!resumeData} type="primary" icon={<PlusOutlined />} onClick={() => openAddSection("experience")}>Add Experience</Button>
                </Empty>
              )}
            </Card>

            {/* ── Education ───────────────────────────────────────────────── */}
            <Card
              title={<Title level={5}>Education</Title>}
              className="rounded-xl"
              extra={sectionExtra("education")}
            >
              {resumeData?.parsedData.education && resumeData.parsedData.education.length > 0 ? (
                <Timeline>
                  {resumeData.parsedData.education.map((edu) => (
                    <Timeline.Item key={edu._id}>
                      <div className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Text strong className="text-lg">{edu.degree}</Text>
                            <div>
                              <Text type="secondary">{edu.institution} • {edu.startYear} - {edu.endYear}</Text>
                            </div>
                          </div>
                          <Space>
                            <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEditSection("education", edu)} />
                            <Popconfirm title="Delete this education?" onConfirm={() => handleDeleteItem("education", edu._id)} okText="Yes" cancelText="No">
                              <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                            </Popconfirm>
                          </Space>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Empty description="No education data available">
                  <Button disabled={!resumeData} type="primary" icon={<PlusOutlined />} onClick={() => openAddSection("education")}>Add Education</Button>
                </Empty>
              )}
            </Card>

            {/* ── Projects ────────────────────────────────────────────────── */}
            <Card
              title={<Title level={5}><ProjectOutlined /> Projects</Title>}
              className="rounded-xl"
              extra={sectionExtra("project")}
            >
              {resumeData?.parsedData.projects && resumeData.parsedData.projects.length > 0 ? (
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  {resumeData.parsedData.projects.map((project) => (
                    <div key={project._id}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <Text strong className="text-lg">{project?.name}</Text>
                            <Space>
                              {project?.link && (
                                <a href={project?.link} target="_blank" rel="noopener noreferrer">
                                  <Button size="small">View Project</Button>
                                </a>
                              )}
                              <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEditSection("project", project)} />
                              <Popconfirm title="Delete this project?" onConfirm={() => handleDeleteItem("project", project._id)} okText="Yes" cancelText="No">
                                <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                              </Popconfirm>
                            </Space>
                          </div>
                          <Paragraph className="mt-2">{project.description}</Paragraph>
                          <Space wrap className="mt-2">
                            {project.technologies.map((tech, i) => (
                              <Tag key={i} color="blue" className="rounded-full">{tech}</Tag>
                            ))}
                          </Space>
                        </div>
                      </div>
                      <Divider />
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty description="No projects available">
                  <Button disabled={!resumeData} type="primary" icon={<PlusOutlined />} onClick={() => openAddSection("project")}>Add Project</Button>
                </Empty>
              )}
            </Card>

            {/* ── Certifications ──────────────────────────────────────────── */}
            <Card
              title={<Title level={5}><TrophyOutlined /> Certifications</Title>}
              className="rounded-xl"
              extra={sectionExtra("certification")}
            >
              {resumeData?.parsedData.certifications && resumeData.parsedData.certifications.length > 0 ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {resumeData.parsedData.certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <Text strong>{cert.name}</Text>
                        <div><Text type="secondary">{cert.issuer}{cert.year ? ` • ${cert.year}` : ""}</Text></div>
                      </div>
                      <Space>
                        <Button type="text" icon={<EditOutlined />} size="small" onClick={() => openEditSection("certification", cert)} />
                        <Popconfirm title="Delete this certification?" onConfirm={() => handleDeleteItem("certification", cert._id || "")} okText="Yes" cancelText="No">
                          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                        </Popconfirm>
                      </Space>
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty description="No certifications available">
                  <Button disabled={!resumeData} type="primary" icon={<PlusOutlined />} onClick={() => openAddSection("certification")}>Add Certification</Button>
                </Empty>
              )}
            </Card>

          </Space>
        </Col>
      </Row>

      {/* ── Profile Edit Modal ──────────────────────────────────────────────── */}
      <Modal confirmLoading={isEditModalLoading} cancelButtonProps={{ disabled: isEditModalLoading }} title="Edit Profile" open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null} width={600}>
        <Form form={form} layout="vertical" onFinish={handleEditSave} className="mt-4">
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter your full name" }]}>
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item label="Tagline" name="tagline" rules={[{ required: true, message: "Please enter your tagline" }]}>
            <Input placeholder="e.g., Full Stack Developer | AI Enthusiast" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="City" name="city" rules={[{ required: true }]}><Input placeholder="Your city" /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Country" name="country" rules={[{ required: true }]}><Input placeholder="Your country" disabled={!!profile?.country} /></Form.Item>
            </Col>
          </Row>
          <Form.Item label="Bio" name="bio" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Tell us about yourself..." maxLength={500} showCount />
          </Form.Item>
          <Form.Item label="GitHub URL" name="githubUrl" rules={[{ type: "url" }]}>
            <Input placeholder="https://github.com/yourusername" prefix={<GithubFilled />} />
          </Form.Item>
          <Form.Item label="LinkedIn URL" name="linkedinUrl" rules={[{ type: "url" }]}>
            <Input placeholder="https://linkedin.com/in/yourusername" prefix={<LinkedinFilled />} />
          </Form.Item>
          <Form.Item label="Portfolio URL" name="portfolioUrl" rules={[{ type: "url" }]}>
            <Input placeholder="https://yourportfolio.com" prefix={<GlobalOutlined />} />
          </Form.Item>
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button onClick={() => setIsEditModalOpen(false)} style={{ marginRight: 8 }}>Cancel</Button>
            <Button loading={profileEditing} type="primary" htmlType="submit">Save Changes</Button>
          </div>
        </Form>
      </Modal>

      {/* ── Section Add/Edit Modal ──────────────────────────────────────────── */}
      <Modal
        title={sectionModal.type ? sectionModalTitle[sectionModal.type] : ""}
        open={sectionModal.open}
        onCancel={closeSectionModal}
        onOk={handleSectionSave}
        okText={sectionModal.editingItem ? "Save Changes" : "Add"}
        confirmLoading={isEditModalLoading}
        cancelButtonProps={{ disabled: isEditModalLoading }}
        width={520}
        destroyOnClose
      >
        <Form form={sectionForm} layout="vertical" className="mt-4">
          {renderSectionForm()}
        </Form>
      </Modal>
    </div>
  );
}

import ReactMarkdown from "react-markdown";
import ProfileSkeleton from "@/component/Skeletons/ProfileSkeleton";
import toast from "react-hot-toast";
import { getTask } from "@/app/api/candidate/task.api";

const AIResponseViewer = ({ aiResult }: { aiResult: string }) => (
  <div className="ai-response-container">
    <ReactMarkdown>{aiResult}</ReactMarkdown>
  </div>
);