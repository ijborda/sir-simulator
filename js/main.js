// Use strict
"use strict";

let isInit = true;
let myChart;
showVal();
plotSIR();

const sliders = document.querySelectorAll('.slider');
Array.from(sliders).forEach(slider => {
  slider.addEventListener('change', plotSIR);
})

Array.from(sliders).forEach(slider => {
  slider.addEventListener('input', showVal);
})

function showVal() {
    const sus = document.querySelector('#susceptible').value;
    const inf = document.querySelector('#infected').value;
    const rec = document.querySelector('#recovered').value;
    const time = document.querySelector('#time').value;
    const beta = document.querySelector('#beta').value;
    const gamma = document.querySelector('#gamma').value;
    document.querySelector('#susceptibleVal').innerHTML = (+sus).toLocaleString();
    document.querySelector('#infectedVal').innerHTML = (+inf).toLocaleString();
    document.querySelector('#recoveredVal').innerHTML = (+rec).toLocaleString();
    document.querySelector('#timeVal').innerHTML = (+time).toLocaleString();
    document.querySelector('#betaVal').innerHTML = beta;
    document.querySelector('#gammaVal').innerHTML = gamma;
}

async function plotSIR() {

  if (!isInit) {
    myChart.destroy();
  } else {
    isInit = false
  }

  const sus = document.querySelector('#susceptible').value;
  const inf = document.querySelector('#infected').value;
  const rec = document.querySelector('#recovered').value;
  const time = document.querySelector('#time').value;
  const beta = document.querySelector('#beta').value;
  const gamma = document.querySelector('#gamma').value;

  const url = `https://sir-epimodel-api.herokuapp.com/api/sir?s=${sus}&i=${inf}&r=${rec}&b=${beta}&g=${gamma}&t=${time}`;
  const res = await fetch(url);
  const sir = await res.json();

  // Graph
  const ctx = document.querySelector('#myChart').getContext('2d');
  
  const labels = sir.t;
  
  const data = {
    labels,
    datasets: [
      {
        data: sir.s,
        label: 'Susceptibles',
        borderColor: "#00008b",
        backgroundColor: "#00008bbb",
      },
      {
        data: sir.i,
        label: 'Infected',
        borderColor: "#dc143c",
        backgroundColor: "#dc143cbb",
      },
      {
        data: sir.r,
        label: 'Recovered',
        borderColor: "#006400",
        backgroundColor: "#3cb371dd",
      },
    ]
  }
  let delayed;
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 5 + context.datasetIndex * 5;
          }
          return delay;
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'SIR Simulation'
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Number of Individuals'
          },
          max: 10000000
        },
        x: {
          title: {
            display: true,
            text: 'Time'
          }
        }
      } 
    }
  }

  myChart = new Chart(ctx, config);

}