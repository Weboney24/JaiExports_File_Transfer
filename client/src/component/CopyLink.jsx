import { Typography } from "antd";
import React from "react";
import { IconHelper } from "../helper/Icon_helper";
import { FaCopy } from "react-icons/fa";

const CopyLink = (textValue) => {
  return (
    <div>
      <Typography.Paragraph
        copyable={{
          icon: [
            <FaCopy key="copy-icon" className="!text-primary" />,
            <IconHelper.successTickIcon key="copied-icon" />,
          ],
          tooltips: ["copy link", "link copied"],
          text: textValue,
        }}
      />
    </div>
  );
};

export default CopyLink;
