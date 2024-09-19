const User = require("../models/user.models");
const Transfer = require("../models/transfer.models");
const { dateFilter } = require("../helper/date_helper");
const fs = require("fs");
const os = require("os");
const bcrypt = require("bcrypt");
const axios = require("axios");
const _ = require("lodash");
const moment = require("moment");
const path = require("path");
const { sendMailWithHelper } = require("./mailHelper");

const getAllCounts = async (req, res) => {
  try {
    const Total_Users = await User.aggregate([{ $match: { role: "user" } }, { $count: "count" }]);
    const Total_Transfers = await Transfer.aggregate([
      {
        $count: "count",
      },
    ]);
    const Today_Transfers = await Transfer.aggregate([
      {
        $match: {
          createdAt: {
            $gte: dateFilter().yesterday,
            $lte: dateFilter().endOfToday,
          },
        },
      },
      {
        $count: "count",
      },
    ]);

    const sendData = [
      {
        text: "Total Transfers",
        track: Total_Users,
        background: "#bae6fd",
      },
      {
        text: "Today Transfers",
        track: Total_Transfers,
        background: "#6ee7b7",
      },
      {
        text: "Total Users",
        track: Today_Transfers,
        background: "#ddd6fe",
      },
    ];
    return res.status(200).send({ data: sendData });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "failed to get counts" });
  }
};

const getPerticularFile = async (req, res) => {
  try {
    const { id } = req.params;
    const files = await Transfer.aggregate([
      {
        $match: {
          "trackgmail.link": id,
        },
      },
    ]);

    return res.status(200).send({ data: files });
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};

const verifyFilePassword = async (req, res) => {
  try {
    const { file_url, file_password } = req.body;

    const result = await Transfer.aggregate([
      {
        $match: {
          "trackgmail.link": file_url,
          transfer_password: file_password,
        },
      },
    ]);

    if (_.isEmpty(result)) {
      return res.status(500).send({ message: "Invalid password" });
    }
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};

const getTodayTransfers = async (req, res) => {
  try {
    const { start, end, names } = JSON.parse(req.params.values);

    const startOfDay = moment(start).startOf("day");
    const endOfDay = moment(end).endOf("day");

    let where = {};
    if (start !== "all" && end !== "all") {
      where.createdAt = {
        $gte: startOfDay.toDate(),
        $lte: endOfDay.toDate(),
      };
    }

    if (names !== "all") {
      where.user_id = { $in: names };
    }

    const result = await Transfer.find(where).populate("user_id", {
      password: 0,
    });

    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "failed" });
  }
};

const filterByDate = async (req, res) => {
  try {
    const result = await Transfer.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDay.toDate(),
            $lte: endOfDay.toDate(),
          },
        },
      },

      {
        $group: {
          _id: "$user_id",
          transferCount: { $sum: 1 },
          transfers: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          transferCount: 1,
          transfers: 1,
          name: { $arrayElemAt: ["$user.name", 0] },
        },
      },
    ]);

    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
  }
};

const getLinkStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Transfer.aggregate([
      {
        $match: {
          "trackgmail.link": id,
          expire_date: {
            $gt: new Date(),
          },
        },
      },
    ]);

    if (_.isEmpty(data)) {
      const data = await Transfer.find({
        transfer_link: id,
      });
      // _.get(data, "[0].files", []).map((res) => {
      //   if (
      //     fs.existsSync(
      //       `${path.join(__dirname, `../public/uploads/${res.filename}`)}`
      //     )
      //   ) {
      //     fs.unlinkSync(
      //       path.join(__dirname, `../public/uploads/${res.filename}`)
      //     );
      //   }
      // });

      return res.status(200).send({ data: [] });
    } else {
      return res.status(200).send({
        data: [{ password: _.get(data, "[0].transfer_password", "") ? true : false }],
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "err" });
  }
};

const sendMail = async (req, res) => {
  try {
    const result = await User.findById({ _id: req.body.id });
    let mailData = {
      email: result.email,
      password: result.password_alise,
    };
    await sendMailWithHelper(result.email, mailData, "register");
    return res.status(200).send({ message: "sended" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "err" });
  }
};

const updateDownloadCount = async (req, res) => {
  try {
    const { id, user_id, file_url } = req.body;

    await Transfer.findByIdAndUpdate({ _id: id }, { $inc: { count: 1 } });
    const finduserEmail = await User.find({ _id: user_id });
    const fileDetails = await Transfer.find({ _id: req.body.id });

    let fetchGmail = _.get(fileDetails, "[0].trackgmail", []).filter((res) => {
      return res.link === file_url;
    });

    const ipInfo = await axios.get("https://ipinfo.io/json");

    let link = `${req.body.client_url}${_.get(fileDetails, "[0].transfer_name", "")}/${file_url}`.split(" ").join("_");

    let mailData = {
      senderEmail: _.get(fetchGmail, "[0].gmail", ""),
      transfername: _.get(fileDetails, "[0].transfer_name", ""),
      password: _.get(fileDetails, "[0].transfer_password", "") || "No Password",
      expired_date: moment(_.get(fileDetails, "[0].expire_date", "")).format("DD/MM/YYYY"),
      message: _.get(fileDetails, "[0].transfer_description", "") || "No Message",
      seperate_link: link,
      ip_info: _.get(ipInfo, "data.ip", ""),
      country: _.get(ipInfo, "data.country", ""),
      region: _.get(ipInfo, "data.region", ""),
      timezone: _.get(ipInfo, "data.timezone", ""),
    };

    await sendMailWithHelper(_.get(finduserEmail, "[0].email", ""), mailData, "download count");
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.userData;
    const { old_password, password } = req.body;
    const result = await User.findOne({ _id: id });
    let verifyPassword = await bcrypt.compare(old_password, result.password);
    if (!verifyPassword) {
      return res.status(500).send({
        message: "The old password entered is incorrect.",
      });
    }
    let formData = {};
    formData.password = await bcrypt.hash(password, 10);
    formData.password_alise = password;
    await User.findByIdAndUpdate({ _id: id }, formData);
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};

const checkUserRole = async (req, res) => {
  try {
    const { id } = req.userData;
    const result = await User.find({ _id: id }, { password: 0, password_alise: 0 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};

module.exports = {
  getAllCounts,
  getPerticularFile,
  verifyFilePassword,
  getTodayTransfers,
  filterByDate,
  getLinkStatus,
  sendMail,
  updateDownloadCount,
  changePassword,
  checkUserRole,
};
