import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import _ from "lodash";
import {
  client_url,
  getLinkStatus,
  getPerticularFile,
  server_url,
  updateDownloadCount,
  verifyFilePassword,
} from "../helper/api_helper";
import { IconHelper } from "../helper/Icon_helper";
import { filesize } from "filesize";
import {
  Modal,
  Tag,
  Form,
  Input,
  Button,
  notification,
  Watermark,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Logo } from "../helper/ImageHelper";
import moment from "moment";
import { MdOutlineSdStorage, MdSdStorage } from "react-icons/md";
import { FcExpired } from "react-icons/fc";

const Files = () => {
  const navigate = useLocation();

  const navigation = useNavigate();

  const [datas, setdatas] = useState([]);
  const [verified, setVerified] = useState(false);
  const [open, setOpen] = useState(false);

  const [dummy, setDummy] = useState(false);
  const [dates, setDates] = useState(false);

  const [loading, setLoading] = useState(false);

  const [linkStatus, setLinkStatus] = useState(false);

  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      const result = await getPerticularFile(
        _.get(navigate, "pathname", "").split("/")[2]
      );
      setdatas(_.get(result, "data.data", []));
    } catch (err) {
      console.log(err);
    }
  };

  const checkLinkStatus = async () => {
    try {
      const result = await getLinkStatus(
        _.get(navigate, "pathname", "").split("/")[2]
      );
      if (_.get(result, "data.data", "") === "expired") {
        navigation("/*");
      } else {
        setLinkStatus(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (linkStatus) {
      if (
        _.get(navigate, "pathname", "").split("/")[2].slice(-6) === "b3P3ts" &&
        !verified
      ) {
        setOpen(true);
        setVerified(false);
      } else {
        fetchData();
      }
    } else {
      checkLinkStatus();
    }
  }, [_.get(navigate, "pathname", "").split("/")[2], linkStatus]);

  const handlePassword = async (value) => {
    try {
      const formdata = {
        ...value,
        file_url: _.get(navigate, "pathname", "").split("/")[2],
      };
      const result = await verifyFilePassword(formdata);
      setdatas(_.get(result, "data.data", []));
      setOpen(false);
      setVerified(true);
    } catch (err) {
      if (_.get(err, "response.data.message", "") === "Invalid password") {
        notification.error({ message: "Invalid password" });
      }
    }
  };

  const handleDownload = async (values) => {
    try {
      setLinkStatus(false);
      await updateDownloadCount({
        id: _.get(datas, "[0]._id", []),
        user_id: _.get(datas, "[0].user_id", []),
        link: `${client_url}${_.get(datas, "[0].transfer_link", [])}`,
      });
      window.open(values.location);
      setLinkStatus(true);
    } catch (err) {
      setLinkStatus(true);
      notification.error({ message: "Something went wrong while downloading" });
      console.log(err);
    }
  };

  useEffect(() => {
    setDummy(!dummy);
    setDates(moment.duration(moment(datas[0]?.expire_date).diff(Date.now())));
  }, [moment()]);

  const getIcon = (name) => {
    console.log(name.split(".")[name.split(".").length - 1]);
    try {
      switch (name.split(".")[name.split(".").length - 1]) {
        case "pdf":
          return <IconHelper.pdfIcon className="!text-5xl" />;
        case "png":
          return <IconHelper.pngIcon className="!text-5xl" />;
        case "jpg":
          return <IconHelper.jpg className="!text-5xl" />;
        case "jpeg":
          return <IconHelper.Jpeg className="!text-5xl" />;
        case "mp3":
          return <IconHelper.mp3 className="!text-5xl" />;
        case "webp":
          return <IconHelper.webp className="!text-5xl" />;
        case "mp4":
          return <IconHelper.mp4 className="!text-5xl" />;
        case "excel":
          return <IconHelper.excel className="!text-5xl" />;
      }
    } catch (err) {}
  };

  return (
    <div
      className={`w-screen ${
        open ? "invisible" : "visible"
      } min-h-screen overflow-hidden center_div bg-gradient-to- from-[#f7f7f7] to-[rgba(255,250,180,0.03)] bg-no-repeat bg-cover bg-center text-primary items-start font-Poppins lining-nums`}
    >
      {!linkStatus ? (
        <img
          src="https://cdn.dribbble.com/users/1186261/screenshots/3718681/_______.gif"
          alt=""
        />
      ) : (
        <div className=" flex w-[1366px] z-50 flex-col lg:mt-[15vh] mt-[6vh] justify-center  items-center px-4  lg:px-10 gap-y-1">
          <div className="flex  flex-col  items-center gap-y-6 justify-center w-full z-50 ">
            <img src={Logo} alt="" className="lg:w-[5%] w-[20%]  rounded-lg" />
            <h1 className="text-secondary tracking-wider font-Poppins">
              Jai Export Enterprises
            </h1>
          </div>
          <p className="line-clamp-1 text-gray-400 pt-2">
            Transfer File Name : {_.get(datas, "[0].transfer_name", [])}
          </p>
          <div className={`font-semibold flex flex-col items-star  pt-4`}>
            {dates.seconds() < 0 ? (
              "Expired"
            ) : (
              <div className="flex items-center gap-x-2">
                {[
                  {
                    name: "Days",
                    value:
                      dates.days() > 9 ? dates.days() : `0 ${dates.days()}`,
                  },
                  {
                    name: "Hours",
                    value: dates.hours(),
                  },
                  {
                    name: "Minutes",
                    value: dates.minutes(),
                  },
                  {
                    name: "Seconds",
                    value: dates.seconds(),
                  },
                ].map((res, index) => {
                  return (
                    <div className="">
                      <span
                        className={` ${
                          dates.seconds() < 0
                            ? "text-red-500 bg-white"
                            : "bg-primary text-white"
                        } px-2  min-w-[50px] center_div rounded text-white py-2`}
                      >
                        {res.value}
                      </span>
                      <span className="!text-[12px]">{res.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-10 pt-5">
            {_.get(datas, "[0].files", []).map((res, index) => {
              return (
                <div
                  className="lg:w-[200px] w-full overflow-hidden relative flex-col gap-y-4 text-secondary h-[200px] shadow-inner hover:shadow-2xl transition-all duration-500 ease-linear rounded-lg bg-white center_div items-center justify-start"
                  key={index}
                >
                  <div className="pt-4 text-secondary">
                    {getIcon(res.name) || (
                      <IconHelper.fileIcon className="!text-secondary" />
                    )}
                  </div>
                  <abbr
                    title={res.name}
                    className="!line-clamp-1 no-underline w-[90%] "
                  >
                    {res.name}
                  </abbr>
                  <Tag className="!text-[10px] bg-white !border-transparent flex items-center gap-x-2">
                    <MdSdStorage />
                    {filesize(res.size)}
                  </Tag>
                  <Tag
                    onClick={() => {
                      handleDownload(res);
                    }}
                    className="flex rounded-lg absolute bottom-2 cursor-pointer border-transparent bg-primary text-white items-center text-sm gap-x-2"
                  >
                    Download
                    <IconHelper.downloadIcon className="cursor-pointer  transition-all duration-500  hover:scale-150" />
                  </Tag>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Modal
        open={open}
        closable={false}
        footer={false}
        centered
        title={
          <span className="!font-Texturina !text-center">
            To view or access this data, you'll need to provide a password
          </span>
        }
      >
        <Form layout="vertical" className="pt-2" onFinish={handlePassword}>
          <Form.Item
            label="File Password"
            name="file_password"
            rules={[
              {
                required: true,
                message: "Please enter a file password",
              },
            ]}
          >
            <Input
              placeholder="Enter File Password"
              className="antd_input w-full lining-nums"
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" block className="primary_btn mt-2">
              Verify
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Files;
