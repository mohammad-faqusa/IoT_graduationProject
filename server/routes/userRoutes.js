const express = require("express");

const path = require("path");
const userControllers = require(path.join(
  __dirname,
  "./../controllers/userControllers.js"
));

const passport = require("passport");
require(path.join(__dirname, "../config/passport"))(passport); // you’ll define this
const jwt = require("jsonwebtoken");

const router = express.Router();

// Handle GET and POST requests on '/'
router.get("/", ensureAuthenticated, (req, res) => {
  res.redirect("/dashboard");
});
router.post("/register", userControllers.userRegister);
router.get("/register", userControllers.getRegisterPage);
router.get("/login", userControllers.getLoginPage);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error_msg", info.message);
      return res.redirect("/login");
    }

    // Establish session for browser routes
    req.login(user, (err) => {
      if (err) return next(err);

      // Issue JWT for Socket.IO
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 1000,
      });

      return res.redirect("/dashboard");
    });
  })(req, res, next);
});

// Auth middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
