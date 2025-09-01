const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connection successfull!");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(0);
  }
};  

module.exports = connectDb;
