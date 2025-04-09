const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({path: './../.env'})

require('./../database.js')

const Peripheral = require('./../models/Peripheral.js')

const generateFiles = async () => {

    const selectedP = [ 'servo', 'switch', 'led' ]

    const selectedPeripherals =  (await Peripheral.find()).filter(p => selectedP.includes(p.name)); 
    // console.log(peripherals)
    // const inputPlist = peripherals.filter(p=> p.readable).map(p => p.name);
    // const outputPlist = peripherals.filter(p=> p.writable).map(p => p.name);



    selectedPeripherals.forEach(p => {
        console.log(p); 
        if(p.readable){
            const readFunc = 
        }
        if(p.writable){

        }
    })

    
}


// module.exports = generateFiles; 



generateFiles()