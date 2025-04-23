"use strict";
const Anthropic = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");
const fs = require("fs");
// import dotenv from "dotenv";
dotenv.config({ path: "./../.env" });
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});
async function callClaude(prompt, shifted) {
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  if (shifted) {
    return await msg.content[0].text
      .replace(/^```python\s*|\s*```$/g, "")
      .split("\n")
      .map((line) => "    " + line)
      .join("\n");
  } else {
    return await msg.content[0].text.replace(/^```python\s*|\s*```$/g, "");
  }
}
// callClaude();
module.exports = callClaude;
