const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await User.findOne({ email: email });
    if (!result) {
      return res.status(500).send({
        message:
          "Account not found! Please reach out to your administrator for further assistance and updates.",
      });
    }
    let verifyPassword = await bcrypt.compare(password, result.password);
    if (!verifyPassword) {
      return res.status(500).send({
        message: "The password entered is incorrect.",
      });
    }
    let token = await jwt.sign(
      { id: result._id, role: result.role },
      process.env.key
    );
    return res
      .status(200)
      .send({ data: { role: result.role, token: token, name: result.name } });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  authUser,
};
