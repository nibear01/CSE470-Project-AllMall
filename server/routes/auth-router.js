const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const upload = require("../config/multer");

// Routes
router.route("/").get(authcontrollers.home);
router.route("/register").post(authcontrollers.register);
router.route("/login").post(authcontrollers.login);
router.route("/user").get(authMiddleware, authcontrollers.user);
router.route("/allusers").get(authcontrollers.getUsers);
router.route("/user/:id").delete(authcontrollers.deleteUser);

router
  .route("/update/user/:id")
  .put(upload.single("image"), authcontrollers.update);

module.exports = router;
