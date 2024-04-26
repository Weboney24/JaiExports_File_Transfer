import React from "react";
import { Column } from "@ant-design/plots";

const LineChart = (properties) => {
  const { users, getTotalTransfer } = properties;
console.log(users)
  const data = users.map((res) => {
    return {
      name: res.name,
      transfer: getTotalTransfer(res._id).length,
    };
  });

  const style = {
    fill: () => {
      return "orange";
    },
  };

  const config = {
    data,
    xField: "name",
    yField: "transfer",
    animate: { enter: { type: "scaleInY" } },
    style,
  };
  return <Column {...config} />;
};

export default LineChart;
