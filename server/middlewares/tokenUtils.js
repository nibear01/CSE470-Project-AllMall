// Token Utility Functions
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

// Refresh access token using refresh token
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_TOKEN,
    );

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = await user.generateAccessToken();

    // Optionally generate new refresh token (rotate refresh tokens)
    const newRefreshToken = await user.generateRefreshToken();

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        userId: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// Logout - revoke refresh token
const logout = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Clear refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

module.exports = {
  refreshAccessToken,
  logout,
};
