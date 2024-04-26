const router = require("express").Router();
// controller
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  sendMail,
  getAllUserWithAdmin
} = require("../controller/user.controller");

router.post("/create_new_user", createUser);
router.put("/update_user/:id", updateUser);
router.delete("/delete_user/:id", deleteUser);
router.get("/get_all_user", getAllUser);
router.get("/get_all_user_admin", getAllUserWithAdmin);



module.exports = router;
