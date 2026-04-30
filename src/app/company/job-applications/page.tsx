// ==================== Page.tsx (Main Component) ====================
"use client";
import {
  getAllJobsApplicationsApi,
  getSpecificJobApplicationsApi,
} from "@/app/api/company/applications.api";
import ApplicationTable, {
  InterviewRecord,
} from "@/component/pages/company/jobApplications/ApplicationTable";
import JobApplicationStats from "@/component/pages/company/jobApplications/JobApplicationStats";
import React, { useEffect, useState } from "react";

export interface JobLocation {
  city: string;
  country: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface JobResponse {
  _id: string;
  companyId: string;
  title: string;
  role: string;
  interviewGuideline: string;
  experienceLevel: string;
  description: string;
  requiredSkills: string[];
  requirements: string[];
  workMode: string;
  deadline: string;
  aiSummary: string;
  embeddingSynced: boolean;
  qdrantId: string | null;
  isDeleted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  location: JobLocation;
  salaryRange: SalaryRange;
  totalInterviews?: number;
  viewCount?: number;
  bestMatchCount?: number;
}

export interface MetaData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StatsData {
  totalApplications: number;
  totalViews: number;
  bestMatches: number;
}

type JobWithStats = Pick<JobResponse, "_id" | "title"> & {
  totalInterviews?: number;
  viewCount?: number;
  bestMatchCount?: number;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobWithStats[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [interviewsData, setInterviewsData] = useState<InterviewRecord[]>([]);
  const [metaData, setMetaData] = useState<MetaData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch all jobs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllJobsApplicationsApi();

        if (!res || !res.data) {
          setApplications([]);
          return;
        }

        const jobs = (res.data.jobs as unknown as JobWithStats[]) || [];
        setApplications(jobs);

        // Set first job as selected by default if available
        if (jobs.length > 0) {
          setSelectedJobId(jobs[0]._id);
        }
      } catch (error) {
        console.error("Error fetching job applications:", error);
        setApplications([]);
      }
    };

    fetchData();
  }, []);

  // Fetch specific job applications when selected job changes
  useEffect(() => {
    if (!selectedJobId) return;

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await getSpecificJobApplicationsApi(selectedJobId, {
          page: metaData.page,
          limit: metaData.limit,
        });

        if (!res || !res.data) {
          setInterviewsData([]);
          setMetaData({
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          });
          return;
        }

        // Set interviews data from res.data.interviews
        setInterviewsData(
          (res.data.interviews as unknown as InterviewRecord[]) || []
        );
console.log("y:",res.data.interviews)
        // Set pagination meta from res.meta
        setMetaData(
          res?.meta || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          }
        );
      } catch (error) {
        console.error("Error fetching specific job applications:", error);
        setInterviewsData([]);
        setMetaData({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [selectedJobId, metaData.page, metaData.limit]);

  // Handle job role change from stats component
  const handleJobRoleChange = (jobId: string) => {
    setSelectedJobId(jobId);
    // Reset to page 1 when changing jobs
    setMetaData((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination change from table
  const handlePageChange = async (page: number, pageSize: number) => {
    if (!selectedJobId) return;

    setLoading(true);
    try {
      const res = await getSpecificJobApplicationsApi(selectedJobId, {
        page,
        limit: pageSize,
      });

      if (!res || !res.data) {
        setInterviewsData([]);
        return;
      }

      // Set interviews data from res.data.interviews
      setInterviewsData(
        (res.data.interviews as unknown as InterviewRecord[]) || []
      );

      // Set pagination meta from res.meta
      setMetaData(
        res?.meta || {
          total: 0,
          page,
          limit: pageSize,
          totalPages: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching paginated applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform jobs data for stats component
  const jobRoles = applications.map((job) => ({
    value: job._id,
    label: job.title,
    icon: "👨‍💻",
  }));

  // Transform stats data
  const statsData = applications.reduce((acc, job) => {
    acc[job._id] = {
      totalApplications: job.totalInterviews || 0,
      totalViews: job.viewCount || 0,
      bestMatches: job.bestMatchCount || 0,
    };
    return acc;
  }, {} as Record<string, StatsData>);

  // Get selected job info
  const selectedJob = applications.find((job) => job._id === selectedJobId);

  return (
    <div className="">
      <JobApplicationStats
        jobRoles={jobRoles}
        totalApplications={selectedJob ? statsData[selectedJob._id].totalApplications : 0}
        statsData={statsData}
        onJobRoleChange={handleJobRoleChange}
      />

      <h1 className="text-4xl font-semibold !mt-6 mb-6">
        Applications {selectedJob && `- ${selectedJob.title}`}
      </h1>

      <ApplicationTable
        data={interviewsData}
        loading={loading}
        pagination={{
          current: metaData.page,
          total: metaData.total,
          pageSize: metaData.limit,
          onChange: handlePageChange,
          showSizeChanger: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} interviews`,
        }}
      />
    </div>
  );
}
