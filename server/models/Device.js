const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create a schema for the class
const deviceSchema = new Schema({
  id: {
    type: Number, // Assuming 'id' is a string, modify this if it's another type (e.g., Number, ObjectId)
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
  }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

deviceSchema.pre('save',async function (next) {

  const docs = await mongoose.model('Device').find({}).sort('-id');

  const plist = []

  this.dictVariables.keys().forEach(element => {
    plist.push(element)
  });

  
  if (!docs[0]) {
    this.id = 1; 
  } else {
    this.id = docs[0].id + 1 ; 
  }


  return next()
});



// Create the model based on the schema
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;

