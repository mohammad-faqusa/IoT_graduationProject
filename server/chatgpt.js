const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// import OpenAI from "openai";
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
async function callChatgpt() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "hello, how are you ",
    text: {
      format: {
        type: "text",
      },
    },
    reasoning: {},
    tools: [],
    temperature: 1,
    max_output_tokens: 2048,
    top_p: 1,
    store: true,
  });

  console.log(response.output_text);
}
callChatgpt();
