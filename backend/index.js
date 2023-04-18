const express = require("express");
const data = require("./data/data");
const colors = require("colors");
const cors = require("cors");
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");
const flash = require("express-flash");
const { notFound } = require("./Middlewares/notFound");
const { errorHandler } = require("./Middlewares/errorHandler");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const userModel = require("./Models/userModel");

const app = express();
const PORT = process.env.PORT;
const sess = {
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
};

app.use(express.json());
app.use(session(sess));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(cors());
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`.brightCyan.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: "http://localhost:3000",
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });
  socket.on("Join Chat", (room) => {
    socket.join(room);
  });
  socket.on("New Message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("Chat users not available");
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("Message Recieved", newMessageRecieved);
    });
  });
  socket.on("Typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("Stop Typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.off("setup", (user) => {
    console.log("User Disconnected");
    socket.leave(user.id);
  });
});
