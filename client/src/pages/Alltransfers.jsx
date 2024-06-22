import React, { useEffect, useState } from "react";

import { Divider, Modal, QRCode, Table, Tooltip, Typography } from "antd";

import _ from "lodash";
import { filesize } from "filesize";
import moment from "moment";
import { client_url, getAllUserFiles } from "../helper/api_helper";
import { copyHelper, IconHelper } from "../helper/Icon_helper";
import DefaultHeader from "./DefaultHeader";
import { FaCopy } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { LuMaximize } from "react-icons/lu";

const AllTransfers = () => {
  const [data, setData] = useState([]);
  const [shift, setShift] = useState(false);

  const [links, setLinks] = useState(false);

  const fetchData = async () => {
    try {
      const result = await getAllUserFiles();
      setData(_.get(result, "data.data", []));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      title: "User",
      dataIndex: "user_id",
      align: "center",
      width: 100,
      render: (data) => {
        return (
          <Tooltip title={_.get(data, "name", "")}>
            <h1
              className={`capitalize ${
                _.get(data, "name", "") === "admin"
                  ? "text-secondary"
                  : "text-primary"
              } font-semibold cursor-pointer !line-clamp-1 !text-start !px-2 !text-[12px]  gap-x-2`}
            >
              {_.get(data, "name", "")}
            </h1>
          </Tooltip>
        );
      },
    },

    {
      title: "Scan",
      dataIndex: "transfer_link",
      width: 50,
      align: "center",
      render: (data) => {
        return (
          <div
            onClick={() => {
              setLinks(client_url + data);
            }}
            className="center_div "
          >
            <LuMaximize className="cursor-pointer !text-[10px]" />
          </div>
        );
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
      dataIndex: "transfer_link",
      align: "center",
      width: 80,
      render: (data) => {
        return (
          <div className="text-sm  gap-x-6 items-center flex justify-center ">
            <Typography.Paragraph
              copyable={{
                text: `${client_url}${data}`,
              }}
              style={{ fontSize: 10 }}
              className="pt-4"
            ></Typography.Paragraph>
            <Link target="_blank" to={`${client_url}${data}`}>
              <IconHelper.clickLink className={`text-blue-400 !text-[10px]`} />
            </Link>
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
            <div className="capitalize !text-[12px] line-clamp-1 !text-start !px-2">
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
              ).toFixed(1),
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
            className={`flex gap-x-2 !text-[12px] !text-center !px-2 ${
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
  ];

  return (
    <div className="w-full h-full overflow-y-scroll p-5 font-Texturina ">
      <div className="flex w-full justify-between items-center">
        <h1 className="lg:text-3xl text-sm font-Texturina flex items-center gap-x-2">
          <IconHelper.allTransfers /> All Transfers
        </h1>
        <div className="lining-nums px-4">
          Total Transfer :
          <span className="text-primary font-bold">{data?.length}</span>
        </div>
      </div>
      <Divider />

      <Table
        scroll={{ x: 100 }}
        bordered
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 20, position: ["bottomCenter"] }}
        size="small"
      />
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

export default AllTransfers;
