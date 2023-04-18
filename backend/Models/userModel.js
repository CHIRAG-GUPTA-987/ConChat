const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userModel = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    displayPicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dxgbebpzs/image/upload/v1678201520/Conchat/ba9fd6137076385.Y3JvcCwzNzY3LDI5NDcsMCwyNzk_ie0sfv.jpg",
    },
  },
  {
    timestamps: true,
  }
);
userModel.plugin(passportLocalMongoose);

const User = mongoose.model("User", userModel);
module.exports = User;
