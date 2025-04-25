
def run_all_methods(peripherals):
    import time
    
    # Test for accelerometer
    try:
        accel = peripherals['accelerometer']
        accel_values = accel.read_accel()
        print(f"Accelerometer readings (g): X={accel_values[0]:.2f}, Y={accel_values[1]:.2f}, Z={accel_values[2]:.2f}")
        
        gyro_values = accel.read_gyro()
        print(f"Gyroscope readings (deg/s): X={gyro_values[0]:.2f}, Y={gyro_values[1]:.2f}, Z={gyro_values[2]:.2f}")
        
        all_values = accel.read_all()
        print(f"Combined readings:")
        print(f"  Accelerometer (g): X={all_values['accel'][0]:.2f}, Y={all_values['accel'][1]:.2f}, Z={all_values['accel'][2]:.2f}")
        print(f"  Gyroscope (deg/s): X={all_values['gyro'][0]:.2f}, Y={all_values['gyro'][1]:.2f}, Z={all_values['gyro'][2]:.2f}")
    except KeyError:
        print("Accelerometer not found in peripherals")
    except Exception as e:
        print(f"Error accessing accelerometer: {e}")
    
    # Test for encoder
    try:
        encoder = peripherals['encoder']
        position = encoder.get_position()
        print(f"Current encoder position: {position}")
        
        print("Resetting encoder position...")
        encoder.reset()
        position = encoder.get_position()
        print(f"Encoder position after reset: {position}")
        
        try:
            print("Simulating 10 steps forward...")
            encoder.simulate_step(10)
            position = encoder.get_position()
            print(f"Encoder position after simulation: {position}")
        except AttributeError:
            print("Encoder simulation not available (not in simulate mode)")
    except KeyError:
        print("Encoder not found in peripherals")
    except Exception as e:
        print(f"Error accessing encoder: {e}")
    
    # Test for LED
    try:
        led = peripherals['led']
        print("Turning LED on...")
        led.on()
        time.sleep(0.5)
        
        led_state = led.is_on()
        print(f"LED state after turning on: {'ON' if led_state else 'OFF'}")
        
        print("Toggling LED...")
        led.toggle()
        time.sleep(0.5)
        
        led_state = led.is_on()
        print(f"LED state after toggle: {'ON' if led_state else 'OFF'}")
        
        print("Turning LED off...")
        led.off()
        time.sleep(0.5)
        
        led_state = led.is_on()
        print(f"LED state after turning off: {'ON' if led_state else 'OFF'}")
    except KeyError:
        print("LED not found in peripherals")
    except Exception as e:
        print(f"Error accessing LED: {e}")
    try:
        import time
        
        # Test push_button functionality
        try:
            push_button = peripherals['push_button']
            
            # Test setting simulated state (only works in simulation)
            try:
                push_button.set_simulated_state(True)
                print("Push button simulated press successful")
                time.sleep(0.5)
                push_button.set_simulated_state(False)
                print("Push button simulated release successful")
            except Exception as e:
                print(f"Error in set_simulated_state: {e}")
            
            # Test is_pressed method
            try:
                pressed = push_button.is_pressed()
                print(f"Button is {'pressed' if pressed else 'released'}")
            except Exception as e:
                print(f"Error in is_pressed: {e}")
            
            # Test push method (simulation only)
            try:
                push_button.push()
                print("Button push simulation successful")
            except Exception as e:
                print(f"Error in push: {e}")
            
            # Test get_event method
            try:
                event = push_button.get_event()
                print(f"Button event detected: {'Yes' if event else 'No'}")
            except Exception as e:
                print(f"Error in get_event: {e}")
                
        except KeyError:
            print("Push button peripheral not found in peripherals dictionary")
        except Exception as e:
            print(f"Error accessing push button: {e}")
            
    except ImportError:
        print("Failed to import required modules")
    except Exception as e:
        print(f"General error: {e}")