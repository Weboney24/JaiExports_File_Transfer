import { useEffect, useState } from "react";
import { copyHelper, IconHelper } from "../../helper/Icon_helper";
import {
  Divider,
  Table,
  Tag,
  Popconfirm,
  notification,
  Modal,
  Form,
  Input,
  Button,
  Tooltip,
  QRCode,
  Typography,
} from "antd";
import { LuMaximize } from "react-icons/lu";
import {
  client_url,
  deleteTransfer,
  getOneUserFiles,
  removeTransferPassword,
  updateTransferPassword,
} from "../../helper/api_helper";
import _ from "lodash";
import { filesize } from "filesize";
import moment from "moment";
import { FaCopy } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ImQrcode } from "react-icons/im";
import RecipientsTableView from "../../component/RecipientsTableView";

const MyTransfer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState({ status: false, data: "", id: "" });

  const [newLink, setNewLink] = useState("");
  const [shift, setShift] = useState(false);

  const [links, setLinks] = useState(false);

  const [expandView, setExpandView] = useState([]);

  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const result = await getOneUserFiles();
      setData(_.get(result, "data.data", []));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit_or_Add = (value) => {
    if (value.transfer_password) {
      form.setFieldsValue(value);
    }

    setOpen((pre) => ({
      ...pre,
      status: true,
      data: value.transfer_password,
      id: value._id,
    }));
  };

  const handleRemovePassword = async (value) => {
    try {
      let formData = {
        id: value._id,
        transfer_password: "",
        transfer_link: "".concat(Date.now()),
      };
      const result = await removeTransferPassword(formData);
      setNewLink(_.get(result, "data.data", ""));
      notification.success({
        message: "Transfer password removed successfully",
      });
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setShift(!shift);
  }, []);

  const columns = [
    {
      title: "S.NO",
      dataIndex: "_id",
      width: 50,
      align: "center",
      render: (data, alldata, index) => {
        return <span className="font-bold !text-[12px]">{index + 1}</span>;
      },
    },

    {
      title: (
        <div className="flex items-center justify-center gap-x-2 !text-[12px]">
          Count
        </div>
      ),
      width: 100,
      dataIndex: "count",
      render: (values) => {
        return <div className=" center_div !text-[12px]">{values}</div>;
      },
    },
    {
      title: "Link",
      dataIndex: "trackgmail",
      align: "center",
      width: 80,
      render: (data, allData) => {
        return (
          <div
            onClick={() => {
              setExpandView({ data: data, allData: allData });
            }}
            className="center_div "
          >
            <LuMaximize className="cursor-pointer !text-[10px]" />
          </div>
        );
      },
    },
    {
      title: "Recipient Count",
      align: "center",
      dataIndex: "trackgmail",
      width: 100,
      render: (data) => {
        return (
          <div className="text-primary font-bold line-clamp-1 !text-[12px]">
            {data?.length}
          </div>
        );
      },
    },
    {
      title: "Transfer Name",
      align: "center",
      dataIndex: "transfer_name",
      width: 200,
      render: (data) => {
        return (
          <Tooltip title={data}>
            <div className="capitalize !text-[12px] line-clamp-1 !text-center !px-2">
              {data}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "Files",
      dataIndex: "files",
      align: "center",
      width: 50,
      render: (data) => {
        return (
          <div className="lining-nums text-primary !text-[12px] font-bold">
            {data?.length}
          </div>
        );
      },
    },
    {
      title: "Size",
      dataIndex: "files",
      align: "center",
      width: 100,
      render: (data) => {
        return (
          <div className="text-green-500 line-clamp-1 !text-[12px]">
            {filesize(
              _.sum(
                data?.map((res) => {
                  return res.size;
                })
              )?.toFixed(1),
              { standard: "jedec" }
            )}
          </div>
        );
      },
    },
    {
      title: <div>Transfer / Expired Date </div>,
      width: 200,
      align: "center",
      dataIndex: "expire_date",
      render: (data, all) => {
        let expDate = moment.duration(moment(data).diff(new Date()));
        return (
          <div
            className={`flex gap-x-2 !text-[12px] !justify-center !text-center !px-2 ${
              expDate.seconds() < 0 ? "text-secondary" : ""
            } `}
          >
            <div>{moment(all.createdAt).format("DD-MMMM-YYYY")}</div> / &nbsp;
            {expDate.seconds() < 0 ? (
              <span className="text-red-500">Expired</span>
            ) : (
              `${moment(data).format("DD-MMMM-YYYY")}`
            )}
          </div>
        );
      },
    },

    {
      title: <div>Password</div>,
      width: 100,
      dataIndex: "transfer_password",
      align: "center",
      render: (data) => {
        return <div className="!text-[12px]">{data ? "Yes" : "No"}</div>;
      },
    },
    {
      title: "Actions",
      align: "center",
      dataIndex: "createdAt",
      width: 120,
      render: (data, datas) => {
        let expDate = moment.duration(
          moment(datas.expire_date).diff(new Date())
        );
        return (
          <div className={`flex justify-end p-1`}>
            {expDate.seconds() > 0 && (
              <Tooltip
                className={
                  _.get(datas, "transfer_password", "")
                    ? "visible"
                    : "invisible"
                }
                title={`Remove Password`}
              >
                <Tag
                  onClick={() => {
                    handleRemovePassword(datas);
                  }}
                  color={"#fed353"}
                  className={`flex items-center gap-x-1 cursor-pointer !p-2 ${
                    expDate.seconds() < 0 ? "hidden" : "flex"
                  }`}
                >
                  <IconHelper.removePassword />
                </Tag>
              </Tooltip>
            )}

            <Tooltip title={`Delete Link`}>
              <Popconfirm
                placement="left"
                title="Sure you want to delete this?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  handleDelete(datas);
                }}
              >
                <Tag
                  color="#fe8a1b"
                  className={` flex items-center gap-x-1 cursor-pointer !p-2 `}
                >
                  <IconHelper.deleteIcon />
                </Tag>
              </Popconfirm>
            </Tooltip>

            {expDate.seconds() > 0 && (
              <Tooltip
                title={`${
                  _.get(datas, "transfer_password", "") ? "Edit" : "Add"
                } Password `}
              >
                <Tag
                  onClick={() => {
                    handleEdit_or_Add(datas);
                  }}
                  color={
                    _.get(datas, "transfer_password", "")
                      ? "#d97706"
                      : "#ffaa0d"
                  }
                  className={`flex items-center gap-x-1 cursor-pointer !p-2`}
                >
                  <IconHelper.keySecurity />
                </Tag>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const handleDelete = async (datas) => {
    try {
      setLoading(true);
      await deleteTransfer(datas._id);
      fetchData();
      notification.success({ message: "File deleted successfully" });
      fetchData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      let formData = {
        ...values,
        transfer_link: "",
        id: open.id,
      };
      formData.transfer_link = "".concat(Date.now()).concat("b3P3ts");
      const result = await updateTransferPassword(formData);
      fetchData();
      handleCancel();
      setNewLink(_.get(result, "data.data", ""));
      notification.success({
        message: "Transfer password updated successfully",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen((pre) => ({
      ...pre,
      status: false,
      data: "",
      id: "",
    }));
    form.resetFields();
  };

  return (
    <div className="w-full h-full overflow-y-scroll p-5 font-Texturina ">
      <div className="flex w-full justify-between items-center">
        <h1 className="lg:text-3xl text-sm font-Texturina flex items-center gap-x-2">
          <IconHelper.myTransfers /> My Transfers
        </h1>
        <div className="lining-nums px-4 lg:text-2xl text-sm">
          Total Transfer :{" "}
          <span className="text-primary font-bold">{data.length}</span>
        </div>
      </div>
      <Divider />

      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 200 }}
        size="small"
        pagination={{ pageSize: 20, position: ["bottomCenter"] }}
      />

      <Modal
        open={open.status}
        footer={false}
        closable={false}
        title={`${`${open.data ? "Update" : "Add"} File Password`}`}
        destroyOnClose
      >
        <Form
          layout="vertical"
          className="pt-2"
          onFinish={handleFinish}
          form={form}
        >
          <Form.Item
            label="Enter File Password"
            name="transfer_password"
            rules={[
              {
                required: true,
                message: "Please enter a file password",
              },
            ]}
          >
            <Input
              placeholder="Enter File Password"
              className="antd_input w-full !lining-nums"
            />
          </Form.Item>
          <Form.Item>
            <div className="!flex items-center w-[100%] gap-x-2 justify-start">
              <Button
                loading={loading}
                htmlType="submit"
                className="primary_btn  !w-[100px]"
              >
                Update
              </Button>
              <Button
                onClick={handleCancel}
                className="primary_btn !bg-white !text-primary !border-2 !border-primary  !w-[100px]"
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!_.isEmpty(expandView)}
        footer={false}
        closable={false}
        destroyOnClose
        onCancel={() => {
          setExpandView([]);
        }}
        width={600}
        className="!center_div"
        title={
          <h1 className="capitalize font-Poppins">
            {_.get(expandView, "allData.transfer_name", "")}
          </h1>
        }
      >
        <RecipientsTableView
          row={true}
          tableData={expandView.data}
          restData={expandView.allData}
          from="viewTransfer"
          setExpandView={setExpandView}
          fetchData={fetchData}
        />
      </Modal>
    </div>
  );
};

export default MyTransfer;
