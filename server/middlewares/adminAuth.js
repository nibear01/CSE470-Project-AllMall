const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const adminAuth = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Token not provided!" 
    });
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    // Verify token
    const decoded = jwt.verify(jwtToken, process.env.JWT_TOKEN);
    console.log(decoded);
    

    // Attach user to req
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    req.user = user;

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    // res.status(200).json({ success: true, message: "Admin verified" });
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = adminAuth;
