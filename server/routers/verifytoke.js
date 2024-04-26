const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    if (req.headers["authorization"]) {
      let result = await jwt.verify(
        req.headers["authorization"].split(" ")[1],
        process.env.key
      );
      req.userData = result;
      next();
    } else {
      
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = { verifyToken };
