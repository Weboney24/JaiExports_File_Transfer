const TransferSchema = require("../models/transfer.models");
const { Types } = require("mongoose");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3.config");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const makeTransfer = async (req, res) => {
  try {
    const result = await _.get(req, "files", []).map(async (res) => {
      console.log(res);
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${res.originalname.split(".")[0]}${Date.now()}${path.extname(
          res.originalname
        )}`,
        Body: require("fs").createReadStream(res.path),
        ACL: "public-read",
      };
      await s3Client.send(new PutObjectCommand(params));
      const location = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
      const key = params.Key;
      fs.unlinkSync(res.path);
      return {
        key: key,
        location: location,
        name: res.originalname,
        size: res.size,
      };
    });
    const media = await Promise.all(result);

    const data = JSON.parse(req.body.data);

    let formData = {
      transfer_name: data.transfer_name,
      transfer_link: data.transfer_link,
      transfer_description: data.transfer_description,
      transfer_password: data.transfer_password,
      custom_expire_date: data.custom_expire_date,
      expire_date: data.expire_date,
      user_id: req.userData.id,
      files: media,
    };
    await TransferSchema.create(formData);
    return res.status(200).send({ data: formData.transfer_link });
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

module.exports = {
  makeTransfer,
  getOneUserFiles,
  getAllUserFiles,
  deleteTransfer,
  removeTransferPassword,
};
