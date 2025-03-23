const mqtt = require('mqtt')

const client = mqtt.connect('mqtt:localhost');

let id = 0 ; 

setInterval(() => {
    if(id > 10 ) 
        id = 0; 
    client.publish(`esp32/status`, `${id}`)
    id++; 

}, 1000);