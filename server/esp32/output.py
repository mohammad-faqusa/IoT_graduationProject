I'll generate MicroPython ESP32 code to initialize all these peripherals. Here's the complete code:

```python
from machine import Pin, I2C, ADC, PWM
import time

# Import peripheral classes
from accelerometer import MPU6050
from dht_sensor import DHTSensor
from encoder import Encoder
from gas_sensor import GasSensor
from led import LED
from led import InternalLED
from motion_sensor import MotionSensor
from push_button import PushButton
from relay import Relay
from servo_motor import Servo
from slide_switch import SlideSwitch

def main():
    # Initialize I2C for devices that need it
    i2c = I2C(0, scl=Pin(22), sda=Pin(21), freq=400000)
    
    # Initialize all peripherals with simulation enabled for most components
    # for development and testing purposes
    
    # MPU6050 accelerometer on I2C bus
    accelerometer = MPU6050(i2c=i2c, addr=0x68, simulate=True)
    
    # DHT22 temperature and humidity sensor on pin 15
    dht_sensor = DHTSensor(pin=15, sensor_type="DHT22", simulate=True)
    
    # Rotary encoder on pins 32 and 33
    encoder = Encoder(pin_a=32, pin_b=33, simulate=True)
    
    # Gas sensor on analog pin 34
    gas_sensor = GasSensor(pin=34, analog=True, simulate=True)
    
    # External LED on pin 16
    led = LED(pin=16, active_high=True, simulate=True)
    
    # Internal (built-in) LED of ESP32 board
    internal_led = InternalLED(simulate=False)  # Usually best to use the real internal LED
    
    # PIR motion sensor on pin 17
    motion_sensor = MotionSensor(pin=17, simulate=True)
    
    # Push button on pin 18 with 50ms debounce
    push_button = PushButton(pin=18, simulate=True, debounce_ms=50)
    
    # Relay on pin 19
    relay = Relay(pin=19, active_high=True, simulate=True)
    
    # Servo motor on pin 23
    servo_motor = Servo(pin=23, freq=50, min_us=500, max_us=2500, angle_range=180)
    
    # Slide switch on pin 25
    slide_switch = SlideSwitch(pin=25, simulate=True)
    
    print("All peripherals initialized successfully")
    
    # Basic usage example loop
    try:
        while True:
            # Read accelerometer data
            accel_data = accelerometer.read_acceleration()
            print(f"Accelerometer: X={accel_data[0]:.2f}, Y={accel_data[1]:.2f}, Z={accel_data[2]:.2f}")
            
            # Read temperature and humidity
            temp, humidity = dht_sensor.read()
            print(f"Temperature: {temp}°C, Humidity: {humidity}%")
            
            # Check encoder position
            position = encoder.read_position()
            print(f"Encoder position: {position}")
            
            # Read gas sensor
            gas_level = gas_sensor.read()
            print(f"Gas level: {gas_level}")
            
            # Toggle external LED
            led.toggle()
            print(f"LED state: {led.state()}")
            
            # Blink internal LED
            internal_led.toggle()
            
            # Check motion sensor
            motion = motion_sensor.detect()
            print(f"Motion detected: {motion}")
            
            # Read button state
            button_state = push_button.is_pressed()
            print(f"Button pressed: {button_state}")
            
            # Toggle relay every 5 seconds
            relay.toggle()
            print(f"Relay state: {relay.state()}")
            
            # Move servo to different positions
            servo_motor.set_angle(0)
            time.sleep(