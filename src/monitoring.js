temphum = document.getElementById('thgrad')
var chartCanvas = document.getElementById('detgraph');
var chart;
var chartDataSets = [];
var chartLabels = ['H2', 'CO', 'CO2', 'CH4', 'C6H6', 'C3H8', 'OH', 'LPG'];

function resetDataSets(){chartDataSets = [];for(i of chartLabels){chartDataSets.push({label: i, tension: 0, data: []});};}
resetDataSets();

chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: chartDataSets
    },
    options: {
        responsive: true
    }
});  

function updateChart(chart, data, time) {
    chartData = {
        "H2" : parseFloat((data.MQ2_H2_1 + data.MQ2_H2_2 + data.MQ2_H2_3 + data.MQ4_H2_1 + data.MQ4_H2_2 + data.MQ4_H2_3 + data.MQ6_H2_1 + data.MQ6_H2_2 + data.MQ6_H2_3 + data.MQ8_H2_1 + data.MQ8_H2_2 + data.MQ8_H2_3) / 12).toFixed(0),
        "CO" : parseFloat((data.MQ2_CO_1 + data.MQ2_CO_2 + data.MQ2_CO_3 + data.MQ7_CO_1 + data.MQ7_CO_2 + data.MQ7_CO_3) / 6).toFixed(0),
        "CO2" : parseFloat((data.MG811_CO2_1 + data.MG811_CO2_2 + data.MG811_CO2_3) / 3).toFixed(0),
        "CH4" : parseFloat((data.MQ2_CH4_1 + data.MQ2_CH4_2 + data.MQ2_CH4_3 + data.MQ4_CH4_1 + data.MQ4_CH4_2 + data.MQ4_CH4_3 + data.MQ9_CH4_1 + data.MQ9_CH4_2 + data.MQ9_CH4_3 + data.MQ214_CH4_1 + data.MQ214_CH4_2 + data.MQ214_CH4_3) / 12).toFixed(0),
        "C6H6" : parseFloat((data.MQ3_C6H6_1 + data.MQ3_C6H6_2 + data.MQ3_C6H6_3) / 3).toFixed(0),
        "C3H8" : parseFloat((data.MQ2_C3H8_1 + data.MQ2_C3H8_2 + data.MQ2_C3H8_3) / 3).toFixed(0),
        "OH" : parseFloat((data.MQ3_OH_1 + data.MQ3_OH_2 + data.MQ3_OH_3) / 3).toFixed(0),
        "LPG" : parseFloat((data.MQ2_LPG_1 + data.MQ2_LPG_2 + data.MQ2_LPG_3) / 3).toFixed(0),
    }
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(chartData[dataset.label]);
        if (dataset.data.length === 11) {
            if (!recording) {
            dataset.data.shift();
            }
        } else if (dataset.data.length > 11) {
            if (!recording) {
                dataset.data.shift();
                dataset.data.shift();
                dataset.data.shift();
            }
        }
    });
    chart.data.labels.push(timerecord(parseInt(time)));
    if (chart.data.labels.length === 12) {
        if (!recording) {
            chart.data.labels.shift();
        }
    } else if (chart.data.labels.length > 12) {
        if (!recording) {
            chart.data.labels.shift();
            chart.data.labels.shift();
            chart.data.labels.shift();
        }
    }
    chart.update();
}

function timerecord(timestamps){
    tr = [];
    dt = 0;
    for (v in timestamps) {
        vr = Math.round(v)
        tr.push(vr)
        dt += vr
    }
    const timeLabels = tr.map(timestamp => {
    const duration = moment.duration((timestamp - tr[0])*2, 'seconds');
    return duration.minutes() +':'+ duration.seconds();
  });
  return timeLabels
}

function updateClassText(className, text) {
    const elements = document.getElementsByClassName(className);
    for (let i of elements) {
        i.textContent = text;
    }
}

function getContrastColor(rgbColor) {
    const match = rgbColor.match(/\d+/g);
    const r = parseInt(match[0], 10);
    const g = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 128 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
}

function humidToColor(value) {
    value = Math.min(Math.max(value, 0), 100);
    const normalizedValue = value / 100;
    const colorValue = Math.round(255 * (1 - normalizedValue));
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
}

function temperatureToColor(value, minValue, maxValue) {
    value = Math.min(Math.max(value, minValue), maxValue);
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const colorValue = Math.round(255 * (1 - normalizedValue));
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
}

setInterval(() => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            online = true;
            const data = JSON.parse(xhttp.responseText);
            updateChart(chart, data, data.t);
            updateClassText('m-h2', parseFloat((data.MQ2_H2_1 + data.MQ2_H2_2 + data.MQ2_H2_3 + data.MQ4_H2_1 + data.MQ4_H2_2 + data.MQ4_H2_3 + data.MQ6_H2_1 + data.MQ6_H2_2 + data.MQ6_H2_3 + data.MQ8_H2_1 + data.MQ8_H2_2 + data.MQ8_H2_3) / 12).toFixed(0));
            updateClassText('m-co', parseFloat((data.MQ2_CO_1 + data.MQ2_CO_2 + data.MQ2_CO_3 + data.MQ7_CO_1 + data.MQ7_CO_2 + data.MQ7_CO_3) / 6).toFixed(0));
            updateClassText('m-co2', parseFloat((data.MG811_CO2_1 + data.MG811_CO2_2 + data.MG811_CO2_3) / 3).toFixed(0));
            updateClassText('m-ch4', parseFloat((data.MQ2_CH4_1 + data.MQ2_CH4_2 + data.MQ2_CH4_3 + data.MQ4_CH4_1 + data.MQ4_CH4_2 + data.MQ4_CH4_3 + data.MQ9_CH4_1 + data.MQ9_CH4_2 + data.MQ9_CH4_3 + data.MQ214_CH4_1 + data.MQ214_CH4_2 + data.MQ214_CH4_3) / 12).toFixed(0));
            updateClassText('m-c6h6', parseFloat((data.MQ3_C6H6_1 + data.MQ3_C6H6_2 + data.MQ3_C6H6_3) / 3).toFixed(0));
            updateClassText('m-c3h8', parseFloat((data.MQ2_C3H8_1 + data.MQ2_C3H8_2 + data.MQ2_C3H8_3) / 3).toFixed(0));
            updateClassText('m-oh', parseFloat((data.MQ3_OH_1 + data.MQ3_OH_2 + data.MQ3_OH_3) / 3).toFixed(0));
            updateClassText('m-lpg', parseFloat((data.MQ2_LPG_1 + data.MQ2_LPG_2 + data.MQ2_LPG_3) / 3).toFixed(0));
            updateClassText('m-humid', parseFloat(data.DHT22_H).toFixed(0) + '%');
            updateClassText('m-temp', parseFloat(data.DHT22_T).toFixed(0) + '°C');
            const humidColor = humidToColor(parseFloat(data.DHT22_H).toFixed(0));
            const tempColor = temperatureToColor(parseFloat(data.DHT22_T).toFixed(0), 1, 100);
            thgrad.style.background = `linear-gradient(90deg, ${tempColor} 22%, ${humidColor} 100%)`;
            document.getElementById("temp").style.color = getContrastColor(tempColor);
            document.getElementById("humid").style.color = getContrastColor(humidColor);
        }
    };
    xhttp.open("GET", "http://127.0.0.1/data", true);
    xhttp.send();
    xhttp.onerror = function () {
        online = false;
        changeStatus();
    };
}, 2000);