const fs = require('fs')
const path = require('path')

const {mainTemplate, bootTemplate} = require(path.join(__dirname, 'templates'))

const generateFiles = (id, pList) => {
     
    let p = {}; 

    pList.forEach(element => {
        p[element] = {func: '', library: '', call: ''}
        p[element].func = generateRandomIntFunc(element);  
        p[element].library = 'random'
        p[element].call = callRandomIntFunc(element, 0, 180)
        
    });


    let content = ''; 
    let libraries = '';
    let functions = '';
    let callfunctions = 'print(';  
    let writtenLibraries = [];
    let pDictPython = ''; 
    let newLine = `
`
    let tap = `    `



    Object.entries(p).forEach(([key, val]) => {
        libraries += writtenLibraries.includes(val.library) ? '' : `import ${val.library}\n`;
        writtenLibraries.push(val.library)
        functions += `${val.func}\n`;
        pDictPython += `p['${key}'] = ${val.call}${newLine+tap+tap}`
        callfunctions += `'\\n${key}:', p['${key}'],`
    })
    callfunctions += '"\\n")'

    let body = `
async def main(client):
    global p
    global readP

    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(2)
        print('publish', n)
        ${pDictPython}
        p['id'] = ${id}
        ${callfunctions}
        if readP:
            await client.publish('esp32/result', json.dumps(p), qos = 1)
            readP = False
        await client.publish('esp32/status', '${id}', qos = 1)
        n += 1

${functions}
`


    fs.writeFileSync(`${__dirname}/espFiles/main.py`, mainTemplate(id, body, libraries))
    fs.writeFileSync(`${__dirname}/espFiles/boot.py`, bootTemplate())


    
}

function generateRandomIntFunc(pName) {
    return `
def ${pName}(min_val, max_val):
    return random.randint(min_val, max_val)
    `
}


function callRandomIntFunc(pName, min, max) {
    return `${pName}(${min}, ${max})`
}

module.exports = generateFiles; 

