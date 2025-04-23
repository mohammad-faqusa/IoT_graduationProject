# Test MotionSensor methods
print("Testing Motion Sensor:")
motion_detected = peripherals['motion_sensor'].read()
print(f"Motion detected: {motion_detected}")

print("Waiting for motion (5 seconds timeout)...")
motion_within_timeout = peripherals['motion_sensor'].wait_for_motion(5)
print(f"Motion detected within timeout: {motion_within_timeout}")

# Test PushButton methods
print("\nTesting Push Button:")
peripherals['push_button'].set_simulated_state(True)
print(f"Button is pressed: {peripherals['push_button'].is_pressed()}")
peripherals['push_button'].set_simulated_state(False)
print(f"Button is pressed: {peripherals['push_button'].is_pressed()}")

print("Simulating button push...")
peripherals['push_button'].push()
event_detected = peripherals['push_button'].get_event()
print(f"Button event detected: {event_detected}")

# Test Relay methods
print("\nTesting Relay:")
print("Turning relay ON")
peripherals['relay'].on()
is_on = peripherals['relay'].is_on()
print(f"Relay is ON: {is_on}")

print("Toggling relay")
peripherals['relay'].toggle()
is_on = peripherals['relay'].is_on()
print(f"Relay is ON after toggle: {is_on}")

print("Turning relay OFF")
peripherals['relay'].off()
is_on = peripherals['relay'].is_on()
print(f"Relay is ON: {is_on}")