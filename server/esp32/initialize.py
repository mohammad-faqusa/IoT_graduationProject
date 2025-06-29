# Initialise peripherals dictionary
peripherals = {}

# Instantiate each peripheral
peripherals["encoder"] = Encoder(13, 14)        # GPIO13, GPIO14
peripherals["internal led"] = InternalLED()     # GPIO2
peripherals["relay"] = Relay(16)                # GPIO16