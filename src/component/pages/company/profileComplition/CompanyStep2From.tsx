// import { Col, Flex, Form } from "antd";
// import React from "react";
// import { LabelInput } from "../../../common";
// import UiButton from "../../../common/CustomButton";
// import LeftArrow from "@/icons/LeftArrow";
// type CompanyStep2FromProps = {
//   onNext: () => void;
//   onBack: () => void;

//   initialValues?: { any };
// };

// export default function CompanyStep2From({
//   onNext,
//   onBack,
//   initialValues,
// }: CompanyStep2FromProps) {
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
//             name="linkedInUrl"
//             label="Linkdin Url"
//             itemProps={{ tooltip: "(optional)" }}
//             placeholder="e.g : linkdin.com/ad-dev07"
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
//             name="website"
//             label=" Website Link  "
//             required
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
import { LabelInput } from "../../../common";
import UiButton from "../../../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";

// Define proper types for form values
interface CompanyStep2FormValues {
  linkedInUrl: string;
  website: string;
}

type CompanyStep2FormProps = {
  onNext: (values: CompanyStep2FormValues) => void;
  onBack: () => void;
  initialValues?: Partial<CompanyStep2FormValues>;
};

export default function CompanyStep2Form({
  onNext,
  onBack,
  initialValues,
}: CompanyStep2FormProps) {
  const [form] = Form.useForm<CompanyStep2FormValues>();

  const onFinish = (values: CompanyStep2FormValues) => {
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
            name="linkedInUrl"
            label="LinkedIn Url"
            itemProps={{ tooltip: "(optional)" }}
            placeholder="e.g : linkedin.com/company/example"
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
            name="website"
            label="Website Link"
            required
            placeholder="e.g : https://example.com"
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
