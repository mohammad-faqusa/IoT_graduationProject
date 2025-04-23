"use strict";
const Anthropic = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");
const fs = require("fs");
// import dotenv from "dotenv";
dotenv.config({ path: "./../.env" });
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});
async function callClaude(prompt, outputPath) {
  const msg = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  //   console.log(msg.content[0].text);
  const input = `\`\`\`python
// your code here
\`\`\``;

  const output = msg.content[0].text.replace(/^```python\s*|\s*```$/g, "");

  fs.writeFileSync(outputPath, output);
}
// callClaude();
module.exports = callClaude;
