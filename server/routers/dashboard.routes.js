const {
  getAllCounts,
  getTodayTransfers,
  sendMail,
  changePassword,
  checkUserRole,
} = require("../controller/dashboard.controller");
const { verifyToken } = require("./verifytoke");

const router = require("express").Router();

router.get("/get_all_counts", getAllCounts);
router.get("/get_today_transfer/:values", getTodayTransfers);

// mail
router.post("/set_invitationmail", sendMail);
router.put("/update_password", changePassword);
router.get("/check_user_role", checkUserRole);

module.exports = router;
