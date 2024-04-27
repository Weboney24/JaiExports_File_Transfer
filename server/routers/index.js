const router = require("express").Router();
const { verifyToken } = require("./verifytoke");

// user routes
const user_routes = require("./user.routes");
router.use("/user", verifyToken, user_routes);

// auth routes
const auth_routes = require("./auth.routes");
router.use("/auth", auth_routes);

// transfer
const transfer_routes = require("./transfer.routes");
router.use("/transfer", verifyToken, transfer_routes);

// dashboard
const dashboard_routes = require("./dashboard.routes");
const {
  getPerticularFile,
  verifyFilePassword,
  filterByDate,
  getLinkStatus,
  updateDownloadCount,
  deleteLinkParser,
} = require("../controller/dashboard.controller");
const { sendMail } = require("../controller/user.controller");
router.use("/dashboard", verifyToken, dashboard_routes);

router.get("/get_shared_file/:id", getPerticularFile);
router.get("/get_link_status/:id", getLinkStatus);
router.get("/delete_link_after_expire", deleteLinkParser);
router.post("/verify_file_password", verifyFilePassword);
router.post("/filter_by_date", filterByDate);
router.put("/update_download_count", updateDownloadCount);

module.exports = router;
