from relay import Relay

def main():
    peripherals = {}
    
    # Initialize relay
    peripherals['relay'] = Relay(pin=5, active_high=True, simulate=True)
    
    # Your application code would go here
    
if __name__ == "__main__":
    main()

def run_all_methods(peripherals):
    try:
        import time
        print("Testing Relay peripheral...")
        
        # Get the relay object from peripherals dictionary
        relay = peripherals["relay"]
        
        # Test turning the relay on
        try:
            print("Turning relay ON...")
            relay.on()
            time.sleep(1)  # Wait a second to observe the change
            
            # Check if relay is on
            state = relay.is_on()
            print(f"Relay is ON: {state}")
            
        except Exception as e:
            print(f"Error turning relay ON: {e}")
        
        # Test turning the relay off
        try:
            print("Turning relay OFF...")
            relay.off()
            time.sleep(1)  # Wait a second to observe the change
            
            # Check if relay is off
            state = relay.is_on()
            print(f"Relay is ON: {state}")  # Should be False
            
        except Exception as e:
            print(f"Error turning relay OFF: {e}")
        
        # Test toggling the relay
        try:
            print("Toggling relay...")
            relay.toggle()  # Should turn ON if currently OFF
            time.sleep(1)
            
            print("Relay state after first toggle:", relay.is_on())
            
            print("Toggling relay again...")
            relay.toggle()  # Should turn OFF if currently ON
            time.sleep(1)
            
            print("Relay state after second toggle:", relay.is_on())
            
        except Exception as e:
            print(f"Error toggling relay: {e}")
        
        # Final state - ensure relay is off when done
        try:
            if relay.is_on():
                relay.off()
            print("Relay test completed!")
            
        except Exception as e:
            print(f"Error in final relay state check: {e}")
    
    except KeyError:
        print("Relay peripheral not found in the peripherals dictionary")
    except Exception as e:
        print(f"Unexpected error in relay test: {e}")