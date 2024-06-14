/* eslint-disable react/prop-types */
import { Avatar, Card, Tag, Tooltip } from "antd";
import { filesize } from "filesize";
import { fileTypeHelper, IconHelper } from "../../../helper/Icon_helper";
import _ from "lodash";
import { MdDeleteOutline } from "react-icons/md";

const Extra = ({ files, onDelete }) => {
  return (
    <>
      {files.map((res, index) => {
        console.log(res);
        return (
          <Card key={index} className="!w-[100%]">
            <Card.Meta
              avatar={<Avatar src={fileTypeHelper(res.type)} size={"small"} />}
              title={
                <Tooltip
                  title={_.get(res, "name", "")}
                  trigger={"hover"}
                  placement="topLeft"
                >
                  {_.get(res, "name", "")}
                </Tooltip>
              }
              description={
                <div className="flex items-center gap-x-4 justify-between">
                  {filesize(res.size, { standard: "jedec" })}
                  <MdDeleteOutline
                    onClick={() => {
                      onDelete(res);
                    }}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              }
            />
          </Card>
        );
      })}
    </>
  );
};

export default Extra;

// <Tag
//   key={index}
//   className="w-full  flex justify-between items-center !rounded-lg bg-white h-[50px] shadow-inner"
// >
//   <h1 className="line-clamp-1 w-[50%] text-black font-Poppins overflow-hidden">
//     {res.name}
//   </h1>
//   <div className="flex items-center justify-end gap-x-4 ">
//     <h1>{filesize(res.size, { standard: "jedec" })}</h1>
//     <IconHelper.deleteIcon
//       onClick={() => {
//         onDelete(res);
//       }}
//       className="text-primary cursor-pointer !text-2xl"
//     />
//   </div>
// </Tag>;
