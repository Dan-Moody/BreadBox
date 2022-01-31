import Adafruit_DHT
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

DHTSensor = Adafruit_DHT.DHT11
GPIO_Pin = 17
while True:
    humidity, temperature = Adafruit_DHT.read_retry(DHTSensor, GPIO_Pin)
    print("Temperature: " + str(temperature) + " Humidity: " + str(humidity) + "\n")
    time.sleep(3)

