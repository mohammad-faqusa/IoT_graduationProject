# Test servo_motor functionality
print("Testing servo_motor...")
print("Initial state:", peripherals['servo_motor'].get_state())

# Test different angles
print("Setting angle to 0°")
peripherals['servo_motor'].write_angle(0)
print("State after setting 0°:", peripherals['servo_motor'].get_state())

print("Setting angle to 90°")
peripherals['servo_motor'].write_angle(90)
print("State after setting 90°:", peripherals['servo_motor'].get_state())

print("Setting angle to 180°")
peripherals['servo_motor'].write_angle(180)
print("State after setting 180°:", peripherals['servo_motor'].get_state())

# Test pulse width setting
print("Setting pulse width to 1000μs")
peripherals['servo_motor'].write_us(1000)
print("State after setting 1000μs:", peripherals['servo_motor'].get_state())

print("Setting pulse width to 2000μs")
peripherals['servo_motor'].write_us(2000)
print("State after setting 2000μs:", peripherals['servo_motor'].get_state())

# Test slide_switch functionality
print("\nTesting slide_switch...")
print("Initial switch state:", peripherals['slide_switch'].read())
print("Initial state property:", peripherals['slide_switch'].state)

# Test simulated states
print("Simulating switch ON")
peripherals['slide_switch'].set_simulated_state(True)
print("Switch state after ON simulation:", peripherals['slide_switch'].read())
print("State property after ON simulation:", peripherals['slide_switch'].state)

print("Simulating switch OFF")
peripherals['slide_switch'].set_simulated_state(False)
print("Switch state after OFF simulation:", peripherals['slide_switch'].read())
print("State property after OFF simulation:", peripherals['slide_switch'].state)

# Clean up servo
print("\nDeinitializing servo_motor...")
peripherals['servo_motor'].deinit()
print("Test completed")