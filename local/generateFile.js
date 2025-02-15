// inputs : file name (esp32 name), ssid, pass
// output : [libraries, network credentials, mqtt, setup, loop] , location of file 
import { spawn } from "child_process";
import {access, mkdir, writeFile} from "node:fs"; 

function generateFile(name, delay = 2000,  path="D:/IoT_graduationProject/local/arduino-cli_1.1.1_Windows_64bit/examples"){
    access(path + "/" + name, (error) => {
        // To check if the given directory 
        // already exists or not
        if (error) {
          // If current directory does not exist
          // then create it
          const fileDirectory = path + "/" + name ; 
          console.log(fileDirectory); 
          mkdir(fileDirectory, (error) => {
            if (error) {
              console.log(error);
            } else {
              const content = generateTemplate(name, delay); 
              console.log("New Directory created successfully !!");
              const filePath = fileDirectory +"/" + name+ ".ino"; 
              writeFile(filePath, content, (err)=>{
                if(err)
                  console.log(err);
                else 
                  console.log("the file is written successfully"); 
              } )
            }
          });
        } else {
          console.log("Given Directory already exists !!");
        }
      });
}

function generateTemplate(name="esp-default", delay=500, ssid="clear", pass="13141516", host="192.168.137.1",port=1883, b_rate="115200"){
    const template = `
    #include <WiFi.h>
    #include <PubSubClient.h>

    const char *ssid = "${ssid}";
    const char *password = "${pass}";
    const char *mqtt_server = "${host}";

    WiFiClient espClient;
    PubSubClient client(espClient);
    long lastMsg = 0;
    char msg[50];
    int value = 0;

    const int ledPin = 2;

    void setup()
    {
    Serial.begin(${b_rate});
    setup_wifi();
    client.setServer(mqtt_server, ${port});
    client.setCallback(callback);

    pinMode(ledPin, OUTPUT);
    }

    void setup_wifi()
    {
    delay(10);
    // We start by connecting to a WiFi network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    }

    void callback(char *topic, byte *message, unsigned int length)
    {
    Serial.print("Message arrived on topic: ");
    Serial.print(topic);
    Serial.print(". Message: ");
    String messageTemp;

    for (int i = 0; i < length; i++)
    {
        Serial.print((char)message[i]);
        messageTemp += (char)message[i];
    }
    Serial.println();

    if (String(topic) == "esp32/${name}/output")
    {
        Serial.print("Changing output to ");
        if (messageTemp == "on")
        {
        Serial.println("on");
        digitalWrite(ledPin, HIGH);
        }
        else if (messageTemp == "off")
        {
        Serial.println("off");
        digitalWrite(ledPin, LOW);
        }
    }
    }

    void reconnect()
    {
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        if (client.connect("ESP8266Client"))
        {
        Serial.println("connected");
        // Subscribe
        client.subscribe("esp32/${name}/output");
        }
        else
        {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        Serial.println(" try again in 5 seconds");
        // Wait 5 seconds before retrying
        delay({5000});
        }
    }
    }
    void loop()
    {
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    long now = millis();
    if (now - lastMsg > ${delay})
    {
        lastMsg = now;

        const char *greeting = "hello from ${name}";
        Serial.println(greeting);
        client.publish("esp32/${name}", greeting);
    }
    }
    `
  
    return template; 
}

export default generateFile; 

