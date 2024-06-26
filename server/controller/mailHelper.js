const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const { CheckTypes } = require("./typesHandler");

const sendMailWithHelper = async (email, data, type) => {
  try {
    let config = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "weboneycbe@gmail.com",
        pass: "ldkd dtxp cmiz ysmg",
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
      // mailTemplate.cc = "info@jai-india.com";
      mailTemplate.subject = "Notification for Downloading File Transfer Links";
    } else if (type === "generateLink") {
      mailTemplate.subject = `A new file link has been sent to you by ${data?.senderEmail}`;
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

module.exports = { sendMailWithHelper };
