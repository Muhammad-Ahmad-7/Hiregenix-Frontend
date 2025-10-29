// import JobApplicationsTable from "@/component/pages/candidate/jobPortal/JobApplicationsTable";
// import React from "react";

// export default function page() {
//   return <JobApplicationsTable />;
// }
"use client";

import { useState } from "react";
import { Tabs } from "antd";
import DataTable from "@/component/pages/candidate/jobPortal/data-table";
import JobApplicationsTable from "@/component/pages/candidate/jobPortal/JobApplicationsTable";
import EmailInterface from "../chat/page";
import MyJobsTable from "@/component/pages/company/jobAnalysis/CompanyJobApplicationTable";

export default function Home() {
  // const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      {/* <DataTable /> */}
      {/* <JobApplicationsTable /> */}
      <MyJobsTable />
    </div>
  );
}
