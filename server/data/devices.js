const Device = require('./../classes/Device')


// constructor(id, name, dictVariables){

const devices =[]; 

const dev1 = new Device(0, 'kitchen', {led: true, servo: 14, lcd: 'kitchen'})
const dev2 = new Device(1, 'bedroom', {led: false, buzzer: true, dht: {temp: 15, humidity: 20}})
const dev3 = new Device(2, 'yard', {motion: true, ultraSonic: 140})

devices.push(dev1);
devices.push(dev2);
devices.push(dev3);



module.exports = devices; 
