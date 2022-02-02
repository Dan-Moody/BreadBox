from flask import Flask, render_template, url_for, request, jsonify, session
import Adafruit_DHT
import RPi.GPIO as GPIO
import time
from threading import *

app = Flask(__name__)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

DHTSensor = Adafruit_DHT.DHT11
GPIO_Pin = 17

setTemp = 70
currTemp = 0
currHumid = 0

isRunning = False
isLightOn = False

def maintainTemp():
	global currTemp
	global currHumid
	global setTemp
	global isRunning
	global isLightOn
	while True:
		currHumid, currTemp = Adafruit_DHT.read_retry(DHTSensor, GPIO_Pin)
		print("Temperature: " + str(currTemp) + " Humidity: " + str(currHumid) + "\n")
		time.sleep(3)

print("here2")
pollSensor = Thread(name='Sensor', target=maintainTemp, daemon=True)
pollSensor.start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sensorData', methods=['POST','GET'])
def sensorData():
	global currTemp
	global currHumid
	global isRunning
	global isLightOn
	global setTemp
	if request.method == "POST":
		temp = request.args.get('temp')
		print("set temp post")
		print(temp)
		print(request)
		setTemp = temp
		isRunning = True
		results = {
			'isRunning': isRunning,
			'setTemp': setTemp
		}
	if request.method == "GET":
		results = {
			'humidity': currHumid,
			'temperature': currTemp,
			'isRunning': isRunning,
			'isLightOn': isLightOn,
			'setTemp': setTemp
		}
	return jsonify(results)

@app.route('/turnOff')
def turnOff():
	global isRunning
	global setTemp
	isRunning = False
	results = {
			'isRunning': isRunning,
			'setTemp': setTemp
	}
	return jsonify(results)


if __name__ == '__main__':
	app.run(debug=True,port=8080, host='0.0.0.0')
