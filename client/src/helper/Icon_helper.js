import {
  MdEditNote,
  MdOutlineDashboard,
  MdOutlineDeleteOutline,
  MdOutlineSettings,
} from "react-icons/md";
import { TbUsers } from "react-icons/tb";
import { MdPersonAddAlt } from "react-icons/md";
import { AiOutlineUserDelete } from "react-icons/ai";
import { TbUserEdit } from "react-icons/tb";
import { RiShareForwardBoxFill } from "react-icons/ri";
import { GiRapidshareArrow, GiSettingsKnobs } from "react-icons/gi";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdTransferWithinAStation } from "react-icons/md";
import { LuFileSymlink } from "react-icons/lu";
import {
  FaExternalLinkAlt,
  FaRegFileExcel,
  FaRegFilePdf,
} from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { FiDownload, FiDownloadCloud } from "react-icons/fi";
import { RiUserShared2Line } from "react-icons/ri";
import { MdKey } from "react-icons/md";
import { MdKeyOff } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { RxSwitch } from "react-icons/rx";
import { PiFileJpgDuotone, PiFilePngDuotone } from "react-icons/pi";
import { SiJpeg } from "react-icons/si";
import { BsFiletypeMp3, BsFiletypeMp4 } from "react-icons/bs";
import { HiOutlinePhoto } from "react-icons/hi2";
import { message } from "antd";
import _ from "lodash";
import { filesize } from "filesize";

export const IconHelper = {
  dashboard: MdOutlineDashboard,
  usersIcon: TbUsers,
  addUserIcon: MdPersonAddAlt,
  deleteUserIcon: AiOutlineUserDelete,
  editUserIcon: TbUserEdit,
  fileShare: RiShareForwardBoxFill,
  fileshare2: GiRapidshareArrow,
  deleteIcon: MdOutlineDelete,
  uploadIcon: AiOutlineCloudUpload,
  allTransfers: MdTransferWithinAStation,
  myTransfers: RiUserShared2Line,
  clickLink: FaExternalLinkAlt,
  fileIcon: CiFileOn,
  downloadIcon: FiDownload,
  keySecurity: MdKey,
  removePassword: MdKeyOff,
  report: FaRegFileAlt,
  logout: TbLogout,
  switchIcon: RxSwitch,
  settings: MdOutlineSettings,
  downloadIcon: FiDownloadCloud,
  pdfIcon: FaRegFilePdf,
  pngIcon: PiFilePngDuotone,
  jpg: PiFileJpgDuotone,
  Jpeg: SiJpeg,
  mp3: BsFiletypeMp3,
  webp: HiOutlinePhoto,
  mp4: BsFiletypeMp4,
  excel: FaRegFileExcel,
  editIcon: MdEditNote,
  deleteIcon2: MdOutlineDeleteOutline,
};

export const navbar = [
  {
    id: 1,
    name: "Dashboard",
    link: "dashboard",
    icons: MdOutlineDashboard,
  },
  {
    id: 2,
    name: "All Trasferers",
    link: "all_transfer",
    icons: MdTransferWithinAStation,
  },
  {
    id: 3,
    name: "Users",
    link: "users",
    icons: TbUsers,
  },
  {
    id: 4,
    name: "My Transfer",
    link: "my_transfer",
    icons: RiUserShared2Line,
  },
  {
    id: 5,
    name: "Make Transfer",
    link: "make_transfer",
    icons: RiShareForwardBoxFill,
  },
  {
    id: 6,
    name: "Settings",
    link: "settings",
    icons: MdOutlineSettings,
  },
];

export const copyHelper = (value) => {
  try {
    window.navigator.clipboard.writeText(value);
    message.success("Link copied");
    console.log("enter");
  } catch (err) {
    console.log(err);
  }
};

export const fileTypeHelper = (type) => {
  if (
    ["image/jpeg", "image/png", "image/gif", "image/webp", ""].includes(type)
  ) {
    return "https://png.pngtree.com/png-vector/20190508/ourmid/pngtree-gallery-vector-icon-png-image_1028015.jpg";
  } else if (["application/pdf"].includes(type)) {
    return "https://media.istockphoto.com/id/1356214382/vector/pdf-file-icon-format-pdf-download-document-image-button-vector-doc-icon.jpg?s=612x612&w=0&k=20&c=Pp0h1HBQynL2JOVu9rMVlcX711XvjXR3UujOuPLck9M=";
  } else if (
    [
      "application/vnd.ms-excel",
      "application/msexcel",
      "application/x-msexcel",
      "application/x-excel",
      "application/x-dos_ms_excel",
      "application/xls",
      "application/x-xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].includes(type)
  ) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/1101px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png";
  } else if (
    [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(type)
  ) {
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkDY7I2XNodvnhc7le1_N4Z43p0iAufJtZlw&s";
  } else {
    return "https://static.vecteezy.com/system/resources/previews/024/090/509/non_2x/folder-file-documents-free-png.png";
  }
};

export const collectFileSize = (files) => {
  let fileText = filesize(
    _.sum(
      files.map((res) => {
        return res.size;
      })
    ),
    { standard: "jedec" }
  );
  return {
    textAlise: fileText,
    actualSize: _.sum(
      files.map((res) => {
        return res.size;
      })
    ),
  };
};
