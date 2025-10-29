import ApplicationTable from "@/component/pages/company/jobApplications/ApplicationTable";
import JobApplicationStats from "@/component/pages/company/jobApplications/JobApplicationStats";
import React from "react";

export default function page() {
  return (
    <>
      <JobApplicationStats />
      <h1 className="text-4xl font-semibold !mt-6">Applications</h1>
      <ApplicationTable />
    </>
  );
}
