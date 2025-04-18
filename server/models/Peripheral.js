const mongoose = require("mongoose");

const AttributeSchema = new mongoose.Schema({
  dataType: String,
  default: mongoose.Schema.Types.Mixed,
  unit: String,
  access: {
    type: String,
    enum: ["read-only", "write-only", "read-write"], // ✅ Add it here
  },
  allowedValues: [mongoose.Schema.Types.Mixed],
  values_meaning: mongoose.Schema.Types.Mixed, // Object with key-value pairs
  purpose: String,
  range: {
    min: Number,
    max: Number,
  },
  prefix: String,
});

const MethodSchema = new mongoose.Schema({
  returns: {
    dataType: String,
    unit: String,
    range: {
      min: Number,
      max: Number,
    },
  },
  purpose: String,
});

const PeripheralSchema = new mongoose.Schema({
  name: { type: String, required: true },
  library_name: { type: String, required: true },
  class_name: { type: String, required: true },
  attributes: {
    type: Map,
    of: AttributeSchema,
  },
  methods: {
    type: Map,
    of: MethodSchema,
  },
});

module.exports = mongoose.model("Peripheral", PeripheralSchema);
