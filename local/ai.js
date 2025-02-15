import OpenAI from "openai";
import 'dotenv/config'; 
import {writeFile} from "fs"; 
const peripherals = ["lcd I2C", "stepper motor", "servo motor", "switch outptu 1", "gas sensor"]; 


const content = `


// ** required libraries for peripherals if required


// ** initialize pins for peripherals, addresses for I2C pins :

// ** list all methods to read/write values for each peripheral

struct VariablesDict
{
    // ** map all read methods of input peripherals and output peripherals to VariablesDict keys 
} variables_dict;

String get_variable_types()
{
    DynamicJsonDocument doc(1024);
    // ** list all variables types and their ranges , each variable mapped : doc["peripheral"]["type"], doc["peripheral"]["range"]

    String output;
    serializeJson(doc, output);
    return output;
}

String get_peripheral_pins()
{
    DynamicJsonDocument doc(1024);
    // ** mapp all pins into doc dictionary ;

    String output;
    serializeJson(doc, output);
    return output;
}

void update_variables_dict()
{
    // ** loop through VariablesDict and update their values by reading the peripherals status
}
void set_peripherals_values(output_vairables_dict){
    // ** map output_variables_dict to all write methods of output peripherals 
}
`; 


const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY 
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": `please fell this code template using peripherals ${peripherals} at this code template ${content}, just write the template code with no addtional comments`},
  ],
});

// completion.then((result) => {console.log(result.choices[0].message.content)});
completion.then(response => {
  // Extract the response text
  const responseText = response.choices[0].message.content;

  // Write the response to a file
  writeFile('response.txt', responseText, (err) => {
      if (err) {
          console.error('Error writing to file', err);
      } else {
          console.log('Response written to response.txt');
      }
  });
})