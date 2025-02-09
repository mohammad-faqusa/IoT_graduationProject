import express from "express"; 
import bodyParser from "body-parser";
import flash , {readArduinoFiles} from "./flash.js"; 
import path from "path"; 
import {readPorts, readData} from "./monitor.js"; 
import { compile } from "ejs";
import {getTopics , readMessages , readDataDemo} from "./pubSub.js";

const __dirname = path.resolve(); 

const app = express(); 
const port = 3000; 
var comPorts = []  ; 

var arduinoFiles = [] ;
var monitorData = "" ;  
var enableMonitor = false; 
var mosquittoTopics =  [] ; 
var telemetryMessages = "" ; 
var enableMessage = false ; 
var enableTopic = true ; 


app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

readArduinoFiles(getArduinoFiles); 

app.get("/", (req, res)=>{
    res.render("pages/home", {arduinoFiles:arduinoFiles}); 
});

app.get("/add", (req, res)=> {
    res.render("pages/add", {arduinoFiles:arduinoFiles});
})

app.get("/add", (req, res)=>{
    console.log(arduinoFiles); 
    readArduinoFiles(getArduinoFiles); 
    res.render("index", {arduinoFiles:arduinoFiles});
});

app.get("/monitor", async (req, res)=>{
    // console.log("here are the ports " ,comPorts); 
    const buttonState = enableMonitor ? "stop" : "read" ; 
    readPorts(getPorts);
    res.render("pages/monitor", {selections:comPorts, streamData:monitorData, buttonState:buttonState, action:"/monitor", selection:"file"});
    console.log(comPorts); 
}); 


app.get("/pubSub",  (req, res)=> {
    console.log(mosquittoTopics); 
    getTopics(returnTopics,enableTopic, enableTopicFunc);
    const buttonState = enableMessage ? "stop" : "read"; 
    
    console.log("for second time " , mosquittoTopics); 
    res.render("pages/monitor", {selections:mosquittoTopics, streamData:telemetryMessages, buttonState:buttonState, action:"/pubSub", selection:"topic"});

}); 

app.post("/pubSub",  (req, res)=> {
    
    // readMessages(returnMessages, enableMessage, enableMessageFunc, req.body.selection); 
    enableMessage = !enableMessage; 
    readDataDemo(returnMessages, enableMessage, enableTopicFunc ); 
    res.redirect("/pubSub"); 
    
}); 


app.post("/add", (req, res)=>{
    const fileName = req.body.arduinoFile;
    flash(fileName);
    res.redirect("/add"); 
});

app.post("/monitor", async (req, res)=> {
    enableMonitor = !enableMonitor; 
    if (enableMonitor) { 
        readData(getData);
    } 
    res.redirect("/monitor"); 
});

app.listen(port, ()=>{
    console.log("the server is running on localhost:" + port); 
});

function getArduinoFiles(arrFiles){
    arduinoFiles = arrFiles; 
};

function getPorts(ports){
    comPorts = [...ports]; 
}

function getData(data = "" ){
    monitorData += data; 
    console.log(enableMonitor); 
    return enableMonitor; 
}

function returnTopics(topics) {
    mosquittoTopics = topics; 
    return enableTopic; 
}

function returnMessages(message) {
    telemetryMessages= message; 
    return enableMessage; 

}

function enableTopicFunc() {
    enableTopic = !enableTopic; 
    return enableTopic; 
}

function enableMessageFunc(){
    enableMessage = !enableMessage; 
    return enableMessage; 
}