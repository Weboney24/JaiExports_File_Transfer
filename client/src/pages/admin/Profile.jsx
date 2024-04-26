import React, { useEffect, useState } from "react";
import { IconHelper } from "../../helper/Icon_helper";
import { Button, Divider, Form, Input, notification } from "antd";
import { changePassword } from "../../helper/api_helper";

const Profile = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState();

  const handleChnagePassword = async (values) => {
    try {
      setLoading(true);
      await changePassword(values);
      form.resetFields();
      notification.success({ message: "Password changed successfully" });
    } catch (err) {
      notification.error({
        message: "Something went wrong when changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-scroll p-5 font-Texturina ">
      <div className="flex w-full justify-between items-center">
        <h1 className="lg:text-3xl text-sm font-Texturina flex items-center gap-x-2">
          <IconHelper.settings /> Change Password
        </h1>
      </div>
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleChnagePassword}>
        <Form.Item
          label="Enter Password"
          name="password"
          rules={[{ required: true, message: "Enter New Password" }]}
        >
          <Input
            placeholder="Enter New Password"
            className="w-[400px] !antd_input"
          />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} htmlType="submit" className="primary_btn">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
