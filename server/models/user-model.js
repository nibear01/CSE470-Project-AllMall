const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userschema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    default: "",
  },
  image: {
    type: String, 
    default: "",
  },
  address : {
    type: String,
    default: "AboyNagar, Dhaka-Bangladesh"
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true} );

//JSON web tokens
userschema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const User = new mongoose.model("User", userschema);
module.exports = User;

