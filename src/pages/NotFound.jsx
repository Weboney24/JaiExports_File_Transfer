import React from "react";
import { Result, Button } from "antd";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";

const NotFound = () => {
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
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={handleClick}>
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
