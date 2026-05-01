const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const authenticateUser = require("../middlewares/authenticate");
const { refreshAccessToken, logout } = require("../middlewares/tokenUtils");
const upload = require("../config/multer");

// Routes
router.route("/").get(authcontrollers.home);
router.route("/register").post(authcontrollers.register);
router.route("/login").post(authcontrollers.login);

// Token endpoints
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(authenticateUser, logout);

// User routes
router.route("/user").get(authenticateUser, authcontrollers.user);
router.route("/allusers").get(authcontrollers.getUsers);
router.route("/user/:id").delete(authcontrollers.deleteUser);

router
  .route("/update/user/:id")
  .put(upload.single("image"), authcontrollers.update);

module.exports = router;
