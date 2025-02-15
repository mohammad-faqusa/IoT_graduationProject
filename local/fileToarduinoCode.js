import {readFile, writeFile} from "fs"; 

var content = '' 

readFile( "./response.txt", 'utf8', (err , data)=>{
    if (err) 
        console.log(err)
    else {
        content = data ; 
        content = skipHead("```cpp", content);
        // console.log(content);
        content = skipTail("```", content); 
        console.log(content); 
        writeFile('./processedResponse.ino', content, (err)=>{
            if (err)
                console.log(err);
            else
                console.log('the processed response is written successfully'); 
        })
    }
 }); 


 function skipHead(word , content){
     return content.substring(content.indexOf(word)+ word.length , content.length);
    }
    
function skipTail(word, content) {
    return content.substring(0 , content.indexOf(word));
 }



