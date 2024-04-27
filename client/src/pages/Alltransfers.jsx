import React, { useEffect, useState } from "react";

import { Divider, Modal, QRCode, Table, Typography } from "antd";

import _ from "lodash";
import { filesize } from "filesize";
import moment from "moment";
import { client_url, getAllUserFiles } from "../helper/api_helper";
import { copyHelper, IconHelper } from "../helper/Icon_helper";
import DefaultHeader from "./DefaultHeader";
import { FaCopy } from "react-icons/fa";
import { Link } from "react-router-dom";
import CopyLink from "../component/CopyLink";

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
  }, [moment()]);

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
        return (
          <span
            className={`capitalize ${
              _.get(data, "name", "") === "admin"
                ? "text-secondary"
                : "text-primary"
            } font-semibold cursor-pointer flex items-center gap-x-2`}
          >
            {_.get(data, "name", "")}
          </span>
        );
      },
    },

    {
      title: "Scan to share",
      dataIndex: "transfer_link",
      align: "center",
      render: (data) => {
        return (
          <div
            onClick={() => {
              setLinks(client_url + data);
            }}
            className="w-[100px] center_div"
          >
            <QRCode
              value={`${client_url}${data}`}
              className="!w-[50px] !h-[50px] cursor-pointer animate-pulse"
            />
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
          <div
            className="text-sm line-clamp-2  gap-x-4 items-center flex  justify-center w-[100px] "
            href={`${client_url}${data}`}
            target="_blank"
          >
            <div className="pt-4">{CopyLink(`${client_url}${data}`)}</div>

            <Link target="_blank" to={`${client_url}${data}`}>
              <IconHelper.clickLink className={`text-blue-400 !text-[10px]`} />
            </Link>
          </div>
        );
      },
    },
    {
      title: "Transfer Name",
      dataIndex: "transfer_name",
      render: (data) => {
        return <div className="capitalize w-[100px]">{data}</div>;
      },
    },

    {
      title: "Files",
      dataIndex: "files",
      render: (data) => {
        return (
          <div className="lining-nums text-primary font-bold">
            {data?.length} <Divider type="vertical" />
          </div>
        );
      },
    },
    {
      title: "Size",
      dataIndex: "files",

      render: (data) => {
        return (
          <div className="text-green-500 !min-w-[100px] !text-sm">
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
      title: "Date",
      dataIndex: "createdAt",
      render: (data) => {
        return (
          <div className="flex !min-w-[100px]">{moment(data).format("ll")}</div>
        );
      },
    },
    {
      title: <div>Expired In</div>,
      dataIndex: "expire_date",
      render: (data) => {
        let expDate = moment.duration(moment(data).diff(new Date()));

        return (
          <div
            className={`text-sm font-semibold  ${
              expDate.seconds() < 0 ? "text-red-500 " : "text-primary"
            } `}
          >
            {expDate.seconds() < 0
              ? "Expired"
              : `${expDate.days()}:${expDate.hours()}:${expDate.minutes()}:${expDate.seconds()}`}
          </div>
        );
      },
    },
    {
      title: <div>Password</div>,
      dataIndex: "transfer_password",
      align: "center",
      render: (data) => {
        return <div>{data ? "Yes" : "No"}</div>;
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
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 6, position: ["bottomCenter"] }}
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
