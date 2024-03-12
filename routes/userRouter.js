// const express = require("express");
// const { signUp, upload, test } = require("../controller/userController");
// const router = express.Router();

// router.post("/signup", test);

// module.exports = router;
const express = require("express");
const {
  signUp,
  upload,
  login,
  sendToken,
  follow,
  getUsers,
  verifyToken,
  changePassword,
} = require("../controller/userController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/signup", upload.single("image"), signUp);
router.post("/login", login);
router.post("/forgot-password", sendToken);
router.post("/follow", auth, follow);
router.get("/getUser", auth, getUsers);

router.post("/resetPassword/:token", changePassword);
module.exports = router;
