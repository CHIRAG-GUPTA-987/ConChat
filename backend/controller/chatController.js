const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

module.exports.accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(404);
    throw new Error("User not found");
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username displayPicture email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (e) {
      res.status(400);
      throw new Error(e.message);
    }
  }
};

module.exports.fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username displayPicture email",
        });
        res.status(200).send(results);
      });
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
};

module.exports.createGroupChat = async (req, res) => {
  try {
    const groupChat = await Chat.findOne({
      chatName: req.body.groupName,
      groupAdmin: req.user,
    });
    if (groupChat) return res.status(409).send("Chat already exists");
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
  if (!req.body.users || !req.body.groupName) {
    return res
      .status(400)
      .send({ message: "Unable to create group chat at the moment" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("Unable to create group chat of two users only");
  }
  users.unshift(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.groupName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
};

module.exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const chatToUpdate = await Chat.findById(chatId);
  if (!chatToUpdate) {
    res.status(400);
    throw new Error("Chat not found");
  }
  if (!chatToUpdate.groupAdmin.equals(req.user._id)) {
    res.status(401);
    throw new Error("Only group admins can change group metadata");
  }
  try {
    const groupChat = await Chat.findOne({
      chatName: chatName,
      groupAdmin: req.user,
    });
    if (groupChat)
      return res.status(409).send("Another chat with same name already exists");
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
  if (chatToUpdate.chatName === chatName) {
    res.status(400).json({ message: "Chat already exists with same name" });
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
};

module.exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const chatToUpdate = await Chat.findById(chatId);
  if (!chatToUpdate) {
    res.status(400);
    throw new Error("Chat not found");
  }
  if (!req.user._id.equals(chatToUpdate.groupAdmin)) {
    res.status(401);
    throw new Error("Unauthorized access");
  }
  if (chatToUpdate.isGroupChat === false) {
    res.status(400);
    throw new Error("Can't add users to one on one chat");
  }
  for (let user of chatToUpdate.users) {
    if (user.equals(userId)) {
      res.status(400);
      throw new Error("Can't add single user multiple times");
    }
  }
  const added = await Chat.findByIdAndUpdate(chatId, {
    $push: { users: userId },
  });
  if (!added) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    const chat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.json(chat);
  }
};

module.exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const chatToUpdate = await Chat.findById(chatId);
  if (!chatToUpdate) {
    res.status(404);
    throw new Error("Chat not found");
  }
  if (!req.user._id.equals(chatToUpdate.groupAdmin)) {
    res.status(401);
    throw new Error("Unauthorized access");
  }
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(404);
    throw new Error("Chat not found");
  } else res.json(removed);
};

module.exports.killGroup = async (req, res) => {
  const { chatId } = req.body;
  const chatToDelete = await Chat.findById(chatId);
  if (!chatToDelete) {
    res.status(400);
    throw new Error("Chat not found");
  }
  if (
    chatToDelete.groupAdmin &&
    !chatToDelete.groupAdmin.equals(req.user._id)
  ) {
    res.status(401);
    throw new Error("Unauthorized access");
  }
  if (chatToDelete.isGroupChat === false) {
    res.status(400);
    throw new Error("Unable to delete one on one chats at the moment");
  }
  const delChat = await Chat.findByIdAndDelete(chatId);
  if (!delChat) {
    res.status(400);
    throw new Error("Unable to delete the group at the moment");
  } else res.json(delChat);
};
