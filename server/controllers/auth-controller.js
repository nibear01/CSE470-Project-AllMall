const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

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
      return res
        .status(400)
        .json({ msg: "Please provide both email and password" });
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

const user = async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData);
    // res.status(200).json({msg: 'Works!'})
    return res.status(201).json({ userData });
  } catch (error) {
    console.log(`User error: ${error}`);
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);

    if (!userExist) {
      // Remove uploaded file if user doesn't exist
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ msg: "User does not exist!" });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (userExist.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          userExist.image.split("/").pop()
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from response

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Remove uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    if (!users) {
      return res.status(404).json({ msg: "Failed to retrive data" });
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "Users not found" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);

    if (!userDeleted) {
      res.status(401).json({ msg: "User ID not found" });
    }

    res.status(200).json({ msg: "User Deleted from the Database." });
  } catch (error) {
    res.status(500).json({ msg: `Server Error: ${error}` });
  }
};

module.exports = { home, register, login, user, update, getUsers, deleteUser };
