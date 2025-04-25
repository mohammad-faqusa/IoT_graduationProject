def callback(topic, msg, retained, properties=None):
    print((topic.decode(), msg.decode(), retained))
    msg = msg.decode()
    msg = json.loads(msg)
    output_dict = {}
    # Process MQTT message for accelerometer
    if "accelerometer" in msg:
        if "read_accel" in msg["accelerometer"]:
            result = peripherals["accelerometer"].read_accel()
            output_dict["accelerometer"]["read_accel"] = result
        if "read_gyro" in msg["accelerometer"]:
            result = peripherals["accelerometer"].read_gyro()
            output_dict["accelerometer"]["read_gyro"] = result
        if "read_all" in msg["accelerometer"]:
            result = peripherals["accelerometer"].read_all()
            output_dict["accelerometer"]["read_all"] = result
    
    # Process MQTT message for DHT sensor
    if "dht_sensor" in msg:
        if "measure" in msg["dht_sensor"]:
            peripherals["dht_sensor"].measure()
            output_dict["dht_sensor"]["measure"] = {"status": "ok"}
        if "temperature" in msg["dht_sensor"]:
            result = peripherals["dht_sensor"].temperature()
            output_dict["dht_sensor"]["temperature"] = result
        if "humidity" in msg["dht_sensor"]:
            result = peripherals["dht_sensor"].humidity()
            output_dict["dht_sensor"]["humidity"] = result
    
    # Process MQTT message for encoder
    if "encoder" in msg:
        if "get_position" in msg["encoder"]:
            result = peripherals["encoder"].get_position()
            output_dict["encoder"]["get_position"] = result
        if "reset" in msg["encoder"]:
            peripherals["encoder"].reset()
            output_dict["encoder"]["reset"] = {"status": "ok"}
        if "simulate_step" in msg["encoder"]:
            steps = msg["encoder"]["simulate_step"]
            peripherals["encoder"].simulate_step(steps)
            output_dict["encoder"]["simulate_step"] = {"status": "ok"}
    # Check for gas_sensor-related messages
    if "gas_sensor" in msg:
        if "read" in msg["gas_sensor"]:
            output_dict["gas_sensor"]["read"] = peripherals["gas_sensor"].read()
    
    # Check for led-related messages
    if "led" in msg:
        if "on" in msg["led"]:
            peripherals["led"].on()
            output_dict["led"]["on"] = {"status": "ok"}
        if "off" in msg["led"]:
            peripherals["led"].off()
            output_dict["led"]["off"] = {"status": "ok"}
        if "toggle" in msg["led"]:
            peripherals["led"].toggle()
            output_dict["led"]["toggle"] = {"status": "ok"}
        if "is_on" in msg["led"]:
            output_dict["led"]["is_on"] = peripherals["led"].is_on()
    
    # Check for internal_led-related messages
    if "internal_led" in msg:
        if "on" in msg["internal_led"]:
            peripherals["internal_led"].on()
            output_dict["internal_led"]["on"] = {"status": "ok"}
        if "off" in msg["internal_led"]:
            peripherals["internal_led"].off()
            output_dict["internal_led"]["off"] = {"status": "ok"}
        if "toggle" in msg["internal_led"]:
            peripherals["internal_led"].toggle()
            output_dict["internal_led"]["toggle"] = {"status": "ok"}
        if "is_on" in msg["internal_led"]:
            output_dict["internal_led"]["is_on"] = peripherals["internal_led"].is_on()
    # Check for motion_sensor peripheral
    if "motion_sensor" in msg:
        # Initialize peripheral data in output_dict if not already present
        if "motion_sensor" not in output_dict:
            output_dict["motion_sensor"] = {}
        
        # Handle read methods
        if "read" in msg["motion_sensor"]:
            result = peripherals["motion_sensor"].read()
            output_dict["motion_sensor"]["read"] = result
        
        # Handle write methods
        if "wait_for_motion" in msg["motion_sensor"]:
            timeout = msg["motion_sensor"]["wait_for_motion"].get("timeout", 10)
            result = peripherals["motion_sensor"].wait_for_motion(timeout)
            output_dict["motion_sensor"]["wait_for_motion"] = result
    
    # Check for push_button peripheral
    if "push_button" in msg:
        # Initialize peripheral data in output_dict if not already present
        if "push_button" not in output_dict:
            output_dict["push_button"] = {}
        
        # Handle read methods
        if "is_pressed" in msg["push_button"]:
            result = peripherals["push_button"].is_pressed()
            output_dict["push_button"]["is_pressed"] = result
        
        if "get_event" in msg["push_button"]:
            result = peripherals["push_button"].get_event()
            output_dict["push_button"]["get_event"] = result
        
        # Handle write methods
        if "set_simulated_state" in msg["push_button"]:
            pressed = msg["push_button"]["set_simulated_state"].get("pressed", False)
            peripherals["push_button"].set_simulated_state(pressed)
            output_dict["push_button"]["set_simulated_state"] = {"status": "ok"}
        
        if "push" in msg["push_button"]:
            peripherals["push_button"].push()
            output_dict["push_button"]["push"] = {"status": "ok"}
    
    # Check for relay peripheral
    if "relay" in msg:
        # Initialize peripheral data in output_dict if not already present
        if "relay" not in output_dict:
            output_dict["relay"] = {}
        
        # Handle read methods
        if "is_on" in msg["relay"]:
            result = peripherals["relay"].is_on()
            output_dict["relay"]["is_on"] = result
        
        # Handle write methods
        if "on" in msg["relay"]:
            peripherals["relay"].on()
            output_dict["relay"]["on"] = {"status": "ok"}
        
        if "off" in msg["relay"]:
            peripherals["relay"].off()
            output_dict["relay"]["off"] = {"status": "ok"}
        
        if "toggle" in msg["relay"]:
            peripherals["relay"].toggle()
            output_dict["relay"]["toggle"] = {"status": "ok"}
    # Check for servo_motor methods
    if "servo_motor" in msg:
        # Handle read methods
        if "read_angle" in msg["servo_motor"]:
            result = peripherals["servo_motor"].read_angle()
            output_dict["servo_motor"]["read_angle"] = result
        
        if "read_us" in msg["servo_motor"]:
            result = peripherals["servo_motor"].read_us()
            output_dict["servo_motor"]["read_us"] = result
        
        # Handle write methods
        if "write_angle" in msg["servo_motor"]:
            angle = msg["servo_motor"]["write_angle"]["angle"]
            peripherals["servo_motor"].write_angle(angle)
            output_dict["servo_motor"]["write_angle"] = {"status": "ok"}
        
        if "write_us" in msg["servo_motor"]:
            us = msg["servo_motor"]["write_us"]["us"]
            peripherals["servo_motor"].write_us(us)
            output_dict["servo_motor"]["write_us"] = {"status": "ok"}
        
        if "deinit" in msg["servo_motor"]:
            peripherals["servo_motor"].deinit()
            output_dict["servo_motor"]["deinit"] = {"status": "ok"}
    
    # Check for slide_switch methods
    if "slide_switch" in msg:
        # Handle read methods
        if "read" in msg["slide_switch"]:
            result = peripherals["slide_switch"].read()
            output_dict["slide_switch"]["read"] = result
        
        if "state" in msg["slide_switch"]:
            result = peripherals["slide_switch"].state
            output_dict["slide_switch"]["state"] = result
        
        # Handle write methods
        if "set_simulated_state" in msg["slide_switch"]:
            state = msg["slide_switch"]["set_simulated_state"]["state"]
            peripherals["slide_switch"].set_simulated_state(state)
            output_dict["slide_switch"]["set_simulated_state"] = {"status": "ok"}
    # Run the async sender from sync context
    asyncio.create_task(send_message(output_dict))