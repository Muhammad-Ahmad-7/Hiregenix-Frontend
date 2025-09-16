import { Col, Flex, Form, Row, Typography } from "antd";
import React from "react";
import PlusIcon from "@/icons/PlusIcon";
import {
  LabelDatePicker,
  LabelInput,
  LabelPhoneNumber,
  LabelSelect,
} from "../common";
import UiButton from "../common/CustomButton";
import LeftArrow from "@/icons/LeftArrow";
const { Text } = Typography;
export default function Step2Form() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form Values:", values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      validateTrigger="onSubmit" // only validate when clicking Next
    >
      <div className="flex flex-col ">
        <Col span={24}>
          <LabelInput
            name="github"
            label="Github Url"
            placeholder="e.g : github.com/ad-dev07"
            required
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
            // type="email"
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="linkdin"
            label="Linkdin Url"
            itemProps={{ tooltip: "(optional)" }}
            placeholder="e.g : linkdin.com/ad-dev07"
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
            // type="email"
          />
        </Col>
        <Col span={24}>
          <LabelInput
            name="website"
            label={
              <span>
                Middle Name{" "}
                <span style={{ color: "rgba(0,0,0,.45)" }}>(optional)</span>
              </span>
            }
            // label="Website Url"
            placeholder="e.g : abd.com"
            rules={[
              {
                type: "url",
                message: "Provide Link ",
              },
            ]}
            // type="email"
          />
        </Col>
        {/* <Col span={24} className="bg-red-600 flex justify-start"> */}
        <UiButton type="link" className=" !justify-start !px-0">
          Add Addition Link +
        </UiButton>
        {/* </Col> */}
      </div>
      <div className="mt-4 gap-2 flex flex-col item-center">
        <Flex gap="small" wrap>
          <Col span={2}>
            <UiButton
              onClick={() => {}}
              block
              size="large"
              className="!rounded-xl"
            >
              <LeftArrow />
            </UiButton>
          </Col>
          <Col span={6}>
            <UiButton
              htmlType="submit"
              type="primary"
              onClick={() => {}}
              block
              size="large"
              className="!rounded-xl"
            >
              Next
            </UiButton>
          </Col>
        </Flex>
      </div>
    </Form>
  );
}
