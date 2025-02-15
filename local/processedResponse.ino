
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Stepper.h>
#include <Servo.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>
#include <MQ135.h>

// Wi-Fi credentials
const char *ssid = "clear";
const char *password = "13141516";

// MQTT broker details
const char *mqtt_server = "192.168.137.1";
const int mqtt_port = 1883;

// Initialize Wi-Fi and MQTT client
WiFiClient espClient;
PubSubClient client(espClient);

// Initialize I2C LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Initialize Stepper Motor
Stepper stepper(100, 8, 9); // 100 steps, pin 8 and 9

// Initialize Servo Motor
Servo myServo;

// Define pins
const int switchPin = 2;
const int gasSensorPin = A0;

// Initialize gas sensor
MQ135 gasSensor = MQ135(gasSensorPin);

struct VariablesDict
{
    int gasLevel;
    bool switchState;
    int stepperPosition;
    int servoAngle;
} variables_dict;

String get_variable_types()
{
    DynamicJsonDocument doc(1024);
    doc["gasLevel"]["type"] = "int";
    doc["gasLevel"]["range"] = "0-1023";
    doc["switchState"]["type"] = "bool";
    doc["switchState"]["range"] = "true/false";
    doc["stepperPosition"]["type"] = "int";
    doc["stepperPosition"]["range"] = "0-100"; // Example range
    doc["servoAngle"]["type"] = "int";
    doc["servoAngle"]["range"] = "0-180";

    String output;
    serializeJson(doc, output);
    return output;
}

String get_peripheral_pins()
{
    DynamicJsonDocument doc(1024);
    doc["LCD"]["pin"] = 0x27;
    doc["stepper"]["pins"]["stepPin"] = 8;
    doc["stepper"]["pins"]["dirPin"] = 9;
    doc["servo"]["pin"] = 10; // Assume servo on pin 10
    doc["switch"]["pin"] = switchPin;
    doc["gasSensor"]["pin"] = gasSensorPin;

    String output;
    serializeJson(doc, output);
    return output;
}

void update_variables_dict()
{
    variables_dict.gasLevel = gasSensor.getPPM();
    variables_dict.switchState = digitalRead(switchPin);
    variables_dict.stepperPosition = stepper.currentPosition(); // Assumed method
    variables_dict.servoAngle = myServo.read();                 // Assumed method
}

void set_peripherals_values(JsonDocument output_variables_dict)
{
    if (output_variables_dict.containsKey("stepperPosition"))
    {
        int position = output_variables_dict["stepperPosition"];
        stepper.step(position);
    }
    if (output_variables_dict.containsKey("servoAngle"))
    {
        int angle = output_variables_dict["servoAngle"];
        myServo.write(angle);
    }
}

void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.println("a message is received");
    String message;
    for (int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }

    Serial.println(message.c_str());

    if (String(topic) == "esp32/input")
    {
        // Parse JSON input
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, message);

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
        Serial.print("publishing message : ");
        Serial.println(output.c_str());
        client.publish("esp32/output", output.c_str());
    }
}
