#define LED_BUILTIN 2 // define the GPIO 2 as LED_BUILTIN

void setup()
{
    Serial.begin(9600);
    pinMode(LED_BUILTIN, OUTPUT);
}

void loop()
{
    Serial.println("hello from esp32");
    digitalWrite(LED_BUILTIN, HIGH); // turn the LED on
    delay(1000);                     // wait for a second
    digitalWrite(LED_BUILTIN, LOW);  // turn the LED off
    delay(1000);                     // wait for a second
}