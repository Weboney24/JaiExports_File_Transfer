const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const { sendMailWithHelper } = require("./mailHelper");

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const formData = req.body;
    formData.password = await bcrypt.hash(password, 10);
    formData.password_alise = password;
    await User.create(formData);
    let mailData = {
      email: email,
      password: password,
    };
    await sendMailWithHelper(email, mailData);
    return res.status(200).send({ message: "user created successfully " });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(500).send({ message: "11000" });
    }
    return res.status(500).send({ message: "user creation request failed" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const formData = req.body;
    if (password) {
      formData.password = await bcrypt.hash(password, 10);
    }
    await User.findByIdAndUpdate({ _id: id }, formData);
    return res
      .status(200)
      .send({ message: "user updated successfully", data: req.body.role });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(500).send({ message: "11000" });
    }
    return res.status(500).send({ message: "user updation request failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete({ _id: id });
    return res.status(200).send({ message: "user deleded successfully " });
  } catch (err) {
    return res.status(500).send({ message: "user deletion request failed" });
  }
};

const getAllUser = async (req, res) => {
  try {
    const result = await User.find({}, { password: 0, password_alise: 0 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};

const getAllUserWithAdmin = async (req, res) => {
  try {
    const result = await User.find({}, { password: 0, password_alise: 0 }).sort(
      {
        createdAt: -1,
      }
    );
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "err" });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  getAllUserWithAdmin,
};
