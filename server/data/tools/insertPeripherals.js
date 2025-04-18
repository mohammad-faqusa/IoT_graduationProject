// 1. Load dependencies
const mongoose = require("mongoose");
const Peripheral = require("../../models/Peripheral"); // path to your model file
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config({ path: "./../../.env" });

const DB = process.env.DB_CONNECTION_STRING;

// 2. Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

// 3. Define the peripherals array

const peripherals = JSON.parse(fs.readFileSync("./../peripherals.json"));

// 4. Insert the array into MongoDB
async function insertPeripherals() {
  try {
    await Peripheral.insertMany(peripherals);
    console.log("Peripherals inserted successfully!");
  } catch (err) {
    console.error("Error inserting peripherals:", err);
  } finally {
    mongoose.disconnect();
  }
}

insertPeripherals();
