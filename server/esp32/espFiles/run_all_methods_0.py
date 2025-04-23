# Test accelerometer (MPU6050)
try:
    # Read acceleration values
    accel = peripherals['accelerometer'].read_accel()
    print(f"Accelerometer (X, Y, Z) [g]: {accel}")
    
    # Read gyroscope values
    gyro = peripherals['accelerometer'].read_gyro()
    print(f"Gyroscope (X, Y, Z) [deg/s]: {gyro}")
    
    # Read both at once
    all_data = peripherals['accelerometer'].read_all()
    print(f"Combined data:")
    print(f"- Accelerometer: {all_data['accel']}")
    print(f"- Gyroscope: {all_data['gyro']}")
except Exception as e:
    print(f"Error testing accelerometer: {e}")

# Test DHT sensor
try:
    # Trigger measurement
    peripherals['dht_sensor'].measure()
    
    # Read temperature and humidity
    temp = peripherals['dht_sensor'].temperature()
    humidity = peripherals['dht_sensor'].humidity()
    
    print(f"Temperature: {temp} °C")
    print(f"Humidity: {humidity} %")
except Exception as e:
    print(f"Error testing DHT sensor: {e}")

# Test encoder
try:
    # Get current position
    position = peripherals['encoder'].get_position()
    print(f"Encoder position: {position}")
    
    # Test simulated steps (only works if in simulation mode)
    try:
        peripherals['encoder'].simulate_step(5)
        print(f"After +5 steps: {peripherals['encoder'].get_position()}")
        
        peripherals['encoder'].simulate_step(-2)
        print(f"After -2 steps: {peripherals['encoder'].get_position()}")
    except AttributeError:
        print("Simulation mode not available")
    
    # Reset encoder
    peripherals['encoder'].reset()
    print(f"After reset: {peripherals['encoder'].get_position()}")
except Exception as e:
    print(f"Error testing encoder: {e}")