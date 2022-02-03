from flask import Flask, render_template, url_for, request, jsonify, session
import Adafruit_DHT
import RPi.GPIO as GPIO
import time
import threading

app = Flask(__name__)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

DHTSensor = Adafruit_DHT.DHT11
GPIO_Pin = 17
GPIO_Pin_Relay = 19
GPIO.setup(GPIO_Pin_Relay, GPIO.OUT)

setTemp = 71
print("here")
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
	tempBuffer = 3
	tempTooLow = True
	while True:
		currHumid, currTemp = Adafruit_DHT.read_retry(DHTSensor, GPIO_Pin)
		print("Temperature: " + str( round( ((int(currTemp) * (9/5))+32),1 ) ) + " Humidity: " + str(currHumid) + " setTemp: " + str(setTemp))
		#print(threading.activeCount())
		#print(str(threading.currentThread().ident) + "\n")
		if isRunning:
			tempF = round( (int(currTemp) * (9/5)+32),1 )
			if (tempF < int(setTemp) + tempBuffer) and tempTooLow:
				GPIO.output(GPIO_Pin_Relay, 1)
				isLightOn = True
			elif (tempF < int(setTemp) - tempBuffer) and not tempTooLow:
				tempTooLow = True
			else:
				tempTooLow = False
				isLightOn = False
				GPIO.output(GPIO_Pin_Relay, 0)
		else: 
			isLightOn = False
			GPIO.output(GPIO_Pin_Relay, 0)
		time.sleep(4)

pollSensor = threading.Thread(name='Sensor', target=maintainTemp, daemon=True)
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
		temp = request.get_json()
		setTemp = int(temp['temp'])
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
	app.run(debug=False,port=8080, host='0.0.0.0')
