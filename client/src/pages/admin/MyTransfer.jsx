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
import { MdOutlineDocumentScanner } from "react-icons/md";

const MyTransfer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState({ status: false, data: "", id: "" });

  const [newLink, setNewLink] = useState("");
  const [shift, setShift] = useState(false);

  const [links, setLinks] = useState(false);

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
      width: 100,
      align: "center",
      render: (data, alldata, index) => {
        return <span className="font-bold">{index + 1}</span>;
      },
    },

    {
      title: "Scan",
      dataIndex: "transfer_link",
      align: "center",
      render: (data) => {
        return (
          <div
            onClick={() => {
              setLinks(client_url + data);
            }}
            className="center_div"
          >
            <MdOutlineDocumentScanner className="cursor-pointer" />
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center justify-center gap-x-2">
          <IconHelper.downloadIcon /> Count
        </div>
      ),
      dataIndex: "count",
      render: (values) => {
        return <div className=" center_div">{values}</div>;
      },
    },
    {
      title: "Transfer Link",
      dataIndex: "transfer_link",
      render: (data) => {
        return (
          <div className="text-sm  gap-x-10 items-center flex justify-center  w-[100px] ">
            <Typography.Paragraph
              copyable={{
                text: `${client_url}${data}`,
              }}
              className="pt-4"
            ></Typography.Paragraph>

            <Link target="_blank" to={`${client_url}${data}`}>
              <IconHelper.clickLink className={`text-blue-400 !text-[14px]`} />
            </Link>
          </div>
        );
      },
    },

    {
      title: "Transfer Name",
      dataIndex: "transfer_name",
      render: (data) => {
        return (
          <Tooltip title={data}>
            <div className="capitalize w-[100px] line-clamp-1">{data}</div>
          </Tooltip>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "transfer_description",
      render: (data) => {
        return (
          <abbr
            title={data}
            className="w-[100px] text-left no-underline line-clamp-1 text-sm"
          >
            {data}
          </abbr>
        );
      },
    },
    {
      title: "Files",
      dataIndex: "files",
      render: (data) => {
        return (
          <div className="lining-nums text-primary font-bold">
            {data.length} <Divider type="vertical" />
          </div>
        );
      },
    },
    {
      title: "Size",
      dataIndex: "files",
      render: (data) => {
        return (
          <div className="text-green-500 !text-sm !w-[100px]">
            {filesize(
              _.sum(
                data.map((res) => {
                  return res.size;
                })
              ).toFixed(1),
              { standard: "jedec" }
            )}
          </div>
        );
      },
    },
    // {
    //   title: "Transfer / Expired Date ",
    //   dataIndex: "createdAt",
    //   render: (data) => {
    //     return (
    //       <div className="min-w-[200px]">
    //         {moment(data).format("DD-MMMM-YYYY")}
    //       </div>
    //     );
    //   },
    // },
    {
      title: <div>Transfer / Expired Date </div>,
      dataIndex: "expire_date",
      render: (data, all) => {
        let expDate = moment.duration(moment(data).diff(new Date()));
        return (
          <div
            className={`text-sm flex gap-x-2 !min-w-[100px] ${
              expDate.seconds() < 0 ? "text-secondary" : ""
            } `}
          >
            <div>{moment(all.createdAt).format("DD-MMMM-YYYY")}</div> / &nbsp;
            {expDate.seconds() < 0 ? (
              <span>Expired</span>
            ) : (
              `${moment(data).format("DD-MMMM-YYYY")}`
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      // align: "center",
      dataIndex: "createdAt",

      render: (data, datas) => {
        let expDate = moment.duration(
          moment(datas.expire_date).diff(new Date())
        );
        return (
          <div className={`flex justify-end`}>
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
        open={open.status || newLink}
        footer={false}
        closable={false}
        title={`${
          newLink
            ? "The password has been Updated, and a new share link has been generated."
            : `${open.data ? "Update" : "Add"} File Password`
        }`}
        destroyOnClose
      >
        {newLink ? (
          <div className="flex flex-col items-center gap-y-4">
            <img
              src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif"
              alt=""
              className="w-full h-[200px]"
            />

            <div className="flex items-center gap-x-4">
              <h1>Transfer Link : </h1>

              <Typography.Paragraph
                copyable={{
                  text: `${client_url}${newLink}`,
                }}
                className="pt-4"
              ></Typography.Paragraph>

              <Link target="_blank" to={`${client_url}${newLink}`}>
                <IconHelper.clickLink
                  className={`text-blue-400 !text-[10px]`}
                />
              </Link>
              <ImQrcode
                onClick={() => {
                  setLinks(`${client_url}${newLink}`);
                }}
                className="!text-[12px] cursor-pointer"
              />
            </div>
            <div className="flex items-centers gap-x-5 py-4">
              <div
                onClick={() => {
                  setNewLink("");
                }}
                className="primary_btn w-[150px] center_div !text-sm rounded-lg px-3 cursor-pointer"
              >
                Close
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </Modal>
      <Modal
        open={links}
        footer={false}
        closable={false}
        onCancel={() => {
          setLinks(false);
        }}
        className="!center_div"
      >
        <QRCode value={links} className="!w-[300px] !h-[300px]" />
      </Modal>
    </div>
  );
};

export default MyTransfer;
