const express = require("express");
const path = require("path");
const userControllers = require(path.join(
  __dirname,
  "./../controllers/userControllers.js"
));
const passport = require("passport");
require(path.join(__dirname, "../config/passport"))(passport); // you’ll define this

const router = express.Router();

// Handle GET and POST requests on '/'
router.post("/register", userControllers.userRegister);
router.get("/register", userControllers.getRegisterPage);
router.get("/login", userControllers.getLoginPage);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
