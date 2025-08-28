# Initialise peripherals dictionary
peripherals = {}

# Instantiate each peripheral
peripherals["servo motor"] = Servo(13)                 # GPIO13
peripherals["internal led"] = InternalLED()            # GPIO2
peripherals["oled"] = OLED()                           # SDA=21, SCL=22