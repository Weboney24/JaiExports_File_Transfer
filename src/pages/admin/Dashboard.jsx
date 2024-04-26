import { useEffect, useState } from "react";
import { IconHelper } from "../../helper/Icon_helper";
import { Select, Divider, DatePicker, Form, Button, Input, Empty } from "antd";
import {
  client_url,
  getAllUser,
  getAllUserWithAdmin,
  getTodayTransfers,
} from "../../helper/api_helper";
import _, { set } from "lodash";
import moment from "moment";
import { filesize } from "filesize";
import LineChart from "./chart/LineChart";
import DefaultHeader from "../DefaultHeader";
import dayjs from "dayjs";

const Dashboard = () => {
  const [transferDatas, setTransfer] = useState([]);
  const [users, setusers] = useState([]);
  const [dummyUsers, setDummyUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter_values, setFilterValues] = useState({
    start: "all",
    end: "all",
    names: "all",
  });

  const [form] = Form.useForm();

  const [filterStatus, setFilterStatus] = useState("All");

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const result = await Promise.all([
        getTodayTransfers(JSON.stringify(filter_values)),
        getAllUserWithAdmin(),
      ]);
      setTransfer(_.get(result, "[0].data.data", []));
      setusers(_.get(result, "[1].data.data", []));
      setDummyUsers(_.get(result, "[1].data.data", []));
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [filter_values]);

  const columns = [
    {
      title: "S.NO",
      dataIndex: "_id",
      width: 100,
      align: "center",
      render: (data, alldata, index) => {
        return <span className="font-bold">{index + 1}</span>;
      },
    },
    {
      title: "User",
      dataIndex: "user_id",
      render: (data) => {
        console.log(data);
        return (
          <span className="capitalize text-primary font-semibold cursor-pointer flex items-center gap-x-2">
            {_.get(data, "name", "")}
          </span>
        );
      },
    },
    {
      title: "Transfer Link",
      dataIndex: "transfer_link",
      render: (data) => {
        return (
          <a
            className="text-sm line-clamp-2 w-[200px] text-blue-500"
            href={`${client_url}${data}`}
            target="_blank"
          >
            {client_url}
            {data}
          </a>
        );
      },
    },

    {
      title: "Files Size",
      dataIndex: "files",
      render: (data) => {
        return (
          <span className="text-green-500 !text-sm">
            {filesize(
              _.sum(
                data?.map((res) => {
                  return res.size;
                })
              ).toFixed(1),
              { standard: "jedec" }
            )}
          </span>
        );
      },
    },
  ];

  const options = users.map((res) => {
    return {
      label: res?.name,
      value: res?._id,
    };
  });

  const getTotalTransfer = (id) => {
    return transferDatas.filter((res) => {
      return res.user_id?._id === id;
    });
  };

  const handleFinish = (values) => {
    values.filter_type = values.filter_type || "All";
    if (values.filter_type === "Today") {
      setFilterValues((pre) => ({
        ...pre,
        start: dayjs(),
        end: dayjs(),
        names: !_.isEmpty(values.user) ? values.user : "all",
      }));
    } else if (values.filter_type === "All") {
      setFilterValues((pre) => ({
        ...pre,
        start: "all",
        end: "all",
        names: !_.isEmpty(values.user) ? values.user : "all",
      }));
    } else {
      setFilterValues((pre) => ({
        ...pre,
        start: dayjs(values.start),
        end: dayjs(values.to),
        names: !_.isEmpty(values.user) ? values.user : "all",
      }));
    }
    if (!_.isEmpty(values.user)) {
      setDummyUsers(
        users.filter((res) => {
          return values.user.includes(res._id);
        })
      );
    } else {
      setDummyUsers(users);
    }
  };

  return (
    <div className="w-full  font-Texturina p-5">
      <h1 className="text-3xl font-Texturina flex items-center gap-x-2">
        <IconHelper.dashboard /> Dashboard
      </h1>
      <Divider />

      <div className="flex  w-full justify-between flex-col gap-y-2  gap-x-10 items-start">
        <div className="pl-4  w-full flex items-center min-h-[150px] ">
          <Form
            form={form}
            layout="vertical"
            className="flex items-center gap-4 flex-wrap"
            onFinish={handleFinish}
          >
            <Form.Item
              name="filter_type"
              label="Filter Types"
              className="w-[300px]"
            >
              <Select
                className="antd_input"
                defaultValue={"All"}
                onChange={(e) => {
                  form.resetFields();
                  form.setFieldsValue({ filter_type: e });
                  setFilterStatus(e);
                }}
              >
                <Select.Option value="Today">Today</Select.Option>
                <Select.Option value="All">All</Select.Option>
                <Select.Option value="custom filter">
                  custom filter
                </Select.Option>
              </Select>
            </Form.Item>
            {filterStatus === "custom filter" && (
              <>
                <Form.Item
                  initialValue={dayjs()}
                  name="start"
                  label="Start date"
                  rules={[{ required: true, message: "Enter Start Date" }]}
                >
                  <DatePicker
                    type="Date"
                    className="antd_input"
                    defaultValue={dayjs()}
                  />
                </Form.Item>
                <Form.Item
                  initialValue={dayjs()}
                  name="to"
                  label="End date"
                  rules={[{ required: true, message: "Enter To Date" }]}
                >
                  <DatePicker className="antd_input" defaultValue={dayjs()} />
                </Form.Item>
              </>
            )}
            <Form.Item name="user" label="Users" className="w-[300px]">
              <Select
                allowClear
                options={options}
                maxTagCount={2}
                className="antd_input"
                mode="multiple"
                placeholder="Filter by users"
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" block className="primary_btn mt-6">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="flex w-full h-[400px] shadow flex-col p-5">
          {_.isEmpty(transferDatas) ? (
            <div className="w-full mx-auto min-h-[400px] center_div">
              <img
                src="https://assets-v2.lottiefiles.com/a/051bbc5e-1178-11ee-8597-4717795896d7/rC2wFs7IMM.png"
                alt=""
                className="w-[400px]"
              />
            </div>
          ) : (
            <LineChart users={dummyUsers} getTotalTransfer={getTotalTransfer} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
