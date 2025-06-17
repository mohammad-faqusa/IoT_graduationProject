# Initialise peripherals dictionary
peripherals = {}

# Instantiate each peripheral
peripherals["internal led"] = InternalLED()           # GPIO2
peripherals["push button"] = PushButton(14)           # GPIO14
peripherals["servo motor"] = Servo(13)                # GPIO13
peripherals["relay"] = Relay(27)                      # GPIO27