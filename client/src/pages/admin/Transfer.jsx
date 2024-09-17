/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { useState } from "react";
import { Divider, Upload, Empty, Progress, Form, Input, Button, Modal, DatePicker, Select, notification, Result, Checkbox, Radio } from "antd";
import { collectFileSize, IconHelper, UrlHelper } from "../../helper/Icon_helper";
import { filesize } from "filesize";
import _ from "lodash";
import { client_url, uploadFiles } from "../../helper/api_helper";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import Extra from "./Makeextra/Extra";
import RecipientsTableView from "../../component/RecipientsTableView";
import dayjs from "dayjs";

const Transfer = () => {
  const [files, setFiles] = useState([]);

  useSelector((data) => data);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [percentage, setPercentage] = useState({
    loaded: "",
    total: "",
  });

  const [modalData, setModalData] = useState(false);
  const [loading, setLoading] = useState(false);

  const [options, setOptions] = useState(true);

  const { Dragger } = Upload;

  const [form] = Form.useForm();

  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      setFiles(info.fileList);
    },
    fileList: files,
    onDrop(e) {},
  };

  const onDelete = (value) => {
    let newList = files;
    setFiles(
      newList.filter((res) => {
        return res.uid != value.uid;
      })
    );
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      if (collectFileSize(files)?.actualSize > 2000000000) {
        setLoading(false);
        return notification.error({
          message: "File size limit exceeded; maximum allowed is 2GB. Please remove or alter files to reduce the size.",
        });
      }

      if (options === "email") {
        values.trackgmail = values.recipient_email?.map((res) => {
          return {
            link: UrlHelper(),
            gmail: res,
          };
        });
      } else {
        values.trackgmail = [
          {
            link: UrlHelper(),
            gmail: "anonymous",
          },
        ];
      }
      values.transfer_link = UrlHelper();
      values.custom_options = options === "email";

      if (values.custom_expire_date) {
        values.expire_date = values.custom_expire_date;
      } else {
        values.expire_date = moment().add(7, "days");
      }
      values.client_url = client_url;

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
          setLoading(true);
        }
      });

      setModalData(finalResult);
      setLoading(false);
      setOpen(true);
    } catch (err) {
      notification.error({ message: "An error occurred while uploading" });
    } finally {
      setLoading(false);
    }
  };

  const handleMore = () => {
    setModalData("");
    setOpen(false);
    form.resetFields();
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
                <Form layout="vertical" form={form} onFinish={handleFinish} className="flex flex-wrap gap-x-10 gap-y-2">
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
                    <Input placeholder="Enter Transfer Name" className="antd_input " />
                  </Form.Item>

                  <Form.Item label="Description" name="transfer_description">
                    <Input.TextArea placeholder="Enter Description" className="antd_input  !h-[100px]" />
                  </Form.Item>
                  <Form.Item label="Transfer Password" name="transfer_password">
                    <Input.Password placeholder="Enter Transfer Password" className="antd_input  !h-[100px]" />
                  </Form.Item>

                  <Form.Item label="Custom Expiry Date" name="custom_expire_date" initialValue={dayjs(moment().add(7, "d").format("DD/MM/YYYY"), "DD/MM/YYYY")}>
                    <DatePicker format={{ format: "DD/MM/YYYY", type: "mask" }} placeholder="Enter Expiry Date" className="antd_input  !lining-nums" use12Hours disabledDate={disabledDate} />
                  </Form.Item>
                  <Form.Item className="w-full" label="Select Send Option">
                    <Radio.Group
                      onChange={(e) => {
                        setOptions(e.target.value);
                      }}
                    >
                      <Radio name="mix" value={"email"}>
                        Send Message via Email
                      </Radio>
                      <Radio name="mix" value={"copy"}>
                        Create Link Only
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  {options === "email" ? (
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
                      <Select virtual={false} mode="tags" className="antd_input  !min-h-[10px] !w-[640px] focus:!border-none hover:border-none" tokenSeparators={[","]} placeholder="Select Recipient Email"></Select>
                    </Form.Item>
                  ) : (
                    ""
                  )}

                  <Form.Item className="!w-full">
                    <Button block className="primary_btn !w-[100px]" htmlType="submit">
                      Upload
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<div className="!font-Poppins text-sm">There are currently no files uploaded.</div>} />
          )}
        </div>
        <div className="flex items-center  justify-start flex-col shadow-2xl bg-white rounded-2xl py-8 p-4 w-[30%] gap-y-10">
          <div className="!w-full center_div flex-col gap-y-2">
            <Progress strokeColor={collectFileSize(files)?.actualSize > 2000000000 ? "red" : "#d97706"} type="dashboard" percent={!_.isEmpty(files) ? (collectFileSize(files)?.actualSize >= 2000000000 ? 100 : ((collectFileSize(files)?.actualSize / 2000000000) * 100).toFixed(1)) : ""} />
            <h1 className="lining-nums text-sm py-2">Limit {collectFileSize(files)?.textAlise}&nbsp;/ 2GB</h1>
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

      <Modal width={loading ? 300 : 600} open={open || loading} footer={false} onCancel={handleMore} centered closable={false}>
        {loading ? (
          <div className="flex flex-col items-center">
            {/* <img src="https://media.tenor.com/dHAJxtIpUCoAAAAi/loading-animation.gif" alt="" className="w-[200px] " /> */}
            <Progress type="circle" strokeColor={"#d97706"} percent={((percentage?.loaded / percentage?.total) * 100).toFixed() || 99} />
            <h1>Please Wait ....</h1>
          </div>
        ) : modalData ? (
          <div className="flex flex-col items-center gap-y-4 pt-10">
            <Result
              status="success"
              title={<h1 className="!text-[16px] font-bold py-2">Files have been successfully uploaded and sent to all recipients.</h1>}
              extra={[
                <div>
                  <RecipientsTableView tableData={modalData} />
                  <div className="flex items-center gap-x-4 justify-center py-10">
                    <Button type="primary" key="console" onClick={handleMore}>
                      Transfer More
                    </Button>

                    <Button key="buy" onClick={handleViewMore}>
                      View My Transfer
                    </Button>
                  </div>
                </div>,
              ]}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img src="https://media.tenor.com/dHAJxtIpUCoAAAAi/loading-animation.gif" alt="" className="w-[200px] " />
            <Progress strokeColor={"#d97706"} percent={((percentage?.loaded / percentage?.total) * 100).toFixed()} />
            <h1>Please Wait ....</h1>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transfer;
