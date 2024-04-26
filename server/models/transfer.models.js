const moment = require("moment");
const { Schema, model } = require("mongoose");

const transferSchema = new Schema(
  {
    transfer_name: String,
    transfer_link: String,
    transfer_password: String,
    custom_expire_date: Date,
    expire_date: {
      type: Date,
      default: moment().add(7, "days"),
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    transfer_description: String,
    files: Array,
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "transfer",
    timestamps: true,
  }
);

module.exports = model("transfer", transferSchema);
