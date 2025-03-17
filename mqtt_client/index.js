const mqtt = require('mqtt');
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on('connect', ()=> {
  console.log(`connected to the server with socket:id : ${socket.id}`)
})

// Connect to Mosquitto broker running locally
const client = mqtt.connect('mqtt:localhost');

// When connected
client.on('connect', () => {
  console.log('Connected to Mosquitto broker');

  // Subscribe to a topic
  client.subscribe('test/topic', (err) => {
    if (!err) {
      // Publish a message to the topic
      client.publish('test/topic', 'Hello from Node.js MQTT Client');
    }
  });
});

// When a message is received
client.on('message', (topic, message) => {
  const doc = `Received message: ${message.toString()} on topic: ${topic}`
  console.log(doc);
  socket.emit('mqttMessage', doc); 
});

// Handle errors
client.on('error', (err) => {
  console.error('Connection error:', err);
});
