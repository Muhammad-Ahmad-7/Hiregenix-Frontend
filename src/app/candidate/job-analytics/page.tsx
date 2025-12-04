// import JobApplicationsTable from "@/component/pages/candidate/jobPortal/JobApplicationsTable";
// import React from "react";

// export default function page() {
//   return <JobApplicationsTable />;
// }
"use client";
import JobApplicationsTable from "@/component/pages/candidate/jobPortal/JobApplicationsTable";

export default function Home() {
  // const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      {/* <DataTable /> */}
      <JobApplicationsTable />
    </div>
  );
}
