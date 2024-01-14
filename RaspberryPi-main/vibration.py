from gpiozero import MotionSensor, LED 
from time import sleep

pir = MotionSensor(16,threshold=0.01) 
while True:
    if (pir.motion_detected):
        print("motion detected")
        sleep(1)
    sleep(.1)