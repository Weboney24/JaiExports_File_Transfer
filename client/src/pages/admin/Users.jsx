import React, { useEffect, useState } from "react";
import { Divider, Select, Tag } from "antd";
import { IconHelper } from "../../helper/Icon_helper";
import {
  Modal,
  Form,
  Input,
  Button,
  notification,
  Table,
  Popconfirm,
} from "antd";
import {
  createUser,
  deleteUser,
  getAllUser,
  sendMail,
  updateUser,
} from "../../helper/api_helper";
import _ from "lodash";
import moment from "moment";
import DefaultHeader from "../DefaultHeader";
import { GrMailOption } from "react-icons/gr";
import { FaShareFromSquare } from "react-icons/fa6";
import { BsSendArrowDown } from "react-icons/bs";
import { useSelector } from "react-redux";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [roleChange, setRoleChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setAllUser] = useState([]);
  const [form] = Form.useForm();

  const userData = useSelector((data) => data);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getAllUser();
      setAllUser(_.get(result, "data.data", []));
    } catch (err) {
      console.log("error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hanldeFinish = async (values) => {
    try {
      setLoading(true);
      if (id) {
        const result = await updateUser(values, id);
        notification.success({ message: "User successfully updated." });
        if (roleChange) {
          //  if(_.get(result, "data.data", "") === )
        }
      } else {
        await createUser(values);
        notification.success({ message: "User successfully created." });
      }
      handleCancel();
    } catch (err) {
      if (_.get(err, "response.data.message", "") === "11000") {
        return notification.error({
          message: "The email has already been utilized.",
        });
      }
      return notification.error({
        message: `user ${id ? "updation" : "creation"} request failed.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data) => {
    setId(_.get(data, "_id", ""));

    form.setFieldsValue(data);
    setOpen(true);
  };

  const handleCancel = () => {
    fetchData();
    setRoleChange(false);
    setOpen(false);
    form.resetFields();
    setId("");
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteUser(id);
      fetchData();
      return notification.success({ message: "user sucessfully deleted." });
    } catch (err) {
      return notification.error({ message: "user delete request failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMail = async (values) => {
    try {
      setLoading(true);
      const responce = await sendMail({ id: values._id });
      notification.success({ message: "Invitaion Successfully Sended" });
    } catch (err) {
      notification.error({
        message: "Something Went Wrong While Sending Invitation",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChangeRequest = (values) => {
    try {
      setRoleChange(true);
      setId(_.get(values, "_id", ""));
      form.setFieldsValue(values);
    } catch (err) {}
  };

  const columns = [
    {
      title: "S.NO",
      dataIndex: "email",
      key: "id",
      width: 100,
      align: "center",
      render: (data, value, index) => {
        return <div className="!font-Texturina font-bold">{index + 1}</div>;
      },
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (values, all_values) => {
        return (
          <div className="flex items-center justify-start gap-x-2">
            <Tag
              className={`center_div h-[30px] border-none text-white font-bold min-w-[100px] uppercase  ${
                values === "sub admin"
                  ? "bg-blue-500"
                  : values === "admin"
                  ? "bg-secondary"
                  : "bg-primary"
              }`}
            >
              <div>{values}</div>
            </Tag>
            {_.get(userData, "userSlice.role", "") === "admin" &&
              values != "admin" && (
                <IconHelper.editUserIcon
                  onClick={() => {
                    handleRoleChangeRequest(all_values);
                  }}
                  className={`bg-lime-500 rounded-lg size-[30px] p-2 cursor-pointer text-white `}
                />
              )}
          </div>
        );
      },
    },
    {
      title: "Mail",
      key: "email",
      dataIndex: "email",
      align: "center",
      render: (data, all_values) => {
        return (
          <div
            onClick={() => {
              handleSendMail(all_values);
            }}
            className=" group  hover:border-transparent cursor-pointer relative py-2 rounded center_div gap-x-2 text-secondary"
          >
            <span className="center_div gap-x-2 z-30 px-2 group-hover:text-white">
              <GrMailOption className="group-hover:hidden" /> Invite
              <BsSendArrowDown className="group-hover:block hidden" />
            </span>
            <div className="w-0 group-hover:w-full group-hover:h-full bg-primary  bottom-0 left-0 transition-all duration-300 absolute rounded h-0"></div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      align: "center",

      width: 300,
      render: (data) => {
        return (
          <div className="flex items-center w-full justify-center gap-x-10">
            <span
              onClick={() => {
                handleEdit(data);
              }}
              className="center_div gap-x-2 border px-2 rounded-lg py-1 bg-primary !text-white cursor-pointer"
            >
              <IconHelper.editUserIcon /> update
            </span>
            <Popconfirm
              onConfirm={() => {
                handleDelete(data._id);
              }}
              okText="Yes"
              cancelText="No"
              title="Are you sure want to delete this user"
              placement="left"
            >
              <span className="center_div gap-x-2 border px-2 rounded-lg py-1 bg-secondary !text-white cursor-pointer">
                <IconHelper.deleteUserIcon />
                delete
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full overflow-y-scroll p-5 font-Texturina ">
      <div className="flex w-full  justify-between">
        <h1 className="lg:text-3xl text-sm font-Texturina flex items-center gap-x-2">
          <IconHelper.usersIcon /> All Users
        </h1>
        <div className="flex items-center gap-x-2">
          <div className="lining-nums lg:text-2xl text-sm">
            Total Users : <span className="text-primary">{user.length}</span>
          </div>
          <div
            onClick={() => {
              setOpen(true);
            }}
            className="px-3 py-1 text-sm text-black rounded-lg flex  capitalize items-center gap-x-2 cursor-pointer"
          >
            <IconHelper.addUserIcon className="lg:text-3xl text-xl bg-light_yellow rounded-md p-1 text-white" />{" "}
            <span className="hidden lg:block">create user</span>
          </div>
        </div>
      </div>
      <Divider />
      <Table
        loading={loading}
        columns={columns}
        dataSource={user}
        scroll={{ x: 100 }}
        pagination={{ pageSize: 6, position: ["bottomCenter"] }}
      />
      <Modal
        open={open || roleChange}
        footer={false}
        closable={false}
        title={`${id ? "Update" : "Create new"}  User ${
          roleChange ? "Role" : ""
        }`}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form layout="vertical pt-4" onFinish={hanldeFinish} form={form}>
          <Form.Item
            label={"Name"}
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter user name",
              },
            ]}
          >
            <Input
              placeholder="Enter user name"
              className="antd_input w-full"
            />
          </Form.Item>
          {roleChange ? (
            <Form.Item
              label={"Select role"}
              name="role"
              rules={[
                {
                  required: true,
                  message: "Please Select user role",
                },
              ]}
            >
              <Select className="antd_input">
                <Select.Option value="user">user</Select.Option>
                <Select.Option value="sub admin">sub admin</Select.Option>
              </Select>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label={"Email"}
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter user email address",
                  },
                  {
                    type: "email",
                    message: "Please enter valid email address",
                  },
                ]}
              >
                <Input
                  placeholder="Enter user email"
                  className="antd_input w-full"
                />
              </Form.Item>
              {id ? (
                ""
              ) : (
                <Form.Item
                  label={"Password"}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter user password",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter user password"
                    className="antd_input w-full"
                  />
                </Form.Item>
              )}
            </>
          )}
          <Form.Item className="pt-4">
            <Button
              loading={loading}
              htmlType="submit"
              block
              className="primary_btn font-Texturina"
            >
              {id ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;