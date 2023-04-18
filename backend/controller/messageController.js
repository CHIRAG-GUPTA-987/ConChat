const Chat = require("../Models/chatModel");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    res.status(400);
    throw new Error("Unable to send messages at the moment");
  }
  try {
    const chat = Chat.find({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });
    if (chat) {
      let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
      };
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "username displayPicture");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "username displayPicture",
      });
      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message,
      });
      return res.json(message);
    } else {
      res.status(401);
      throw new Error("Unauthorized access");
    }
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
};

const fetchMessages = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;
  try {
    const chat = Chat.find({
      _id: chatId,
      users: { $elemMatch: { $eq: req.user._id } },
    });
    if (chat) {
      let messages = await Message.find({ chat: chatId })
        .populate("sender", "username displayPicture")
        .populate("chat");
      return res.json(messages);
    } else {
      res.status(401);
      throw new Error("Unauthorized access");
    }
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
};

module.exports = { sendMessage, fetchMessages };
