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

# Initialize all peripherals and store in peripherals dictionary
peripherals = {}

# Initialize MPU6050 accelerometer with default values
peripherals["accelerometer"] = MPU6050(simulate=True)

# Initialize DHT sensor on pin 4 with DHT22 type
peripherals["dht_sensor"] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)

# Initialize Encoder on pins 12 and 13
peripherals["encoder"] = Encoder(pin_a=12, pin_b=13, simulate=True)

# Initialize Gas sensor on pin 32 (analog)
peripherals["gas_sensor"] = GasSensor(pin=32, analog=True, simulate=True)

# Initialize LED on pin 2
peripherals["led"] = LED(pin=2, active_high=True, simulate=True)

# Initialize internal LED
peripherals["internal_led"] = InternalLED(simulate=False)

# Initialize motion sensor on pin 14
peripherals["motion_sensor"] = MotionSensor(pin=14, simulate=True)

# Initialize push button on pin 5 with 50ms debounce
peripherals["push_button"] = PushButton(pin=5, simulate=True, debounce_ms=50)

# Initialize relay on pin 15
peripherals["relay"] = Relay(pin=15, active_high=True, simulate=True)

# Initialize servo motor on pin 18
peripherals["servo_motor"] = Servo(pin=18, freq=50, min_us=500, max_us=2500, angle_range=180)

# Initialize slide switch on pin 23
peripherals["slide_switch"] = SlideSwitch(pin=23, simulate=True)