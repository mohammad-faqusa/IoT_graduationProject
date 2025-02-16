#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Wi-Fi credentials
const char *ssid = "clear";
const char *password = "13141516";

// MQTT broker details
const char *mqtt_server = "192.168.137.1";
const int mqtt_port = 1883;

// Initialize Wi-Fi and MQTT client
WiFiClient espClient;
PubSubClient client(espClient);

// Peripheral pins
#define DHTPIN 4            // DHT22 data pin
#define GAS_SENSOR_PIN 34   // Gas sensor analog pin
#define LED_PIN 5           // Digital output for LED
#define MOTOR_ENABLE_PIN 18 // Digital output for motor enable

// DHT22 setup
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Global variables
float temperature = 0.0;
float humidity = 0.0;
int gas_value = 0;
bool led_status = false;
bool motor_status = false;

// Struct to store peripheral variables
struct VariablesDict
{
    float temperature;
    float humidity;
    int gas_value;
    bool led_status;
    bool motor_status;
} variables_dict;

// Function to return variable types and ranges
String get_variable_types()
{
    DynamicJsonDocument doc(1024);
    doc["temperature"]["type"] = "float";
    doc["temperature"]["range"] = "-40 to 80";
    doc["humidity"]["type"] = "float";
    doc["humidity"]["range"] = "0 to 100";
    doc["gas_value"]["type"] = "int";
    doc["gas_value"]["range"] = "0 to 4095";
    doc["led_status"]["type"] = "bool";
    doc["led_status"]["range"] = "0 or 1";
    doc["motor_status"]["type"] = "bool";
    doc["motor_status"]["range"] = "0 or 1";

    String output;
    serializeJson(doc, output);
    return output;
}

// Function to return peripheral pins
String get_peripheral_pins()
{
    DynamicJsonDocument doc(1024);
    doc["temperature"] = DHTPIN;
    doc["humidity"] = DHTPIN;
    doc["gas_value"] = GAS_SENSOR_PIN;
    doc["led_status"] = LED_PIN;
    doc["motor_status"] = MOTOR_ENABLE_PIN;

    String output;
    serializeJson(doc, output);
    return output;
}

// Function to update variables_dict from peripherals
void update_variables_dict()
{
    variables_dict.temperature = dht.readTemperature();
    variables_dict.humidity = dht.readHumidity();
    variables_dict.gas_value = analogRead(GAS_SENSOR_PIN);
    variables_dict.led_status = digitalRead(LED_PIN);
    variables_dict.motor_status = digitalRead(MOTOR_ENABLE_PIN);
}

// MQTT callback function
void callback(char *topic, byte *payload, unsigned int length)
{
    String message;
    for (int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }

    // Check if the topic is "esp32/input"
    if (String(topic) == "esp32/input")
    {
        // Parse JSON input
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, message);

        // Update variables_dict if keys are present
        if (doc.containsKey("temperature"))
        {
            variables_dict.temperature = doc["temperature"].as<float>();
        }
        if (doc.containsKey("humidity"))
        {
            variables_dict.humidity = doc["humidity"].as<float>();
        }
        if (doc.containsKey("gas_value"))
        {
            variables_dict.gas_value = doc["gas_value"].as<int>();
        }
        if (doc.containsKey("led_status"))
        {
            variables_dict.led_status = doc["led_status"].as<bool>();
        }
        if (doc.containsKey("motor_status"))
        {
            variables_dict.motor_status = doc["motor_status"].as<bool>();
        }

        // Publish updated variables_dict
        DynamicJsonDocument outputDoc(1024);
        outputDoc["temperature"] = variables_dict.temperature;
        outputDoc["humidity"] = variables_dict.humidity;
        outputDoc["gas_value"] = variables_dict.gas_value;
        outputDoc["led_status"] = variables_dict.led_status;
        outputDoc["motor_status"] = variables_dict.motor_status;

        String output;
        serializeJson(outputDoc, output);
        client.publish("esp32/output", output.c_str());
    }

    // Check if the topic is "esp32/peripherals"
    else if (String(topic) == "esp32/peripherals")
    {
        // Publish peripheral pins and variable types
        String pins = get_peripheral_pins();
        String types = get_variable_types();

        DynamicJsonDocument doc(1024);
        doc["peripheral_pins"] = serialized(pins);
        doc["variable_types"] = serialized(types);

        String output;
        serializeJson(doc, output);
        client.publish("esp32/output", output.c_str());
    }
}

// Setup function
void setup()
{
    // Initialize serial communication
    Serial.begin(115200);

    // Initialize Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to Wi-Fi...");
    }
    Serial.println("Connected to Wi-Fi");

    // Initialize MQTT
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(callback);
    while (!client.connected())
    {
        Serial.println("Connecting to MQTT...");
        if (client.connect("ESP32Client"))
        {
            Serial.println("Connected to MQTT");
        }
        else
        {
            delay(1000);
        }
    }
    client.subscribe("esp32/input");
    client.subscribe("esp32/peripherals");

    // Initialize peripherals
    dht.begin();
    pinMode(LED_PIN, OUTPUT);
    pinMode(MOTOR_ENABLE_PIN, OUTPUT);
    pinMode(GAS_SENSOR_PIN, INPUT);
}

// Loop function
void loop()
{
    // Update variables_dict with current peripheral values
    update_variables_dict();

    // Handle MQTT communication
    client.loop();

    // Small delay to avoid overloading the loop
    delay(100);
}