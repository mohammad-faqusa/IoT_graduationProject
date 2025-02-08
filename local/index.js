const express = require("express"); 

const app = express(); 
const port = 3000; 


app.use(express.static('public')); 

app.get("/", (req,res)=> {
    res.render("index.html"); 
})

app.post("/add", (req, res)=>{
    console.log(req.body); 
    flashEsp(); 
    res.redirect("/"); 

})
app.listen(port, ()=>{
    console.log("the server is running on localhost:" + port); 
})  

function flashEsp(){

    var spawn = require('child_process').spawn;
    var child = spawn("powershell.exe",  ["./arduino-cli_1.1.1_Windows_64bit/hello.ps1" , 'ex1', './arduino-cli_1.1.1_Windows_64bit/']);

    // You can also use a variable to save the output 
    // for when the script closes later
    var scriptOutput = "";

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data) {
        //Here is where the output goes
        data=data.toString();
        scriptOutput+=data;
        if (data == '\n' || data.length > 50 ) {
            console.log(scriptOutput); 
            scriptOutput = "" ; 
        }
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
        //Here is where the error output goes

        console.log('stderr: ' + data);

        data=data.toString();
        scriptOutput+=data;
    });

    child.on('close', function(code) {
        //Here you can get the exit code of the script

        console.log('closing code: ' + code);

        console.log('Full output of script: ',scriptOutput);
});

}