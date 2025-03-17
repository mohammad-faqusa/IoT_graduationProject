const mqtt = require('mqtt');

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
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);
});

// Handle errors
client.on('error', (err) => {
  console.error('Connection error:', err);
});
