const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create a schema for the class
const PeripheralSchema = new Schema({
    name: String,
    readable: Boolean,
    writable: Boolean,
    io_type: String,
    data_type: String,
    library: String,
    range: mongoose.Schema.Types.Mixed
});

// Create the model based on the schema

const peripherals = [
    {
      "name": "servo",
      "readable": false,
      "writable": true,
      "io_type": "output",
      "data_type": "int",
      "range": { "min": 0, "max": 180 }
    },
    {
      "name": "dht",
      "readable": true,
      "writable": false,
      "io_type": "input",
      "data_type": "object",
      "range": {
        "temperature": { "min": -40, "max": 80 },
        "humidity": { "min": 0, "max": 100 }
      }
    },
    {
      "name": "motion",
      "readable": true,
      "writable": false,
      "io_type": "input",
      "data_type": "boolean",
      "range": null
    },
    {
      "name": "gas_sensor",
      "readable": true,
      "writable": false,
      "io_type": "input",
      "data_type": "float",
      "range": { "min": 0, "max": 1023 }
    },
    {
      "name": "switch",
      "readable": true,
      "writable": true,
      "io_type": "input/output",
      "data_type": "boolean",
      "range": null
    },
    {
      "name": "led",
      "readable": false,
      "writable": true,
      "io_type": "output",
      "data_type": "boolean",
      "range": null
    },
    {
      "name": "accelorometer",
      "readable": true,
      "writable": false,
      "io_type": "input",
      "data_type": "object",
      "range": {
        "x": { "min": -2, "max": 2 },
        "y": { "min": -2, "max": 2 },
        "z": { "min": -2, "max": 2 }
      }
    },
    {
      "name": "encoder",
      "readable": true,
      "writable": false,
      "io_type": "input",
      "data_type": "int",
      "range": { "min": 0, "max": null }
    }
  ];

const Peripheral = mongoose.model('Peripheral', PeripheralSchema);

// Peripheral.insertMany(peripherals).then(() => console.log('Inserted!')).catch(err => console.error(err));



module.exports = Peripheral;

