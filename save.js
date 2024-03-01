const AWS = require("aws-sdk");
const dotenv = require("dotenv");

require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multer = require("multer");
dotenv.config();
const bucketName = process.env.BUCKET;
const awsConfig = {
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
};
const S3 = new AWS.S3(awsConfig);

const upload = multer({
  limits: 1024 * 1024 * 5,
  fileFilter: function (req, file, done) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    )
      done(null, true);
    else {
      done("File type is not supported", false);
    }
  },
});

const uploadToS3 = async (fileData, fileName) => {
  const fileExtension = fileName.split(".").pop();
  return new Promise((reject, resolve) => {
    const params = {
      Bucket: bucketName,
      Key: `${Date.now().toString()}.${fileExtension}`,
      Body: fileData,
      // ContentDisposition: "inline",
    };
    S3.upload(params, (err, data) => {
      if (err) {
        console.log("error");
        return reject(err);
      }
      return resolve(data);
    });
  });
};
