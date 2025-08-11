const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(400).json({ msg: "Invalid HTTP, Token not provided!" });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  //   console.log("Token: ", jwtToken);

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_TOKEN);

    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0,
    });

    req.user = userData
    req.token = token 
    req.userID = userData._id 
    // console.log("req data: ",req);
    // console.log("user data: ",userData);

    next();
  } catch (error) {
    res.status(400).json({ msg: "Invalid HTTP, Token not provided!" });
  }
};

module.exports = authMiddleware;
