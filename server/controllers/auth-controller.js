const User = require("../models/user-model");
const bcrypt = require("bcrypt");

const home = async (req, res) => {
  try {
    res.status(200).send("This is home page using controller");
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res) => {
  try {
    // console.log(req.body);

    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ msg: "User Already Exists" });
    }
    const saltround = 10;
    const hash_password = await bcrypt.hash(password, saltround);

    const userCreated = await User.create({
      username,
      email,
      phone,
      password: hash_password,
    });

    res.status(200).json({
      msg: userCreated,
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
    // res.status(201).send("registration running");
  } catch (error) {
    // res.status(500).json("internal  server error")
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide both email and password" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    res.status(200).json({
      msg: "Login SuccessFull",
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
      username: userExist.username.toString(),
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


module.exports = { home, register, login };
