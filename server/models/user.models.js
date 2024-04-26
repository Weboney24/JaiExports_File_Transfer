const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    password_alise: String,
    role: {
      type: String,
      default: "user",
    },
  },
  {
    collection: "user",
    timestamps: true,
  }
);

module.exports = model("user", userSchema);
