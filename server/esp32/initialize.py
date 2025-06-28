# Initialise peripherals dictionary
peripherals = {}

# Instantiate each peripheral
peripherals["servo"] = Servo(12)                # GPIO12
peripherals["relay"] = Relay(14)                # GPIO14
peripherals["internal led"] = InternalLED()     # GPIO2
peripherals["push button"] = PushButton(27)     # GPIO27