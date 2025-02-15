import express, { query } from "express"; 
import bodyParser from "body-parser";
import flash , {readArduinoFiles} from "./flash.js"; 
import path from "path"; 
import {readPorts, readData} from "./monitor.js"; 
import { readDataDemo, outputData} from "./pubSub.js";
import generateFile from "./generateFile.js";
import pg from "pg"; 
import 'dotenv/config'; 
import passport from "passport";



const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    password:process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE 
}); 

await db.connect();

const resultDb = await db.query("SELECT * FROM customers"); 
console.log(resultDb.rows); 
  

// console.log(process.env); 

const port = 3000; 
var comPorts = []  ; 


const app = express();
const __dirname = path.resolve();

var arduinoFiles = [] ;
var monitorData = "" ;  
var enableMonitor = false; 
var mosquittoTopics =  [] ; 
var telemetryMessages = "" ; 
var enableMessage = false ; 
var outputEnable = true ; 
 



app.set('view engine', 'ejs');
app.set("views", "views"); // Ensure it points to the correct directory

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Render EJS views

// readArduinoFiles(getArduinoFiles); 

readDataDemo(returnMessages, enableMessageFunc); 

app.get("/", (req, res)=>{
    res.render("pages/home"); 
});


app.get("/login", (req, res)=> {
    res.render("pages/login", {title:"login"}); 
})
app.post("/login", (req, res)=>{
    console.log(req.body); 
    res.redirect("/login"); 
})
app.get("/register", (req, res)=> {
    res.render("pages/login", {title:"register"}); 
})
app.post("/register", async (req, res)=>{
    console.log(req.body); 
    const username = req.body.username;
    const password = req.body.password; 
    const result = await db.query("INSERT INTO customers (email, pass) VALUES ($1 , $2);", [username, password])
    res.redirect("/register"); 
})
app.get("/add", (req, res)=>{
    console.log(arduinoFiles); 
    readArduinoFiles(getArduinoFiles); 
    res.render("pages/add", {arduinoFiles:arduinoFiles});
});

app.get("/monitor", async (req, res)=>{
    // console.log("here are the ports " ,comPorts); 
    const buttonState = enableMonitor ? "stop" : "read" ; 
    readPorts(getPorts);
    res.render("pages/monitor", {selections:comPorts, streamData:monitorData, buttonState:buttonState, action:"/monitor", selection:"file"});
    console.log(comPorts); 
}); 


app.get("/pubSub",  (req, res)=> {
    const buttonState = !enableMessage ? "stop" : "read"; 
    res.render("pages/monitor", 
        {buttonState:buttonState, action:"/pubSub", selection:"topic"});
}); 


app.get("/pubSub/info", (req, res)=>{
    if (!enableMessage) 
        telemetryMessages = "" ; 
    res.json({messages:telemetryMessages});
    telemetryMessages = "" ; 
});

app.post("/pubSub/enable" , (req, res)=>{
    console.log(req.body); 
    enableInput(req.body.enableButton);
});

app.post("/pubSub/output" , (req,res)=>{
    console.log(req.body);
    const message = req.body.led ; 

    outputData(req.body.topic, message, outputEnable, toggleEnableOutputFun);
    res.send("the message is received"); 

})


app.post("/add", (req, res)=>{
    const fileName = req.body.arduinoFile;
    flash(fileName);
    res.redirect("/add"); 
});

app.post("/add/generate", (req, res)=>{
    const espName = req.body.esp_name; 
    console.log(espName); 
    generateFile(espName); 
    readArduinoFiles(getArduinoFiles); 
    setTimeout(()=>{
        res.redirect("/add"); 
    }, 500)
    
})

app.post("/monitor", async (req, res)=> {
    enableMonitor = !enableMonitor;
    if (enableMonitor) { 
        readData(getData);
    } 
    res.redirect("/monitor"); 
});

const users = [{username:"mohammad",password:"314151"}]; 


passport.serializeUser((user, done)=>{
    done(null, user.id); 
}); 
passport.deserializeUser((user, done)=>{
    done(null, user); 
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
    telemetryMessages += message; 
}

function enableTopicFunc() {
    enableTopic = !enableTopic; 
    return enableTopic; 
}

function enableMessageFunc(){
    return enableMessage ; 
}
function enableInput(enable){
    enableMessage = enable; 
}

function toggleEnableOutputFun() {
    outputEnable = !outputEnable; 
}