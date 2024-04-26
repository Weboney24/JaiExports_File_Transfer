import React, { useState } from "react";
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
  Spin,
  DatePicker,
  QRCode,
} from "antd";
import { copyHelper, IconHelper } from "../../helper/Icon_helper";
import { filesize } from "filesize";
import _ from "lodash";
import { client_url, uploadFiles } from "../../helper/api_helper";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";
import DefaultHeader from "../DefaultHeader";
import { TbArrowsRandom } from "react-icons/tb";
import { FaCopy } from "react-icons/fa";

const Transfer = () => {
  const [files, setFiles] = useState([]);
  const [dummy, setDummy] = useState(false);

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
    try {
      if (aliseName.status === "custom") {
        values.transfer_link = values.transfer_password
          ? values.transfer_link.concat(Date.now()).concat("b3P3ts")
          : values.transfer_link.concat(Date.now());
      } else {
        values.transfer_link = values.transfer_password
          ? uuidv4().slice(0, 7).concat(values.transfer_link).concat("b3P3ts")
          : uuidv4().slice(0, 7).concat(values.transfer_link);
      }

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
      <Divider />

      <div className="w-full flex-col">
        <div
          className={`${
            files.length >= 5 ? "hidden" : "block"
          } bg-white p-2 shadow-inner rounded-2xl`}
        >
          <Dragger {...props} showUploadList={false} maxCount={5}>
            <div className={`w-full !h-[150px] center_div flex-col gap-y-4`}>
              <IconHelper.uploadIcon className="!text-6xl !text-gray-500" />
              <p className="text-sm font-Poppins font-normal leading-relaxed text-gray-500 text-center">
                Click or drag file to this area to upload <br />
              </p>
            </div>
          </Dragger>
        </div>
        <Divider />
        <div className="center_div">
          {!_.isEmpty(files) ? (
            <div className="flex items-start gap-y-4 justify-between w-full lg:flex-row flex-col-reverse gap-x-10 lg:px-4">
              {/* form */}
              <div className="lg:w-[50%] w-full shadow-md p-5 rounded-lg  bg-white flex flex-col gap-y-4">
                <div>
                  <h1 className="lining-nums">Limit {files.length}/5</h1>
                  <Progress
                    strokeColor={"#d97706"}
                    percent={
                      !_.isEmpty(files)
                        ? files.length >= 5
                          ? 100
                          : files.length * 20
                        : ""
                    }
                  />
                </div>
                <Form layout="vertical" form={form} onFinish={handleFinish}>
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
                      className="antd_input w-full"
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <div>
                        Link &nbsp;&nbsp;
                        <span className="text-[12px] lining-nums text-blue-500">
                          {client_url}
                          {aliseName.status === "auto"
                            ? aliseName.name
                            : aliseName.name &&
                              aliseName.name.concat(Date.now())}
                        </span>
                      </div>
                    }
                    name="transfer_link"
                    rules={[
                      {
                        required: true,
                        message: "Please enter a transfer link",
                      },
                    ]}
                  >
                    <div className="flex items-center justify-between">
                      <Input
                        addonBefore={client_url}
                        value={aliseName.name}
                        onChange={(value) => {
                          handleRandomGenerate(value.target.value);
                        }}
                        placeholder="Enter Transfer link name"
                        className="antd_input w-[80%]  rounded-r-none"
                      />
                      <div
                        onClick={() => {
                          handleRandomGenerate(10, "auto");
                        }}
                        className="lg:w-[20%] w-[30px] !text-[10px]  center_div h-[40px] font-Poppins  bg-secondary text-white rounded-r cursor-pointer"
                      >
                        <span className="lg:block hidden"> Auto Generate</span>
                        <TbArrowsRandom className="!text-xl lg:hidden block" />
                      </div>
                    </div>
                  </Form.Item>
                  <Form.Item label="Description" name="transfer_description">
                    <Input.TextArea
                      placeholder="Enter Description"
                      className="antd_input w-full !h-[100px]"
                    />
                  </Form.Item>
                  <Form.Item label="Transfer Password" name="transfer_password">
                    <Input
                      placeholder="Enter Transfer Password"
                      className="antd_input w-full !h-[100px]"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Custom Expiry Date"
                    name="custom_expire_date"
                  >
                    <DatePicker
                      placeholder="Enter Expiry Date"
                      className="antd_input w-full !lining-nums"
                      use12Hours
                      showTime
                      disabledDate={disabledDate}
                      format={"DD:MM:YYYY HH:mm A"}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button block className="primary_btn" htmlType="submit">
                      Upload
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              {/* uploded files */}
              <div className="lg:w-[50%] shadow-md w-full pt-5 p-5 rounded-lg flex flex-col gap-y-6">
                <h1 className="lining-nums text-end">
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
                {files.map((res, index) => {
                  return (
                    <Tag
                      key={index}
                      className="w-full  flex justify-between items-center !rounded-lg bg-white h-[50px] shadow-inner"
                    >
                      <h1 className="line-clamp-1 w-[50%] text-black font-Poppins overflow-hidden">
                        {res.name}
                      </h1>
                      <div className="flex items-center justify-end gap-x-4 ">
                        <h1>{filesize(res.size, { standard: "jedec" })}</h1>
                        <IconHelper.deleteIcon
                          onClick={() => {
                            onDelete(res);
                          }}
                          className="text-primary cursor-pointer !text-2xl"
                        />
                      </div>
                    </Tag>
                  );
                })}
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
              <FaCopy
                onClick={() => {
                  copyHelper(`${client_url}${_.get(modalData, "data", "")}`);
                }}
                className={`text-primary hover:text-secondary cursor-pointer`}
              />
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
