/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { getLinkStatus, getPerticularFile, server_url, updateDownloadCount, verifyFilePassword } from "../helper/api_helper";
import { collectFileSize, fileTypeHelper, IconHelper } from "../helper/Icon_helper";
import { filesize } from "filesize";
import { Modal, Form, Input, Button, notification, Card, Avatar, Result, Tooltip, Tag } from "antd";
import { Logo } from "../helper/ImageHelper";
import moment from "moment";
import fileDownload from "js-file-download";
import axios from "axios";
import { DownloadOutlined, FrownOutlined, SmallDashOutlined, SmileOutlined } from "@ant-design/icons";

const Files = () => {
  const navigate = useLocation();

  const [datas, setdatas] = useState([]);

  const [open, setOpen] = useState(false);

  const [dummy, setDummy] = useState(false);

  const [loading, setLoading] = useState(false);

  const [expired, setExpired] = useState(false);

  const fetchData = async () => {
    try {
      const result = await getPerticularFile(_.get(navigate, "pathname", "").split("/")[3]);

      setdatas(_.get(result, "data.data", []));
    } catch (err) {
      console.log(err);
    }
  };

  const checkLinkStatus = async () => {
    try {
      setLoading(true);
      const result = await getLinkStatus(_.get(navigate, "pathname", "").split("/")[3]);
      if (_.isEmpty(_.get(result, "data.data", ""))) {
        setExpired(true);
      } else {
        if (_.get(result, "data.data.[0].password", "")) {
          setOpen(true);
        } else {
          fetchData();
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLinkStatus();
  }, [_.get(navigate, "pathname", "").split("/")[3]]);

  const handlePassword = async (value) => {
    try {
      const formdata = {
        ...value,
        file_url: _.get(navigate, "pathname", "").split("/")[3],
      };

      const result = await verifyFilePassword(formdata);
      setdatas(_.get(result, "data.data", []));
      setOpen(false);
      fetchData();
    } catch (err) {
      if (_.get(err, "response.data.message", "") === "Invalid password") {
        notification.error({ message: "Invalid password" });
      }
    }
  };

  const handleDownload = async (values) => {
    try {
      setLoading(true);
      await updateDownloadCount({
        id: _.get(datas, "[0]._id", []),
        user_id: _.get(datas, "[0].user_id", []),
        file_url: _.get(navigate, "pathname", "").split("/")[3],
        client_url: `http://jai-india.in/files/${_.get(navigate, "pathname", "").split("/")[2]}/`,
        file_name: _.get(values, "name", ""),
      });

      axios
        .get(`${server_url}/${values.location}`, {
          responseType: "blob",
        })
        .then((res) => {
          fileDownload(res.data, values.name);
        });
    } catch (err) {
      notification.error({ message: "Something went wrong while downloading" });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDummy(!dummy);
  }, []);

  const handleDownloadAll = async () => {
    try {
      setLoading(true);
      await updateDownloadCount({
        id: _.get(datas, "[0]._id", []),
        user_id: _.get(datas, "[0].user_id", []),
        file_url: _.get(navigate, "pathname", "").split("/")[3],
        client_url: `http://jai-india.in/files/${_.get(navigate, "pathname", "").split("/")[2]}/`,
        file_name: "All Files",
      });
      _.get(datas, "[0].files", []).map((result) => {
        axios
          .get(`${server_url}/${result.location}`, {
            responseType: "blob",
          })
          .then((res) => {
            fileDownload(res.data, result.name);
          });
      });
      // eslint-disable-next-line no-empty
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };


  const DownloadALLComponent = () => {
    return (
      <div
        className="md:w-fit w-full !bg-white !h-[50px] hover:scale-110 transition-all duration-500 !cursor-pointer !text-primary !border !font-Poppins  border-primary center_div px-4 rounded-lg shadow-sm"
        onClick={() => {
          handleDownloadAll();
        }}
      >
        <p className="!font-['Poppins'] center_div gap-x-4"> {collectFileSize(_.get(datas, "[0].files", []))?.textAlise} - Download All <IconHelper.downloadIcon /></p>
      </div>
    );
  }

  return (
    <div className={`w-screen ${open ? "invisible" : "visible"} h-screen overflow-hidden center_div relative bg-white  !font-['Poppins'] bg-no-repeat bg-cover bg-center  items-start lining-nums`}>
      {loading ? (
        <div className="m-auto size-[300px] bg-white p-4  rounded-full   center_div flex-col">
          <img src={Logo} className="size-[120px] !object-contain" />
          <h1 className="py-2 font-medium text-primary text-2xl !font-Poppins ">Jai Export Enterprises</h1>
          <h1 className="py-2 font-medium text-black text-xl !font-Poppins animate-bounce absolute bottom-[50px]">Just a second...</h1>
        </div>
      ) : expired ? (
        <div className="!w-screen !h-screen center_div">
          <Result
            status="warning"
            title="Oops, there was a problem with your link"
            icon={<FrownOutlined />}
            subTitle={
              <span>
                It seems your link has expired or wasn&apos;t copied correctly.
                <br />
                Please check and try again, or ask your friend to send another one.
              </span>
            }
          />
        </div>
      ) : (
        <div className="w-screen !h-screen overflow-scroll relative  flex gap-x-2 flex-col">
          <div className="w-full px-10  center_div md:flex-row flex-col md:py-0 py-5 min-h-[80px] md:border-b md:mb-0 mb-10 justify-between">
            <div className="flex items-end gap-x-2 md:flex-row flex-col md:gap-y-1 gap-y-4">
              <img src={Logo} className="w-[50px]  bg-white !mx-auto  !object-contain " />
              <h1 className="!text-primary !font-Poppins">Jai Export Enterprises</h1>
            </div>
            {_.get(datas, "[0].transfer_name", [])}

            <div className="md:block hidden">
              <DownloadALLComponent />
            </div>
          </div>
          <div className="!w-full md:px-10 py-4 flex flex-wrap md:gap-1 gap-2 center_div  lg:pb-0 pb-[100px]">
            {_.get(datas, "[0].files", []).map((res, index) => {
              return (
                <Tooltip
                  color={"#29354c"}
                  title={
                    <div className="!space-y-2">
                      <h1>File Name : {res?.name}</h1>
                      <h1>File Size : {filesize(res.size)}</h1>
                    </div>
                  }
                  key={index}
                >
                  <div key={index} className="md:w-[250px] w-[90%] 2xl:w-[400px] shadow h-[80px] 2xl:h-[200px] transition-all group md:rounded-none rounded-2xl !bg-white relative  duration-500 hover:!bg-primary center_div justify-between items-center px-4">
                    <Avatar shape="square" src={fileTypeHelper(res.mimetype)} />
                    <div className="md:w-[50%] w-[70%]">
                      <h1 className="line-clamp-1 !text-[12px] group-hover:text-white">{res.name}</h1>
                      <div className="!text-[12px] group-hover:text-white">{filesize(res.size)}</div>
                    </div>
                    <IconHelper.downloadIcon
                      className="cursor-pointer hover:text-primary group-hover:text-white hover:!scale-125"
                      onClick={() => {
                        handleDownload(res);
                      }}
                    />
                  </div>
                </Tooltip>
              );
            })}
          </div>
          <div className="md:hidden block fixed bottom-0 !w-full">
            <DownloadALLComponent />
          </div>
        </div>
      )}
      <Modal open={open} closable={false} footer={false} centered title={<span className="!font-Texturina !font-medium text-center">To view or access this data, you&apos;ll need to provide a password</span>}>
        <Form layout="vertical" className="pt-2" onFinish={handlePassword}>
          <Form.Item
            label={<h1 className="!font-Poppins font-medium">File Password</h1>}
            name="file_password"
            rules={[
              {
                required: true,
                message: "Please enter a file password",
              },
            ]}
          >
            <Input placeholder="Enter File Password" className="antd_input  w-full lining-nums" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" block className="primary_btn !w-full mt-2">
              Verify
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Files;
