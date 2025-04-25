from accelerometer import MPU6050
from encoder import Encoder
from led import LED
from push_button import PushButton

# Initialize peripherals pin mapping
peripherals_pins = {
    'accelerometer': {'sda': 21, 'scl': 22},
    'encoder': {'pin_a': 25, 'pin_b': 26},
    'led': {'pin': 2},
    'push_button': {'pin': 4}
}

# Initialize peripherals dictionary
peripherals = {}

# Initialize MPU6050 accelerometer (using default values)
peripherals['accelerometer'] = MPU6050(simulate=True)

# Initialize Encoder
peripherals['encoder'] = Encoder(
    pin_a=peripherals_pins['encoder']['pin_a'],
    pin_b=peripherals_pins['encoder']['pin_b'],
    simulate=True
)

# Initialize LED
peripherals['led'] = LED(
    pin=peripherals_pins['led']['pin'],
    active_high=True,
    simulate=True
)

# Initialize PushButton
peripherals['push_button'] = PushButton(
    pin=peripherals_pins['push_button']['pin'],
    simulate=True,
    debounce_ms=50
)