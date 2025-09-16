"use client";
import React from "react";
import sign_in from "../../../../public/main.png";
import SignInWrapper from "@/component/pages/login/SignInWrapper";
import Left1 from "@/component/pages/login/Left1";

const Page: React.FC = () => {
  return (
    <SignInWrapper img={sign_in}>
      <Left1 />
    </SignInWrapper>
    // <div className="bg-white">
    //   <div className="px-4 bg-white h-screen max-w-[1500px] mx-auto">
    //     {/* Header */}

    //     <LoginHeader />

    //     {/* Content Section */}
    //     <Row className="bg-white h-[calc(100vh-5rem)]">
    //       {/* Left Section */}
    //       <Col
    //         xs={24}
    //         md={12}
    //         className="!flex !flex-col !justify-center !items-center p-4 lg:p-32"
    //       >
    //         {/* Logo Circle */}
    //         <div className="flex w-full">
    //           <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg border border-gray-200 mb-4">
    //             <Fire />
    //           </div>
    //         </div>

    //         {/* Text & Buttons */}
    //         <div className="w-full shadow-none">
    //           <Title level={1} className="!mb-2">
    //             Let’s get you what you are looking for
    //           </Title>

    //           <Text type="secondary">
    //             Select your role for joining our platform
    //           </Text>

    //           <div className="mt-8 gap-2 flex flex-col">
    //             <Link href={ROUTES.company}>
    //               <Button block size="large" className="!rounded-full mb-4">
    //                 Join as recruiter
    //               </Button>
    //             </Link>
    //             <Link href={ROUTES.candidate}>
    //               <Button block size="large" className="!rounded-full">
    //                 Join as candidate
    //               </Button>
    //             </Link>
    //           </div>
    //         </div>
    //       </Col>

    //       {/* Right Section */}
    //       <Col
    //         xs={0}
    //         md={12}
    //         className="!flex !justify-center !items-center rounded-4xl"
    //       >
    //         <Image
    //           width={550}
    //           height={500}
    //           src={sign_in}
    //           alt="sign in"
    //           className="rounded-4xl"
    //         />
    //       </Col>
    //     </Row>
    //   </div>
    // </div>
  );
};

export default Page;
