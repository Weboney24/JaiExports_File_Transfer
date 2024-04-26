const { authUser } = require("../controller/auth.controller");

const router = require("express").Router();
// controller

router.post("/auth_user", authUser);

module.exports = router;
