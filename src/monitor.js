function listenInterval(onUpdate) {
    return setInterval(() => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const data = JSON.parse(this.responseText);

                // Update Thermocouple data
                for (let i = 1; i <= 7; i++) {
                    const thermocoupleData = data[`Thermocouple_${i}`];
                    if (thermocoupleData) {
                        updateChartData(thermocoupleData, i);
                    }
                }

                // Gas data mappings
                const gasData = {
                    'm-h2': [
                        'MQ2_H2_1', 'MQ2_H2_2', 'MQ4_H2_1', 'MQ4_H2_2',
                        'MQ6_H2_1', 'MQ6_H2_2', 'MQ7_H2_1', 'MQ7_H2_2',
                        'MQ8_H2_1', 'MQ8_H2_2'
                    ],
                    'm-co': ['MQ2_CO_1', 'MQ2_CO_2', 'MQ7_CO_1', 'MQ7_CO_2'],
                    'm-co2': ['MG811_CO2_1', 'MG811_CO2_2'],
                    'm-ch4': [
                        'MQ2_CH4_1', 'MQ2_CH4_2', 'MQ4_CH4_1', 'MQ4_CH4_2',
                        'MQ9_CH4_1', 'MQ9_CH4_2'
                    ],
                    'm-c6h6': ['MQ3_C6H6_1', 'MQ3_C6H6_2'],
                    'm-c3h8': ['MQ2_C3H8_1', 'MQ2_C3H8_2'],
                    'm-oh': ['MQ2_OH_1', 'MQ2_OH_2'],
                    'm-lpg': ['MQ2_LPG_1', 'MQ2_LPG_2', 'MQ9_LPG_1', 'MQ9_LPG_2']
                };

                // Update gas data
                for (const [className, keys] of Object.entries(gasData)) {
                    const avgValue = calculateAverage(keys, data);
                    updateClassText(className, avgValue);
                }

                // Update humidity and temperature
                const humidity = parseFloat(data.DHT22_H).toFixed(0);
                const temperature = parseFloat(data.DHT22_T).toFixed(0);

                updateClassText('m-humid', humidity);
                updateClassText('m-temp', temperature);

                // Update colors
                const humidColor = humidToColor(humidity);
                const tempColor = temperatureToColor(temperature, 1, 100);

                updateElementStyles("temp", tempColor);
                updateElementStyles("humid", humidColor);

                // Trigger callback if provided
                if (onUpdate) onUpdate(data);
            }
        };

        xhttp.open("GET", "http://127.0.0.1/data", true);
        xhttp.send();
    }, 2500);
}

// Helper Functions
function calculateAverage(keys, data) {
    const sum = keys.reduce((acc, key) => acc + (data[key] || 0), 0);
    return (sum / keys.length).toFixed(0);
}

function updateElementStyles(elementId, backgroundColor) {
    const element = document.getElementById(elementId);
    element.style.backgroundColor = backgroundColor;
    element.style.color = getContrastColor(backgroundColor);
}

function updateClassText(className, text){
    for(i of document.getElementsByClassName(className)){
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