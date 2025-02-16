import OpenAI from "openai";
import 'dotenv/config'; 
import {writeFile} from "fs"; 
import {getTemplate, secondPart} from "./code_generation/preGeneration.js"; 
const peripherals = ["lcd I2C", "stepper motor", "servo motor", "switch outptu 1", "gas sensor"]; 


const content = getTemplate(peripherals); 


const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY 
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": content},
  ],
});

// completion.then((result) => {console.log(result.choices[0].message.content)});
completion.then(response => {
  // Extract the response text
  var responseText = response.choices[0].message.content;
  responseText = filterPy(responseText); 
  responseText += secondPart(); 

  // Write the response to a file
  writeFile('response.py', responseText, (err) => {
      if (err) {
          console.error('Error writing to file', err);
      } else {
          console.log('Response written to response.py');
      }
  });
})

function filterPy(content){
  content = content.substring('```python'.length , content.length);
  content = content.substring(0 , content.indexOf('```'));
  return content; 
}
