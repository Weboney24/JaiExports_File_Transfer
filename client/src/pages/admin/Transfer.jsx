import { useState } from "react";
import {
  Divider,
  Upload,
  Tag,
  Empty,
  Progress,
  Form,
  Input,
  Button,
  Modal,
  DatePicker,
  QRCode,
  Typography,
  Select,
  notification,
} from "antd";
import {
  collectFileSize,
  IconHelper,
  UrlHelper,
} from "../../helper/Icon_helper";
import { filesize } from "filesize";
import _ from "lodash";
import { client_url, uploadFiles } from "../../helper/api_helper";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import Extra from "./Makeextra/Extra";

const Transfer = () => {
  const [files, setFiles] = useState([]);
  const [dummy, setDummy] = useState(false);

  const userData = useSelector((data) => data);

  console.log(userData);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [percentage, setPercentage] = useState({
    loaded: "",
    total: "",
  });

  const [aliseName, setAliseName] = useState({
    name: "",
    status: "",
  });

  const [modalData, setModalData] = useState(false);
  const [loading, setLoading] = useState(false);

  const { Dragger } = Upload;

  const [form] = Form.useForm();

  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      console.log(info, "gk");
      setFiles(info.fileList);
    },
    fileList: files,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const onDelete = (value) => {
    let newList = files;
    setFiles(
      newList.filter((res) => {
        return res.uid != value.uid;
      })
    );
  };

  const handleRandomGenerate = (value, flag) => {
    try {
      if (flag === "auto") {
        setAliseName((pre) => ({
          ...pre,
          name: uuidv4().slice(0, 7).concat(Date.now()),
          status: "auto",
        }));
        form.setFieldsValue({
          transfer_link: uuidv4().slice(0, 7).concat(Date.now()),
        });
      } else {
        setAliseName((pre) => ({
          ...pre,
          name: value.trim() || "",
          status: "custom",
        }));
        form.setFieldsValue({ transfer_link: value.trim() || "" });
      }
      setDummy(!dummy);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFinish = async (values) => {
    console.log(values);

    try {
      if (collectFileSize(files)?.actualSize > 2000000000) {
        return notification.error({
          message:
            "File size limit exceeded; maximum allowed is 2GB. Please remove or alter files to reduce the size.",
        });
      }

      values.trackgmail = values.recipient_email?.map((res) => {
        return {
          link: UrlHelper(),
          gmail: res,
        };
      });
      values.transfer_link = UrlHelper();

      if (values.custom_expire_date) {
        values.expire_date = values.custom_expire_date;
      }

      const formData = new FormData();
      files.forEach((res) => {
        formData.append("files", res.originFileObj);
      });
      formData.append("data", JSON.stringify(values));
      const finalResult = await uploadFiles(formData, (data) => {
        setOpen(true);

        setPercentage((pre) => ({
          ...pre,
          total: data.total,
          loaded: data.loaded,
        }));

        if (data.progress === 1) {
          setOpen(false);
          form.resetFields();
          setPercentage((pre) => ({
            ...pre,
            total: "",
            loaded: "",
          }));
          setFiles([]);
          setAliseName((pre) => ({
            ...pre,
            name: "",
            status: "",
          }));
          setLoading(true);
        }
      });
      setModalData(finalResult);
      setLoading(false);
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMore = () => {
    setModalData("");
    setOpen(false);
  };

  const handleViewMore = () => {
    setModalData("");
    setOpen(false);
    navigate("/my_transfer");
  };

  const disabledDate = (current) => {
    let currentDate = moment();
    return current < currentDate.subtract(1, "days");
  };

  return (
    <div className="!w-full h-[99vh] !overflow-y-scroll py-20 !p-5 !font-Poppins ">
      <h1 className="text-3xl font-Texturina flex items-center gap-x-2">
        <IconHelper.fileshare2 /> Make Transfers
      </h1>
      <h1 className="lining-nums hidden text-end">
        Total Size : &nbsp;
        <span className="text-primary font-bold">
          {filesize(
            _.sum(
              files.map((res) => {
                return res.size;
              })
            ),
            { standard: "jedec" }
          )}
        </span>
      </h1>
      <Divider />

      <div className="w-full flex gap-x-2">
        <div className="center_div items-start w-[80%]">
          {!_.isEmpty(files) ? (
            <div className="flex items-start gap-y-4  justify-between w-full lg:flex-row flex-col-reverse gap-x-10 lg:px-4">
              {/* form */}
              <div className="w-full  p-5 rounded-lg  bg-white flex flex-col gap-y-6">
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={handleFinish}
                  className="flex flex-wrap gap-x-10 gap-y-2"
                >
                  <Form.Item
                    label="Transfer Name"
                    name="transfer_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a transfer name",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Transfer Name"
                      className="antd_input "
                    />
                  </Form.Item>

                  <Form.Item label="Description" name="transfer_description">
                    <Input.TextArea
                      placeholder="Enter Description"
                      className="antd_input  !h-[100px]"
                    />
                  </Form.Item>
                  <Form.Item label="Transfer Password" name="transfer_password">
                    <Input
                      placeholder="Enter Transfer Password"
                      className="antd_input  !h-[100px]"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Custom Expiry Date"
                    name="custom_expire_date"
                  >
                    <DatePicker
                      placeholder="Enter Expiry Date"
                      className="antd_input  !lining-nums"
                      use12Hours
                      disabledDate={disabledDate}
                      format={"DD:MM:YYYY"}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Select Recipient Email"
                    name="recipient_email"
                    rules={[
                      {
                        required: true,
                        message: "Please add/select a recipient email",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      mode="tags"
                      className="antd_input  !min-h-[10px] !w-[640px] focus:!border-none hover:border-none"
                      tokenSeparators={[","]}
                      placeholder="Select Recipient Email"
                    ></Select>
                  </Form.Item>

                  <Form.Item className="!w-full">
                    <Button
                      block
                      className="primary_btn !w-[100px]"
                      htmlType="submit"
                    >
                      Upload
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="!font-Poppins text-sm">
                  There are currently no files uploaded.
                </div>
              }
            />
          )}
        </div>
        <div className="flex items-start  justify-start flex-col shadow-2xl bg-white rounded-2xl py-2 p-4 w-[30%] gap-y-2">
          <div className="!w-full">
            <Progress
              strokeColor={
                collectFileSize(files)?.actualSize > 2000000000
                  ? "red"
                  : "#d97706"
              }
              percent={
                !_.isEmpty(files)
                  ? collectFileSize(files)?.actualSize >= 2000000000
                    ? 100
                    : (
                        (collectFileSize(files)?.actualSize / 2000000000) *
                        100
                      ).toFixed(1)
                  : ""
              }
            />
            <h1 className="lining-nums text-sm py-2">
              Limit {collectFileSize(files)?.textAlise}&nbsp;/ 2GB
            </h1>
          </div>
          <div className={` bg-white  shadow-inner w-[100%]  h-[inherit]`}>
            <Dragger {...props} showUploadList={false} className="!bg-white">
              <div className={`w-full !h-[100px] center_div flex-col gap-y-4`}>
                <IconHelper.uploadIcon className="!text-2xl !text-gray-500" />
                <p className="text-sm font-Poppins font-normal leading-relaxed text-gray-500 text-center">
                  Click or drag file to this area to upload <br />
                </p>
              </div>
            </Dragger>
          </div>
          {/* uploded files */}
          <div className="flex flex-col w-[100%]   gap-y-2 items-center  min-h-[100px]">
            <Extra files={files} onDelete={onDelete} />
          </div>
        </div>
        {/* <Divider /> */}
      </div>

      <Modal
        width={400}
        open={open || loading}
        footer={false}
        onCancel={handleMore}
        centered
      >
        {loading ? (
          <img
            src="https://i.pinimg.com/originals/6b/e0/89/6be0890f52e31d35d840d4fe2e10385b.gif"
            alt=""
            className="w-full h-[200px]"
          />
        ) : modalData ? (
          <div className="flex flex-col items-center gap-y-4 pt-10">
            <div className="text-sm   gap-x-4 items-center flex justify-start w-full px-6 ">
              <span>Transfer Link :</span>

              <Typography.Paragraph
                copyable={{
                  text: `${client_url}${_.get(modalData, "data", "")}`,
                }}
                className="pt-4"
              ></Typography.Paragraph>

              <Link
                target="_blank"
                to={`${client_url}${_.get(modalData, "data", "")}`}
              >
                <IconHelper.clickLink
                  className={`text-blue-400 !text-[10px]`}
                />
              </Link>
            </div>
            <QRCode
              className="!w-[300px] !h-[300px]"
              value={`${client_url}${_.get(modalData, "data", "")}`}
            />

            <div className="flex items-centers gap-x-5 py-2">
              <Tag
                className="cursor-pointer hover:shadow-2xl bg-white shadow-inner py-1 px-4"
                onClick={handleMore}
              >
                Transfer More
              </Tag>
              <Tag
                onClick={handleViewMore}
                className="cursor-pointer hover:shadow-2xl bg-white shadow-inner py-1 px-4"
              >
                View My Transfer
              </Tag>
            </div>
          </div>
        ) : (
          <Progress
            strokeColor={"#d97706"}
            percent={((percentage?.loaded / percentage?.total) * 100).toFixed()}
          />
        )}
      </Modal>
    </div>
  );
};

export default Transfer;
