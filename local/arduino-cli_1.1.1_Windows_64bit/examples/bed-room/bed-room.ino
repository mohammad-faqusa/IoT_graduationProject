
    #include <WiFi.h>
    #include <PubSubClient.h>

    const char *ssid = "clear";
    const char *password = "13141516";
    const char *mqtt_server = "192.168.137.1";

    WiFiClient espClient;
    PubSubClient client(espClient);
    long lastMsg = 0;
    char msg[50];
    int value = 0;

    const int ledPin = 2;

    void setup()
    {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_server, 1883);
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

    if (String(topic) == "esp32/bed-room/output")
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
        client.subscribe("esp32/bed-room/output");
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
    if (now - lastMsg > 2000)
    {
        lastMsg = now;

        const char *greeting = "hello from bed-room";
        Serial.println(greeting);
        client.publish("esp32/bed-room", greeting);
    }
    }
    