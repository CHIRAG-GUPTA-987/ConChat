const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.brightMagenta.bold
    );
  } catch (e) {
    console.log(`Error: ${e.message}`.bgBrightMagenta);
    process.exit();
  }
};
module.exports = connectDB;
