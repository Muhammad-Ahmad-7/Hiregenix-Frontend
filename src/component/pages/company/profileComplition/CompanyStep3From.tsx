// import { Col, Flex, Form } from "antd";
// import React from "react";
// import { LabelSelect } from "../../../common";
// import UiButton from "../../../common/CustomButton";
// import LeftArrow from "@/icons/LeftArrow";
// import LabelTextArea from "../../../common/LabelTextArea";
// type Step2FormProps = {
//   onNext: () => void;
//   onBack: () => void;
// };
// import type { SelectProps } from "antd";

// const options: SelectProps["options"] = [];

// for (let i = 10; i < 36; i++) {
//   options.push({
//     value: i.toString(36) + i,
//     label: i.toString(36) + i,
//   });
// }

// const handleChange = (value: string[]) => {
//   console.log(`selected ${value}`);
// };
// export default function CompanyStep3From({
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
//         {/* <Col span={24}>
//           <LabelSelect
//             name="expertize"
//             label="Expertize"
//             placeholder="e.g : github.com/ad-dev07"
//             options={[]}
//             // required
//           />
//         </Col> */}
//         <Col span={24}>
//           <LabelSelect
//             label={
//               <span>
//                 Tech Stack{" "}
//                 <span style={{ color: "rgba(0,0,0,.45)" }}>(up to 5)</span>
//               </span>
//             }
//             maxCount={5}
//             name="techStack"
//             mode="tags"
//             style={{ width: "100%" }}
//             placeholder="Tags Mode"
//             onChange={handleChange}
//             options={options}
//           />
//         </Col>
//         <Col span={24}>
//           <LabelTextArea
//             name="description"
//             label="Description"
//             placeholder="Write about your company..."
//             required
//             autoSize={{ minRows: 3, maxRows: 5 }}
//             itemProps={{ tooltip: "(optional)" }}
//           />
//         </Col>
//         {/* <Col span={24}>
//           <LabelInput
//             name="tagline"
//             label="Tagline"
//             // label="Website Url"
//             placeholder="e.g Frontend Developer | MERN Stack expert"
//           />
//         </Col> */}
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
import { LabelSelect } from "../../../common";
import UiButton from "../../../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";
import LabelTextArea from "../../../common/LabelTextArea";
import type { SelectProps } from "antd";

// Define proper types for form values
interface CompanyStep3FormValues {
  techStack: string[];
  description: string;
}

type CompanyStep3FormProps = {
  onNext: (values: CompanyStep3FormValues) => void;
  onBack: () => void;
  initialValues?: Partial<CompanyStep3FormValues>;
};

// Generate options for tech stack select
const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

export default function CompanyStep3Form({
  onNext,
  onBack,
  initialValues,
}: CompanyStep3FormProps) {
  const [form] = Form.useForm<CompanyStep3FormValues>();

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const onFinish = (values: CompanyStep3FormValues) => {
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
          <LabelSelect
            label={
              <span>
                Tech Stack{" "}
                <span style={{ color: "rgba(0,0,0,.45)" }}>(up to 5)</span>
              </span>
            }
            maxCount={5}
            name="techStack"
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Tags Mode"
            onChange={handleChange}
            options={options}
          />
        </Col>
        <Col span={24}>
          <LabelTextArea
            name="description"
            label="Description"
            placeholder="Write about your company..."
            required
            autoSize={{ minRows: 3, maxRows: 5 }}
            itemProps={{ tooltip: "(optional)" }}
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
