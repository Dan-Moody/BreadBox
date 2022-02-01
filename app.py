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

setTemp = 0
currTemp = 0
currHumid = 0

def maintainTemp():
	global currTemp
	global currHumid
	global setTemp
	while True:
		currHumid, currTemp = Adafruit_DHT.read_retry(DHTSensor, GPIO_Pin)
		print("Temperature: " + str(currTemp) + " Humidity: " + str(currHumid) + "\n")
		time.sleep(3)

pollSensor = Thread(name='Sensor', target=maintainTemp, daemon=True)
pollSensor.start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sensorData', methods=['POST','GET'])
def sensorData():
	if request.method == "GET":
		global setTemp
		global currTemp
		global currHumid
		temp = request.args.get('temp')
		print("daniel temp: " + temp)
		setTemp = temp
		results = {
			'humidity': currHumid,
			'temperature': currTemp
		}
	return jsonify(results)
	
if __name__ == '__main__':
	app.run(debug=True,port=8080, host='0.0.0.0')
