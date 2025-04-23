def run_all_methods():
    try:
        # Test Accelerometer (MPU6050)
        if "accelerometer" in peripherals:
            print("\n--- Testing Accelerometer (MPU6050) ---")
            try:
                accel = peripherals["accelerometer"].read_accel()
                print(f"Accelerometer readings (g): X={accel[0]:.2f}, Y={accel[1]:.2f}, Z={accel[2]:.2f}")
            except Exception as e:
                print(f"Error reading accelerometer: {e}")
                
            try:
                gyro = peripherals["accelerometer"].read_gyro()
                print(f"Gyroscope readings (deg/s): X={gyro[0]:.2f}, Y={gyro[1]:.2f}, Z={gyro[2]:.2f}")
            except Exception as e:
                print(f"Error reading gyroscope: {e}")
                
            try:
                all_data = peripherals["accelerometer"].read_all()
                print(f"All data - Accel (g): X={all_data['accel'][0]:.2f}, Y={all_data['accel'][1]:.2f}, Z={all_data['accel'][2]:.2f}")
                print(f"All data - Gyro (deg/s): X={all_data['gyro'][0]:.2f}, Y={all_data['gyro'][1]:.2f}, Z={all_data['gyro'][2]:.2f}")
            except Exception as e:
                print(f"Error reading all MPU6050 data: {e}")

        # Test DHT Sensor
        if "dht_sensor" in peripherals:
            print("\n--- Testing DHT Sensor ---")
            try:
                peripherals["dht_sensor"].measure()
                print("DHT sensor measurement triggered")
                temp = peripherals["dht_sensor"].temperature()
                humid = peripherals["dht_sensor"].humidity()
                print(f"Temperature: {temp:.1f}°C, Humidity: {humid:.1f}%")
            except Exception as e:
                print(f"Error with DHT sensor: {e}")

        # Test Encoder
        if "encoder" in peripherals:
            print("\n--- Testing Encoder ---")
            try:
                pos = peripherals["encoder"].get_position()
                print(f"Current encoder position: {pos}")
                peripherals["encoder"].reset()
                print("Encoder reset to zero")
                # Testing simulate_step only if we're in simulation mode
                try:
                    peripherals["encoder"].simulate_step(5)
                    new_pos = peripherals["encoder"].get_position()
                    print(f"After simulating 5 steps, position: {new_pos}")
                except:
                    print("simulate_step not available (not in simulation mode)")
            except Exception as e:
                print(f"Error with encoder: {e}")

        # Test Gas Sensor
        if "gas_sensor" in peripherals:
            print("\n--- Testing Gas Sensor ---")
            try:
                gas_level = peripherals["gas_sensor"].read()
                print(f"Gas level: {gas_level}")
            except Exception as e:
                print(f"Error with gas sensor: {e}")

        # Test LED
        if "led" in peripherals:
            print("\n--- Testing LED ---")
            try:
                peripherals["led"].on()
                print("LED turned ON")
                is_on = peripherals["led"].is_on()
                print(f"LED is on: {is_on}")
                peripherals["led"].toggle()
                print("LED toggled")
                is_on = peripherals["led"].is_on()
                print(f"LED is on after toggle: {is_on}")
                peripherals["led"].off()
                print("LED turned OFF")
            except Exception as e:
                print(f"Error with LED: {e}")

        # Test Internal LED
        if "internal_led" in peripherals:
            print("\n--- Testing Internal LED ---")
            try:
                peripherals["internal_led"].on()
                print