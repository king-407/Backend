// const express = require("express");
// const { signUp, upload, test } = require("../controller/userController");
// const router = express.Router();

// router.post("/signup", test);

// module.exports = router;
const express = require("express");
const { signUp, upload } = require("../controller/userController");
const router = express.Router();
router.post("/signup", upload.single("image"), signUp);
module.exports = router;
