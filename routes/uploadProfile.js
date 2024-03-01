// const express = require("express");
// const router = express.Router();
// const User = require("../model/userModel");
// const AWS = require("aws-sdk");
// const dotenv = require("dotenv");

// require("aws-sdk/lib/maintenance_mode_message").suppress = true;
// const multer = require("multer");
// dotenv.config();

// const awsConfig = {
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.env.SECRET_KEY,
//   region: process.env.REGION,
// };
// const S3 = new AWS.S3(awsConfig);

// let upload = multer({
//   limits: 1024 * 1024 * 5,
//   fileFilter: function (req, file, done) {
//     if (
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/png"
//     )
//       done(null, true);
//     else {
//       done("File type is not supported", false);
//     }
//   },
// });

// const uploadToS3 = (fileData) => {
//   return new Promise((reject, resolve) => {
//     const params = {
//       Bucket: process.env.BUCKET,
//       Key: `${Date.now().toString()}`,
//       Body: fileData,
//       ContentDisposition: "inline",
//     };
//     S3.upload(params, (err, data) => {
//       if (err) {
//         console.log(err);
//         reject(err);
//       }
//       return resolve(data);
//     });
//   });
// };

// router.post(
//   "/profile-image",
//   upload.single("image"),
//   async (req, res, next) => {
//     const { name, email, password, user_name } = req.body;
//     try {
//       const user = User.find({ email });
//       if (user) {
//         return res
//           .status(400)
//           .json({ failed: "User with this email already exists" });
//       }

//       const userName = User.find({ user_name });
//       if (userName) {
//         return res
//           .status(400)
//           .json({ failed: "User with this user name exists" });
//       }

//       let imageUrl;

//       try {
//         const result = await uploadToS3(req.file.buffer);
//         console.log(result.location);
//         imageUrl = result.location;
//       } catch (err) {
//         console.log(err);

//         return next("Failed to upload image");
//       }

//       const saveUser = new Product({
//         name,
//         email,
//         password,
//         user_name,
//         image,
//       });

//       await saveUser.save();
//       return res.status(200).send(saveUser);
//     } catch (e) {
//       console.log(e);
//     }
//   }
// );
// module.exports = router;
