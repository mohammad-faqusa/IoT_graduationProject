from dht_sensor import DHTSensor
from gas_sensor import GasSensor
from led import InternalLED
from motion_sensor import MotionSensor

# Initialize peripherals
peripherals = {}
peripherals['dht_sensor'] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
peripherals['gas_sensor'] = GasSensor(pin=35, analog=True, simulate=True)
peripherals['internal_led'] = InternalLED(simulate=False)
peripherals['motion_sensor'] = MotionSensor(pin=13, simulate=True)

def run_all_methods(peripherals):
    import time
    
    # DHT Sensor testing
    try:
        print("Testing DHT Sensor...")
        dht = peripherals['dht_sensor']
        dht.measure()  # Update temperature and humidity readings
        time.sleep(2)  # Allow time for measurement
        
        temp = dht.temperature()
        humid = dht.humidity()
        
        print(f"Temperature: {temp}°C")
        print(f"Humidity: {humid}%")
        
        if -40 <= temp <= 125:
            print("Temperature reading is within valid range")
        else:
            print("WARNING: Temperature reading is outside valid range")
        
        if 0 <= humid <= 100:
            print("Humidity reading is within valid range")
        else:
            print("WARNING: Humidity reading is outside valid range")
            
    except KeyError:
        print("DHT sensor not found in peripherals dictionary")
    except Exception as e:
        print(f"Error testing DHT sensor: {e}")
    
    # Gas Sensor testing
    try:
        print("\nTesting Gas Sensor...")
        gas_sensor = peripherals['gas_sensor']
        gas_level = gas_sensor.read()
        print(f"Gas level: {gas_level}")
        
        if 0 <= gas_level <= 1023:
            print("Gas level reading is within valid range")
        else:
            print("WARNING: Gas level reading is outside valid range")
        
        # Interpret gas level
        if gas_level > 800:
            print("WARNING: High gas concentration detected!")
        elif gas_level > 400:
            print("Moderate gas concentration detected")
        else:
            print("Low gas concentration detected")
            
    except KeyError:
        print("Gas sensor not found in peripherals dictionary")
    except Exception as e:
        print(f"Error testing gas sensor: {e}")
    
    # Internal LED testing
    try:
        print("\nTesting Internal LED...")
        led = peripherals['internal_led']
        
        # Test on state
        led.on()
        time.sleep(0.5)
        is_on = led.is_on()
        print(f"LED turned ON, is_on() returned: {is_on}")
        
        # Test off state
        led.off()
        time.sleep(0.5)
        is_on = led.is_on()
        print(f"LED turned OFF, is_on() returned: {is_on}")
        
        # Test toggle functionality
        print("Testing toggle functionality")
        initial_state = led.is_on()
        led.toggle()
        time.sleep(0.5)
        new_state = led.is_on()
        print(f"LED toggled from {initial_state} to {new_state}")
        
        # Return to off state
        led.off()
        
    except KeyError:
        print("Internal LED not found in peripherals dictionary")
    except Exception as e:
        print(f"Error testing internal LED: {e}")
    try:
        import time
        
        # Test motion_sensor
        if 'motion_sensor' in peripherals:
            try:
                # Read the current state of the motion sensor
                motion_detected = peripherals['motion_sensor'].read()
                print(f"Motion sensor reading: {'Motion detected' if motion_detected else 'No motion detected'}")
                
                # Wait for motion with a timeout
                print("Waiting for motion (5 seconds timeout)...")
                motion_result = peripherals['motion_sensor'].wait_for_motion(timeout=5)
                if motion_result:
                    print("Motion was detected within the timeout period")
                else:
                    print("No motion was detected within the timeout period")
                    
            except Exception as e:
                print(f"Error testing motion_sensor: {e}")
        else:
            print("Motion sensor not found in peripherals")
            
    except ImportError:
        print("Required modules not available")
    except Exception as e:
        print(f"Unexpected error: {e}")