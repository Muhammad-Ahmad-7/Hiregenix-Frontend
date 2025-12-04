// import JobApplicationsTable from "@/component/pages/candidate/jobPortal/JobApplicationsTable";
// import React from "react";

// export default function page() {
//   return <JobApplicationsTable />;
// }
"use client";
import MyJobsTable from "@/component/pages/company/jobAnalysis/CompanyJobApplicationTable";

import { Card, Select, Typography } from "antd";
import { JobPortalMapCard } from "@/component/pages/candidate/dashboard/JobPortalMapCard";

const { Title, Text } = Typography;
export default function Home() {
  // const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      {/* <DataTable /> */}
      {/* <JobApplicationsTable /> */}
      <MyJobsTable />
      <JobsListed />
    </div>
  );
}

const JobsListed = () => {
  const totalJobs = 85357;
  const newJobs = 240;
  const recommended = 12450;

  const regions = [
    { name: "South America", count: 15605 },
    { name: "North America", count: 25205 },
    { name: "Europe", count: 20109 },
    { name: "Asia", count: 15563 },
    { name: "Africa", count: 9457 },
    { name: "Australia", count: 2578 },
  ];

  return (
    <Card className="p-6 w-full shadow-md rounded-lg">
      <div className="flex justify-between items-start mb-6">
        <Title level={4}>Jobs Listed</Title>
        <Select
          defaultValue="Select country"
          options={regions.map((r) => ({ label: r.name, value: r.name }))}
          className="w-40"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <Text className="block text-gray-500">Total jobs</Text>
          <Title level={5}>{totalJobs.toLocaleString()}</Title>
        </div>
        <div>
          <Text className="block text-gray-500">New jobs</Text>
          <Title level={5}>{newJobs.toLocaleString()}</Title>
        </div>
        <div>
          <Text className="block text-gray-500">Recommended</Text>
          <Title level={5}>{recommended.toLocaleString()}</Title>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left region list */}
        <div className="flex flex-col gap-2">
          {regions.map((region) => (
            <div key={region.name} className="flex justify-between w-48">
              <Text>{region.name}</Text>
              <Text className="font-semibold">
                {region.count.toLocaleString()}
              </Text>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="flex-1">
          <JobPortalMapCard size="lg" />
        </div>
      </div>
    </Card>
  );
};
