from push_button import PushButton
from relay import Relay
from servo_motor import Servo
from slide_switch import SlideSwitch

peripherals = {}
peripherals["push_button"] = PushButton(pin=0, simulate=True, debounce_ms=50)
peripherals["relay"] = Relay(pin=0, active_high=True, simulate=True)
peripherals["servo_motor"] = Servo(pin=0, freq=50, min_us=500, max_us=2500, angle_range=180)
peripherals["slide_switch"] = SlideSwitch(pin=0, simulate=True)

def run_all_methods(peripherals):
    import time
    import json
    from machine import Pin
    
    # Test each peripheral with appropriate try-except blocks
    try:
        print("Testing push button...")
        push_button = peripherals['push_button']
        
        # Test is_pressed method
        print(f"Button pressed: {push_button.is_pressed()}")
        
        # Test set_simulated_state method
        push_button.set_simulated_state(True)
        print(f"After simulation, button pressed: {push_button.is_pressed()}")
        push_button.set_simulated_state(False)
        print(f"After simulation released, button pressed: {push_button.is_pressed()}")
        
        # Test push method
        push_button.push()
        print("Button push simulated")
        
        # Test get_event method
        event = push_button.get_event()
        print(f"Button event detected: {event}")
        
    except KeyError:
        print("Push button peripheral not found")
    except Exception as e:
        print(f"Error testing push button: {e}")
    
    try:
        print("\nTesting relay...")
        relay = peripherals['relay']
        
        # Test on method
        relay.on()
        print("Relay turned ON")
        
        # Test is_on method
        print(f"Relay is ON: {relay.is_on()}")
        
        # Test off method
        relay.off()
        print("Relay turned OFF")
        print(f"Relay is ON: {relay.is_on()}")
        
        # Test toggle method
        relay.toggle()
        print("Relay toggled")
        print(f"Relay is ON: {relay.is_on()}")
        
    except KeyError:
        print("Relay peripheral not found")
    except Exception as e:
        print(f"Error testing relay: {e}")
    
    try:
        print("\nTesting servo motor...")
        servo_motor = peripherals['servo_motor']
        
        # Test write_angle method
        servo_motor.write_angle(0)
        print("Servo positioned at 0 degrees")
        time.sleep(1)
        
        servo_motor.write_angle(90)
        print("Servo positioned at 90 degrees")
        time.sleep(1)
        
        servo_motor.write_angle(180)
        print("Servo positioned at 180 degrees")
        time.sleep(1)
        
        # Test write_us method
        servo_motor.write_us(1000)
        print("Servo pulse width set to 1000μs")
        time.sleep(1)
        
        servo_motor.write_us(1500)
        print("Servo pulse width set to 1500μs")
        time.sleep(1)
        
        servo_motor.write_us(2000)
        print("Servo pulse width set to 2000μs")
        time.sleep(1)
        
        # Test get_state method
        state = servo_motor.get_state()
        print(f"Servo state: {json.dumps(state)}")
        
        # Test deinit method
        servo_motor.deinit()
        print("Servo deinitialized")
        
    except KeyError:
        print("Servo motor peripheral not found")
    except Exception as e:
        print(f"Error testing servo motor: {e}")
    try:
        import time
        
        # Try to access slide_switch peripheral
        if 'slide_switch' in peripherals:
            # Test set_simulated_state method
            try:
                print("Testing slide switch set_simulated_state method...")
                peripherals['slide_switch'].set_simulated_state(True)
                print("Set simulated state to ON")
                time.sleep(0.5)
                peripherals['slide_switch'].set_simulated_state(False)
                print("Set simulated state to OFF")
            except Exception as e:
                print(f"Error testing set_simulated_state: {e}")
            
            # Test read method
            try:
                print("Testing slide switch read method...")
                state = peripherals['slide_switch'].read()
                print(f"Current switch state (read method): {'ON' if state else 'OFF'}")
            except Exception as e:
                print(f"Error testing read method: {e}")
            
            # Test state property
            try:
                print("Testing slide switch state property...")
                state = peripherals['slide_switch'].state
                print(f"Current switch state (state property): {'ON' if state else 'OFF'}")
            except Exception as e:
                print(f"Error testing state property: {e}")
                
            # Test toggling between states
            try:
                print("Testing switch toggle sequence...")
                peripherals['slide_switch'].set_simulated_state(True)
                time.sleep(0.2)
                print(f"State after setting ON: {'ON' if peripherals['slide_switch'].read() else 'OFF'}")
                
                peripherals['slide_switch'].set_simulated_state(False)
                time.sleep(0.2)
                print(f"State after setting OFF: {'ON' if peripherals['slide_switch'].state else 'OFF'}")
            except Exception as e:
                print(f"Error testing toggle sequence: {e}")
        else:
            print("Slide switch peripheral not found in peripherals dictionary")
            
    except ImportError:
        print("Failed to import required modules")
    except Exception as e:
        print(f"Unexpected error: {e}")