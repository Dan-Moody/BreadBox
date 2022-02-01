
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

// Updates the table with the latest temp and humidity
var updateChart = function (temp, humid) {
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
var temperatureAJAX = async function(temp) {
    $.ajax({

        url: '/sensorData',
        type: 'GET',
        data: {
            'temp': temp
        },
        dataType: 'json',
        success: function (data) {
            console.log(data);
            updateChart(data["temperature"], data["humidity"]);
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
    temperatureAJAX(temp)
}

// On click for the proofing button and related input
const proofTemp = document.querySelector("#proofTemp");
var proof = function() {
    let temp = proofTemp.value;
    if (!checkTemp(temp)) {
        return;
    }
    temperatureAJAX(temp)
}


// On click for the turn off button
var turnOff = function() {
    console.log("Turning off");
}
