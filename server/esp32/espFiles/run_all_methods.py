def run_all_methods():
    try:
        # Test accelerometer methods
        if 'accelerometer' in peripherals:
            print("Testing accelerometer...")
            try:
                accel_vals = peripherals['accelerometer'].read_accel()
                print(f"Acceleration (g): X={accel_vals[0]:.2f}, Y={accel_vals[1]:.2f}, Z={accel_vals[2]:.2f}")
            except Exception as e:
                print(f"Error reading accelerometer: {e}")
            
            try:
                gyro_vals = peripherals['accelerometer'].read_gyro()
                print(f"Gyroscope (deg/s): X={gyro_vals[0]:.2f}, Y={gyro_vals[1]:.2f}, Z={gyro_vals[2]:.2f}")
            except Exception as e:
                print(f"Error reading gyroscope: {e}")
            
            try:
                all_vals = peripherals['accelerometer'].read_all()
                print(f"All readings - Accel (g): X={all_vals['accel'][0]:.2f}, Y={all_vals['accel'][1]:.2f}, Z={all_vals['accel'][2]:.2f}")
                print(f"All readings - Gyro (deg/s): X={all_vals['gyro'][0]:.2f}, Y={all_vals['gyro'][1]:.2f}, Z={all_vals['gyro'][2]:.2f}")
            except Exception as e:
                print(f"Error reading all sensor values: {e}")
        
        # Test DHT sensor methods
        if 'dht_sensor' in peripherals:
            print("\nTesting DHT sensor...")
            try:
                peripherals['dht_sensor'].measure()
                print("DHT measurement triggered")
                
                temp = peripherals['dht_sensor'].temperature()
                print(f"Temperature: {temp:.1f}°C")
                
                humidity = peripherals['dht_sensor'].humidity()
                print(f"Humidity: {humidity:.1f}%")
            except Exception as e:
                print(f"Error with DHT sensor: {e}")
        
        # Test encoder methods
        if 'encoder' in peripherals:
            print("\nTesting encoder...")
            try:
                position = peripherals['encoder'].get_position()
                print(f"Current encoder position: {position}")
                
                print("Resetting encoder position...")
                peripherals['encoder'].reset()
                position = peripherals['encoder'].get_position()
                print(f"Position after reset: {position}")
                
                try:
                    print("Simulating 10 steps forward...")
                    peripherals['encoder'].simulate_step(10)
                    position = peripherals['encoder'].get_position()
                    print(f"Position after simulation: {position}")
                except Exception as e:
                    print(f"Note: Simulation failed, might be in hardware mode: {e}")
            except Exception as e:
                print(f"Error with encoder: {e}")
        
        # Test gas sensor methods
        if 'gas_sensor' in peripherals:
            print("\nTesting gas sensor...")
            try:
                gas_level = peripherals['gas_sensor'].read()
                print(f"Gas level: {gas_level}")
                if gas_level > 700:
                    print("Warning: High gas level detected!")
                elif gas_level > 300:
                    print("Moderate gas level detected")
                else:
                    print("Gas level normal")
            except Exception as e:
                print(f"Error with gas sensor: {e}")
                
        print("\nAll peripheral tests completed")
    
    except Exception as e:
        print(f"Error during peripheral testing: {e}")