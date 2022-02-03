import Adafruit_DHT
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

DHTSensor = Adafruit_DHT.DHT11
GPIO_Pin = 19
GPIO.setup(GPIO_Pin, GPIO.OUT)
time.sleep(3)
GPIO.output(GPIO_Pin, 1)
time.sleep(3)
GPIO.output(GPIO_Pin, 0)

#while True:
#    humidity, temperature = Adafruit_DHT.read_retry(DHTSensor, GPIO_Pin)
#    print("Temperature: " + str(temperature) + " Humidity: " + str(humidity) + "\n")
#    time.sleep(3)

