const express = require("express");
const passport = require("passport");
const expressAsyncHandler = require("express-async-handler");

const { isLoggedIn } = require("../Middlewares/authMiddleware");
const {
  loginUser,
  registerUser,
  allUsers,
} = require("../controller/userController");

const router = express.Router();

router.route("/").get(isLoggedIn, expressAsyncHandler(allUsers));
router.route("/login").post(
  passport.authenticate("local", {
    failureFlash: false,
    failureRedirect: "/",
  }),
  expressAsyncHandler(loginUser)
);
router.route("/register").post(expressAsyncHandler(registerUser));

module.exports = router;
