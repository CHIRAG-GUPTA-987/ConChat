const User = require("../Models/userModel");
const createUserName = require("../Middlewares/username");
const { generateToken } = require("../Middlewares/jwt");

module.exports.loginUser = async (req, res) => {
  const generatedToken = await generateToken(req.user._id);
  res.status(201).json({
    username: req.user.username,
    firstName: req.user.firstName,
    displayPicture: req.user.displayPicture,
    email: req.user.email,
    authToken: generatedToken,
    lastName: req.user.lastName,
    id: req.user._id,
  });
};

module.exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, displayPicture } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).send("User already exists");
  }
  const username = await createUserName(firstName, email);
  let user = {};
  console.log(displayPicture);
  if (displayPicture === "")
    user = await new User({
      firstName,
      lastName,
      email,
      username,
    });
  else
    user = await new User({
      firstName,
      lastName,
      email,
      displayPicture,
      username,
    });
  const newUser = await User.register(user, password);
  console.log(newUser);
  res.status(201).json({
    userName: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    displayPicture: newUser.displayPicture,
    authToken: await generateToken(newUser._id),
    id: newUser._id,
  });
};

module.exports.allUsers = async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { username: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keywords).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
};
