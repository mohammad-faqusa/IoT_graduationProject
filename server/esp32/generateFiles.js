const fs = require("fs");
const path = require("path");
// const dotenv = require('dotenv')

// dotenv.config({path: './../.env'})

// require('./../database.js')

// const Peripheral = require(path.join(__dirname + '/../models/Peripheral.js'))

const { mainTemplate, bootTemplate } = require(path.join(
  __dirname,
  "templates"
));

const generateFiles = async (id, pList) => {
  const pDB = await Peripheral.find();
  console.log(pDB);

  let p = {};

  pList.forEach((element) => {
    console.log("this is element : ", element);
    // const pDoc = pDB.find(p => p.name === element)
    // console.log('this is pDoc : ', pDoc)
    p[element] = { func: "", library: "", call: "" };
    p[element].func = generateRandomIntFunc(element);
    p[element].library = "random";
    p[element].call = callRandomIntFunc(element, 0, 180);
    // p[element].writable = pDoc.writable
    // p[element].readable = pDoc.readable
  });

  let content = "";
  let libraries = "";
  let functions = "";
  let callfunctions = "print(";
  let writtenLibraries = [];
  let pDictPython = "";
  let initP = "";
  let newLine = `
`;
  let tap = `    `;

  Object.entries(p).forEach(([key, val]) => {
    libraries += writtenLibraries.includes(val.library)
      ? ""
      : `import ${val.library}\n`;
    writtenLibraries.push(val.library);
    initP += `p['${key}'] = ''\n`;
    functions += `${val.func}\n`;
    pDictPython += `p['${key}'] = ${val.call}${newLine + tap + tap}`;
    callfunctions += `'\\n${key}:', p['${key}'],`;
    // await client.subscribe('esp32/device_1/Mouse/req', 1)
    // subscribe_topics+= `await client.subscribe('esp32/${id}/${key}/req', 1)${newLine+tap}`
  });
  callfunctions += '"\\n")';

  let body = `
async def main(client):
    global p
    global readP
    global readAll
    global currentTopic
    global pSelected

    await client.connect()
    n = 0
    while True:
        await asyncio.sleep(1)
        print('publish', n)
        ${pDictPython}
        p['id'] = ${id}
        ${callfunctions}
        await asyncio.sleep(1)
        if readP:
            await client.publish(currentTopic , json.dumps(pSelected), qos = 1)
            readP = False
        if readAll:
            await client.publish('esp32/${id}/getDict' , json.dumps(p), qos = 1)
            readAll = False
        await asyncio.sleep(1)
        await client.publish('esp32/status', '${id}', qos = 1)
        n += 1

${functions}
`;

  fs.writeFileSync(
    `${__dirname}/espFiles/main.py`,
    mainTemplate(id, body, libraries, initP)
  );
  fs.writeFileSync(`${__dirname}/espFiles/boot.py`, bootTemplate());
};

function generateRandomIntFunc(pName) {
  return `
def ${pName}(min_val, max_val):
    return random.randint(min_val, max_val)
    `;
}

function callRandomIntFunc(pName, min, max) {
  return `${pName}(${min}, ${max})`;
}

module.exports = generateFiles;
