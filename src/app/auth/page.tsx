// export default function App() {
//   const isClient = false;
//   return (
//     <div className="h-screen w-full flex justify-center items-center ">
//       HIREGENIX
//     </div>
//   );
// }
"use client";
// import Left3 from "@/component/pages/login/Left3";
// import { Button, DatePicker } from "antd";
import React from "react";

import company_dashboard from "../../../public/dashboard-company.svg";
import candidate_dashboard from "../../../public/dashboard-candidate.svg";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import Left1 from "@/component/pages/login/Left1";
const Home = () => (
  <SignInWrapper img={company_dashboard} secondaryImg={candidate_dashboard}>
    <Left1 />
    {/* <CompanyProfilePage /> */}
    {/* <LoginScreen /> */}
    {/* <LoginScreen /> */}
    {/* <Left3 /> */}
  </SignInWrapper>
);

export default Home;
