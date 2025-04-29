
def run_all_methods(peripherals):
    import time
    from machine import Pin, I2C
    import uasyncio as asyncio
    
    # Test accelerometer (MPU6050)
    try:
        if 'accelerometer' in peripherals:
            # Test read_accel method
            try:
                accel_data = peripherals['accelerometer'].read_accel()
                print("Accelerometer data (x, y, z):", accel_data)
                for i, axis in enumerate(['x', 'y', 'z']):
                    if not (-2 <= accel_data[i] <= 2):
                        print(f"Warning: Acceleration {axis} value {accel_data[i]} outside expected range (-2g to 2g)")
            except Exception as e:
                print("Error reading accelerometer data:", e)
            
            # Test read_gyro method
            try:
                gyro_data = peripherals['accelerometer'].read_gyro()
                print("Gyroscope data (x, y, z):", gyro_data)
                for i, axis in enumerate(['x', 'y', 'z']):
                    if not (-250 <= gyro_data[i] <= 250):
                        print(f"Warning: Gyroscope {axis} value {gyro_data[i]} outside expected range (-250 to 250 deg/s)")
            except Exception as e:
                print("Error reading gyroscope data:", e)
            
            # Test read_all method
            try:
                all_data = peripherals['accelerometer'].read_all()
                print("All sensor data:", all_data)
                
                # Verify accelerometer data
                for i, axis in enumerate(['x', 'y', 'z']):
                    if not (-2 <= all_data['accel'][i] <= 2):
                        print(f"Warning: Acceleration {axis} value {all_data['accel'][i]} outside expected range (-2g to 2g)")
                
                # Verify gyroscope data
                for i, axis in enumerate(['x', 'y', 'z']):
                    if not (-250 <= all_data['gyro'][i] <= 250):
                        print(f"Warning: Gyroscope {axis} value {all_data['gyro'][i]} outside expected range (-250 to 250 deg/s)")
            except Exception as e:
                print("Error reading all sensor data:", e)
        else:
            print("Accelerometer not found in peripherals")
    except Exception as e:
        print("Error accessing accelerometer:", e)
    
    # Test DHT sensor
    try:
        if 'dht_sensor' in peripherals:
            # Test measure method
            try:
                peripherals['dht_sensor'].measure()
                print("DHT measurement triggered successfully")
                # Give the sensor a moment to complete the measurement
                time.sleep(0.5)
            except Exception as e:
                print("Error triggering DHT measurement:", e)
            
            # Test temperature method
            try:
                temp = peripherals['dht_sensor'].temperature()
                print("Temperature:", temp, "°C")
                if not (-40 <= temp <= 125):
                    print(f"Warning: Temperature {temp}°C outside expected range (-40°C to 125°C)")
            except Exception as e:
                print("Error reading temperature:", e)
            
            # Test humidity method
            try:
                humidity = peripherals['dht_sensor'].humidity()
                print("Humidity:", humidity, "%")
                if not (0 <= humidity <= 100):
                    print(f"Warning: Humidity {humidity}% outside expected range (0% to 100%)")
            except Exception as e:
                print("Error reading humidity:", e)
        else:
            print("DHT sensor not found in peripherals")
    except Exception as e:
        print("Error accessing DHT sensor:", e)
    
    # Test encoder
    try:
        if 'encoder' in peripherals:
            # Test get_position method
            try:
                position = peripherals['encoder'].get_position()
                print("Encoder position:", position)
            except Exception as e:
                print("Error reading encoder position:", e)
            
            # Test reset method
            try:
    import time
    
    try:
        # Test Gas Sensor
        try:
            if 'gas_sensor' in peripherals:
                gas_level = peripherals['gas_sensor'].read()
                print(f"Gas Sensor reading: {gas_level}")
                # Wait a moment to let the sensor stabilize
                time.sleep(0.1)
        except Exception as e:
            print(f"Error testing gas sensor: {e}")
            
        # Test LED
        try:
            if 'led' in peripherals:
                # Turn LED on
                peripherals['led'].on()
                print("LED turned ON")
                time.sleep(0.5)
                
                # Check if LED is on
                is_on = peripherals['led'].is_on()
                print(f"LED is ON: {is_on}")
                time.sleep(0.5)
                
                # Toggle LED
                peripherals['led'].toggle()
                print("LED toggled")
                time.sleep(0.5)
                
                # Check if LED is on after toggle
                is_on = peripherals['led'].is_on()
                print(f"LED is ON after toggle: {is_on}")
                time.sleep(0.5)
                
                # Turn LED off
                peripherals['led'].off()
                print("LED turned OFF")
                time.sleep(0.5)
                
                # Check if LED is on
                is_on = peripherals['led'].is_on()
                print(f"LED is ON: {is_on}")
        except Exception as e:
            print(f"Error testing LED: {e}")
            
        # Test Internal LED
        try:
            if 'internal_led' in peripherals:
                # Turn internal LED on
                peripherals['internal_led'].on()
                print("Internal LED turned ON")
                time.sleep(0.5)
                
                # Check if internal LED is on
                is_on = peripherals['internal_led'].is_on()
                print(f"Internal LED is ON: {is_on}")
                time.sleep(0.5)
                
                # Toggle internal LED
                peripherals['internal_led'].toggle()
                print("Internal LED toggled")
                time.sleep(0.5)
                
                # Check if internal LED is on after toggle
                is_on = peripherals['internal_led'].is_on()
                print(f"Internal LED is ON after toggle: {is_on}")
                time.sleep(0.5)
                
                # Turn internal LED off
                peripherals['internal_led'].off()
                print("Internal LED turned OFF")
                time.sleep(0.5)
                
                # Check if internal LED is on
                is_on = peripherals['internal_led'].is_on()
                print(f"Internal LED is ON: {is_on}")
        except Exception as e:
            print(f"Error testing internal LED: {e}")
            
    except Exception as e:
        print(f"General error during peripheral testing: {e}")
    import time
    import logging
    
    # Set up logging
    try:
        import logging
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger("peripherals_test")
    except ImportError:
        print("Warning: logging module not available")
        
        # Create simple logger replacement
        class SimpleLogger:
            def info(self, msg): print("[INFO]", msg)
            def error(self, msg): print("[ERROR]", msg)
            def warning(self, msg): print("[WARNING]", msg)
        
        logger = SimpleLogger()
    
    # Test motion sensor
    try:
        logger.info("Testing Motion Sensor...")
        
        # Test read method
        motion_detected = peripherals["motion_sensor"].read()
        logger.info(f"Motion detected: {motion_detected}")
        
        # Test wait_for_motion method with a 5-second timeout
        logger.info("Waiting for motion (5 seconds timeout)...")
        motion_within_timeout = peripherals["motion_sensor"].wait_for_motion(5)
        if motion_within_timeout:
            logger.info("Motion detected within timeout period")
        else:
            logger.info("No motion detected within timeout period")
            
    except KeyError:
        logger.error("Motion sensor not found in peripherals dictionary")
    except Exception as e:
        logger.error(f"Error testing motion sensor: {e}")
    
    # Test push button
    try:
        logger.info("\nTesting Push Button...")
        
        # Test is_pressed method
        is_pressed = peripherals["push_button"].is_pressed()
        logger.info(f"Button is currently pressed: {is_pressed}")
        
        # Test get_event method
        event_detected = peripherals["push_button"].get_event()
        logger.info(f"Button event detected: {event_detected}")
        
        # Test set_simulated_state method (only for simulation)
        logger.info("Setting simulated button press state...")
        peripherals["push_button"].set_simulated_state(True)
        time.sleep(0.5)
        is_pressed_after_sim = peripherals["push_button"].is_pressed()
        logger.info(f"Button is pressed after simulation: {is_pressed_after_sim}")
        
        # Test push method (only for simulation)
        logger.info("Simulating button push...")
        peripherals["push_button"].push()
        time.sleep(0.5)
        event_after_push = peripherals["push_button"].get_event()
        logger.info(f"Button event after simulated push: {event_after_push}")
        
        # Reset simulated state
        peripherals["push_button"].set_simulated_state(False)
        
    except KeyError:
        logger.error("Push button not found in peripherals dictionary")
    except Exception as e:
        logger.error(f"Error testing push button: {e}")
    
    # Test relay
    try:
        logger.info("\nTesting Relay...")
        
        # Test initial state
        initial_state = peripherals["relay"].is_on()
        logger.info(f"Initial relay state (ON=True): {initial_state}")
        
        # Test turning on
        logger.info("Turning relay ON...")
        peripherals["relay"].on()
        time.sleep(1)
        on_state = peripherals["relay"].is_on()
        logger.info(f"Relay is ON: {on_state}")
        
        # Test toggling
        logger.info("Toggling relay...")
        peripherals["relay"].toggle()
        time.sleep(1)
        toggle_state = peripherals["relay"].is_on()
        logger.info(f"Relay after toggle: {toggle_state}")
        
        # Test turning off
        logger.info("Turning relay OFF...")
        peripherals["relay"].off()
        time.sleep(1)
        off_state = peripherals["relay"].is_on()
        logger.info(f"Relay is OFF: {off_state}")
        
    except KeyError:
        logger.error("Relay not found in peripherals dictionary")
    except Exception as e:
        logger.error(f"Error testing relay: {e}")
    
    logger.info("\nPer
    import time
    
    # Test servo motor
    try:
        # Write angle to servo motor
        peripherals['servo_motor'].write_angle(0)
        time.sleep(1)
        peripherals['servo_motor'].write_angle(90)
        time.sleep(1)
        peripherals['servo_motor'].write_angle(180)
        time.sleep(1)
        
        # Write microseconds pulse width to servo motor
        peripherals['servo_motor'].write_us(500)
        time.sleep(1)
        peripherals['servo_motor'].write_us(1500)
        time.sleep(1)
        peripherals['servo_motor'].write_us(2500)
        time.sleep(1)
        
        # Read angle and pulse width
        current_angle = peripherals['servo_motor'].read_angle()
        print(f"Current servo angle: {current_angle}°")
        
        current_us = peripherals['servo_motor'].read_us()
        print(f"Current servo pulse width: {current_us}μs")
        
        # Deinitialize servo (comment out if you need to continue using the servo)
        # peripherals['servo_motor'].deinit()
        
    except Exception as e:
        print(f"Servo motor test failed: {e}")
    
    # Test slide switch
    try:
        # Set simulated state
        peripherals['slide_switch'].set_simulated_state(True)
        time.sleep(0.5)
        
        # Read switch state using read() method
        switch_state = peripherals['slide_switch'].read()
        print(f"Switch state (using read method): {'ON' if switch_state else 'OFF'}")
        
        # Read switch state using state property
        switch_property_state = peripherals['slide_switch'].state
        print(f"Switch state (using state property): {'ON' if switch_property_state else 'OFF'}")
        
        # Test the opposite state
        peripherals['slide_switch'].set_simulated_state(False)
        time.sleep(0.5)
        
        # Read again after changing state
        switch_state = peripherals['slide_switch'].read()
        print(f"Switch state after change (using read method): {'ON' if switch_state else 'OFF'}")
        
        switch_property_state = peripherals['slide_switch'].state
        print(f"Switch state after change (using state property): {'ON' if switch_property_state else 'OFF'}")
        
    except Exception as e:
        print(f"Slide switch test failed: {e}")