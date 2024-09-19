const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookie_parser = require("cookie-parser");
require("dotenv").config();
const app = express();
const path = require("path");
const cron = require("node-cron");

app.use(cookie_parser());
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

// root router
const route = require("./routers/index");
const { db_connection } = require("./controller/db");
const { scheduleExpiryMail } = require("./controller/mailHelper");
app.use("/api", route);

db_connection().then(() => {
  app.listen(8080, () => {
    console.log(`server listening on port 8080`);
  });
});

let job = cron.schedule("* * * * * *", () => {
  scheduleExpiryMail();
});

job.start();
