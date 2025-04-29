def read_methods(peripherals):
    result = {}
    for peripheral_name, peripheral_obj in peripherals.items():
        try:
            # Check if 'accelerometer' is in peripherals and initialize result structure if needed
            if 'accelerometer' in peripherals and 'accelerometer' not in result:
                result['accelerometer'] = {'err': {}}
            
            # Call read_accel method for accelerometer
            if 'accelerometer' in peripherals:
                try:
                    result['accelerometer']['read_accel'] = peripherals['accelerometer'].read_accel()
                except Exception as err:
                    result['accelerometer']['err']['read_accel'] = str(err)
                    
                # Call read_gyro method for accelerometer
                try:
                    result['accelerometer']['read_gyro'] = peripherals['accelerometer'].read_gyro()
                except Exception as err:
                    result['accelerometer']['err']['read_gyro'] = str(err)
                    
                # Call read_all method for accelerometer
                try:
                    result['accelerometer']['read_all'] = peripherals['accelerometer'].read_all()
                except Exception as err:
                    result['accelerometer']['err']['read_all'] = str(err)
            
            # Check if 'dht_sensor' is in peripherals and initialize result structure if needed
            if 'dht_sensor' in peripherals and 'dht_sensor' not in result:
                result['dht_sensor'] = {'err': {}}
            
            # Call temperature method for dht_sensor
            if 'dht_sensor' in peripherals:
                try:
                    result['dht_sensor']['temperature'] = peripherals['dht_sensor'].temperature()
                except Exception as err:
                    result['dht_sensor']['err']['temperature'] = str(err)
                    
                # Call humidity method for dht_sensor
                try:
                    result['dht_sensor']['humidity'] = peripherals['dht_sensor'].humidity()
                except Exception as err:
                    result['dht_sensor']['err']['humidity'] = str(err)
            
            # Check if 'encoder' is in peripherals and initialize result structure if needed
            if 'encoder' in peripherals and 'encoder' not in result:
                result['encoder'] = {'err': {}}
            
            # Call get_position method for encoder
            if 'encoder' in peripherals:
                try:
                    result['encoder']['get_position'] = peripherals['encoder'].get_position()
                except Exception as err:
                    result['encoder']['err']['get_position'] = str(err)
        
        except Exception as err:
            print(f"Error in read process: {err}")
        # For the peripheral gas_sensor with method 'read'
        if peripheral_name == 'gas_sensor':
            if 'read' not in result[peripheral_name]:
                result[peripheral_name]['read'] = {}
            try:
                result[peripheral_name]['read']['value'] = peripheral_obj.read()
                result[peripheral_name]['read']['status'] = 'success'
            except Exception as err:
                result[peripheral_name]['read']['status'] = 'error'
                if 'err' not in result[peripheral_name]:
                    result[peripheral_name]['err'] = {}
                result[peripheral_name]['err']['read'] = str(err)
        
        # For the peripheral led with method 'is_on'
        elif peripheral_name == 'led':
            if 'is_on' not in result[peripheral_name]:
                result[peripheral_name]['is_on'] = {}
            try:
                result[peripheral_name]['is_on']['value'] = peripheral_obj.is_on()
                result[peripheral_name]['is_on']['status'] = 'success'
            except Exception as err:
                result[peripheral_name]['is_on']['status'] = 'error'
                if 'err' not in result[peripheral_name]:
                    result[peripheral_name]['err'] = {}
                result[peripheral_name]['err']['is_on'] = str(err)
        
        # For the peripheral internal_led with method 'is_on'
        elif peripheral_name == 'internal_led':
            if 'is_on' not in result[peripheral_name]:
                result[peripheral_name]['is_on'] = {}
            try:
                result[peripheral_name]['is_on']['value'] = peripheral_obj.is_on()
                result[peripheral_name]['is_on']['status'] = 'success'
            except Exception as err:
                result[peripheral_name]['is_on']['status'] = 'error'
                if 'err' not in result[peripheral_name]:
                    result[peripheral_name]['err'] = {}
                result[peripheral_name]['err']['is_on'] = str(err)
        if peripheral_name not in result:
            result[peripheral_name] = {'val': {}, 'err': {}}
        
        if peripheral_name == "motion_sensor":
            try:
                result[peripheral_name]['val']['read'] = peripheral_obj.read()
            except Exception as err:
                result[peripheral_name]['err']['read'] = str(err)
        
        elif peripheral_name == "push_button":
            try:
                result[peripheral_name]['val']['is_pressed'] = peripheral_obj.is_pressed()
            except Exception as err:
                result[peripheral_name]['err']['is_pressed'] = str(err)
            
            try:
                result[peripheral_name]['val']['get_event'] = peripheral_obj.get_event()
            except Exception as err:
                result[peripheral_name]['err']['get_event'] = str(err)
        
        elif peripheral_name == "relay":
            try:
                result[peripheral_name]['val']['is_on'] = peripheral_obj.is_on()
            except Exception as err:
                result[peripheral_name]['err']['is_on'] = str(err)
        try:
            if isinstance(peripheral_obj, dict) and 'type' in peripheral_obj and peripheral_obj['type'] == 'servo_motor':
                try:
                    result[peripheral_name]['read_angle'] = peripheral_obj.read_angle()
                except Exception as err:
                    result[peripheral_name]['err']['read_angle'] = err
                
                try:
                    result[peripheral_name]['read_us'] = peripheral_obj.read_us()
                except Exception as err:
                    result[peripheral_name]['err']['read_us'] = err
            
            elif isinstance(peripheral_obj, dict) and 'type' in peripheral_obj and peripheral_obj['type'] == 'slide_switch':
                try:
                    result[peripheral_name]['read'] = peripheral_obj.read()
                except Exception as err:
                    result[peripheral_name]['err']['read'] = err
                
                try:
                    result[peripheral_name]['state'] = peripheral_obj.state
                except Exception as err:
                    result[peripheral_name]['err']['state'] = err
            
            elif hasattr(peripheral_obj, 'read_angle') and callable(getattr(peripheral_obj, 'read_angle')):
                try:
                    result[peripheral_name]['read_angle'] = peripheral_obj.read_angle()
                except Exception as err:
                    result[peripheral_name]['err']['read_angle'] = err
                
                try:
                    result[peripheral_name]['read_us'] = peripheral_obj.read_us()
                except Exception as err:
                    result[peripheral_name]['err']['read_us'] = err
            
            elif hasattr(peripheral_obj, 'read') and callable(getattr(peripheral_obj, 'read')):
                try:
                    result[peripheral_name]['read'] = peripheral_obj.read()
                except Exception as err:
                    result[peripheral_name]['err']['read'] = err
                
                if hasattr(peripheral_obj, 'state'):
                    try:
                        result[peripheral_name]['state'] = peripheral_obj.state
                    except Exception as err:
                        result[peripheral_name]['err']['state'] = err
        except Exception as err:
            result[peripheral_name]['err']['general'] = str(err)
    return result