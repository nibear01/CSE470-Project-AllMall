const mongoose = require('mongoose');

// const URI = "mongodb://127.0.0.1:27017/AllMall";
const URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connection successfull!");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(0);
  }
}

module.exports = connectDb;

