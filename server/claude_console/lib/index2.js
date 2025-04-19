// const callClaude = require("./index.js");

// index2.js
const callClaude = require("./index.js");

(async () => {
  try {
    await callClaude(
      "hi, I want to use your api for micropython esp32 code generation"
    );
  } catch (err) {
    console.error("Error calling Claude:", err);
  }
})();
