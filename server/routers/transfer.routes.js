const { upload } = require("../controller/multerHandler");
const {
  makeTransfer,
  getOneUserFiles,
  getAllUserFiles,
  deleteTransfer,
  removeTransferPassword,
  resendEmails,
  addMoreRecipients,
} = require("../controller/transfer.controller");

const router = require("express").Router();

router.post("/make_transfer", upload.array("files"), makeTransfer);
router.get("/get_one_user_files", getOneUserFiles);
router.get("/get_all_user_files", getAllUserFiles);
router.post("/resend_mails", resendEmails);
router.post("/add_more_mails", addMoreRecipients);
router.delete("/delete_one_user_files/:id", deleteTransfer);
router.put("/remove_file_password", removeTransferPassword);

module.exports = router;
