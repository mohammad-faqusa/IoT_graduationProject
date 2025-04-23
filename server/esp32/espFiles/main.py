from accelerometer import MPU6050
from dht_sensor import DHTSensor
from led import InternalLED

# Initialize peripherals
peripherals = {}
peripherals["accelerometer"] = MPU6050(simulate=True)
peripherals["dht_sensor"] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
peripherals["internal_led"] = InternalLED(simulate=False)

def run_all_methods(peripherals):
    import time
    import json
    
    # Try to accelerometer test
    try:
        accelerometer = peripherals['accelerometer']
        print("Testing accelerometer (MPU6050)...")
        
        # Test read_accel method
        accel_data = accelerometer.read_accel()
        print(f"Acceleration (g): X={accel_data[0]:.2f}, Y={accel_data[1]:.2f}, Z={accel_data[2]:.2f}")
        
        # Test read_gyro method
        gyro_data = accelerometer.read_gyro()
        print(f"Gyroscope (deg/s): X={gyro_data[0]:.2f}, Y={gyro_data[1]:.2f}, Z={gyro_data[2]:.2f}")
        
        # Test read_all method
        all_data = accelerometer.read_all()
        print("All sensor data:")
        print(f"  Acceleration (g): X={all_data['accel'][0]:.2f}, Y={all_data['accel'][1]:.2f}, Z={all_data['accel'][2]:.2f}")
        print(f"  Gyroscope (deg/s): X={all_data['gyro'][0]:.2f}, Y={all_data['gyro'][1]:.2f}, Z={all_data['gyro'][2]:.2f}")
        
    except KeyError:
        print("Accelerometer not found in peripherals dictionary")
    except Exception as e:
        print(f"Error testing accelerometer: {e}")
    
    # Try DHT sensor test
    try:
        dht_sensor = peripherals['dht_sensor']
        print("\nTesting DHT sensor...")
        
        # Test measure method
        dht_sensor.measure()
        print("DHT sensor measurement triggered")
        
        # Wait a bit for the sensor to complete measurement
        time.sleep(0.5)
        
        # Test temperature method
        temp = dht_sensor.temperature()
        print(f"Temperature: {temp:.1f}°C")
        
        # Test humidity method
        humid = dht_sensor.humidity()
        print(f"Humidity: {humid:.1f}%")
        
    except KeyError:
        print("DHT sensor not found in peripherals dictionary")
    except Exception as e:
        print(f"Error testing DHT sensor: {e}")
    
    # Try internal LED test
    try:
        internal_led = peripherals['internal_led']
        print("\nTesting internal LED...")
        
        # Test on method
        internal_led.on()
        print("Internal LED turned ON")
        is_on = internal_led.is_on()
        print(f"LED is on: {is_on}")
        time.sleep(1)
        
        # Test off method
        internal_led.off()
        print("Internal LED turned OFF")
        is_on = internal_led.is_on()
        print(f"LED is on: {is_on}")
        time.sleep(1)
        
        # Test toggle method
        print("Toggling internal LED")
        for i in range(3):
            internal_led.toggle()
            is_on = internal_led.is_on()
            print(f"LED is on after toggle {i+1}: {is_on}")
            time.sleep(0.5)
        
        # Return to OFF state
        internal_led.off()
        
    except KeyError:
        print("Internal LED not found in peripherals dictionary")
    except Exception as e:
        print(f"Error testing internal LED: {e}")
    
    # Output results as JSON
    results = {
        "accelerometer_test": "completed" if "accelerometer" in peripherals else "skipped",
        "dht_sensor_test": "completed" if "dht_sensor" in peripherals else "skipped",
        "internal_led_test": "completed" if "internal_led" in peripherals else "skipped"
    }
    
    print("\nTest results summary:")
    print(json.dumps(results, indent=2))