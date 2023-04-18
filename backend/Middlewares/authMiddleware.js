const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const expressAsyncHandler = require("express-async-handler");

module.exports.isLoggedIn = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodeToken = jwt.verify(token, process.env.JSONWEBSECRET);
      req.user = await User.findById(decodeToken.id).select("-password");
      next();
    } catch (e) {
      res.status(401);
      throw new Error("Not authorised, token failed");
    }
  } else {
    res.status(404);
    throw new Error("Authentication can't be possible at the moment");
  }
});
