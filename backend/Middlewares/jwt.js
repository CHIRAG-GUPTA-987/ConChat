const jwt = require("jsonwebtoken");

module.exports.generateToken = async (id) => {
  return jwt.sign({ id }, process.env.JSONWEBSECRET, {
    expiresIn: "30d",
  });
  jwt.sign();
};
