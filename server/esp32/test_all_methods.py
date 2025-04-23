
def run_all_methods():
        # Test each peripheral
    try:
        # Test accelerometer (MPU6050)
        accelerometer = peripherals.get('accelerometer')
        if accelerometer:
            try:
                # Read acceleration values
                accel_values = accelerometer.read_accel()
                print(f"Accelerometer readings (g): X={accel_values[0]}, Y={accel_values[1]}, Z={accel_values[2]}")
                
                # Read gyroscope values
                gyro_values = accelerometer.read_gyro()
                print(f"Gyroscope readings (deg/s): X={gyro_values[0]}, Y={gyro_values[1]}, Z={gyro_values[2]}")
                
                # Read all values at once
                all_values = accelerometer.read_all()
                print(f"Combined readings:")
                print(f"  Accel (g): X={all_values['accel'][0]}, Y={all_values['accel'][1]}, Z={all_values['accel'][2]}")
                print(f"  Gyro (deg/s): X={all_values['gyro'][0]}, Y={all_values['gyro'][1]}, Z={all_values['gyro'][2]}")
            except Exception as e:
                print(f"Error testing accelerometer: {e}")
        else:
            print("Accelerometer not found in peripherals")
    except Exception as e:
        print(f"Error accessing accelerometer: {e}")
    
    try:
        # Test DHT sensor
        dht_sensor = peripherals.get('dht_sensor')
        if dht_sensor:
            try:
                # Trigger measurement
                dht_sensor.measure()
                
                # Read temperature
                temp = dht_sensor.temperature()
                print(f"Temperature: {temp}°C")
                
                # Read humidity
                humidity = dht_sensor.humidity()
                print(f"Humidity: {humidity}%")
            except Exception as e:
                print(f"Error testing DHT sensor: {e}")
        else:
            print("DHT sensor not found in peripherals")
    except Exception as e:
        print(f"Error accessing DHT sensor: {e}")
    
    try:
        # Test encoder
        encoder = peripherals.get('encoder')
        if encoder:
            try:
                # Get current position
                position = encoder.get_position()
                print(f"Encoder position: {position}")
                
                # Reset position
                encoder.reset()
                print("Encoder position reset to zero")
                
                # Simulate steps (if in simulation mode)
                try:
                    encoder.simulate_step(5)
                    print("Simulated 5 steps")
                    position = encoder.get_position()
                    print(f"New encoder position: {position}")
                except Exception as e:
                    print(f"Could not simulate steps (might not be in simulation mode): {e}")
            except Exception as e:
                print(f"Error testing encoder: {e}")
        else:
            print("Encoder not found in peripherals")
    except Exception as e:
        print(f"Error accessing encoder: {e}")
    import time
    
    # Test gas_sensor
    try:
        print("Testing Gas Sensor...")
        gas_level = peripherals['gas_sensor'].read()
        print(f"Gas level reading: {gas_level}")
    except Exception as e:
        print(f"Error testing gas sensor: {e}")
    
    # Test LED
    try:
        print("Testing LED...")
        peripherals['led'].on()
        print("LED turned ON")
        time.sleep(0.5)
        
        is_on = peripherals['led'].is_on()
        print(f"LED is ON: {is_on}")
        
        peripherals['led'].toggle()
        print("LED toggled")
        time.sleep(0.5)
        
        is_on = peripherals['led'].is_on()
        print(f"LED is ON after toggle: {is_on}")
        
        peripherals['led'].off()
        print("LED turned OFF")
        time.sleep(0.5)
        
        is_on = peripherals['led'].is_on()
        print(f"LED is ON: {is_on}")
    except Exception as e:
        print(f"Error testing LED: {e}")
    
    # Test Internal LED
    try:
        print("Testing Internal LED...")
        peripherals['internal_led'].on()
        print("Internal LED turned ON")
        time.sleep(0.5)
        
        is_on = peripherals['internal_led'].is_on()
        print(f"Internal LED is ON: {is_on}")
        
        peripherals['internal_led'].toggle()
        print("Internal LED toggled")
        time.sleep(0.5)
        
        is_on = peripherals['internal_led'].is_on()
        print(f"Internal LED is ON after toggle: {is_on}")
        
        peripherals['internal_led'].off()
        print("Internal LED turned OFF")
        time.sleep(0.5)
        
        is_on = peripherals['internal_led'].is_on()
        print(f"Internal LED is ON: {is_on}")
    except Exception as e:
        print(f"Error testing internal LED: {e}")
    try:
        # Test motion_sensor methods
        motion_detected = peripherals['motion_sensor'].read()
        print(f"Motion sensor read: {motion_detected}")
        
        # Test wait_for_motion with default timeout
        motion_within_timeout = peripherals['motion_sensor'].wait_for_motion()
        print(f"Motion detected within default timeout: {motion_within_timeout}")
        
        # Test wait_for_motion with custom timeout (5 seconds)
        motion_within_custom_timeout = peripherals['motion_sensor'].wait_for_motion(5)
        print(f"Motion detected within 5 seconds: {motion_within_custom_timeout}")
    except Exception as e:
        print(f"Error testing motion_sensor: {e}")
    
    try:
        # Test push_button methods
        # Simulate button press
        peripherals['push_button'].set_simulated_state(True)
        print("Button simulated as pressed")
        
        # Check if button is pressed
        button_pressed = peripherals['push_button'].is_pressed()
        print(f"Button is pressed: {button_pressed}")
        
        # Simulate button release
        peripherals['push_button'].set_simulated_state(False)
        print("Button simulated as released")
        
        # Simulate a complete push cycle
        peripherals['push_button'].push()
        print("Button push cycle simulated")
        
        # Check for button events
        button_event = peripherals['push_button'].get_event()
        print(f"Button was pressed: {button_event}")
    except Exception as e:
        print(f"Error testing push_button: {e}")
    
    try:
        # Test relay methods
        # Turn relay on
        peripherals['relay'].on()
        print("Relay turned ON")
        
        # Check if relay is on
        relay_state = peripherals['relay'].is_on()
        print(f"Relay is ON: {relay_state}")
        
        # Toggle relay state
        peripherals['relay'].toggle()
        print("Relay state toggled")
        
        # Check if relay state changed after toggle
        relay_state_after_toggle = peripherals['relay'].is_on()
        print(f"Relay is ON after toggle: {relay_state_after_toggle}")
        
        # Turn relay off
        peripherals['relay'].off()
        print("Relay turned OFF")
        
        # Verify relay is off
        relay_state_after_off = peripherals['relay'].is_on()
        print(f"Relay is ON after turning off: {relay_state_after_off}")
    except Exception as e:
        print(f"Error testing relay: {e}")
    # Test servo_motor peripheral
    try:
        # Test write_angle method
        peripherals['servo_motor'].write_angle(0)
        print("Servo set to 0 degrees")
        peripherals['servo_motor'].write_angle(90)
        print("Servo set to 90 degrees")
        peripherals['servo_motor'].write_angle(180)
        print("Servo set to 180 degrees")
        
        # Test write_us method
        peripherals['servo_motor'].write_us(500)
        print("Servo pulse set to 500 µs")
        peripherals['servo_motor'].write_us(1500)
        print("Servo pulse set to 1500 µs")
        peripherals['servo_motor'].write_us(2500)
        print("Servo pulse set to 2500 µs")
        
        # Test get_state method
        state = peripherals['servo_motor'].get_state()
        print(f"Servo state: pin={state['pin']}, angle={state['angle']}°, pulse_us={state['pulse_us']}µs")
        
        # Test deinit method
        peripherals['servo_motor'].deinit()
        print("Servo deinitialized")
    except Exception as e:
        print(f"Error testing servo_motor: {e}")
    
    # Test slide_switch peripheral
    try:
        # Test set_simulated_state method
        peripherals['slide_switch'].set_simulated_state(True)
        print("Slide switch simulated state set to ON")
        
        # Test read method
        switch_state = peripherals['slide_switch'].read()
        print(f"Slide switch read state: {'ON' if switch_state else 'OFF'}")
        
        # Test setting to OFF and reading again
        peripherals['slide_switch'].set_simulated_state(False)
        print("Slide switch simulated state set to OFF")
        switch_state = peripherals['slide_switch'].read()
        print(f"Slide switch read state: {'ON' if switch_state else 'OFF'}")
        
        # Test state property
        switch_property_state = peripherals['slide_switch'].state
        print(f"Slide switch state property: {'ON' if switch_property_state else 'OFF'}")
    except Exception as e:
        print(f"Error testing slide_switch: {e}")