import { Avatar, Divider } from "antd";
import _ from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";

const DefaultHeader = () => {
  const [dummy, setDummy] = useState(false);
  const userData = useSelector((data) => data);

  useEffect(() => {
    setDummy(!dummy);
  }, [moment()]);

  return (
    <div className="flex items-center justify-between z-50 h-[50px] fixed w-[100vw] lg:w-[87vw] lg:h-[80px] bg-secondary text-white shadow px-5">
      <div className="lg:!text-3xl text-md tracking-wider text-primary  lg:mt-0 mt-2">
        Jai Export Enterprises
      </div>
      <div className="flex  gap-x-4 items-center">
        <span className="lg:text-sm text-md lg:mt-0 mt-2">
          {moment(Date.now()).format("hh:mm:ss A")}
        </span>
        <div className="flex gap-x-2 items-center !bg-white text-secondary rounded-2xl p-[2px] pl-3 ">
          <div className="uppercase !text-sm">
            {_.get(userData, "userSlice.role", "")}
          </div>
          <Avatar
            className="!capitalize bg-primary text-white lg:flex hidden"
            size={"small"}
          >
            <span className="uppercase !text-[12px]">
              {_.get(userData, "userSlice.name", "")?.slice(0, 2)}
            </span>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default DefaultHeader;
