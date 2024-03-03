const errorM = (err, req, res, next) => {
  return res.status(400).json({ success: false, msg: err });
};
module.exports = errorM;
