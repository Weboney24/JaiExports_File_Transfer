const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const sendMailWithHelper = async (email, data, type) => {
  try {
    let config = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaihandloom@gmail.com",
        pass: "rqrx xsgv lqmf uthn",
      },
      port: 587,
      secure: false,
    });

    let file =
      type === "download count"
        ? ejs.render(
            fs.readFileSync(
              path.join(__dirname, "../helper/download.ejs"),
              "utf8"
            ),
            data
          )
        : ejs.render(
            fs.readFileSync(
              path.join(__dirname, "../helper/greetings.ejs"),
              "utf8"
            ),
            data
          );

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
