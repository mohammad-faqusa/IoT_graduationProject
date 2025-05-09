const bcrypt = require("bcryptjs");
const path = require("path");
const User = require(path.join(__dirname, "./../models/User"));

exports.userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  res.redirect("/login");
};

exports.getRegisterPage = (req, res) => {
  res.render("register", { title: "Register", errors: null });
};

exports.getLoginPage = (req, res) => {
  res.render("login", { title: "Login", errors: null });
};
