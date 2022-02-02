
var temps = []; // temp dataPoints
var humids = []; // humid dataPoints

var chart = new CanvasJS.Chart("chartContainer", {
    title: {
        text: "Box Temperature and Humidity"
    },
    axisY: {
        title: "Temperature (in F)",
        suffix: " F"
    },
    axisY2: {
        title: "Humidity (in %)",
        suffix: "%"
    },
    data: [{
        name: "Humidity",
        type: "line",
        axisYType: "secondary",
        showInLegend: true,
        dataPoints: humids
    },
    {
        name: "Temperature",
        type: "line",
        showInLegend: true,
        dataPoints: temps
    }]
});

var xVal = 0;
var dataLength = 20; // number of dataPoints visible at any point
temps.push({
    x: xVal,
    y: 0
});
humids.push({
    x: xVal,
    y: 0
});
xVal++;
chart.render();

const tempElement = document.querySelector("#temperature");
const humidElement = document.querySelector("#humidity");
const lightStatus = document.querySelector("#light");
const isRunningView = document.querySelector("#isRunning");
const desiredTemp = document.querySelector("#desiredTemp");


// Updates the table with the latest temp and humidity
// temp: the current temperature in the box
// humid: the current humidity in the box
// isRunning: true if the pi is using
// isLightOn: true if the light in the box is on
// setTemp: current target temperature of the box
var updateChart = function (temp, humid, isRunning, isLightOn, setTemp) {
    //console.log("setTemp: " + setTemp);
    desiredTemp.innerHTML = setTemp;
    tempElement.innerHTML = temp;
    humidElement.innerHTML = humid;
    
    if (isLightOn) {
        lightStatus.innerHTML = "On";
    } else {
        lightStatus.innerHTML = "Off";
    }
    if (isRunning) {
        isRunningView.innerHTML = "Yes";
    } else {
        isRunningView.innerHTML = "No";
    }
    
    
    temp = (temp * (9/5))+32
    temps.push({
        x: xVal,
        y: temp
    });
    humids.push({
        x: xVal,
        y: humid
    });
    xVal++;

    if (temps.length > dataLength) {
        temps.shift();
    }
    if (humids.length > dataLength) {
        humids.shift();
    }

    chart.render();
};

// Checks if the temp is within a valid range for the heating if noti ignore it
var checkTemp = function(temp) {
    if (temp < 70 || temp > 100) {
        return false;
    } else {
        return true;
    }
}

// Sends AJAX request to flask for temperature and humidity
var temperatureAJAX = async function() {
    $.ajax({
        url: '/sensorData',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            updateChart(data["temperature"], data["humidity"], data["isRunning"], data["isLightOn"], data["setTemp"]);
        },
        error: function (request, error) {
            console.log("Request: " + JSON.stringify(request));
        }
    });
}

var intervalID = setInterval(temperatureAJAX, 1000);

// Sends AJAX request to flask for temperature and humidity
// temp: the desired temperature to heat the box to
var setTemp = async function(temp) {
    $.ajax({
        url: '/sensorData',
        type: 'POST',
        data: {
            'temp': temp
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
        },
        error: function (request, error) {
            console.log("Request: " + JSON.stringify(request));
        }
    });
}

// Sends AJAX request to flask to turn off light bulb
var turnOffPi = async function() {
    $.ajax({
        url: '/turnOff',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (data) {
            console.log("Box heating element is off");
            isRunning.innerHTML = "No";
        },
        error: function (request, error) {
            console.log("Request: " + JSON.stringify(request));
            
        }
    });
}

// On click for the preheat button and related input
const preheatTemp = document.querySelector("#preheatTemp");
var preheat = function() {
    let temp = preheatTemp.value;
    if (!checkTemp(temp)) {
        return;
    }
    setTemp(temp)
}

// On click for the proofing button and related input
const proofTemp = document.querySelector("#proofTemp");
var proof = function() {
    let temp = proofTemp.value;
    if (!checkTemp(temp)) {
        return;
    }
    setTemp(temp)
}


// On click for the turn off button
var turnOff = function() {
    console.log("Turning off");
    turnOffPi();
}
