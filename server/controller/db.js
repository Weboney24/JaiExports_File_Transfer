const mongoose = require("mongoose");

const db_connection = async () => {
  try {
    await mongoose.connect(process.env.db_url);
    console.log("db connection established");
  } catch (err) {
    console.log("db connection error: " + err);
    return err;
  }
};

module.exports = { db_connection };
