#include <WiFi.h>

// Replace with your network credentials
const char *ssid = "clear";        // Your Wi-Fi SSID (name)
const char *password = "13141516"; // Your Wi-Fi password

void setup()
{
  // Start the Serial communication
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  // Once connected, print the IP address
  Serial.println();
  Serial.println("Connected to Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop()
{
  Serial.println("hello from esp32");
  delay(1000);
  // Your main code here
  // The Wi-Fi connection is maintained automatically in the background
}