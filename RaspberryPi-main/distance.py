# Install gpiozero library on Raspberry Pi
from gpiozero import DistanceSensor
from time import sleep

# Trigger pin
trigPin = 23

# Echo pin 
echoPin = 24

sensor = DistanceSensor(echoPin, trigPin)

try:
    while True:
        print('Distance to nearest object is', sensor.distance, 'm')
        sleep(0.5)
except KeyboardInterrupt:
    print('GPIO cleaned up')


