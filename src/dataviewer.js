document.addEventListener('DOMContentLoaded', function() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      const jsonData = JSON.parse(this.responseText);
      const timestamps = jsonData.data.map(entry => entry.t);
      console.log('Timestamps:', timestamps);

      const datasets = [
        { label: 'H2', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 },
        { label: 'CO', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 },
        { label: 'CO2', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 },
        { label: 'CH4', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 },
        { label: 'C6H6', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 },
        { label: 'C3H8', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 },
        { label: 'OH', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 },
        { label: 'LPG', data: [], borderColor: getRandomColor(), fill: false, tension: 0.1 }
      ];

      jsonData.data.forEach(data => {
        console.log('Data Entry:', data);

        const chartData = {
          "H2": parseFloat((data.MQ2_H2_1 + data.MQ2_H2_2 + data.MQ2_H2_3 + data.MQ4_H2_1 + data.MQ4_H2_2 + data.MQ4_H2_3 + data.MQ6_H2_1 + data.MQ6_H2_2 + data.MQ6_H2_3 + data.MQ8_H2_1 + data.MQ8_H2_2 + data.MQ8_H2_3) / 12).toFixed(0),
          "CO": parseFloat((data.MQ2_CO_1 + data.MQ2_CO_2 + data.MQ2_CO_3 + data.MQ7_CO_1 + data.MQ7_CO_2 + data.MQ7_CO_3) / 6).toFixed(0),
          "CO2": parseFloat((data.MG811_CO2_1 + data.MG811_CO2_2 + data.MG811_CO2_3) / 3).toFixed(0),
          "CH4": parseFloat((data.MQ2_CH4_1 + data.MQ2_CH4_2 + data.MQ2_CH4_3 + data.MQ4_CH4_1 + data.MQ4_CH4_2 + data.MQ4_CH4_3 + data.MQ9_CH4_1 + data.MQ9_CH4_2 + data.MQ9_CH4_3 + data.MQ214_CH4_1 + data.MQ214_CH4_2 + data.MQ214_CH4_3) / 12).toFixed(0),
          "C6H6": parseFloat((data.MQ3_C6H6_1 + data.MQ3_C6H6_2 + data.MQ3_C6H6_3) / 3).toFixed(0),
          "C3H8": parseFloat((data.MQ2_C3H8_1 + data.MQ2_C3H8_2 + data.MQ2_C3H8_3) / 3).toFixed(0),
          "OH": parseFloat((data.MQ3_OH_1 + data.MQ3_OH_2 + data.MQ3_OH_3) / 3).toFixed(0),
          "LPG": parseFloat((data.MQ2_LPG_1 + data.MQ2_LPG_2 + data.MQ2_LPG_3) / 3).toFixed(0)
        };

        console.log('Chart Data:', chartData);

        datasets[0].data.push(chartData.H2);
        datasets[1].data.push(chartData.CO);
        datasets[2].data.push(chartData.CO2);
        datasets[3].data.push(chartData.CH4);
        datasets[4].data.push(chartData.C6H6);
        datasets[5].data.push(chartData.C3H8);
        datasets[6].data.push(chartData.OH);
        datasets[7].data.push(chartData.LPG);
      });

      console.log('Datasets:', datasets);

      const ctx = document.getElementById('filegraph').getContext('2d');
      const gasSensorChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: timestamps,
          datasets: datasets
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'second'
              }
            }
          }
        }
      });
    }
  };
  xhttp.open("GET", "http://127.0.0.1/f/get?fn=R_14-1-2025_14-44-25.json", true);
  xhttp.send();
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}