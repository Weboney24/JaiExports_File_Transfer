const TransferSchema = require("../models/transfer.models");
const UseSchema = require("../models/user.models");
const { Types } = require("mongoose");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3.config");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { sendMailWithHelper } = require("./mailHelper");

const makeTransfer = async (req, res) => {
  try {
    const userData = await UseSchema.find({ _id: req.userData.id });

    const result = _.get(req, "files", []).map((res) => {
      console.log(res);
      return {
        location: res.filename,
        name: res.originalname,
        size: res.size,
        mimetype: res.mimetype,
      };
    });

    const media = result;
    console.log(media);
    const data = JSON.parse(req.body.data);

    let formData = {
      transfer_name: data.transfer_name,
      transfer_link: data.transfer_link,
      transfer_description: data.transfer_description,
      transfer_password: data.transfer_password,
      custom_expire_date: data.custom_expire_date,
      trackgmail: data.trackgmail,
      expire_date: data.expire_date,
      user_id: req.userData.id,
      files: media,
    };
    await TransferSchema.create(formData);

    let mailData = {
      senderEmail: _.get(userData, "[0].email", ""),
      transfername: formData.transfer_name,
      password: formData.transfer_password || "No Password",
      expired_date: moment(
        formData.custom_expire_date || formData.expire_date
      ).format("DD/MM/YYYY"),
      message: formData.transfer_description || "No Message",
      seperate_link: `${data.client_url}${formData.transfer_link}`,
    };

    formData.trackgmail.map(async (res) => {
      mailData.seperate_link = `${data.client_url}${res.link}`;
      await sendMailWithHelper(res.gmail, mailData, "generateLink");
    });
    formData.trackgmail;
    return res.status(200).send({
      data: { anonymous: formData.transfer_link, all: formData.trackgmail },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err });
  }
};

const getOneUserFiles = async (req, res) => {
  try {
    const result = await TransferSchema.aggregate([
      {
        $match: {
          user_id: new Types.ObjectId(req.userData.id),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Transfer");
  }
};

const getAllUserFiles = async (req, res) => {
  try {
    const result = await TransferSchema.find({})
      .sort({ createdAt: -1 })
      .populate("user_id", { password: 0, password_alise: 0 });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Transfer");
  }
};

const deleteTransfer = async (req, res) => {
  try {
    await TransferSchema.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send("Transfer");
  }
};

const removeTransferPassword = async (req, res) => {
  try {
    const { id, transfer_link } = req.body;

    const result = await TransferSchema.findByIdAndUpdate(
      { _id: id },
      req.body
    );
    return res.status(200).send({ data: transfer_link });
  } catch (err) {
    return res.status(500).send("Transfer");
  }
};

const resendEmails = async (req, res) => {
  try {
    const userData = await UseSchema.find({ _id: req.body.user_id });
    const fileDetails = await TransferSchema.find({ _id: req.body.file_id });

    let mailData = {
      senderEmail: _.get(userData, "[0].email", ""),
      transfername: _.get(fileDetails, "[0].transfer_name", ""),
      password:
        _.get(fileDetails, "[0].transfer_password", "") || "No Password",
      expired_date: moment(_.get(fileDetails, "[0].expire_date", "")).format(
        "DD/MM/YYYY"
      ),
      message:
        _.get(fileDetails, "[0].transfer_description", "") || "No Message",
    };

    _.get(req, "body.resend_mails", []).map(async (res) => {
      mailData.seperate_link = `${req.body.client_url}${res.link}`;
      await sendMailWithHelper(res.gmail, mailData, "generateLink");
    });
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send("Transfer");
  }
};

const addMoreRecipients = async (req, res) => {
  try {
    const userData = await UseSchema.find({ _id: req.body.user_id });
    const fileDetails = await TransferSchema.find({ _id: req.body.file_id });

    let mailData = {
      senderEmail: _.get(userData, "[0].email", ""),
      transfername: _.get(fileDetails, "[0].transfer_name", ""),
      password:
        _.get(fileDetails, "[0].transfer_password", "") || "No Password",
      expired_date: moment(_.get(fileDetails, "[0].expire_date", "")).format(
        "DD/MM/YYYY"
      ),
      message:
        _.get(fileDetails, "[0].transfer_description", "") || "No Message",
    };

    await TransferSchema.findByIdAndUpdate(
      {
        _id: req.body.file_id,
      },
      { $push: { trackgmail: req.body.trackgmail } }
    );

    _.get(req, "body.trackgmail", []).map(async (res) => {
      mailData.seperate_link = `${req.body.client_url}${res.link}`;
      await sendMailWithHelper(res.gmail, mailData, "generateLink");
    });
    return res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Transfer");
  }
};

module.exports = {
  makeTransfer,
  getOneUserFiles,
  getAllUserFiles,
  deleteTransfer,
  removeTransferPassword,
  resendEmails,
  addMoreRecipients,
};
