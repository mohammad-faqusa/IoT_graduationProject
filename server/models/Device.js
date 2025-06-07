const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deviceSchema = new Schema(
  {
    id: Number,
    name: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    dictVariables: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/7083/7083924.png",
    },
    status: {
      type: String,
      default: "offline",
    },
    automatedFunctions: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // <-- references the User model
      required: true,
    },
    connectionPins: {
      type: Map,
      of: Object, // <── each entry can be {}, { pin: 5 }, { pin_id: 15 }, etc.
      default: {}, // start empty
    },
  },
  { timestamps: true }
);

deviceSchema.pre("save", async function (next) {
  const docs = await mongoose.model("Device").find({}).sort("-id");

  const plist = [];

  this.dictVariables.keys().forEach((element) => {
    plist.push(element);
  });

  if (!docs[0]) {
    this.id = 1;
  } else {
    this.id = docs[0].id + 1;
  }

  return next();
});

deviceSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error(`Duplicate key error: ${JSON.stringify(error.keyValue)}`));
  } else {
    next(error);
  }
});

// Create the model based on the schema
const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
