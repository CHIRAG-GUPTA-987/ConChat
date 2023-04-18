const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const { isLoggedIn } = require("../Middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  killGroup,
} = require("../controller/chatController");

const router = express.Router();

router.route("/").post(isLoggedIn, expressAsyncHandler(accessChat));
router.route("/").get(isLoggedIn, expressAsyncHandler(fetchChats));
router
  .route("/group/new")
  .post(isLoggedIn, expressAsyncHandler(createGroupChat));
router.route("/group/rename").put(isLoggedIn, expressAsyncHandler(renameGroup));
router.route("/group/adduser").put(isLoggedIn, expressAsyncHandler(addToGroup));
router
  .route("/group/remove")
  .put(isLoggedIn, expressAsyncHandler(removeFromGroup));
router.route("/group/kill").delete(isLoggedIn, expressAsyncHandler(killGroup));

module.exports = router;
