import { useEffect } from "react";
import { Loginleft, Logo } from "../helper/ImageHelper";
import { Form, Input, Button, notification } from "antd";
import { authUser } from "../helper/api_helper";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { changeRole } from "../helper/state/slice/user.slice";

const Sighin = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

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

      localStorage.setItem("6F9d2H5s8R3g7P1w4T6s8P3w1R7g9D2h", _.get(result, "data.data.token", ""));
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

  const LogoComponent = () => {
    return (
      <div className="flex flex-col gap-y-2 items-center pb-4">
        <img src={Logo} alt="" className="w-[80px] h-auto object-cover" />
        <h1 className="lg:text-3xl py-2 font-Texturina text-secondary font-medium lg:text-white">Jai Export Enterprises</h1>
      </div>
    );
  };

  return (
    <div className="w-screen lg:h-screen min-h-screen lg:overflow-hidden flex items-center lg:justify-between lg:flex-row flex-col lg:py-0 py-10">
      <div className="lg:hidden block">
        <LogoComponent />
      </div>
      <div className="lg:w-[50%] w-full">
        <div className="h-full w-full  flex items-center gap-y-4 flex-col  justify-center">
          <img src={Loginleft} alt="" className="lg:w-[50%] w-[50%]" />
          <h1 className="lg:text-3xl font-Texturina lg:pr-10 lg:p-3 md:text-lg text-sm line-clamp-1 font-medium">Stay together on your network</h1>
        </div>
      </div>
      <div className="lg:w-[50%] w-[90%] lg:mt-0 mt-10 bg-secondary lg:rounded-none rounded-lg  h-full flex flex-col justify-center">
        <div className="lg:block hidden">
          <LogoComponent />
        </div>
        <Form
          layout="vertical"
          className="lg:px-10 px-2 py-4 rounded-lg flex flex-col
          items-center justify-center lg:bg-secondary bg-secondary md:shadow-none shadow-2xl"
          form={form}
          onFinish={handleFinish}
        >
          <h1 className="text-2xl text-white font-Texturina font-semibold pb-5">Sign In</h1>
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
            className="md:w-[inherit] w-full"
          >
            <Input placeholder="Enter Email" className="antd_input" />
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
            className="md:w-[inherit] w-full"
          >
            <Input.Password placeholder="Enter Password" className="antd_input" />
          </Form.Item>
          <Form.Item className="pt-4 md:w-[inherit] w-full">
            <Button htmlType="submit" className="primary_btn  w-full font-Texturina">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Sighin;
