import React, { useEffect } from "react";
import { Loginleft, Logo } from "../helper/ImageHelper";
import { Form, Input, Button, notification } from "antd";
import { authUser } from "../helper/api_helper";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeRole } from "../helper/state/slice/user.slice";

const Sighin = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("kD7&z9B*pQ#2sL!5") === "X#4sN@9cV2mW!7bJ") {
      navigate("/my_transfer");
    } else if (localStorage.getItem("kD7&z9B*pQ#2sL!5") === "G$6rT@wP3qY!8nA") {
      navigate("/dashboard");
    } else {
      localStorage.clear();
      navigate("/signin");
    }
  }, []);

  const handleFinish = async (values) => {
    try {
      const result = await authUser(values);

      localStorage.setItem(
        "6F9d2H5s8R3g7P1w4T6s8P3w1R7g9D2h",
        _.get(result, "data.data.token", "")
      );
      localStorage.setItem("6F9d2H5s8R3g7P1w", "4T6s8P3w1R7g9D2h");
      changeRole({
        role: _.get(result, "data.data[0].role", ""),
        name: _.get(result, "data.data[0].name", ""),
      });
      if (_.get(result, "data.data.role", "") === "admin") {
        navigate("/dashboard");
      } else {
        localStorage.setItem("kD7&z9B*pQ#2sL!5", "X#4sN@9cV2mW!7bJ");
        navigate("/make_transfer");
      }
    } catch (err) {
      notification.error({ message: _.get(err, "response.data.message", "") });
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-between lg:flex-row flex-col">
      <div className="w-[50%] lg:block hidden">
        <div className="h-full w-full  flex items-center gap-y-4 flex-col  justify-center">
          <img src={Loginleft} alt="" className="w-[50%]" />
          <h1 className="text-3xl font-Texturina pr-10 p-3">
            Stay together on your network
          </h1>
        </div>
      </div>
      <div className="lg:w-[50%] w-[100%] px-2 min-h-full bg-secondary flex flex-col items-center justify-start lg:pt-20 pt-10 !text-white">
        <div className="flex gap-x-5 flex-col items-center py-10">
          <img src={Logo} alt="" className="w-[80px] h-auto object-cover" />
          <h1 className="lg:text-3xl py-2 font-Texturina text-white">
            Jai Export Enterprises
          </h1>
        </div>
        <div className="">
          <Form
            layout="vertical"
            className="lg:px-10 px-2 py-4 rounded-2xl lg:w-[inherit] !w-full bg-secondary shadow-inner"
            form={form}
            onFinish={handleFinish}
          >
            <h1 className="text-2xl text-white font-Texturina font-semibold pb-5">
              Sign In
            </h1>
            <Form.Item
              label={<span className="text-white">Email</span>}
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address",
                },
                {
                  type: "email",
                  message: "Please enter valid email address",
                },
              ]}
            >
              <Input
                placeholder="Enter Email"
                className="antd_input !w-[400px]"
              />
            </Form.Item>
            <Form.Item
              label={<span className="text-white">Password</span>}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter Password"
                className="antd_input lg:!w-[400px] !w-[300px]"
              />
            </Form.Item>
            <Form.Item className="pt-4 ">
              <Button
                htmlType="submit"
                className="primary_btn lg:w-[400px] w-full font-Texturina"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Sighin;
