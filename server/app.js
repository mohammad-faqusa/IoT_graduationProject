const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
require(path.join(__dirname, "./config/passport"))(passport); // you’ll define this
const flash = require("connect-flash");

const devicesRouter = require("./routes/devicesRoutes");
const addDeviceRouter = require("./routes/addDeviceRoutes");
const dashboardRouter = require("./routes/dashboard");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Flash middleware (after session and before routes)
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// Optionally set flash messages globally for templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); // passport sets errors to `error`
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", userRouter);
app.use("/devices", ensureAuthenticated, devicesRouter);
app.use("/addDevice", ensureAuthenticated, addDeviceRouter);
app.use("/dashboard", ensureAuthenticated, dashboardRouter);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = app;
