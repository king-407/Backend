const { S3 } = require("aws-sdk");
require("dotenv").config();
const s3Uploadv2 = async (file) => {
  const awsConfig = {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
  };
  const s3 = new S3(awsConfig);
  const param = {
    Bucket: process.env.BUCKET,
    Key: `uploads/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
  };
  return await s3.upload(param).promise();
};
module.exports = s3Uploadv2;
