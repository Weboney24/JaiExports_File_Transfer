const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const CheckTypes = (type, data) => {
  try {
    switch (type) {
      case "download count":
        return ejs.render(
          fs.readFileSync(
            path.join(__dirname, "../helper/download.ejs"),
            "utf8"
          ),
          data
        );
      case "register":
        return ejs.render(
          fs.readFileSync(
            path.join(__dirname, "../helper/greetings.ejs"),
            "utf8"
          ),
          data
        );
      case "generateLink":
        return ejs.render(
          fs.readFileSync(
            path.join(__dirname, "../helper/generatelink.ejs"),
            "utf8"
          ),
          data
        );
    }
  } catch (err) {
    return err;
  }
};

module.exports = { CheckTypes };
