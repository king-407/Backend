const errorM = (err, req, res, next) => {
  return res.status(500).json({ success: false, err });
};
module.exports = errorM;
