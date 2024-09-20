const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const _ = require("lodash");
const { CheckTypes } = require("./typesHandler");
const transferModels = require("../models/transfer.models");

const sendMailWithHelper = async (email, data, type) => {
  try {
    let config = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaiexportenterprises@gmail.com",
        pass: "joco bfgn bhah iapv",
      },
      port: 587,
      secure: false,
    });

    let file = CheckTypes(type, data);

    let mailTemplate = {
      from: {
        address: "info@jai-india.com",
        name: "Jai Export Enterprises",
      },
      to: email,
      html: file,
      subject: "Jai Export Enterprises File Transfer Application Invitation",
    };

    if (type === "download count") {
      mailTemplate.cc = "info@jai-india.com";
      mailTemplate.subject = "Notification for Downloading File Transfer Links";
    } else if (type === "generateLink") {
      mailTemplate.subject = `A new file link has been sent to you by ${data?.senderEmail}`;
    } else if (type === "expiry reminder") {
      mailTemplate.subject = `Warning: Transfer Links Expiring Soon`;
    }

    config.sendMail(mailTemplate, (err, info) => {
      if (err) {
        throw Error(err);
      } else {
        return true;
      }
    });
  } catch (err) {
    console.log(err);
    throw Error(err);
  }
};

const scheduleExpiryMail = async () => {
  try {
    const result = await transferModels.aggregate([
      {
        $match: {
          $and: [
            {
              expire_date: {
                $lte: moment().add(1, "day").toDate(),
                $gte: moment().toDate(),
              },
            },
            {
              count: {
                $not: { $gt: 0 },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "user",
          as: "user",
          foreignField: "_id",
          localField: "user_id",
        },
      },
    ]);

    if (!_.isEmpty(result)) {
      result.map(async (res) => {
        if (res?.expiry_mail != true && res.expiry_mail != undefined) {
          let mailData = {
            senderEmail: _.get(res, "user[0].email", ""),
            transfername: _.get(res, "transfer_name", ""),
            password: _.get(res, "transfer_password", "") || "No Password",
            expired_date: moment(_.get(res, "expire_date", "")).format("DD/MM/YYYY"),
            message: _.get(res, "transfer_description", "") || "No Message",
            seperate_link: `http://jai-india.in/files/${res.transfer_name}/${res.transfer_link}`.split(" ").join("_"),
          };
          await sendMailWithHelper(_.get(res, "user[0].email", ""), mailData, "expiry reminder");
          await transferModels.updateOne({ _id: res._id }, { $set: { expiry_mail: true } });
        }
      });
    }
    // console.log(new Date(moment().add(1, "d")));
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendMailWithHelper, scheduleExpiryMail };
