from flask import Flask, render_template, redirect, request
import Adafruit_DHT
import RPi.GPIO as GPIO

app = Flask(__name__)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

DHTSensor = Adafruit_DHT.DHT11
GPIO_Pin = 17

@app.route('/')
def index():
    humidity, temperature = Adafruit_DHT.read_retry(DHTSensor, GPIO_Pin)
    templateData = {
    'title' : 'GPIO input Status!',
    'humidity' : humidity,
    'temperature' : temperature
    }
    return render_template('index.html', **templateData)

@app.route('/status', methods=['POST','GET'])
def status():
    return render_template('status.html')
	
if __name__ == '__main__':
	app.run(debug=True,port=8080, host='0.0.0.0')
