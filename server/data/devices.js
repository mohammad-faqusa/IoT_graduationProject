const Device = require('./../classes/Device')


// constructor(id, name, dictVariables){

const devices =[]; 

const dev1 = new Device(0, 'oven', 'kitchen', {led: true, servo: 14, lcd: 'kitchen'}, 'https://static.wixstatic.com/media/fd9026_2278803b508a4a38b4b8dc730540d246~mv2.jpg/v1/fill/w_1000,h_1000,al_c,q_85/fd9026_2278803b508a4a38b4b8dc730540d246~mv2.jpg')
const dev2 = new Device(1, 'window', 'bedroom', {led: false, buzzer: true, dht: {temp: 15, humidity: 20}}, 'https://www.self-build.co.uk/wp-content/uploads/2022/09/Casement-Norrsken.webp')
const dev3 = new Device(2, 'waterflow', 'yard', {motion: true, ultraSonic: 140},'https://www.shutterstock.com/shutterstock/videos/3915959/thumb/1.jpg?ip=x480' )

devices.push(dev1);
devices.push(dev2);
devices.push(dev3);



module.exports = devices; 
