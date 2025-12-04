// import { Col, Flex, Form } from "antd";
// import React from "react";
// import { LabelInput } from "../common";
// import UiButton from "../common/CustomButton";
// import LeftArrow from "@/icons/LeftArrow";
// type Step2FormProps = {
//   onNext: () => void;
//   onBack: () => void;

//   initialValues?: { any };
// };

// export default function Step2Form({
//   onNext,
//   onBack,
//   initialValues,
// }: Step2FormProps) {
//   const [form] = Form.useForm();

//   const onFinish = (values: any) => {
//     console.log("Form Values:", values);

//     onNext(values);
//     form.resetFields();
//   };

//   return (
//     <Form
//       form={form}
//       initialValues={initialValues}
//       onFinish={onFinish}
//       validateTrigger="onSubmit" // only validate when clicking Next
//     >
//       <div className="flex flex-col ">
//         <Col span={24}>
//           <LabelInput
//             name="githubUrl"
//             label="Github Url"
//             placeholder="e.g : github.com/ad-dev07"
//             required
//             rules={[
//               {
//                 type: "url",
//                 message: "Provide Link ",
//               },
//             ]}
//             // type="email"
//           />
//         </Col>
//         <Col span={24}>
//           <LabelInput
//             name="linkedinUrl"
//             label="Linkdin Url"
//             itemProps={{ tooltip: "(optional)" }}
//             placeholder="e.g : linkdin.com/ad-dev07"
//             rules={[
//               {
//                 type: "url",
//                 message: "Provide Link ",
//               },
//             ]}
//             // type="email"
//           />
//         </Col>
//         <Col span={24}>
//           <LabelInput
//             name="portfolioUrl"
//             label={
//               <span>
//                 Middle Name{" "}
//                 <span style={{ color: "rgba(0,0,0,.45)" }}>(optional)</span>
//               </span>
//             }
//             // label="Website Url"
//             placeholder="e.g : abd.com"
//             rules={[
//               {
//                 type: "url",
//                 message: "Provide Link ",
//               },
//             ]}
//             // type="email"
//           />
//         </Col>
//         {/* <Col span={24} className="bg-red-600 flex justify-start"> */}
//         {/* <UiButton type="link" className=" !justify-start !px-0">
//           Add Addition Link +
//         </UiButton> */}
//         {/* </Col> */}
//       </div>
//       <Flex gap="small" wrap className="!mt-6">
//         <Col span={2}>
//           <UiButton onClick={onBack} block size="large" className="!rounded-xl">
//             <LeftArrow />
//           </UiButton>
//         </Col>
//         <Col span={6}>
//           <UiButton
//             htmlType="submit"
//             type="primary"
//             onClick={() => {}}
//             block
//             size="large"
//             className="!rounded-xl"
//           >
//             Next
//           </UiButton>
//         </Col>
//       </Flex>
//     </Form>
//   );
// }
import { Col, Flex, Form } from "antd";
import React from "react";
import { LabelInput } from "../common";
import UiButton from "../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";

// Define proper types for form values
interface Step2FormValues {
  githubUrl: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

type Step2FormProps = {
  onNext: (values: Step2FormValues) => void;
  onBack: () => void;
  initialValues?: Partial<Step2FormValues>;
};

export default function Step2Form({
  onNext,
  onBack,
  initialValues,
}: Step2FormProps) {
  const [form] = Form.useForm<Step2FormValues>();

  const onFinish = (values: Step2FormValues) => {
    console.log("Form Values:", values);
    onNext(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      validateTrigger="onSubmit" // only validate when clicking Next
    >
      <div className="flex flex-col ">
        <Col span={24}>
          <LabelInput
            name="githubUrl"
            label="Github Url"
            placeholder="e.g : github.com/ad-dev07"
            required
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="linkedinUrl"
            label="Linkdin Url"
            itemProps={{ tooltip: "(optional)" }}
            placeholder="e.g : linkdin.com/ad-dev07"
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="portfolioUrl"
            label={
              <span>
                Portfolio Url{" "}
                <span style={{ color: "rgba(0,0,0,.45)" }}>(optional)</span>
              </span>
            }
            placeholder="e.g : abd.com"
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
          />
        </Col>
      </div>
      <Flex gap="small" wrap className="!mt-6">
        <Col span={2}>
          <UiButton onClick={onBack} block size="large" className="!rounded-xl">
            <LeftArrow />
          </UiButton>
        </Col>
        <Col span={6}>
          <UiButton
            htmlType="submit"
            type="primary"
            block
            size="large"
            className="!rounded-xl"
          >
            Next
          </UiButton>
        </Col>
      </Flex>
    </Form>
  );
}
