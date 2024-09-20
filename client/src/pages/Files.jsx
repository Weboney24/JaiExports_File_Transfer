/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { getLinkStatus, getPerticularFile, server_url, updateDownloadCount, verifyFilePassword } from "../helper/api_helper";
import { collectFileSize, fileTypeHelper } from "../helper/Icon_helper";
import { filesize } from "filesize";
import { Modal, Form, Input, Button, notification, Card, Avatar, Result } from "antd";
import { Logo } from "../helper/ImageHelper";
import moment from "moment";
import fileDownload from "js-file-download";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";

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

  return (
    <div className={`w-screen ${open ? "invisible" : "visible"} min-h-screen overflow-hidden pb-10 center_div bg-gradient-to- from-[#f7f7f7] to-[rgba(255,250,180,0.03)] bg-no-repeat bg-cover bg-center text-primary items-start font-Poppins lining-nums`}>
      {loading ? (
        <img src="https://cdn.dribbble.com/users/2015153/screenshots/6592242/progess-bar2.gif" alt="" />
      ) : (
        <div className=" flex w-[1366px] z-50 flex-col lg:mt-[15vh] mt-[6vh] justify-center  items-center px-4  lg:px-10 gap-y-1">
          <div className="flex  flex-col  items-center gap-y-6 justify-center w-full z-50 ">
            <img src={Logo} alt="" className="lg:w-[5%] w-[20%]  rounded-lg" />
            <h1 className="text-secondary text-2xl tracking-wider font-Poppins">Jai Export Enterprises</h1>
          </div>
          {expired ? (
            <Result
              status="404"
              title="Oops, there was a problem with your link"
              subTitle={
                <span>
                  It seems your link has expired or wasn&apos;t copied correctly.
                  <br />
                  Please check and try again, or ask your friend to send another one.
                </span>
              }
            />
          ) : (
            <>
              <div className="flex justify-center flex-col items-center !w-[70%]">
                <div className=" pt-2 flex items-center capitalize justify-start gap-x-2">
                  <div className="w-[150px] text-right  px-2 line-clamp-1 text-slate-800">Transfer Name</div>
                  {_.get(datas, "[0].transfer_name", [])}
                </div>

                <div className="capitalize pt-2 flex items-start justify-start gap-x-2">
                  <div className="w-[150px] text-right  px-2 line-clamp-1 text-slate-800">Total File</div>
                  {collectFileSize(_.get(datas, "[0].files", []))?.textAlise}
                </div>

                <div className="capitalize pt-2 flex items-start justify-start gap-x-2">
                  <div className="w-[150px] text-right  px-2 line-clamp-1 text-slate-800">Expired Date</div>
                  {moment(_.get(datas, "[0].expire_date", [])).format("DD-MMMM-YYYY")}
                </div>
              </div>

              <div className="flex flex-wrap w-[80%] justify-center gap-5 pt-4">
                {_.get(datas, "[0].files", []).map((res, index) => {
                  return (
                    <Card key={index} hoverable loading={loading} className="w-[40%]  min-h-[120px] relative">
                      <Card.Meta avatar={<Avatar src={fileTypeHelper(res.mimetype)} />} title={filesize(res.size)} description={<h1 className="line-clamp-2">{res.name}</h1>} />
                      <div className="absolute top-4 right-6 ">
                        <DownloadOutlined
                          className="cursor-pointer hover:text-primary"
                          onClick={() => {
                            handleDownload(res);
                          }}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Button
                className="primary_btn !w-[30%] mt-10"
                onClick={() => {
                  handleDownloadAll();
                }}
              >
                Download All
              </Button>
            </>
          )}
        </div>
      )}
      <Modal open={open} closable={false} footer={false} centered title={<span className="!font-Texturina !text-center">To view or access this data, you&apos;ll need to provide a password</span>}>
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
            <Input placeholder="Enter File Password" className="antd_input w-full lining-nums" />
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
