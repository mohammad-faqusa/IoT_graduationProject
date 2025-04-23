# Read gas sensor value
gas_level = peripherals['gas_sensor'].read()
print(f"Gas sensor reading: {gas_level}")

# Test external LED
print("Testing external LED...")
peripherals['led'].on()
print(f"LED is on: {peripherals['led'].is_on()}")
peripherals['led'].off()
print(f"LED is off: {peripherals['led'].is_on()}")
peripherals['led'].toggle()
print(f"LED after toggle: {peripherals['led'].is_on()}")
peripherals['led'].toggle()
print(f"LED after second toggle: {peripherals['led'].is_on()}")

# Test internal LED
print("Testing internal LED...")
peripherals['internal_led'].on()
print(f"Internal LED is on: {peripherals['internal_led'].is_on()}")
peripherals['internal_led'].off()
print(f"Internal LED is off: {peripherals['internal_led'].is_on()}")
peripherals['internal_led'].toggle()
print(f"Internal LED after toggle: {peripherals['internal_led'].is_on()}")
peripherals['internal_led'].toggle()
print(f"Internal LED after second toggle: {peripherals['internal_led'].is_on()}")

# Test all components in a simple interactive demo
print("\nStarting interactive demo...")
for i in range(5):
    gas_reading = peripherals['gas_sensor'].read()
    print(f"Gas sensor reading: {gas_reading}")
    
    # If gas reading is above threshold, turn on both LEDs
    if gas_reading > 500:
        peripherals['led'].on()
        peripherals['internal_led'].on()
        print("Gas level HIGH - LEDs ON")
    else:
        peripherals['led'].off()
        peripherals['internal_led'].off()
        print("Gas level normal - LEDs OFF")
    
    # Wait a bit between readings
    import time
    time.sleep(1)