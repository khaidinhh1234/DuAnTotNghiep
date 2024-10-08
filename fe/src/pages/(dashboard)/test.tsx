import { Button, Form, Input, Typography } from "antd";
// import TextEditor from "components/TextEditor";
import React, { useState } from "react";
import TextEditor from "./test2";

const { Item } = Form;
const { TextArea } = Input;
const { Title } = Typography;

interface IPostCreate {
  body: string;
}

export const Test = () => {
  const [form] = Form.useForm();

  const onSubmit = (values: IPostCreate) => {
    // logic to submit form to server
    console.log(values.body);
    form.resetFields();
  };
  return (
    <>
      <Title level={5}>Your Post</Title>

      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Item
          name="body"
          rules={[
            {
              required: true,
              message: "Please enter body of post",
            },
          ]}
        >
          {/* @ts-ignore */}
          <TextEditor />
        </Item>

        <Item>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Item>
      </Form>
    </>
  );
};
