const mongoose = require("mongoose");

const DB = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(DB)
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));
