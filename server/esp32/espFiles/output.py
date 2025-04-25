# Check for accelerometer methods
if "accelerometer" in msg:
    # Read methods
    if "read_accel" in msg["accelerometer"]:
        result = peripherals["accelerometer"].read_accel()
        output_dict["accelerometer"]["read_accel"] = result
    
    if "read_gyro" in msg["accelerometer"]:
        result = peripherals["accelerometer"].read_gyro()
        output_dict["accelerometer"]["read_gyro"] = result
    
    if "read_all" in msg["accelerometer"]:
        result = peripherals["accelerometer"].read_all()
        output_dict["accelerometer"]["read_all"] = result

# Check for DHT sensor methods
if "dht_sensor" in msg:
    # Write methods
    if "measure" in msg["dht_sensor"]:
        peripherals["dht_sensor"].measure()
        output_dict["dht_sensor"]["measure"] = {"status": "ok"}
    
    # Read methods
    if "temperature" in msg["dht_sensor"]:
        result = peripherals["dht_sensor"].temperature()
        output_dict["dht_sensor"]["temperature"] = result
    
    if "humidity" in msg["dht_sensor"]:
        result = peripherals["dht_sensor"].humidity()
        output_dict["dht_sensor"]["humidity"] = result

# Check for encoder methods
if "encoder" in msg:
    # Read methods
    if "get_position" in msg["encoder"]:
        result = peripherals["encoder"].get_position()
        output_dict["encoder"]["get_position"] = result
    
    # Write methods
    if "reset" in msg["encoder"]:
        peripherals["encoder"].reset()
        output_dict["encoder"]["reset"] = {"status": "ok"}
    
    if "simulate_step" in msg["encoder"]:
        steps = msg["encoder"]["simulate_step"]
        peripherals["encoder"].simulate_step(steps)
        output_dict["encoder"]["simulate_step"] = {"status": "ok"}