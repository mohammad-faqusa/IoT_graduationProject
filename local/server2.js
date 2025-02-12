import express from "express"; 
import http from "http"; 
import {Server} from "socket.io"; 
import bodyParser from "body-parser";

import flash , {readArduinoFiles} from "./flash.js"; 


const app = express();
const server = http.createServer(app);  // Attach Express to HTTP server
const io = new Server(server);  // Attach Socket.IO to the same server


var arduinoFiles = [] ;
var monitorData = "" ;  
var enableMonitor = false; 
var mosquittoTopics =  [] ; 
var telemetryMessages = "" ; 
var enableMessage = false ; 
var enableTopic = true ; 


// Serve static files (optional)
app.set('view engine', 'ejs');
// app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Render EJS views
app.set("view engine", "ejs");



// Route to render the page
app.get("/", (req, res) => {
    res.render("pages/home");
});

app.get("/add", (req, res)=> {
    readArduinoFiles(getArduinoFiles); 
    setTimeout(()=>{
        res.render("pages/add", {arduinoFiles:arduinoFiles});
    }, 500); 
});

app.get("/page1", (req, res)=>{
    res.render("page1"); 
}); 

// app.post("/add", (req, res)=>{
//     const fileName = req.body.arduinoFile;
//     console.log(fileName); 
//     // flash(fileName);
// });

// app.post("/add/generate", (req, res)=>{
//     const espName = req.body.esp_name; 
//     console.log(espName); 
//     generateFile(espName); 
//     readArduinoFiles(getArduinoFiles); 
//     setTimeout(()=>{
//         res.redirect("/add"); 
//     }, 500)
    
// })

// Socket.IO connection event
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for messages from the client
    socket.on("message", (data) => {
        console.log("Received message from ", socket.id , data);
        socket.emit("message", data); 
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

function getArduinoFiles(arrFiles){
    arduinoFiles = arrFiles; 
};
