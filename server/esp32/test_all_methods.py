
def run_all_methods(peripherals):
import time
import json

# Testing function body
try:
    # Test accelerometer (MPU6050)
    try:
        print("Testing accelerometer (MPU6050)...")
        
        # Read acceleration values
        accel_values = peripherals['accelerometer'].read_accel()
        print(f"Acceleration (g): X={accel_values[0]:.2f}, Y={accel_values[1]:.2f}, Z={accel_values[2]:.2f}")
        
        # Read gyroscope values
        gyro_values = peripherals['accelerometer'].read_gyro()
        print(f"Gyroscope (deg/s): X={gyro_values[0]:.2f}, Y={gyro_values[1]:.2f}, Z={gyro_values[2]:.2f}")
        
        # Read all values at once
        all_values = peripherals['accelerometer'].read_all()
        print("All sensor values:")
        print(f"  Acceleration (g): X={all_values['accel'][0]:.2f}, Y={all_values['accel'][1]:.2f}, Z={all_values['accel'][2]:.2f}")
        print(f"  Gyroscope (deg/s): X={all_values['gyro'][0]:.2f}, Y={all_values['gyro'][1]:.2f}, Z={all_values['gyro'][2]:.2f}")
        
    except Exception as e:
        print(f"Error testing accelerometer: {e}")
    
    # Test DHT sensor
    try:
        print("\nTesting DHT sensor...")
        
        # Measure temperature and humidity
        peripherals['dht_sensor'].measure()
        print("Measurement triggered")
        
        # Read temperature
        temp = peripherals['dht_sensor'].temperature()
        print(f"Temperature: {temp:.1f}°C")
        
        # Read humidity
        humidity = peripherals['dht_sensor'].humidity()
        print(f"Humidity: {humidity:.1f}%")
        
    except Exception as e:
        print(f"Error testing DHT sensor: {e}")
    
    # Test internal LED
    try:
        print("\nTesting internal LED...")
        
        # Turn LED on
        peripherals['internal_led'].on()
        print("LED turned ON")
        is_on = peripherals['internal_led'].is_on()
        print(f"LED is ON: {is_on}")
        time.sleep(1)
        
        # Turn LED off
        peripherals['internal_led'].off()
        print("LED turned OFF")
        is_on = peripherals['internal_led'].is_on()
        print(f"LED is ON: {is_on}")
        time.sleep(1)
        
        # Toggle LED a few times
        for i in range(3):
            peripherals['internal_led'].toggle()
            is_on = peripherals['internal_led'].is_on()
            print(f"LED toggled, is now: {'ON' if is_on else 'OFF'}")
            time.sleep(0.5)
            
    except Exception as e:
        print(f"Error testing internal LED: {e}")

    # Format all results as JSON
    results = {
        "accelerometer": None,
        "dht_sensor": None,
        "internal_led": None
    }
    
    try:
        accel_data = peripherals['accelerometer'].read_all()
        results["accelerometer"] = {
            "accel": [round(val, 2) for val in accel_data['accel']],
            "gyro": [round(val, 2) for val in accel_data['gyro']]
        }
    except Exception:
        pass
    
    try:
        peripherals['dht_sensor'].measure()
        results["dht_sensor"] = {
            "temperature": round(peripherals['dht_sensor'].temperature(), 1),
            "humidity": round(peripherals['dht_sensor'].humidity(), 1)
        }
    except Exception:
        pass
    
    try:
        results["internal_