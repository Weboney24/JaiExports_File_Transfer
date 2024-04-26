import React from "react";
import { Result, Button } from "antd";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";

const NotAccess = () => {
  const userRole = useSelector((data) => data);
  const navigate = useNavigate();

  const handleClick = () => {
    if (_.get(userRole, "userSlice.role", "") === "G$6rT@wP3qY!8nA") {
      navigate("/dashboard");
    } else {
      navigate("/make_transfer");
    }
  };

  return (
    <div className="w-screen h-screen center_div">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={handleClick}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotAccess;
