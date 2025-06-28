# Initialise peripherals dictionary
peripherals = {}

# Instantiate each peripheral
peripherals["dht sensor"] = DHTSensor(14)               # GPIO14
peripherals["internal led"] = InternalLED()             # GPIO2
peripherals["relay"] = Relay(27)                        # GPIO27