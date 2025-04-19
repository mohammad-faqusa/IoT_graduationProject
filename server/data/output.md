# ESP32 MicroPython Peripherals Initialization Code

```python
from accelerometer import MPU6050
from dht import DHTSensor
from encoder import Encoder
from gas_sensor import GasSensor
from led import LED
from led import InternalLED
from motion_sensor import MotionSensor
from push_button import PushButton
from relay import Relay
from servo_motor import Servo
from slide_switch import SlideSwitch
from machine import Pin, I2C
import time

# Initialize I2C for the accelerometer
i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)

# Initialize all peripherals
# Using simulation mode for all peripherals except internal LED
accelerometer = MPU6050(i2c=i2c, addr=0x68, simulate=True)
dht_sensor = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
encoder = Encoder(pin_a=12, pin_b=13, simulate=True)
gas_sensor = GasSensor(pin=36, analog=True, simulate=True)
led = LED(pin=2, active_high=True, simulate=True)
internal_led = InternalLED(simulate=False)  # Using the real internal LED
motion_sensor = MotionSensor(pin=16, simulate=True)
push_button = PushButton(pin=5, simulate=True, debounce_ms=50)
relay = Relay(pin=17, active_high=True, simulate=True)
servo_motor = Servo(pin=15, freq=50, min_us=500, max_us=2500, angle_range=180)
slide_switch = SlideSwitch(pin=14, simulate=True)

def main():
    while True:
        # Read values from all sensors
        accel_x, accel_y, accel_z = accelerometer.get_values()
        temp, humidity = dht_sensor.read()
        encoder_position = encoder.get_position()
        gas_level = gas_sensor.read()
        motion_detected = motion_sensor.motion_detected()
        button_pressed = push_button.is_pressed()
        switch_state = slide_switch.get_state()
        
        # Print sensor readings
        print("Accelerometer: X={:.2f}, Y={:.2f}, Z={:.2f}".format(accel_x, accel_y, accel_z))
        print("DHT Sensor: Temperature={:.1f}°C, Humidity={:.1f}%".format(temp, humidity))
        print("Encoder Position:", encoder_position)
        print("Gas Level:", gas_level)
        print("Motion Detected:", "Yes" if motion_detected else "No")
        print("Button State:", "Pressed" if button_pressed else "Released")
        print("Switch State:", "ON" if switch_state else "OFF")
        
        # Control outputs based on inputs
        if motion_detected:
            led.on()
            internal_led.on()
            relay.on()
        else:
            led.off()
            internal_led.off()
            relay.off()
        
        # Move servo based on encoder position
        servo_angle = min(180, max(0, encoder_position % 180))
        servo_motor.set_angle(servo_angle)
        
        print("Servo Angle:", servo_angle)
        print("-" * 40)
        
        time.sleep(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Program stopped by user")
        # Clean up
        led.off()
        internal_led.off()
        relay.off()
        servo_motor.set_angle(90)  # Reset servo to middle position
```

This code initializes all the peripherals you specified with appropriate parameters, then creates a main loop that:
1. Reads values from all sensors
2. Displays the readings
3. Controls the output devices based on sensor inputs
4. Moves the servo motor based on the encoder position

The peripherals are set to simulation mode (except for the internal LED) which allows for testing without actual hardware