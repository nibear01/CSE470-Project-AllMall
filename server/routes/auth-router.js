const express = require("express");
const router = express.Router();
// const { home, register } = require("../controllers/auth-controller");
const authcontrollers = require("../controllers/auth-controller");

//using controllers
router.route("/").get(authcontrollers.home);
router.route("/register").post(authcontrollers.register);
router.route("/login").post(authcontrollers.login);


module.exports = router; 
