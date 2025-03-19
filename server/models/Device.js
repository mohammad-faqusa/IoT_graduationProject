const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create a schema for the class
const deviceSchema = new Schema({
  id: {
    type: Number, // Assuming 'id' is a string, modify this if it's another type (e.g., Number, ObjectId)
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String, // Assuming location is a string, modify if it's more complex (e.g., an object with coordinates)
    required: true,
  },
  dictVariables: {
    type: Map,
    of: Schema.Types.Mixed, // This allows for flexible key-value pairs
    required: true,
  },
  image: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/7083/7083924.png', // Default image URL
  },
  status: {
    type: String,
    default: 'offline',
  },
  automatedFunctions: {
    type: [Schema.Types.Mixed], // Array of any type, can store functions or any objects
    default: [],
  },
  info: {
    type: Map, // Assuming `info` is a string. You can modify this if it's more complex
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create the model based on the schema
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
