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

peripherals = {}

# Initialize each peripheral and store in the peripherals dictionary
peripherals['accelerometer'] = MPU6050(i2c=None, addr=0x68, simulate=True)
peripherals['dht_sensor'] = DHTSensor(pin=4, sensor_type="DHT22", simulate=True)
peripherals['encoder'] = Encoder(pin_a=5, pin_b=6, simulate=True)
peripherals['gas_sensor'] = GasSensor(pin=7, analog=True, simulate=True)
peripherals['led'] = LED(pin=8, active_high=True, simulate=True)
peripherals['internal_led'] = InternalLED(simulate=False)
peripherals['motion_sensor'] = MotionSensor(pin=9, simulate=True)
peripherals['push_button'] = PushButton(pin=10, simulate=True, debounce_ms=50)
peripherals['relay'] = Relay(pin=11, active_high=True, simulate=True)
peripherals['servo_motor'] = Servo(pin=12, freq=50, min_us=500, max_us=2500, angle_range=180)
peripherals['slide_switch'] = SlideSwitch(pin=13, simulate=True)