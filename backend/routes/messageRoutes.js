const express = require("express");
const { isLoggedIn } = require("../Middlewares/authMiddleware");
const router = express.Router();
const {
  sendMessage,
  fetchMessages,
} = require("../controller/messageController");
const expressAsyncHandler = require("express-async-handler");

router.route("/").post(isLoggedIn, expressAsyncHandler(sendMessage));
router
  .route("/fetch/:chatId")
  .get(isLoggedIn, expressAsyncHandler(fetchMessages));

module.exports = router;
