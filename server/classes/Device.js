


class Device {
    constructor(id, name, location,  dictVariables, image = 'https://cdn-icons-png.flaticon.com/512/7083/7083924.png'){
        this.id = id;
        this.name = name;
        this.location = location; 
        this.dictVariables = dictVariables;
        this.image = image
        this.status = 'offline' 
        this.automatedFunctions = [];
        this.info = this.getInfo()
    }
    setVariable(varDoc, value){
        this.dictVariables[varDoc] = value
    }
    getVariable(varDoc){
        return this.dictVariables[varDoc]
    }

    getInfo(){
        const info = {
            id: this.id,
            name: this.name,
            location: this.location,
            image: this.image,
            status: this.status,
        }
        for (const [key, value] of Object.entries(this.dictVariables)) {
            info[key] = JSON.stringify(value)
        }
        return info 
    }
    
    
    addAutomate(inputDevice, outputDevice, logic){
        // generate a function in micropython langauge then write it on esp32 later 

    }
    
}


module.exports = Device; 