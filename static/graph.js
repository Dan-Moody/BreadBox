
var temps = []; // temp dataPoints
var humid = []; // humid dataPoints

var chart = new CanvasJS.Chart("chartContainer", {
    title: {
        text: "Box Temperature and Humidity"
    },
    axisY: {
        title: "Temperature (in F)",
        suffix: " F"
    },
    data: [{
        name: "Humidity",
        type: "line",
        showInLegend: true,
        dataPoints: humid
    },
    {
        name: "Temperature",
        type: "line",
        showInLegend: true,
        dataPoints: temps
    }]
});

var xVal = 0;
var yVal = 100;
var updateInterval = 1000;
var dataLength = 20; // number of dataPoints visible at any point

var updateChart = function (count) {
    count = count || 1;

    for (var j = 0; j < count; j++) {
        yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        temps.push({
            x: xVal,
            y: yVal
        });
        xVal++;
    }

    if (temps.length > dataLength) {
        temps.shift();
    }

    chart.render();
};

updateChart(dataLength);
setInterval(function () { updateChart() }, updateInterval);

var checkTemp = function(temp) {
    if (temp < 70 || temp > 100) {
        return false;
    } else {
        return true;
    }
}

var temperatureAJAX = function(temp) {
    $.ajax({

        url: '/sensorData',
        type: 'GET',
        data: {
            'temp': temp
        },
        dataType: 'json',
        success: function (data) {
            console.log('Data: ' + data);
            return data;
        },
        error: function (request, error) {
            console.log("Request: " + JSON.stringify(request));
            return JSON.stringify(request);
        }
    });
}

const preheatTemp = document.querySelector("#preheatTemp");
var preheat = function() {
    let temp = preheatTemp.value;
    if (!checkTemp(temp)) {
        return;
    }
    let resp = temperatureAJAX(temp);
    console.log("preheat " + resp);
    // console.log("preheating " + temp);
}

const proofTemp = document.querySelector("#proofTemp");
var proof = function() {
    let temp = proofTemp.value;
    if (!checkTemp(temp)) {
        return;
    }
    let resp = temperatureAJAX(temp);
    console.log("proofing " + resp);
    // console.log("proofing " + temp);
}

var turnOff = function() {
    console.log("Turning off");
}